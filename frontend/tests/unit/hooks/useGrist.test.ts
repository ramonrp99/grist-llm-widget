import type { TGristRow } from "@customTypes/TGrist"
import useGrist from "@hooks/useGrist"
import { act, renderHook, waitFor } from "@testing-library/react"

describe('useGrist', () => {
    const mockReady = vi.fn()
    const mockGetTable = vi.fn(() => ({
        getTableId: vi.fn().mockResolvedValue('Table1')
    }))
    const mockApplyUserActions = vi.fn().mockResolvedValue(['ok'])

    let onRecordCallback: (data: TGristRow | null) => void
    let onRecordsCallback: (data: TGristRow[]) => void

    beforeEach(() => {
        vi.clearAllMocks()

        globalThis.grist = {
            ready: mockReady,
            getTable: mockGetTable,
            onRecord: vi.fn(cb => {onRecordCallback = cb}),
            onRecords: vi.fn(cb => {onRecordsCallback = cb}),
            docApi: {
                applyUserActions: mockApplyUserActions
            }
        }
    })

    it('Debe inicializar Grist e isReady ser true', async () => {
        const { result } = renderHook(() => useGrist())

        expect(mockReady).toHaveBeenCalledWith({requiredAccess: 'read table'})

        act(() => {
            onRecordCallback({id: 1, nombre: 'Test'})
        })

        await waitFor(() => {
            expect(result.current.isReady).toBe(true)
        })
    })

    it('Debe actualizar la fila seleccionada cuando la función onRecord de Grist emite datos', async () => {
        const { result } = renderHook(() => useGrist())

        act(() => {
            onRecordCallback({id: 1, nombre: 'Test'})
        })

        expect(result.current.row).toEqual({id: 1, nombre: 'Test'})
        expect(result.current.isReady).toBe(true)
    })

    it('Debe actualizar la tabla cuando la función onRecords de Grist emite datos', async () => {
        const { result } = renderHook(() => useGrist())

        act(() => {
            onRecordsCallback([
                {id: 1, nombre: 'Test'},
                {id: 2, nombre: 'Test 2'}
            ])
        })

        expect(result.current.table).toEqual([
            {id: 1, nombre: 'Test'},
            {id: 2, nombre: 'Test 2'}
        ])
        expect(result.current.isReady).toBe(true)
    })

    it('updateRow debe llamar a applyUserActions con el formato correcto', async () => {
        const { result } = renderHook(() => useGrist())

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        await act(async () => {
            await result.current.updateRow(1, {nombre: 'Test'})
        })

        expect(mockApplyUserActions).toHaveBeenCalledWith([
            ['UpdateRecord', 'Table1', 1, { nombre: 'Test' }]
        ])
    })

    it('addRow debe llamar a applyUserActions con el formato correcto', async () => {
        const { result } = renderHook(() => useGrist())

        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0))
        })

        await act(async () => {
            await result.current.addRow({nombre: 'Test'})
        })

        expect(mockApplyUserActions).toHaveBeenCalledWith([
            ['AddRecord', 'Table1', null, { nombre: 'Test' }]
        ])
    })
})