import { useState } from "react";
import type { TMessage } from "../types/TMessage"

export default function useChat() {
    const [messages, setMessages] = useState<TMessage[]>([])

    const addMessage = (message: string, isUser: boolean) => {
        const msg: TMessage = {
            id: crypto.randomUUID(),
            text: message,
            isUser: isUser
        }

        setMessages(prev => [...prev, msg])
    }

    return {messages, addMessage}
}