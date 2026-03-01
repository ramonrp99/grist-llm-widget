export function getModels() {
    return fetch('http://localhost:3000/api/ai/models')
        .then(res => res.json())
        .then(response => {
            return response.data
        })
}

export function generateCompletion(message: string, context: string, model: string) {
    return fetch('http://localhost:3000/api/ai/chat', {
        method: 'POST',
        headers: {
            'CF-TURNSTILE-TOKEN': import.meta.env.VITE_CF_TURNSTILE_TOKEN,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'model': model,
            'prompt': message,
            'context': context,
            'messages': []
        })
    })
        .then(res => res.json())
        .then(response => {
            return response.data
        })
}