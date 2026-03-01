import { markdownTable } from "markdown-table"

export function getMarkdownTable(table) {
    const header = Object.keys(table[0]).filter(k => k !== 'id')
    const rows = table.map(row => header.map(h => String(row[h])))

    return markdownTable([header, ...rows])
}