import { useEffect, useMemo, useState } from "react"

interface ChatTableProps {
    data: string[][],
    onSave: (data: string[][]) => void
}

interface RowData {
    id: string,
    cells: string[]
}

export default function ChatTable({data, onSave}: Readonly<ChatTableProps>) {
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

    const [isEditing, setIsEditing] = useState(false)
    const [editableRows, setEditableRows] = useState<RowData[]>(rows)

    useEffect(() => {
        setEditableRows(rows)
    }, [rows])

    function updateCellInRow(cells: string[], cellIndex: number, value: string) {
        return cells.map((cell, i) => i === cellIndex ? value : cell)
    }

    function handleCellChange(rowId: string, cellIndex: number, value: string) {
        setEditableRows(prev => {
            return prev.map(row => {
                if(row.id !== rowId) {
                    return row
                }

                return {
                    ...row,
                    cells: updateCellInRow(row.cells, cellIndex, value)
                }
            })
        })
    }

    function handleSaveClick() {
        const finalData = [header, ...editableRows.map(row => row.cells)]

        onSave(finalData)
        setIsEditing(false)
    }

    return (
        <div className="flex flex-col gap-2 max-w-full">
            <div className="overflow-x-auto">
                <table className="border-collapse table-auto">
                    <thead>
                        <tr>
                            {header.map((h, i) => (
                                <th 
                                    key={`header-${h}-${i}`}
                                    className="border px-3 py-2 whitespace-nowrap bg-table-header"
                                >
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {editableRows.map(row => (
                            <tr key={row.id}>
                                {row.cells.map((cell, iCell) => (
                                    <td 
                                        key={`${row.id}-cell-${iCell}`}
                                        data-value={cell}
                                        className="relative border bg-table-cell min-h-1 after:content-[attr(data-value)] after:invisible after:whitespace-nowrap after:block after:px-3 after:py-2"
                                    >
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => handleCellChange(row.id, iCell, e.target.value)}
                                            disabled={!isEditing}
                                            className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] min-w-0 px-2 py-1 bg-transparent outline-none border-none enabled:ring-2 enabled:ring-inset enabled:ring-primary"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row gap-2 justify-end">
                <button
                    onClick={() => setIsEditing(true)}
                    disabled={isEditing}
                    className="px-2 py-1 border-2 rounded-md cursor-pointer bg-secondary text-primary border-primary font-semibold hover:bg-message-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-message-hover"
                >
                    Editar
                </button>
                <button
                    onClick={handleSaveClick}
                    className="px-2 py-1 rounded-md cursor-pointer bg-primary text-secondary font-semibold hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-primary-hover"
                >
                    Guardar
                </button>
            </div>
        </div>
    )
}