import { useCallback, useLayoutEffect, useRef } from 'react';
import type { TMessage } from '../types/TMessage';
import ChatMessage from './ChatMessage';

interface ChatListProps {
    messages: TMessage[]
}

export default function ChatList({messages}: Readonly<ChatListProps>) {
    const lastUserMessageIndex = messages.map(m => m.isUser).lastIndexOf(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const lastUserMessageRef = useRef<HTMLDivElement>(null)
    const lastResponseRef = useRef<HTMLDivElement>(null)
    const spacerRef = useRef<HTMLDivElement>(null)

    // Calcula el espacio en blanco que debe añadirse al final del listado para que el scroll situe arriba el mensaje del usuario
    const updateSpacer = useCallback(() => {
        const viewport = containerRef.current?.parentElement

        if(!viewport || lastUserMessageIndex === -1) {
            return
        }

        const viewportHeight = viewport.clientHeight
        const lastUserMsgHeight = lastUserMessageRef.current?.clientHeight ?? 0
        const lastResponseHeight = lastResponseRef.current?.clientHeight ?? 0

        // Se tiene en cuenta la separación entre elementos por la clase "gap-4" y la clase "pb-2" del elemento padre
        // gap-4 = 16px // pb-2 = 8px
        // Si el último mensaje es del usuario, solo hay un gap-4
        // Si no lo es, hay 2 gap-4
        const gapHeight = messages.at(-1)?.isUser ? 24 : 40

        const neededSpace = Math.max(0, viewportHeight - lastUserMsgHeight - lastResponseHeight - gapHeight)

        if(spacerRef.current) {
            spacerRef.current.style.height = `${neededSpace}px`
        }
    }, [messages, lastUserMessageIndex])

    useLayoutEffect(() => {
        const viewport = containerRef.current?.parentElement

        if(!viewport) {
            return
        }

        updateSpacer()

        // Observar redimensiones de los elementos para recalcular el tamaño del espacio en blanco
        const resizeObserver = new ResizeObserver(() => {
            updateSpacer()
        })

        resizeObserver.observe(viewport)

        if(containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        // Scroll automático cuando se añade el mensaje del usaurio
        if(messages.at(-1)?.isUser){
            lastUserMessageRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }

        return () => resizeObserver.disconnect()
    }, [messages, lastUserMessageIndex, updateSpacer])

    const handleMessageRef = (index: number) => (el: HTMLDivElement) => {
        if(index === lastUserMessageIndex) {
            lastUserMessageRef.current = el
        } else if(index === messages.length - 1) {
            lastResponseRef.current = el
        } 
    }

    return (
        <div className="flex flex-col gap-4" ref={containerRef}>
            {messages.map((message, index) => 
                <div
                    key={message.id}
                    ref={handleMessageRef(index)}
                >
                    <ChatMessage message={message}/>
                </div>
            )}
            <div ref={spacerRef}/>
        </div>
    )
}