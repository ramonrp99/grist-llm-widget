import type { TMessage } from "../types/TMessage"

interface ChatMessageProps {
    message: TMessage
}

export default function ChatMessage({message}: Readonly<ChatMessageProps>) {
    if(message.isUser) {
        return (
            <div className="border border-black bg-white text-black rounded-sm max-w-[70%] ml-auto p-4">
                <p className="text-left break-words">{message.text}</p>
            </div>
        )
    } else {
        return (
            <div>
                <p className="text-left break-words">{message.text}</p>
            </div>
        )
    }
    
}