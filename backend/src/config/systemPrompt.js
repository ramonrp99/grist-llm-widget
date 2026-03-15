const { readFile } = require('../utils/files')

const response = readFile('../../config/systemPrompt.md')

const systemPrompt = (response.ok && response.data)
    ? response.data
    : 'Actúa como un experto en análisis e interpretación de datos. Utiliza los siguientes datos para generar tu respuesta:'

module.exports = { systemPrompt }