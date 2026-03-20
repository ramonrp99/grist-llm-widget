const config = require('../config/env')
const AppError = require('../core/AppError')

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

    return json.data
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

// Enviar prompt a modelo de Ollama
const generateOllamaCompletion = async (url, model, messages) => {
    const res = await fetch(`${url}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': model,
            'messages': messages,
            'stream': false
        })
    })

    const json = await res.json()

    if(!res.ok || json.error) {
        const message = json.error.message || 'Error al generar una respuesta con Ollama'
        const statusCode = res.status || 500

        throw new AppError(statusCode, message)
    }

    return json.message.content
}

module.exports = { getOpenRouterModels, generateOpenRouterCompletion, generateOllamaCompletion }