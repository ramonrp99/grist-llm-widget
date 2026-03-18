const config = require('../config/env')
const AppError = require('../core/AppError')

let cachedModels = null

// Obtener listado de modelos disponibles en OpenRouter
const getOpenRouterModels = async () => {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${config.openRouterApiKey}`
        }
    })

    const json = await res.json()

    if(!res.ok || json.error) {
        const message = json.error.message || 'Error al obtener los modelos de OpenRouter'
        const statusCode = res.status || 500

        throw new AppError(statusCode, message)
    }

    cachedModels = json.data

    return json.data
}

// Obtener listado de modelos locales disponibles
const getLocalModels = async () => {

}

// Obtener listado de modelos disponibles
const getAvailableModels = async () => {
    if(!cachedModels) {
        return await getOpenRouterModels()
    }

    return cachedModels
}

const getModelById = async (modelId) => {
    const models = await getAvailableModels()

    return models.find(m => m.id === modelId)
}

// Enviar prompt a modelo de OpenRouter
const generateOpenRouterCompletion = async (model, messages) => {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.openRouterApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': model,
            'messages': messages
        })
    })

    const json = await res.json()

    if(!res.ok || json.error) {
        const message = json.error.message || 'Error al generar una respuesta con OpenRouter'
        const statusCode = res.status || 500

        throw new AppError(statusCode, message)
    }

    return json.choices[0].message.content
}

// Enviar prompt a modelo local
const generateLocalCompletion = async (data) => {

}

// Enviar prompt al modelo seleccionado
const generateCompletion = async (model, messages) => {
    return await generateOpenRouterCompletion(model, messages)
}

module.exports = { getAvailableModels, getModelById, generateCompletion }