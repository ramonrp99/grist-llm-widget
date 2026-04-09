export interface TMessage {
    id: string,
    text: string,
    table?: string[][],
    mdTable?: string,
    isUser: boolean,
    isLoading: boolean,
    error: boolean
}

export interface THistoryMessage {
    role: 'user' | 'assistant',
    content: string,
    table?: string
}