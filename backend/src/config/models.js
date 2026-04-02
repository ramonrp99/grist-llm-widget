const { readFile } = require('../utils/files')
const { validateExternalModel, validateLocalModel } = require('../schemas/model')

const response = readFile('../../config/models.json')

const availableModels = { external: [], local: [] }

if(response.ok && response.data) {
    try {
        const modelsJson = JSON.parse(response.data)

        if(Array.isArray(modelsJson.external)) {
            availableModels.external = modelsJson.external.filter(model => {
                const result = validateExternalModel(model)

                if(!result.success) {
                    console.error('Modelo externo omitido por error de formato:', result.error.message)
                    return false
                }

                return true
            })
        }

        if(Array.isArray(modelsJson.local)) {
            availableModels.local = modelsJson.local.filter(model => {
                const result = validateLocalModel(model)

                if(!result.success) {
                    console.error('Modelo local omitido por error de formato:', result.error.message)
                    return false
                }

                return true
            })
        }
    } catch(err) {
        console.error('Error al parsear models.json:', err.message)
    }
}

module.exports = { availableModels }