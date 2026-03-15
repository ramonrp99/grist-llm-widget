const aiService = require('../services/aiService')
const { buildChatMessages } = require('../utils/promptBuilder')
const { extractTable } = require('../utils/markdown')
const AppResponse = require('../core/AppResponse')

const { availableModels } = require('../config/models')

const getModels = async(req, res, next) => {
    try {
        const models = await aiService.getAvailableModels()

        // La API de OpenRouter siempre devuelve todos sus modelos disponibles
        // Únicamente se devuelven los que se encuentren listados en models.json
        const availableModelsIds = new Set(availableModels.external.map(m => m.model))
        const finalModels = models.filter(m => availableModelsIds.has(m.id))
                                  .map(m => ({
                                      model: m.id,
                                      name: availableModels.external.find(am => am.model === m.id)?.name || m.name,
                                      description: availableModels.external.find(am => am.model === m.id)?.description || m.description,
                                      type: 'external'
                                  }))

        new AppResponse(200, finalModels).send(res)
    } catch (err) {
        next(err)
    }
}

const generateCompletion = async(req, res, next) => {
    try {
        const { model, prompt, context, messages } = req.body

        const totalMessages = buildChatMessages(prompt, context, messages)

        const response = await aiService.generateCompletion(model, totalMessages)

        const estructuredResponse = extractTable(response)

        new AppResponse(200, estructuredResponse).send(res)
    } catch (err) {
        next(err)
    }
}

module.exports = { getModels, generateCompletion }