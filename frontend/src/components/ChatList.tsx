import type { TMessage } from '../types/TMessage';
import Message from './ChatMessage';

interface ChatListProps {
    messages: TMessage[],
    onSaveTable: (data: string[][]) => void
}

export default function ChatList({messages, onSaveTable}: Readonly<ChatListProps>) {
    return (
        <div className="flex flex-col gap-4">
            {messages.map((message) => 
                <Message
                    key={message.id}
                    message={message}
                    onSaveTable={onSaveTable}
                />
            )}
        </div>
    )
}