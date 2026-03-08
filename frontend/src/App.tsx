import { useState } from 'react';
import './App.css'
import ChatList from './components/ChatList'
import MessageInput from './components/MessageInput'
import useChat from './hooks/useChat';
import useGrist from './hooks/useGrist';
import { generateCompletion } from './services/aiService';
import type { TGristRow } from './types/TGrist';
import { getMarkdownTable, extractTableData } from './utils/markdown';

export default function App() {
    const [isGenerating, setIsGenerating] = useState(false)

    const {messages, addMessage} = useChat()
    const {isReady, row, table} = useGrist()

    function sendMessage(message: string, context: string, model: string): void {
        setIsGenerating(true)

        addMessage(true, message)

        if(!isReady) {
            addMessage(false, 'Ha ocurrido un error inesperado.')
            setIsGenerating(false)
            return
        }

        let gristData: TGristRow[] = []

        if(context === 'row') {
            if(row) {
                gristData = [row]
            }
        } else {
            gristData = table
        }

        const mdTable = getMarkdownTable(gristData)

        generateCompletion(message, mdTable, model).then((data) => {
            const table = data.table ? extractTableData(data.table) : undefined

            addMessage(false, data.text, table)

            setIsGenerating(false)
        })
    }

    return (
        <div className='flex flex-col h-full'>
            <section className='flex-1 overflow-y-auto pb-4 mask-b-from-[calc(100%-1rem)] mask-b-to-100%'>
                <ChatList messages={messages}/>
            </section>
            <section className='p-2 border-2 border-neutral-200 rounded-xl shadow-md'>
                <MessageInput disabled={isGenerating} onSend={(message, context, model) => sendMessage(message, context, model)}/>
            </section>
        </div>
    )
}
