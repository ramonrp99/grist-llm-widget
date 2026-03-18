const { readFile } = require('../utils/files')
const { countTokens } = require('../utils/tokenizer')

const response = readFile('../../config/systemPrompt.md')

const systemPrompt = (response.ok && response.data)
    ? response.data
    : 'Actúa como un experto en análisis e interpretación de datos. Utiliza los siguientes datos para generar tu respuesta:'

const systemPromptTokens = countTokens(systemPrompt)

module.exports = { systemPrompt, systemPromptTokens }