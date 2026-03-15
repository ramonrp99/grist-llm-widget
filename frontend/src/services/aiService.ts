import type { THistoryMessage } from "../types/TMessage"

export async function getModels() {
    const res = await fetch('http://localhost:3000/api/ai/models')

    const json = await res.json()

    if(!res.ok || json.error) {
        throw new Error('Se ha producido un error al obtener los modelos disponibles.')
    }

    return json.data
}

export async function generateCompletion(message: string, context: string, model: string, history: THistoryMessage[]) {
    const res = await fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
            'CF-TURNSTILE-TOKEN': import.meta.env.VITE_CF_TURNSTILE_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': model,
            'prompt': message,
            'context': context,
            'messages': history
        })
    })

    const json = await res.json()

    if(!res.ok || json.error) {
        if(res.status === 429) {
            throw new Error('Se ha alcanzado el límite de peticiones. Inténtalo de nuevo más tarde.')
        }

        throw new Error('Se ha producido un error inesperado. Por favor, inténtalo de nuevo.')
    }

    return json.data
}