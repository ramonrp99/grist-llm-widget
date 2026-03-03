import { useEffect, useState } from "react";
import type { TGristAPI, TGristRow } from "../types/TGrist";

declare global {
    var grist: TGristAPI
}

export default function useGrist() {
    const [isReady, setIsReady] = useState(false)
    const [row, setRow] = useState<TGristRow | null>(null)
    const [table, setTable] = useState<TGristRow[]>([])

    useEffect(() => {
        const grist = globalThis.grist

        if(!grist) {
            console.error("Error con Grist Plugin API")
            return
        }

        grist.ready({
            requiredAccess: 'read table'
        })

        grist.onRecord((data: TGristRow | null) => {
            setRow(data)
            setIsReady(true)
        })

        grist.onRecords((data: TGristRow[]) => {
            setTable(data)
            setIsReady(true)
        })
    }, [])

    return {isReady, row, table}
}