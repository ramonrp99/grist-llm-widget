import type { TSuggestion } from '../types/TSuggestion'
import suggestions from './../../config/suggestions.json'

const REQUIRED_KEYS = ['title', 'prompt', 'context']
const REQUIRED_CONTEXT_VALUES = new Set(['row', 'table'])

export const processedSuggestions: TSuggestion[] = suggestions.flatMap(suggestion => {
    const keys = Object.keys(suggestion)

    const hasValidKeys = keys.length === REQUIRED_KEYS.length && REQUIRED_KEYS.every(key => keys.includes(key))

    if(!hasValidKeys) {
        return []
    }

    const hasInvalidValues = REQUIRED_KEYS.some(key => {
        const value = suggestion[key as keyof typeof suggestion]

        if(typeof value !== 'string' || value.trim().length === 0) {
            return true
        }

        if(key === 'context' && !REQUIRED_CONTEXT_VALUES.has(value)) {
            return true
        }

        return false
    })

    if(hasInvalidValues) {
        return []
    }

    return [{
        id: crypto.randomUUID() as string,
        ...suggestion
    }]
})