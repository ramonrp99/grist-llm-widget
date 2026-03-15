const { validatePrompt } = require('../schemas/prompt')
const z = require('zod')
const AppError = require('../core/AppError')

const validateChatRequest = (req, res, next) => {
    const result = validatePrompt(req.body)

    if(!result.success) {
        return next(new AppError(400, 'Petición inválida.', z.treeifyError(result.error)))
    }

    next()
}

module.exports = { validateChatRequest }