import { useState } from "react";
import type { TMessage } from "../types/TMessage"

export default function useChat() {
    const [messages, setMessages] = useState<TMessage[]>([])

    const addMessage = (isUser: boolean, message: string, table?: string[][], mdTable?: string, isLoading = false, error: boolean = false) => {
        const msg: TMessage = {
            id: crypto.randomUUID(),
            text: message,
            table: table,
            mdTable: mdTable,
            isUser: isUser,
            isLoading: isLoading,
            error: error
        }

        setMessages(prev => [...prev, msg])

        return msg.id
    }

    const updateMessage = (id: string, updates: Partial<TMessage>) => {
        setMessages(prev => {
            if(prev.length === 0) return prev

            const msgIndex = prev.findIndex(m => m.id === id)

            if(msgIndex === -1) return prev
            
            const updatedMessages = [...prev]

            updatedMessages[msgIndex] = {
                ...updatedMessages[msgIndex],
                ...updates
            }

            return updatedMessages
        })
    }

    return {messages, addMessage, updateMessage}
}