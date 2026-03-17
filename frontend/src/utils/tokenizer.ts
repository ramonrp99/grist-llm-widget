import { getEncoding } from "js-tiktoken"

const encoding = getEncoding('cl100k_base')

export function countTokens(input: string) {
    return encoding.encode(input).length
}