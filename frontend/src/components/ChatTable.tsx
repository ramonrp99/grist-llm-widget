import { useMemo } from "react"

interface ChatTableProps {
    data: string[][]
}

export default function ChatTable({data}: Readonly<ChatTableProps>) {
    const {header, rows} = useMemo(() => {
        const [header, ...rows] = data

        return {
            header: header,
            rows: rows.map(row => ({
                id: crypto.randomUUID(),
                cells: row
            }))
        }
    }, [data])

    return (
        <div className="max-w-full overflow-x-auto">
            <table className="border-collapse table-auto">
                <thead>
                    <tr>
                        {header.map((h, i) => (
                            <th 
                                key={`header-${h}-${i}`}
                                className="border p-2 whitespace-nowrap bg-table-header"
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map(row => (
                        <tr key={row.id}>
                            {row.cells.map((cell, iCell) => (
                                <td 
                                    key={`${row.id}-cell-${iCell}`}
                                    className="border p-2 whitespace-nowrap bg-table-cell"
                                >
                                    {cell}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}