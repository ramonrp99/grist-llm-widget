import { useState, type ChangeEvent, type SyntheticEvent } from "react"
import type { TModel } from "../types/TModel"
import type { TForm } from "../types/TForm"

interface MessageInputProps {
    models: TModel[],
    disabled: boolean,
    initialData?: TForm,
    onSend: (message: string, context: string, model: string) => void
}

export default function MessageInput({models, disabled, initialData, onSend}: Readonly<MessageInputProps>) {
    const [message, setMessage] = useState(initialData?.prompt || '')
    const [context, setContext] = useState(initialData?.context || '')

    // Comprobar si initialData ha cambiado sin provocar el renderizado en cascada que provocaría el uso de useEffect en esta funcionalidad
    const [prevInitialData, setPrevInitialData] = useState(initialData)

    if(initialData !== prevInitialData) {
        setPrevInitialData(initialData)

        setMessage(initialData?.prompt || '')
        setContext(initialData?.context || '')
    }

    const handlePromptChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value)
    }

    const handleContextChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setContext(e.target.value)
    }

    const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const model: string = formData.get('model') as string

        onSend(message, context, model)

        setMessage('')
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 min-w-0 w-full"
        >
            <div>
                <input
                    type="text"
                    id="message"
                    name="message"
                    placeholder="Haz una consulta..."
                    autoComplete="off"
                    className="p-1 w-full focus:outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                    required
                    pattern=".*\S+.*"
                    title="El campo no puede estar vacío o contener únicamente espacios en blanco"
                    value={message}
                    onChange={handlePromptChange}
                />
            </div>
            <div className="flex flex-row justify-between gap-2">
                <div className="flex">
                    <select 
                        name="context"
                        id="context"
                        value={context}
                        onChange={handleContextChange}
                        className="field-sizing-content h-8 p-1 border-2 rounded-full cursor-pointer bg-secondary text-primary border-primary font-semibold hover:bg-message-hover focus:outline-none focus:bg-message-hover disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <option value="row">Fila seleccionada</option>
                        <option value="table">Tabla completa</option>
                    </select>
                </div>
                <div className="flex min-w-0 gap-2">
                    <select 
                        name="model"
                        id="model"
                        className="field-sizing-content flex-1 min-w-0 h-8 p-1 border-2 rounded-full cursor-pointer bg-secondary text-primary border-primary font-semibold hover:bg-message-hover focus:outline-none focus:bg-message-hover disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        {
                            models.map(model => <option value={model.model} key={model.model}>{model.name}</option>)
                        }
                    </select>
                    <button
                        type="submit"
                        disabled={disabled}
                        className="flex h-8 p-1 rounded-full cursor-pointer bg-primary text-secondary hover:bg-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:bg-primary-hover disabled:bg-gray-50 disabled:border-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined">send</span>
                    </button>
                </div>
            </div>
        </form>
    )
}