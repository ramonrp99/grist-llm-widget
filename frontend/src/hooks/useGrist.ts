import { useCallback, useEffect, useRef, useState } from "react";
import type { TGristAPI, TGristRow } from "../types/TGrist";

declare global {
    var grist: TGristAPI
}

export default function useGrist() {
    const [isReady, setIsReady] = useState(false)
    const [row, setRow] = useState<TGristRow | null>(null)
    const [table, setTable] = useState<TGristRow[]>([])
    const [tableId, setTableId] = useState<string | null>(null)

    const gristRef = useRef<TGristAPI | null>(null)

    useEffect(() => {
        const grist = globalThis.grist

        if(!grist) {
            return
        }

        gristRef.current = grist

        grist.ready({
            requiredAccess: 'read table'
        })

        grist.getTable().getTableId().then(id => setTableId(id))

        grist.onRecord((data: TGristRow | null) => {
            setRow(data)
            setIsReady(true)
        })

        grist.onRecords((data: TGristRow[]) => {
            setTable(data)
            setIsReady(true)
        })
    }, [])

    const sendAction = useCallback(async (action: string, rowId: number | null, data: Record<string, string>) => {
        const grist = gristRef.current

        if(!grist) {
            throw new Error('Error con Grist Plugin API')
        }

        if(!tableId) {
            throw new Error('Grist TableId no disponible')
        }

        try {
            return await grist.docApi.applyUserActions([
                [action, tableId, rowId, data]
            ])
        } catch(err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido'

            throw new Error(errorMessage)
        }
    }, [tableId])

    const updateRow = (rowId: number, data: Record<string, string>) => {
        return sendAction('UpdateRecord', rowId, data)
    }

    const addRow = (data: Record<string, string>) => {
        return sendAction('AddRecord', null, data)
    }

    return {isReady, row, table, updateRow, addRow}
}