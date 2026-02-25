const config = require('../config/env')
const { countTokens } = require('./tokenizer')
const { splitTableIntoRows } = require('./markdown')
const AppError = require('../core/AppError')

const { systemPrompt } = require('../config/systemPrompt')

// Devuelve el historial de mensajes truncado
const getTruncatedHistory = (history, availableTokens) => {
    const truncatedHistory = []
    let currentTokens = 0

    // Incluye mensajes del historial hasta alcanzar el límite (de más reciente a más antiguo)
    for (let i = history.length - 1; i >= 0; i--) {
        const messageTokens = countTokens(history[i].content)

        if (currentTokens + messageTokens <= availableTokens) {
            truncatedHistory.unshift(history[i])
            currentTokens += messageTokens
        } else {
            break
        }
    }

    return truncatedHistory
}

// Devuelve el contexto (tabla markdown de datos) truncado
// La tabla mínima está formada por las 3 primeras filas (cabecera, separador y fila 1)
// Incluye filas en orden descendente hasta alcanzar el límite de tokens
const getTruncatedContext = (context, availableTokens) => { 
    const rowsTokens = splitTableIntoRows(context).map(row => ({
        content: row,
        tokens: countTokens(row)
    }))

    const minTokens = rowsTokens[0].tokens + rowsTokens[1].tokens + rowsTokens[2].tokens

    // Devuelve null si la tabla mínima (3 primeras filas) supera el límite
    if (minTokens > availableTokens) {
        return null
    }

    let currentContext = `${rowsTokens[0].content}\n${rowsTokens[1].content}\n${rowsTokens[2].content}`
    let currentTokens = minTokens

    // Incluye filas de la tabla hasta alcanzar el límite
    for (let i = 3; i < rowsTokens.length - 1; i++) {
        const row = rowsTokens[i]

        if (currentTokens + row.tokens <= availableTokens) {
            currentContext += `\n${row[i].content}`
            currentTokens += row[i].tokens
        } else {
            break
        }
    }

    return currentContext
}

// Comprueba que el listado de mensajes (system promp + user prompt + contexto + historial) no superan el límite de tokens establecido
// y devuelve el listado de mensajes listo para enviar a un LLM
// Si se supera el límite:
// - 1º. Reduce el historial de mensajes (descarta primero los más antiguos)
// - 2º. Reduce el contexto (mantiene mínimo las 3 primeras filas (cabecera, separador y fila nº 1))
// Devuelve un error controlado si continua superando el límite tras la reducción máxima
const buildChatMessages = (userPrompt, context, history) => {
    const maxTokens = config.ai.maxTokens

    const systemPromptTokens = countTokens(systemPrompt)
    const userPromptTokens = countTokens(userPrompt)
    
    const fullContextTokens = countTokens(context)
    const fullHistoryTokens = history.reduce((sum, msg) => sum + countTokens(msg.content), 0)

    const baseTokens = systemPromptTokens + userPromptTokens
    const totalTokens = baseTokens + fullContextTokens + fullHistoryTokens

    // Todas las partes caben dentro del límite
    if (totalTokens <= maxTokens) {
        return [
            {
                role: 'system',
                content: `${systemPrompt}\n\n${context}`
            },
            ...history,
            {
                role: 'user',
                content: userPrompt
            }
        ]
    }

    // Si no caben todas las partes, se realiza truncado
    // 1º. Se trunca o descarta el historial
    // 2º. Se trunca contexto
    let finalContext = ''
    let finalHistory = []

    // Tokens disponibles para el contexto e historial
    const tokensAvailable = maxTokens - baseTokens

    // Si el contexto completo cabe dentro del límite, se incluye el contexto completo y se trunca el historial
    // Si no cabe, se descarta el historial completo y se trunca el contexto
    if (fullContextTokens <= tokensAvailable) {
        const tokensAvailableHistory = tokensAvailable - fullContextTokens

        finalContext = context
        finalHistory = getTruncatedHistory(history, tokensAvailableHistory)
    } else {
        finalContext = getTruncatedContext(context, tokensAvailable)
        finalHistory = []

        if (finalContext === null) {
            throw new AppError(400, 'El mensaje excede el límite máximo de tokens establecido. Debe reducir el mensaje o el contexto seleccionado.')
        }
    }

    return [
        {
            role: 'system',
            content: `${systemPrompt}\n\n${finalContext}`
        },
        ...finalHistory,
        {
            role: 'user',
            content: userPrompt
        }
    ]
}

module.exports = { buildChatMessages }