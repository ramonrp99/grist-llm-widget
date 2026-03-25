const fs = require('node:fs')
const { readFile } = require('@utils/files')

jest.mock('node:fs')

describe('utils/files - readFile', () => {
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    test('Debe leer el archivo correctamente y devolver ok: true', () => {
        const mockContent = 'Texto de prueba'
        fs.readFileSync.mockReturnValue(mockContent)

        const result = readFile('test.txt')
        expect(fs.readFileSync).toHaveBeenCalled()
        expect(result.ok).toBe(true)
        expect(result.data).toBe(mockContent)
    })

    test('Debe devolver ok: false y el error si falla la lectura del archivo', () => {
        const mockError = new Error('ENOENT: no such file or directory')
        fs.readFileSync.mockImplementation(() => {
            throw mockError
        })

        const result = readFile('test.txt')
        expect(result.ok).toBe(false)
        expect(result.error).toBe(mockError)
        expect(console.error).toHaveBeenCalled()
    })
})