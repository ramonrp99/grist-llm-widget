const { rateLimit } = require('express-rate-limit')
const config = require('../config/env')
const AppError = require('../core/AppError')

const aiLimiter = rateLimit({
    windowMs: config.rateLimit.ai.windowMs,
    limit: config.rateLimit.ai.max,
    handler: (req, res, next, options) => {
        next(new AppError(429, 'Se ha alcanzado límite de peticiones. Inténtalo de nuevo más tarde.'))
    }
})

module.exports = { aiLimiter }