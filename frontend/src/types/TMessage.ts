export interface TMessage {
    id: string,
    text: string,
    table?: string[][],
    isUser: boolean,
    error: boolean
}

export interface THistoryMessage {
    role: 'user' | 'assistant',
    content: string
}