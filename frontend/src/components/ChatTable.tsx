import { useEffect, useMemo, useState } from "react"
import useGrist from "../hooks/useGrist"
import AppAlert from "./core/AppAlert"
import AppSpinner from "./core/AppSpinner"

interface ChatTableProps {
    data: string[][]
}

interface RowData {
    id: string,
    cells: string[]
}

export default function ChatTable({data}: Readonly<ChatTableProps>) {
    const {updateRow, addRow} = useGrist()
    const [error, setError] = useState(false)

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

    const idColumnIndex = useMemo(() => {
        return header.indexOf('id')
    }, [header])

    const showIdColumn = useMemo(() => {
        return rows.some(row => row.cells[idColumnIndex] && row.cells[idColumnIndex] !== '')
    }, [rows, idColumnIndex])

    const [isEditing, setIsEditing] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [editableRows, setEditableRows] = useState<RowData[]>(rows)

    useEffect(() => {
        setEditableRows(rows)
    }, [rows])

    const updateCellInRow = (cells: string[], cellIndex: number, value: string) => {
        return cells.map((cell, i) => i === cellIndex ? value : cell)
    }

    const handleCellChange = (rowId: string, cellIndex: number, value: string) => {
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

    const handleEditClick = () => {
        setIsEditing(true)
    }

    const handleCancelClick = () => {
        setEditableRows(rows)
        setIsEditing(false)
    }

    const handleSaveClick = async () => {
        try {
            setIsSaving(true)

            const headers = header.filter((_, index) => index !== idColumnIndex)
            const finalData = [...editableRows.map(row => row.cells)]

            for(const row of finalData) {
                const rowId = row[idColumnIndex]
                const rowData = row.filter((_, index) => index !== idColumnIndex)
                const rowJson = Object.fromEntries(headers.map((h, i) => [h, rowData[i]]))

                if(rowId === '') {
                    await addRow(rowJson)
                } else {
                    await updateRow(Number(rowId), rowJson)
                }
            }

            setIsEditing(false)
            setIsSaved(true)
            setIsSaving(false)
        } catch(err) {
            setError(true)
            setIsSaving(false)
            console.error('Error al guardar los datos en Grist:', err)
        }
    }

    const handleAlertClose = () => {
        setError(false)
    }

    return (
        <div className="flex flex-col gap-2 max-w-full">
            {error ? (
                <AppAlert message="Ha ocurrido un error al guardar los datos en Grist. Por favor, inténtalo de nuevo." onClose={handleAlertClose}/>
            ) : null}

            <div className="overflow-x-auto">
                <table className="border-collapse table-auto">
                    <thead>
                        <tr>
                            {header.map((h, i) => i === idColumnIndex && !showIdColumn ? null : (
                                <th 
                                    key={`header-${h}-${i}`}
                                    className={`px-3 py-2 ${i === idColumnIndex ? '' : 'border whitespace-nowrap bg-table-header'}`}
                                >
                                    {i === idColumnIndex ? null : h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {editableRows.map(row => (
                            <tr key={row.id}>
                                {row.cells.map((cell, iCell) => iCell === idColumnIndex && !showIdColumn ? null : (
                                    <td 
                                        key={`${row.id}-cell-${iCell}`}
                                        data-value={cell}
                                        className={`relative border min-h-1 ${iCell === idColumnIndex ? 'bg-table-column-id' : 'bg-table-cell'} after:content-[attr(data-value)] after:invisible after:whitespace-nowrap after:block after:px-3 after:py-2`}
                                    >
                                        {iCell === idColumnIndex ? (
                                            <span
                                                className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] min-w-0 px-2 py-1 bg-transparent"
                                            >
                                                {cell}
                                            </span>
                                        ): (
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleCellChange(row.id, iCell, e.target.value)}
                                                disabled={!isEditing}
                                                className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] min-w-0 px-2 py-1 bg-transparent outline-none border-none enabled:ring-2 enabled:ring-inset enabled:ring-primary"
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row gap-2 justify-end">
                {isSaving ? (
                    <div className="p-2">
                        <AppSpinner width={24} height={24} primaryColor="text-primary" secondaryColor="text-message"/>
                    </div>
                ) : (<>
                    {isSaved ? (
                        <p
                            className="flex flex-row gap-0.5 pr-2 text-primary font-semibold"
                        >
                            <span className="material-symbols-outlined">check</span>
                            <span>Guardado</span>
                        </p>
                    ) : (<>
                        {isEditing ? (
                            <button
                                onClick={handleCancelClick}
                                className="px-2 py-1 border-2 rounded-md cursor-pointer bg-secondary text-red-500 border-red-500 font-semibold hover:bg-red-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-red-100"
                            >
                                Cancelar
                            </button>
                        ) : (
                            <button
                                onClick={handleEditClick}
                                className="px-2 py-1 border-2 rounded-md cursor-pointer bg-secondary text-primary border-primary font-semibold hover:bg-message-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-message-hover"
                            >
                                Editar
                            </button>
                        )}
                        <button
                            onClick={handleSaveClick}
                            className="px-2 py-1 rounded-md cursor-pointer bg-primary text-secondary font-semibold hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-primary-hover"
                        >
                            Guardar
                        </button>
                    </>)}
                </>)}
            </div>
        </div>
    )
}