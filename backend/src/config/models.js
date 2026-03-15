const { readFile } = require('../utils/files')

const response = readFile('../../config/models.json')

const availableModels = (response.ok && response.data)
    ? JSON.parse(response.data)
    : { external: [] }

module.exports = { availableModels }