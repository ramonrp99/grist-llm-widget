vi.mock('@utils/tokenizer', () => ({
    countTokens: vi.fn(text => text ? text.length : 0)
}))

vi.mock('@utils/markdown', () => ({
    splitTableIntoRows: vi.fn(text => text.split(/\n/))
}))

import { preparePrompt } from "@utils/promptShaper"
import type { THistoryMessage } from "@customTypes/TMessage"

describe('utils/promptShaper - preparePrompt', () => {
    it('Caso ideal - Debe devolver el historial y el contexto sin truncado', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        const history: THistoryMessage[] = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo', table: '| id | nombre |\n| --- | --- |\n| 2 | Test2 |'}
        ]

        const result = preparePrompt(userPrompt, context, history, 110)

        expect(result).toEqual({
            prompt: userPrompt,
            context: context,
            history: history
        })
    })

    it('Truncado de historial - Debe mantener el contexto y truncar el historial (quitar antiguos)', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        const history: THistoryMessage[] = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        const result = preparePrompt(userPrompt, context, history, 55)

        expect(result).toEqual({
            prompt: userPrompt,
            context: context,
            history: [{role: 'assistant', content: 'Nuevo'}]
        })
    })

    it('Truncado de contexto - Debe eliminar el historial y truncar filas de la tabla de contexto', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |\n| 2 | Test |'
        const history: THistoryMessage[] = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        const result = preparePrompt(userPrompt, context, history, 50)

        expect(result).toEqual({
            prompt: userPrompt,
            context: '| id | nombre |\n| --- | --- |\n| 1 | Test |',
            history: []
        })
    })

    it('Truncado de contexto - Debe lanzar Error si las 3 filas mínimas de la tabla ya exceden el límite', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |\n| 2 | Test |'
        const history: THistoryMessage[] = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        expect(() => {
            preparePrompt(userPrompt, context, history, 40)
        }).toThrow()
    })
})