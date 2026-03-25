const { countTokens } = require('@utils/tokenizer')

describe('/utils/tokenizer - countToken', () => {
    test('Debe devolver 0 para un string vacío', () => {
        expect(countTokens('')).toBe(0)
    })

    test('Debe contar correctamente palabras simples', () => {
        const result = countTokens('Hola mundo')
        expect(result).toBe(2)
        expect(typeof result).toBe('number')
    })

    test('Debe contar correctamente strings largos', () => {
        const longString = 'a'.repeat(1000)
        expect(countTokens(longString)).toBe(125)
    })

    test('Debe devolver 0 si el input no es un string', () => {
        expect(countTokens(null)).toBe(0)
        expect(countTokens(undefined)).toBe(0)
        expect(countTokens(123)).toBe(0)
    })
})