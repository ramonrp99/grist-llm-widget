import { act, renderHook } from '@testing-library/react'
import useChat from "@hooks/useChat"

describe('useChat', () => {
    beforeEach(() => {
        if(!globalThis.crypto) {
            vi.stubGlobal('crypto', {
                randomUUID: () => `uuid-${Math.random()}`
            })
        }
    })

    it('Debe inicializar con un array de mensajes vacío', () => {
        const { result } = renderHook(() => useChat())

        expect(result.current.messages).toEqual([])
    })

    it('Debe añadir un mensaje correctamente y devolver su ID', () => {
        const { result } = renderHook(() => useChat())
        let msgId = ''

        act(() => {
            msgId = result.current.addMessage(true, 'Test')
        })

        expect(typeof msgId).toBe('string')
        expect(msgId).not.toBe('')
        expect(result.current.messages).toHaveLength(1)
        expect(result.current.messages[0]).toEqual({
            id: msgId,
            text: 'Test',
            table: undefined,
            isUser: true,
            isLoading: false,
            error: false
        })
    })

    it('Debe actualizar propiedades específicas de un mensaje', () => {
        const { result } = renderHook(() => useChat())
        let msgId = ''

        act(() => {
            msgId = result.current.addMessage(true, 'Test')
        })

        act(() => {
            result.current.updateMessage(msgId, {
                text: 'Updated',
                error: true
            })
        })

        expect(result.current.messages).toHaveLength(1)
        expect(result.current.messages[0]).toEqual({
            id: msgId,
            text: 'Updated',
            table: undefined,
            isUser: true,
            isLoading: false,
            error: true
        })
    })

    it('No debe actualizar ningún mensaje si el id no existe', () => {
        const { result } = renderHook(() => useChat())
        let msgId = ''

        act(() => {
            msgId = result.current.addMessage(true, 'Test')
        })

        act(() => {
            result.current.updateMessage('a', {
                text: 'Updated',
                error: true
            })
        })

        expect(result.current.messages).toHaveLength(1)
        expect(result.current.messages[0]).toEqual({
            id: msgId,
            text: 'Test',
            table: undefined,
            isUser: true,
            isLoading: false,
            error: false
        })
    })
})