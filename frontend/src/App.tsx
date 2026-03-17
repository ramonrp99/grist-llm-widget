import { useEffect, useState } from 'react';
import './App.css'
import ChatList from './components/ChatList'
import MessageInput from './components/MessageInput'
import useChat from './hooks/useChat';
import useGrist from './hooks/useGrist';
import { getModels, generateCompletion } from './services/aiService';
import type { TGristRow } from './types/TGrist';
import { getMarkdownTable, extractTableData } from './utils/markdown';
import ChatSuggestions from './components/ChatSuggestions';
import { processedSuggestions } from './config/suggestions';
import type { TForm } from './types/TForm';
import type { THistoryMessage } from './types/TMessage';
import type { TModel } from './types/TModel';
import AppAlert from './components/core/AppAlert';

export default function App() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [inputValues, setInputValues] = useState<TForm | undefined>(undefined)
    const [models, setModels] = useState<TModel[]>([])
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const {messages, addMessage, updateLastMessage} = useChat()
    const {isReady, row, table} = useGrist()

    useEffect(() => {
        const loadModels = async () => {
            try {
                const models = await getModels()

                if(models.length === 0) {
                    throw new Error('No se han encontrado modelos disponibles. Por favor, ponte en contacto con el administrador.')
                }

                setModels(models)
            } catch(err) {
                const errMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'
                
                setError(true)
                setErrorMsg(errMessage)
            }
        }

        loadModels()
    }, [])

    const onSendMessage = async (message: string, context: string, model: string) => {
        try {
            const history = messages

            addMessage(true, message)
            setIsGenerating(true)

            if(!isReady) {
                throw new Error('Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.')
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
            const processedHistory: THistoryMessage[] = history.flatMap(message => {
                if(message.error) return []

                return [{
                    role: message.isUser ? 'user' : 'assistant',
                    content: message.text
                }]
            })

            const data = await generateCompletion(message, mdTable, model, processedHistory)
            const dataTable = data.table ? extractTableData(data.table) : undefined

            addMessage(false, data.text, dataTable)
            setIsGenerating(false)
        } catch(err) {
            // Marcar el mensaje del usuario también como error
            updateLastMessage({error: true})

            const errMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'

            addMessage(false, errMessage, undefined, true)
            setIsGenerating(false)
        }
    }

    const onSelectSuggestion = (suggestionId: string) => {
        const selectedSuggestion = processedSuggestions.find(s => s.id === suggestionId)

        if(selectedSuggestion) {
            setInputValues({
                id: crypto.randomUUID(),
                prompt: selectedSuggestion.prompt,
                context: selectedSuggestion.context
            })
        }
    }

    const handleAlertClose = () => {
        setError(false)
        setErrorMsg('')
    }

    return (
        <div className='flex flex-col h-full gap-2'>
            {error ? (
                <AppAlert message={errorMsg} onClose={handleAlertClose}/>
            ): null}
            <section className='flex-1 overflow-y-auto pb-2 mask-b-from-[calc(100%-0.5rem)] mask-b-to-100%'>
                <ChatList messages={messages}/>
            </section>
            {!processedSuggestions || processedSuggestions.length === 0 ? null : (
                <section>
                    <ChatSuggestions suggestions={processedSuggestions} onSelect={onSelectSuggestion}/>
                </section>
            )}
            <section className='p-2 border-2 border-neutral-200 rounded-xl shadow-md'>
                <MessageInput key={inputValues?.id} models={models} disabled={isGenerating} initialData={inputValues} onSend={onSendMessage}/>
            </section>
        </div>
    )
}
