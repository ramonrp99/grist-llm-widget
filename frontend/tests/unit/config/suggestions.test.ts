describe('config/suggestions', () => {
    beforeEach(() => {
        vi.resetModules()
        vi.restoreAllMocks()
    })

    it('Debe filtrar las opciones predefinidas con formato incorrecto', async () => {
        vi.doMock('../../../config/suggestions.json', () => ({
            default: [
                {title: 'Opción 1', prompt: 'Prompt', context: 'row'},
                {title: 'Opción 2', prompt: ''},
                {title: 'Opción 3', prompt: 'Prompt', context: 123},
                {title: '  ', prompt: 'Prompt', context: 'row'},
                {title: 'Opción 4', prompt: 'Prompt', context: 'test'},
            ]
        }))

        const { processedSuggestions } = await import("@config/suggestions")

        expect(processedSuggestions).toHaveLength(1)
        expect(processedSuggestions[0]).toMatchObject({title: 'Opción 1', prompt: 'Prompt', context: 'row'})
    })

    it('Debe devolver un array vacío si ninguna opción predefinida es válida', async () => {
        vi.doMock('../../../config/suggestions.json', () => ({
            default: [
                {title: 'Opción 2', prompt: ''},
                {title: 'Opción 3', prompt: 'Prompt', context: 123},
                {title: '  ', prompt: 'Prompt', context: 'row'},
                {title: 'Opción 4', prompt: 'Prompt', context: 'test'},
            ]
        }))

        const { processedSuggestions } = await import("@config/suggestions")

        expect(processedSuggestions).toHaveLength(0)
        expect(processedSuggestions).toEqual([])
    })

    it('Debe generar un UUID para cada opción predefinida válida', async () => {
        vi.doMock('../../../config/suggestions.json', () => ({
            default: [
                {title: 'Opción 1', prompt: 'Prompt', context: 'row'},
                {title: 'Opción 2', prompt: ''},
                {title: 'Opción 3', prompt: 'Prompt', context: 123},
                {title: '  ', prompt: 'Prompt', context: 'row'},
                {title: 'Opción 4', prompt: 'Prompt', context: 'test'},
            ]
        }))

        const { processedSuggestions } = await import("@config/suggestions")

        processedSuggestions.forEach(suggestion => {
            expect(suggestion.id).toBeDefined()
            expect(typeof suggestion.id).toBe('string')
            expect(suggestion.id).toHaveLength(36)
        })
    })
})