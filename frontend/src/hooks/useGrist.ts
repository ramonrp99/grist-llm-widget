import { useEffect, useState } from "react";

declare global {
    var grist: any
}

export default function useGrist() {
    const [isReady, setIsReady] = useState(false)
    const [record, setRecord] = useState([])
    const [table, setTable] = useState([])

    useEffect(() => {
        const grist = globalThis.grist

        if(!grist) {
            console.error("Error con Grist Plugin API")
            return
        }

        grist.ready({
            requiredAccess: 'read table'
        })

        grist.onRecord((data: any) => {
            setRecord(data)
            setIsReady(true)
        })

        grist.onRecords((data: any) => {
            setTable(data)
            setIsReady(true)
        })
    }, [])

    return {isReady, record, table, grist: globalThis.grist}
}