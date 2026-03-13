export interface TMessage {
    id: string,
    text: string,
    table?: string[][],
    isUser: boolean,
    error: boolean
}