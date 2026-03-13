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

    const sendMessage = async (message: string, context: string, model: string) => {
        try {
            addMessage(true, message)
            setIsGenerating(true)

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

            const data = await generateCompletion(message, mdTable, model)
            const dataTable = data.table ? extractTableData(data.table) : undefined

            addMessage(false, data.text, dataTable)
            setIsGenerating(false)
        } catch(err) {
            const errMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'

            addMessage(false, errMessage, undefined, true)
            setIsGenerating(false)
        }
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
