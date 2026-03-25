jest.mock('@utils/files', () => ({
    readFile: jest.fn()
}))

describe('config/models', () => {
    beforeEach(() => {
        jest.resetModules()
        jest.clearAllMocks()
        jest.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterAll(() => {
        console.error.mockRestore()
    })

    test('Debe cargar los datos de config/models.json si el formato es correcto', () => {
        const models = {
            external: [{model: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Descripción'}],
            local: [{url: 'http://localhost:11434', model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)', description: 'Descripción (local)'}]
        }

        const { readFile } = require('@utils/files')
        readFile.mockReturnValue({ok: true, data: JSON.stringify(models)})

        const { availableModels } = require('../../../src/config/models')

        expect(availableModels).toEqual(models)
        expect(console.error).not.toHaveBeenCalled()
    })

    test('Debe mostrar error por consola y no cargar un modelo externo si le falta algún campo obligatorio', () => {
        const models = {
            external: [
                {name: 'Llama 3 8B', description: 'Descripción'},
                {model: 'meta-llama/llama-3-8b-instruct', name: 'Llama 3 8B'},
                {model: 'google/gemini-2.5-flash-lite', description: 'Descripción'}
            ],
            local: [{url: 'http://localhost:11434', model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)', description: 'Descripción (local)'}]
        }

        const { readFile } = require('@utils/files')
        readFile.mockReturnValue({ok: true, data: JSON.stringify(models)})

        const { availableModels } = require('../../../src/config/models')

        expect(availableModels).toEqual({external: [], local: models.local})
        expect(console.error).not.toHaveBeenCalled()
    })

    test('Debe mostrar error por consola y no cargar un modelo externo si su campo model está vacío', () => {
        const models = {
            external: [
                {model: '', name: 'Llama 3 8B', description: 'Descripción'},
                {model: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Descripción'}
            ],
            local: [{url: 'http://localhost:11434', model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)', description: 'Descripción (local)'}]
        }

        const { readFile } = require('@utils/files')
        readFile.mockReturnValue({ok: true, data: JSON.stringify(models)})

        const { availableModels } = require('../../../src/config/models')

        expect(availableModels).toEqual({external: [{model: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Descripción'}], local: models.local})
        expect(console.error).not.toHaveBeenCalled()
    })

    test('Debe mostrar error por consola y no cargar un modelo local si le falta algún campo obligatorio', () => {
        const models = {
            external: [{model: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Descripción'}],
            local: [
                {model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)', description: 'Descripción (local)'},
                {url: 'http://localhost:11434', model: 'qwen3.5:0.8b', description: 'Descripción (local)'},
                {url: 'http://localhost:11434', model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)'},
                {url: 'http://localhost:11434', name: 'Gemini (local)', description: 'Descripción (local)'}
            ]
        }

        const { readFile } = require('@utils/files')
        readFile.mockReturnValue({ok: true, data: JSON.stringify(models)})

        const { availableModels } = require('../../../src/config/models')

        expect(availableModels).toEqual({external: models.external, local: []})
        expect(console.error).not.toHaveBeenCalled()
    })

    test('Debe mostrar error por consola y no cargar un modelo local si su campo url o model está vacío', () => {
        const models = {
            external: [{model: 'google/gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', description: 'Descripción'}],
            local: [
                {url: '', model: 'qwen3.5:0.8b', name: 'Qwen 3.5 0.8B (local)', description: 'Descripción (local)'},
                {url: 'http://localhost:11434', model: '', name: 'Gemini (local)', description: 'Descripción (local)'}
            ]
        }

        const { readFile } = require('@utils/files')
        readFile.mockReturnValue({ok: true, data: JSON.stringify(models)})

        const { availableModels } = require('../../../src/config/models')

        expect(availableModels).toEqual({external: models.external, local: []})
        expect(console.error).not.toHaveBeenCalled()
    })
})