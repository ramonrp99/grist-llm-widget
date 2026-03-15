const fs = require('node:fs')
const path = require('node:path')

const readFile = (dirname, encoding = 'utf-8') => {
    const filePath = path.join(__dirname, dirname)

    try {
        const content = fs.readFileSync(filePath, encoding)

        return {
            ok: true,
            data: content
        }
    } catch (err) {
        console.error(`Error leyendo el fichero ${path}: ${err}`)

        return {
            ok: false,
            error: err
        }
    }
}

module.exports = { readFile }