import { useEffect, useState } from "react"
import { getModels } from "../services/aiService"
import type { TModel } from "../types/TModel"

interface MessageInputProps {
    onSend: (message: string, context: string, model: string) => void
}

export default function MessageInput({onSend}: Readonly<MessageInputProps>) {
    const [models, setModels] = useState<TModel[]>([])

    useEffect(() => {
        getModels().then(models => setModels(models))
    }, [])

    function sendMessage(formData: FormData) {
        const message: string = formData.get('message') as string
        const context: string = formData.get('context') as string
        const model: string = formData.get('model') as string

        onSend(message, context, model)
    }

    return (
        <form
            action={sendMessage}
            className="p-4 flex gap-2"
        >
            <input
                type="text"
                id="message"
                name="message"
                placeholder="Escribe..."
                className="border px-4 outline-none focus:ring-2"
            />
            <select 
                name="context"
                id="context"
                className="border"
            >
                <option value="row">Fila seleccionada</option>
                <option value="table">Tabla completa</option>
            </select>
            <select 
                name="model"
                id="model"
                className="border"
            >
                {
                    models.map(model => <option value={model.model} key={model.model}>{model.name}</option>)
                }
            </select>
            <button
                type="submit"
                className=""
            >
                Enviar
            </button>
        </form>
    )
}