import type { EmblaCarouselType } from "embla-carousel"
import useEmblaCarousel from "embla-carousel-react"
import { useCallback, useEffect, useState, type SyntheticEvent } from "react"
import type { TSuggestion } from "../types/TSuggestion"

interface ChatSuggestionsProps {
    suggestions: TSuggestion[],
    onSelect: (value: string) => void
}

export default function ChatSuggestions({suggestions, onSelect}: Readonly<ChatSuggestionsProps>) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps'
    })

    const [prevBtnHidden, setPrevBtnHidden] = useState(true)
    const [nextBtnHidden, setNextBtnHidden] = useState(true)

    const onCarousel = useCallback((emblaApi: EmblaCarouselType) => {
        if(!emblaApi) return

        setPrevBtnHidden(!emblaApi.canScrollPrev())
        setNextBtnHidden(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if(!emblaApi) return

        // Necesario para que los botones de navegación se muestren al inicio
        const animationId = globalThis.requestAnimationFrame(() => {
            onCarousel(emblaApi)
        })

        emblaApi
            .on('init', onCarousel)
            .on('reInit', onCarousel)
            .on('select', onCarousel)
            .on('settle', onCarousel)

        return () => {
            emblaApi
                .off('init', onCarousel)
                .off('reInit', onCarousel)
                .off('select', onCarousel)
                .off('settle', onCarousel)

            globalThis.cancelAnimationFrame(animationId)
        }
    }, [emblaApi, onCarousel])

    const scrollPrev = () => {
        emblaApi?.scrollPrev()
    }

    const scrollNext = () => {
        emblaApi?.scrollNext()
    }

    const handleOptionClick = (e: SyntheticEvent<HTMLButtonElement>) => {
        const selectedOption = e.currentTarget.dataset.option as string

        onSelect(selectedOption)
    }

    if(!suggestions || suggestions.length === 0) return null

    return (
        <div className="embla relative w-full">
            {prevBtnHidden ? null : (
                <div className="absolute left-0 inset-y-0 z-10 flex items-center bg-linear-to-r from-secondary via-secondary/80 to-transparent">
                    <button className="embla__prev flex bg-secondary rounded-full p-1 cursor-pointer" onClick={scrollPrev}>
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                </div>
            )}

            <div className="embla__viewport overflow-x-hidden" ref={emblaRef}>
                <div className="embla__container flex items-center justify-center-safe gap-2">
                    {suggestions.map(suggestion => (
                        <button
                            key={suggestion.id}
                            data-option={suggestion.id}
                            onClick={handleOptionClick}
                            className="embla__slide flex-none bg-primary text-secondary rounded-full font-semibold cursor-pointer px-4 py-2"
                        >
                            {suggestion.title}
                        </button>
                    ))}
                </div>
            </div>
            
            {nextBtnHidden ? null : (
                <div className="absolute right-0 inset-y-0 z-10 flex items-center bg-linear-to-l from-secondary via-secondary/80 to-transparent">
                    <button className="embla__next flex bg-secondary rounded-full p-1 cursor-pointer" onClick={scrollNext}>
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    )
}