import './App.css'
import ChatList from './components/ChatList'
import MessageInput from './components/MessageInput'
import useChat from './hooks/useChat';
import useGrist from './hooks/useGrist';
import { generateCompletion } from './services/aiService';
import type { TGristRow } from './types/TGrist';
import { getMarkdownTable } from './utils/markdown';

export default function App() {
    const {messages, addMessage} = useChat()
    const {isReady, row, table} = useGrist()

    function sendMessage(message: string, context: string, model: string): void {
        addMessage(message, true)

        if(!isReady) {
            addMessage('Ha ocurrido un error inesperado.', false)
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
            addMessage(data.text, false)
        })
    }

    return (
        <div>
            <section>
                <ChatList messages={messages}/>
            </section>
            <section>
                <MessageInput onSend={(message, context, model) => sendMessage(message, context, model)}/>
            </section>
        </div>
    )
}
