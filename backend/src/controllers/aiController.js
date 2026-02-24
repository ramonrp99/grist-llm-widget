const aiService = require('../services/aiService')
const { buildChatMessages } = require('../utils/promptBuilder')
const { extractTable } = require('../utils/markdown')

const { availableModels } = require('../config/models')

const getModels = async(req, res, next) => {
    try {
        const response = await aiService.getAvailableModels()

        // La API de OpenRouter siempre devuelve todos sus modelos disponibles
        // Únicamente se devuelven los que se encuentren listados en models.json
        const availableModelsIds = new Set(availableModels.external.map(m => m.model))
        const models = response.data.filter(m => availableModelsIds.has(m.id))
                                    .map(m => ({
                                        model: m.id,
                                        name: availableModels.external.find(am => am.model === m.id)?.name || m.name,
                                        description: availableModels.external.find(am => am.model === m.id)?.description || '',
                                        type: 'external'
                                    }))

        res.json({
            ok: true,
            data: models
        })
    } catch (err) {
        next(err)
    }
}

const generateCompletion = async(req, res, next) => {
    try {
        const { model, prompt, context, messages } = req.body

        const totalMessages = buildChatMessages(prompt, context, messages)

        const response = await aiService.generateCompletion(model, totalMessages.data)

        const estructuredResponse = extractTable(response.data)

        res.json({
            ok: true,
            response: estructuredResponse.text,
            data: estructuredResponse.table
        })
    } catch (err) {
        next(err)
    }
}

module.exports = { getModels, generateCompletion }