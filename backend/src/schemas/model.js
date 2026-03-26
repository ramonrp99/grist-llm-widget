const z = require('zod')

const externalModelSchema = z.object({
    model: z.string()
            .nonempty(),
    
    name: z.string(),

    description: z.string()
})

const localModelSchema = z.object({
    url: z.string()
          .nonempty(),

    model: z.string()
            .nonempty(),
    
    name: z.string(),

    description: z.string()
})

const validateExternalModel = (input) => {
    return externalModelSchema.safeParse(input)
}

const validateLocalModel = (input) => {
    return localModelSchema.safeParse(input)
}

module.exports = { validateExternalModel, validateLocalModel }