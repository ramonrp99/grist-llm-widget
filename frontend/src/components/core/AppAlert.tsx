import { createPortal } from "react-dom"

interface AppAlertProps {
    message: string,
    onClose: () => void
}

export default function AppAlert({message, onClose}: Readonly<AppAlertProps>) {
    return createPortal((
        <div className="fixed inset-0 z-9999 flex items-start justify-center pt-20">
            <button
                className="absolute inset-0 border-none p-0 bg-black/40 backdrop-blur-xs"
                onClick={onClose}
            />
            <div className="relative flex items-center bg-red-50 border-s-4 border-red-500 rounded-md max-w-xs shadow-2xl overflow-hidden">
                <div className="flex p-4 shrink-0 text-red-500">
                    <span className="material-symbols-outlined">error</span>
                </div>
                <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex justify-between pt-1 pr-1">
                        <p className="text-red-500 font-semibold">Error</p>
                        <button className="flex cursor-pointer" onClick={onClose}>
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <p className="text-sm pr-4 pb-2 wrap-break-word">{message}</p>
                </div>
            </div>
        </div>
    ), document.body)
}

/*
<button
    className="absolute inset-0 border-none p-0 bg-gray-200/60 backdrop-blur-[1px]"
    onClick={onClose}
/>
<div
    className="relative flex flex-col gap-2 rounded-md p-4 bg-secondary shadow-md"
>
    <p>{message}</p>
    <button onClick={onClose}>Cerrar</button>
</div>

*/