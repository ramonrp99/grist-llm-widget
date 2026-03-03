import { markdownTable } from "markdown-table"
import type { TGristRow } from "../types/TGrist"

export function getMarkdownTable(table: TGristRow[]): string {
    if(!table || table.length === 0) {
        return ''
    }

    const header = Object.keys(table[0]).filter(k => k !== 'id')
    const rows = table.map(row => header.map(h => String(row[h] ?? '')))

    return markdownTable([header, ...rows])
}