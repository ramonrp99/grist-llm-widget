const path = require('node:path')
const envFile = process.env.NODE_ENV === 'production' ? '.env' : '.env.development'

require('dotenv').config({
    path: path.resolve(process.cwd(), envFile)
})

console.log(`Cargando configuración desde: ${envFile}`)

const config = {
    // Server
    env: process.env.NODE_ENV || 'development',
    port: Number.parseInt(process.env.PORT) || 3000,

    // CORS
    allowedOrigins: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(m => m.trim()) : [],

    // Rate Limits
    rateLimit: {
        ai: {
            windowMs: (Number.parseInt(process.env.AI_LIMIT_WINDOW_MINS) || 60) * 60 * 1000,
            max: Number.parseInt(process.env.AI_LIMIT_MAX) || 50
        }
    },

    // Keys
    openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
    cfTurnstileSecretKey: process.env.CF_TURNSTILE_SECRET_KEY || '',

    // Validaciones Requests (Schemas)
    schemas: {
        promptSchema: {
            model: {
                maxLength: Number.parseInt(process.env.MAX_MODEL_LENGTH) || 50
            },
            prompt: {
                maxLength: Number.parseInt(process.env.MAX_PROMPT_LENGTH) || 500
            },
            context: {
                maxLength: Number.parseInt(process.env.MAX_CONTEXT_LENGTH) || 3000
            }
        },
        messagesSchema: {
            content: {
                maxLength: Number.parseInt(process.env.MAX_MESSAGE_CONTENT_LENGTH) || 500
            }
        },
    },

    // AI
    ai: {
        maxTokens: Number.parseInt(process.env.MAX_TOKENS) || 1000
    }
}

const requiredEnvs = ['ALLOWED_ORIGINS', 'OPENROUTER_API_KEY', 'CF_TURNSTILE_SECRET_KEY']

requiredEnvs.forEach(name => {
    if (!process.env[name]) {
        throw new Error(`La variable de entorno ${name} es obligatoria.`)
    }
})

module.exports = Object.freeze(config)