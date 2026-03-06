import { markdownTable } from "markdown-table"
import type { TGristRow } from "../types/TGrist"
import { marked, type Tokens } from "marked"

export function getMarkdownTable(table: TGristRow[]): string {
    if(!table || table.length === 0) {
        return ''
    }

    const header = Object.keys(table[0]).filter(k => k !== 'id')
    const rows = table.map(row => header.map(h => String(row[h] ?? '')))

    return markdownTable([header, ...rows])
}

export function extractTableData(table: string): string[][] | undefined {
    const tokens = marked.lexer(table)
    const tableToken = tokens.find(token => token.type === 'table') as Tokens.Table

    if(!tableToken) {
        return undefined
    }

    const header = tableToken.header.map(h => h.text)
    const rows = tableToken.rows.map(row =>
        row.map(cell => cell.text)
    )

    return [header, ...rows]
}