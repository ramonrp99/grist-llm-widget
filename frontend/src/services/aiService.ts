export function getModels() {
    return fetch('http://localhost:3000/api/ai/models')
        .then(res => res.json())
        .then(response => {
            return response.data
        })
}