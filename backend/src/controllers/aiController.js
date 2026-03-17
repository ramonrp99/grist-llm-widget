const aiService = require('../services/aiService')
const config = require('../config/env')
const { buildChatMessages } = require('../utils/promptBuilder')
const { extractTable } = require('../utils/markdown')
const AppResponse = require('../core/AppResponse')
const { systemPromptTokens } = require('../config/systemPrompt')

const { availableModels } = require('../config/models')

const getModels = async(req, res, next) => {
    try {
        const models = await aiService.getAvailableModels()

        // La API de OpenRouter siempre devuelve todos sus modelos disponibles
        // Únicamente se devuelven los que se encuentren listados en models.json
        const availableModelsIds = new Set(availableModels.external.map(m => m.model))
        const finalModels = models.filter(m => availableModelsIds.has(m.id))
                                  .map(m => {
                                      const modelTokenLimit = m.top_provider?.context_length || m.context_length
                                      // Se divide el limite de token del modelo en 50% para la entrada y 50% para la salida
                                      const modelInputTokenLimit = Math.floor(modelTokenLimit / 2)
                                      const tokenLimit = Math.min(config.ai.maxTokens, modelInputTokenLimit)
                                      const maxTokens = Math.max(tokenLimit - systemPromptTokens, 0)

                                      return {
                                          model: m.id,
                                          name: availableModels.external.find(am => am.model === m.id)?.name || m.name,
                                          description: availableModels.external.find(am => am.model === m.id)?.description || m.description,
                                          max_tokens: maxTokens,
                                          type: 'external'
                                      }
                                  })

        new AppResponse(200, finalModels).send(res)
    } catch (err) {
        next(err)
    }
}

const generateCompletion = async(req, res, next) => {
    try {
        const { model, prompt, context, messages } = req.body

        const modelInfo = await aiService.getModelById(model)
        const modelTokenLimit = modelInfo.top_provider?.context_length || modelInfo.context_length
        // Se divide el limite de token del modelo en 50% para la entrada y 50% para la salida
        const modelInputTokenLimit = Math.floor(modelTokenLimit / 2)

        const totalMessages = buildChatMessages(prompt, context, messages, Math.min(config.ai.maxTokens, modelInputTokenLimit))

        const response = await aiService.generateCompletion(model, totalMessages)

        const estructuredResponse = extractTable(response)

        new AppResponse(200, estructuredResponse).send(res)
    } catch (err) {
        next(err)
    }
}

module.exports = { getModels, generateCompletion }