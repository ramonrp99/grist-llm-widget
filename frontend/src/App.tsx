import './App.css'
import ChatList from './components/ChatList'
import MessageInput from './components/MessageInput'
import useChat from './hooks/useChat';
import useGrist from './hooks/useGrist';
import { generateCompletion } from './services/aiService';
import { getMarkdownTable } from './utils/markdown';

export default function App() {
    const {messages, addMessage} = useChat()
    const {isReady, record, table} = useGrist()

    return (
        <div>
            <section>
                <ChatList messages={messages}/>
            </section>
            <section>
                <MessageInput onSend={(message, context, model) => {
                    addMessage(message, true)

                    if(!isReady) {
                        addMessage('Ha ocurrido un error inesperado.', false)
                        return
                    }

                    const mdTable = getMarkdownTable(context === 'row' ? [record] : table)

                    generateCompletion(message, mdTable, model).then((data) => {
                        addMessage(data.text, false)
                    })
                }}/>
            </section>
        </div>
    )
}
