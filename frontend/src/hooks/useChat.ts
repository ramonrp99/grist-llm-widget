import { useState } from "react";
import type { TMessage } from "../types/TMessage"

export default function useChat() {
    const [messages, setMessages] = useState<TMessage[]>([])

    const addMessage = (isUser: boolean, message: string, table?: string[][], error: boolean = false) => {
        const msg: TMessage = {
            id: crypto.randomUUID(),
            text: message,
            table: table,
            isUser: isUser,
            error: error
        }

        setMessages(prev => [...prev, msg])
    }

    const updateLastMessage = (updates: Partial<TMessage>) => {
        setMessages(prev => {
            if(prev.length === 0) return prev

            const lastIndex = prev.length - 1
            const updatedMessages = [...prev]

            updatedMessages[lastIndex] = {
                ...updatedMessages[lastIndex],
                ...updates
            }

            return updatedMessages
        })
    }

    return {messages, addMessage, updateLastMessage}
}