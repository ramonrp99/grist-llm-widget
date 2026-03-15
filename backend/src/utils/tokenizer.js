const { getEncoding } = require('js-tiktoken')

const encoding = getEncoding('cl100k_base')

// Devuelve el número de tokens de un string
const countTokens = (input) => {
    return encoding.encode(input).length
}

module.exports = { countTokens }