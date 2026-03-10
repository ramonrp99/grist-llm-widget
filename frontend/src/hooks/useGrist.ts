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
            console.error("Error con Grist Plugin API")
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
            console.error("Error con Grist Plugin API")
            return
        }

        if(!tableId) {
            console.error('Grist TableId no disponible')
            return
        }

        try {
            return await grist.docApi.applyUserActions([
                [action, tableId, rowId, data]
            ])
        } catch(err) {
            console.error(`Error realizando la acción ${action}:`, err)
            throw err
        }
    }, [tableId])

    const updateRow = (rowId: number, data: Record<string, string>) => {
        sendAction('UpdateRecord', rowId, data)
    }

    const addRow = (data: Record<string, string>) => {
        sendAction('AddRecord', null, data)
    }

    return {isReady, row, table, updateRow, addRow}
}