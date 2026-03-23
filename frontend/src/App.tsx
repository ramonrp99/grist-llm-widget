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
import { preparePrompt } from './utils/promptShaper';
import AppSpinner from './components/core/AppSpinner';

export default function App() {
    const [isLoading, setIsLoading] = useState(true)
    const [isGenerating, setIsGenerating] = useState(false)
    const [inputValues, setInputValues] = useState<TForm | undefined>(undefined)
    const [models, setModels] = useState<TModel[]>([])
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const {messages, addMessage, updateMessage} = useChat()
    const {isReady, row, table} = useGrist()

    useEffect(() => {
        const loadModels = async () => {
            try {
                const models = await getModels()

                if(models.length === 0) {
                    throw new Error('No se han encontrado modelos disponibles. Por favor, ponte en contacto con el administrador.')
                }

                setModels(models)
                setIsLoading(false)
            } catch(err) {
                const errMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'
                
                setError(true)
                setErrorMsg(errMessage)
                setIsLoading(false)
            }
        }

        loadModels()
    }, [])

    const onSendMessage = async (message: string, context: string, model: string, turnstileToken: string) => {
        const history = messages
        
        // Mensaje del usuario
        const userMsgId = addMessage(true, message)

        setIsGenerating(true)
        // Se añade mensaje de respuesta vacio con isLoading a true para mostrar spinner de carga
        const responseMsgId = addMessage(false, '', undefined, true)

        try {
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

            const maxTokens = models.find(m => m.model === model)?.max_tokens || 0
            const truncatedData = preparePrompt(message, mdTable, processedHistory, maxTokens)

            const data = await generateCompletion(truncatedData.prompt, truncatedData.context, model, truncatedData.history, turnstileToken)
            const dataTable = data.table ? extractTableData(data.table) : undefined

            // Acualizar mensaje de respuesta con los datos obtenidos
            updateMessage(responseMsgId, {text: data.text, table: dataTable, isLoading: false})
            setIsGenerating(false)
        } catch(err) {
            // Marcar el mensaje del usuario también como error
            updateMessage(userMsgId, {error: true})

            const errMessage = err instanceof Error ? err.message : 'Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.'

            // Actualizar mensaje de respuesta con el error
            updateMessage(responseMsgId, {text: errMessage, isLoading: false, error: true})
            setIsGenerating(false)

            setInputValues({
                prompt: message,
                context: context
            })
        }
    }

    const onSelectSuggestion = (suggestionId: string) => {
        const selectedSuggestion = processedSuggestions.find(s => s.id === suggestionId)

        if(selectedSuggestion) {
            setInputValues({
                prompt: selectedSuggestion.prompt,
                context: selectedSuggestion.context
            })
        }
    }

    const handleAlertClose = () => {
        setError(false)
        setErrorMsg('')
    }

    if(isLoading) {
        return (
            <div className='flex items-center justify-center h-full w-full'>
                <AppSpinner width={64} height={64} primaryColor='text-primary' secondaryColor='text-message'/>
            </div>
        )
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
                <MessageInput models={models} disabled={isGenerating} initialData={inputValues} onSend={onSendMessage}/>
            </section>
            <section className='flex justify-center items-center pb-2'>
                <p className='text-xs text-black/80'>La IA puede cometer errores. Considera verificar la información importante.</p>
            </section>
        </div>
    )
}
