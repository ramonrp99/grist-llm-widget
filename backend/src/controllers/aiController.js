const aiService = require('../services/aiService')
const config = require('../config/env')
const { buildChatMessages } = require('../utils/promptBuilder')
const { extractTable } = require('../utils/markdown')
const AppResponse = require('../core/AppResponse')
const { systemPromptTokens } = require('../config/systemPrompt')

const { availableModels } = require('../config/models')

let cachedModels = null

// Función para cachear el listado de modelos disponible (necesario para getModels y generateCompletion)
const getAvailableModels = async() => {
    if(!cachedModels) {
        const externalModels = await aiService.getOpenRouterModels()

        // La API de OpenRouter siempre devuelve todos sus modelos disponibles
        // Únicamente se devuelven los que se encuentren listados en models.json
        const availableExternalModelsIds = new Set(availableModels.external.map(m => m.model))
        const processedExternalModels = externalModels.filter(m => availableExternalModelsIds.has(m.id)).map(m => {
            const modelTokenLimit = m.top_provider?.context_length || m.context_length
            // Se divide el limite de token del modelo en 50% para la entrada y 50% para la salida
            const modelInputTokenLimit = Math.floor(modelTokenLimit / 2)
            const maxTokens = Math.min(config.ai.maxTokens, modelInputTokenLimit)

            return {
                model: m.id,
                name: availableModels.external.find(am => am.model === m.id)?.name || m.name,
                description: availableModels.external.find(am => am.model === m.id)?.description || m.description,
                max_tokens: maxTokens,
                type: 'external'
            }
        })

        const processedLocalModels = availableModels.local.map(m => {
            const maxTokens = Math.min(config.ai.maxTokens, 4096)

            return {
                url: m.url,
                model: m.model,
                name: m.name,
                description: m.description,
                max_tokens: maxTokens,
                type: 'local'
            }
        })

        cachedModels = [...processedExternalModels, ...processedLocalModels]
    }

    return cachedModels
}

const getModels = async(req, res, next) => {
    try {
        const models = await getAvailableModels()

        // Se quita el parámetro url y se modifica el valor de max_tokens en las respuestas del endpoint /models
        const updatedModels = models.map(model => {
            const {url, ...rest} = model

            return {
                ...rest,
                max_tokens: Math.max(model.max_tokens - systemPromptTokens, 0)
            }
        })

        new AppResponse(200, updatedModels).send(res)
    } catch (err) {
        next(err)
    }
}

const generateCompletion = async(req, res, next) => {
    try {
        const { model, prompt, context, messages } = req.body

        const models = await getAvailableModels()
        const modelInfo = models.find(m => m.model === model)

        const totalMessages = buildChatMessages(prompt, context, messages, modelInfo.max_tokens)

        const response = await (modelInfo.type === 'local'
            ? aiService.generateOllamaCompletion(modelInfo.url, model, totalMessages)
            : aiService.generateOpenRouterCompletion(model, totalMessages))

        const estructuredResponse = extractTable(response)

        new AppResponse(200, estructuredResponse).send(res)
    } catch (err) {
        next(err)
    }
}

module.exports = { getModels, generateCompletion }