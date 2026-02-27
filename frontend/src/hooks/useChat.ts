import { useState } from "react";
import type { TMessage } from "../types/TMessage"

export default function useChat() {
    const [messages, setMessages] = useState<TMessage[]>([])

    const addMessage = (text: string) => {
        const msg: TMessage = {
            id: crypto.randomUUID(),
            text: text,
            isUser: true
        }

        setMessages(prev => [...prev, msg])

        // PROVISIONAL
        // Respuesta LLM
        setTimeout(() => {
            const aiMsg: TMessage = {
                id: crypto.randomUUID(),
                text: 'Respuesta provisional',
                isUser: false
            }

            setMessages(prev => [...prev, aiMsg])
        }, 1000)
    }

    return {messages, addMessage}
}