import { useState } from "react";
import type { TMessage } from "../types/TMessage"

export default function useChat() {
    const [messages, setMessages] = useState<TMessage[]>([])

    const addMessage = (isUser: boolean, message: string, table?: string[][]) => {
        const msg: TMessage = {
            id: crypto.randomUUID(),
            text: message,
            table: table,
            isUser: isUser
        }

        setMessages(prev => [...prev, msg])
    }

    return {messages, addMessage}
}