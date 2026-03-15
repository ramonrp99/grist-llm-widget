const z = require('zod')
const config = require('../config/env')
const { isTable } = require('../utils/markdown')
const { availableModels } = require('../config/models')

const messageSchema = z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().nonempty().max(config.schemas.messagesSchema.content.maxLength)
})

const promptSchema = z.object({
    model: z.string()
            .nonempty()
            .max(config.schemas.promptSchema.model.maxLength)
            .refine((val) => {
                return Object.values(availableModels).flat().some(m => m.model === val)
            }, {
                error: 'Modelo no autorizado.'
            }),

    prompt: z.string()
             .nonempty()
             .max(config.schemas.promptSchema.prompt.maxLength),

    context: z.string()
              .nonempty()
              .max(config.schemas.promptSchema.context.maxLength)
              .refine((val) => isTable(val), {
                  error: 'El formato del contexto no es válido. Debe ser una tabla Markdown.'
              }),

    messages: z.array(messageSchema)
})

const validatePrompt = (input) => {
    return promptSchema.safeParse(input)
}

module.exports = { validatePrompt }