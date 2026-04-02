jest.mock('@utils/tokenizer', () => ({
    countTokens: jest.fn(text => text ? text.length : 0)
}))

jest.mock('@utils/markdown', () => ({
    splitTableIntoRows: jest.fn(text => text.split(/\n/))
}))

jest.mock('@config/systemPrompt', () => ({
    systemPrompt: 'System',
    systemPromptTokens: 6
}))

const { buildChatMessages } = require('@utils/promptBuilder')
const AppError = require('@core/AppError')

describe('utils/promptBuilder - buildChatMessages', () => {
    test('Caso ideal - Debe devolver un array de mensajes sin truncado', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        const history = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        const result = buildChatMessages(userPrompt, context, history, 100)

        expect(result).toHaveLength(4)
        expect(result[0]).toEqual({role: 'system', content: `System\n\n${context}`})
        expect(result[1]).toEqual({role: 'user', content: 'Antiguo'})
        expect(result[2]).toEqual({role: 'assistant', content: 'Nuevo'})
        expect(result[3]).toEqual({role: 'user', content: userPrompt})
    })

    test('Truncado de historial - Debe mantener el contexto y truncar el historial (quitar antiguos)', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |'
        const history = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        const result = buildChatMessages(userPrompt, context, history, 60)

        expect(result).toHaveLength(3)
        expect(result[0]).toEqual({role: 'system', content: `System\n\n${context}`})
        expect(result[1]).toEqual({role: 'assistant', content: 'Nuevo'})
        expect(result[2]).toEqual({role: 'user', content: userPrompt})
    })

    test('Truncado de contexto - Debe eliminar el historial y truncar filas de la tabla de contexto', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |\n| 2 | Test |'
        const history = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        const result = buildChatMessages(userPrompt, context, history, 60)

        expect(result).toHaveLength(2)
        expect(result[0]).toEqual({role: 'system', content: 'System\n\n| id | nombre |\n| --- | --- |\n| 1 | Test |'})
        expect(result[1]).toEqual({role: 'user', content: userPrompt})
    })

    test('Truncado de contexto - Debe lanzar AppError si las 3 filas mínimas de la tabla ya exeden el límite', () => {
        const userPrompt = 'Hola'
        const context = '| id | nombre |\n| --- | --- |\n| 1 | Test |\n| 2 | Test |'
        const history = [
            {role: 'user', content: 'Antiguo'},
            {role: 'assistant', content: 'Nuevo'}
        ]

        expect(() => {
            buildChatMessages(userPrompt, context, history, 40)
        }).toThrow(AppError)
    })
})