jest.mock('marked', () => ({
    marked: {
        lexer: jest.fn(text => {
            if(typeof text === 'string' && text.includes('|')) {
                return [{type: 'table'}]
            }

            return [{type: 'paragraph'}]
        })
    }
}))

const { splitTableIntoRows, extractTable, isTable } = require('@utils/markdown')

describe('utils/markdown - splitTableIntoRows', () => {
    test('Debe dividir una tabla en filas y devolverlas un array', () => {
        const input = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        const rows = splitTableIntoRows(input)
        expect(rows).toHaveLength(3)
        expect(rows[0]).toBe('| id | nombre |')
        expect(rows[1]).toBe('| --- | --- |')
        expect(rows[2]).toBe('| 1 | Test |')
    })

    test('Debe manejar strings sin saltos de línea', () => {
        const input = 'Texto de prueba'
        const rows = splitTableIntoRows(input)
        expect(rows).toHaveLength(1)
        expect(rows[0]).toBe(input)
    })
})

describe('/utils/markdown - extractTable', () => {
    test('Debe extraer la tabla del texto correctamente', () => {
        const input = 'Texto de prueba\n```md| id | nombre |\n| --- | --- |\n| 1 | Test |```'
        const result = extractTable(input)

        expect(result.table).toBe('| id | nombre |\n| --- | --- |\n| 1 | Test |')
        expect(result.text).toBe('Texto de prueba')
    })

    test('Debe devolver table: null si no hay etiquetas ```md y ```', () => {
        const input = 'Texto de prueba'
        const result = extractTable(input)

        expect(result.table).toBeNull()
        expect(result.text).toBe(input)
    })
})

describe('/utils/markdown - isTable', () => {
    test('Debe devolver true si es una tabla Markdown válida', () => {
        const input = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        expect(isTable(input)).toBe(true)
    })

    test('Debe devolver false si no es una tabla Markdown válida', () => {
        const input = 'Texto de prueba'
        expect(isTable(input)).toBe(false)
    })
})