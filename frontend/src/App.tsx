import './App.css'
import ChatList from './components/ChatList'
import MessageInput from './components/MessageInput'
import useChat from './hooks/useChat';

export default function App() {
    const {messages, addMessage} = useChat()

    return (
        <div>
            <section>
                <ChatList messages={messages}/>
            </section>
            <section>
                <MessageInput onSend={(text) => addMessage(text)}/>
            </section>
        </div>
    )
}
