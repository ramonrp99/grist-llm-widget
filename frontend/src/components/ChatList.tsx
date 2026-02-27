import type { TMessage } from '../types/TMessage';
import Message from './ChatMessage';

interface ChatListProps {
    messages: TMessage[]
}

export default function ChatList({messages}: Readonly<ChatListProps>) {
    return (
        <div className='flex flex-1 overflow-y-auto p-4 flex-col gap-6'>
            {messages.map((message) => 
                <Message
                    key={message.id}
                    message={message}
                />
            )}
        </div>
    )
}