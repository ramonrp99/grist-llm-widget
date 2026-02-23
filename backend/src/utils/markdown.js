const { marked } = require('marked')

// Divide tabla markdown en filas
const splitTableIntoRows = (table) => {
    return table
        .split(/\n/)
}

const extractTable = (text) => {
    const regex = /```md\s*([\s\S]*?)\s*```/
    const match = text.match(regex)

    if (!match) {
        return {
            text: text,
            table: null
        }
    }

    return {
        text: text.replace(regex, '').trim(),
        table: match[1]
    }
}

const isTable = (text) => {
    const tokens = marked.lexer(text)

    return tokens.some(token => token.type === 'table')
}

module.exports = { splitTableIntoRows, extractTable, isTable }