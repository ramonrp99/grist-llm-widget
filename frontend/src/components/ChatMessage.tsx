import Markdown from "react-markdown"
import type { TMessage } from "../types/TMessage"
import ChatTable from "./ChatTable"
import AppSpinner from "./core/AppSpinner"

interface ChatMessageProps {
    message: TMessage
}

export default function ChatMessage({message}: Readonly<ChatMessageProps>) {
    if(message.isUser) {
        return (
            <div className="rounded-lg rounded-tr-none max-w-[70%] ml-auto px-4 py-2 bg-message shadow-xs">
                <p className="text-left wrap-break-word">{message.text}</p>
            </div>
        )
    } else if(message.isLoading) {
        return (
            <AppSpinner width={24} height={24} primaryColor="text-primary" secondaryColor="text-message"/>
        )
    } else if(message.error) {
        return (
            <div className="flex gap-2 text-red-500">
                <span className="material-symbols-outlined">error</span>
                <p className="text-left wrap-break-word">{message.text}</p>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col gap-4 items-start">
                <div className="text-left wrap-break-word">
                    <Markdown>{message.text}</Markdown>
                </div>
                {message.table && (
                    <ChatTable data={message.table}/>
                )}
            </div>
        )
    }
    
}