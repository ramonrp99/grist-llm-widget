import { countTokens } from "@utils/tokenizer"

describe('utils/tokenizer - countTokens', () => {
    it('Debe devolver 0 para un string vacío', () => {
        expect(countTokens('')).toBe(0)
    })

    it('Debe contar correctamente strings simples', () => {
        const result = countTokens('Hola mundo')
        expect(result).toBe(2)
        expect(typeof result).toBe('number')
    })

    it('Debe contar correctamente strings largos', () => {
        const input = 'a'.repeat(1000)
        const result = countTokens(input)
        expect(result).toBe(125)
        expect(typeof result).toBe('number')
    })
})