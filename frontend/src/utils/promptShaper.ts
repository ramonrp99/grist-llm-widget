import type { THistoryMessage } from "../types/TMessage"
import { splitTableIntoRows } from "./markdown"
import { countTokens } from "./tokenizer"

export function getTruncatedHistory(history: THistoryMessage[], availableTokens: number) {
    const truncatedHistory = []
    let currentTokens = 0

    // Incluye mensajes del historial hasta alcanzar el límite (de más reciente a más antiguo)
    for(let i = history.length - 1; i >= 0; i--) {
        const totalMessage = history[i].content + (history[i].table ? '\n' + history[i].table : '')
        const messageTokens = countTokens(totalMessage)

        if (currentTokens + messageTokens <= availableTokens) {
            truncatedHistory.unshift(history[i])
            currentTokens += messageTokens
        } else {
            break
        }
    }

    return truncatedHistory
}

export function getTruncatedContext(context: string, availableTokens: number) {
    const rowsTokens = splitTableIntoRows(context).map(row => ({
        content: row,
        tokens: countTokens(row)
    }))

    if(rowsTokens.length < 3) {
        return null
    }

    const minTokens = rowsTokens[0].tokens + rowsTokens[1].tokens + rowsTokens[2].tokens

    // Devuelve null si la tabla mínima (3 primeras filas) supera el límite
    if(minTokens > availableTokens) {
        return null
    }

    let currentContext = `${rowsTokens[0].content}\n${rowsTokens[1].content}\n${rowsTokens[2].content}`
    let currentTokens = minTokens

    // Incluye filas de la tabla hasta alcanzar el límite
    for(let i = 3; i < rowsTokens.length - 1; i++) {
        const row = rowsTokens[i]

        if(currentTokens + row.tokens <= availableTokens) {
            currentContext += `\n${row.content}`
            currentTokens += row.tokens
        } else {
            break
        }
    }

    return currentContext
}

export function preparePrompt(userPrompt: string, context: string, history: THistoryMessage[], maxTokens: number) {
    const userPromptTokens = countTokens(userPrompt)
    
    const fullContextTokens = countTokens(context)
    const fullHistoryTokens = history.reduce((sum, msg) => sum + countTokens(msg.content), 0)

    const baseTokens = userPromptTokens
    const totalTokens = baseTokens + fullContextTokens + fullHistoryTokens

    // Todas las partes caben dentro del límite
    if(totalTokens <= maxTokens) {
        return {
            prompt: userPrompt,
            context: context,
            history: history
        }
    }

    // Si no caben todas las partes, se realiza truncado
    // 1º. Se trunca o descarta el historial
    // 2º. Se trunca contexto
    let finalContext: string | null = ''
    let finalHistory: THistoryMessage[] = []

    // Tokens disponibles para el contexto e historial
    const tokensAvailable = maxTokens - baseTokens

    // Si el contexto completo cabe dentro del límite, se incluye el contexto completo y se trunca el historial
    // Si no cabe, se descarta el historial completo y se trunca el contexto
    if(fullContextTokens <= tokensAvailable) {
        const tokensAvailableHistory = tokensAvailable - fullContextTokens

        finalContext = context
        finalHistory = getTruncatedHistory(history, tokensAvailableHistory)
    } else {
        finalContext = getTruncatedContext(context, tokensAvailable)
        finalHistory = []

        if (finalContext === null) {
            throw new Error('El mensaje excede el límite máximo de tokens establecido. Por favor, reduce el mensaje o ponte en contacto con el administrador.')
        }
    }

    return {
        prompt: userPrompt,
        context: finalContext,
        history: finalHistory
    }
}