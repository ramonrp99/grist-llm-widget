import { getMarkdownTable, extractTableData, splitTableIntoRows } from '@utils/markdown'

describe('utils/markdown - getMarkdownTable', () => {
    it('Debe convertir un array de objetos en una tabla Markdown', () => {
        const input = [{id: 1, nombre: 'Test'}]
        const result = getMarkdownTable(input)
        expect(result).contains('| id | nombre |')
        expect(result).contains('| 1  | Test   |')
    })

    it('Debe devolver un string vacío si el input es un array vacío', () => {
        expect(getMarkdownTable([])).toBe('')
    })

    it('Debe manejar valores null como string vacíos', () => {
        const input = [{ id: 1, nombre: null}]
        const result = getMarkdownTable(input)
        expect(result).contains('| id | nombre |')
        expect(result).contains('| 1  |        |')
    })
})

describe('utils/markdown - extractTableData', () => {
    it('Debe extraer los datos de una tabla Markdown', () => {
        const input = '| id | nombre |\n| -- | ------ |\n| 1  | Test   |'
        const result = extractTableData(input)
        expect(result).toEqual([
            ['id', 'nombre'],
            ['1', 'Test']
        ])
    })

    it('Debe devolver undefined si el input no es una tabla Markdown', () => {
        const input = 'Test'
        const result = extractTableData(input)
        expect(result).toBeUndefined()
    })
})

describe('utils/markdown - splitTableIntoRows', () => {
    it('Debe dividir una tabla en filas y devolverlas en un array', () => {
        const input = '| id | nombre |\n| -- | ------ |\n| 1  | Test   |'
        const result = splitTableIntoRows(input)
        expect(result).toHaveLength(3)
        expect(result[0]).toBe('| id | nombre |')
        expect(result[1]).toBe('| -- | ------ |')
        expect(result[2]).toBe('| 1  | Test   |')
    })

    it('Debe manejar strings sin saltos de línea', () => {
        const input = 'Test'
        const result = splitTableIntoRows(input)
        expect(result).toHaveLength(1)
        expect(result[0]).toBe(input)
    })
})