import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getProductImage, getPlaceholderImage } from '../../utils/cn';

/**
 * Carrousel d'images avec navigation automatique et manuelle
 */
export function Carousel({ items, autoPlay = true, interval = 5000, className }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!autoPlay) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % items.length);
        }, interval);

        return () => clearInterval(timer);
    }, [items.length, autoPlay, interval]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <div className={cn('relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5', className)}>
            {/* Images du carrousel */}
            <div className="relative aspect-square overflow-hidden">
                {items.map((item, index) => {
                    const imageUrl = item.image_url ? getProductImage(item.image_url, item.name, 600) : getPlaceholderImage(item.name, 600, 600);
                    const isActive = index === currentIndex;

                    return (
                        <div
                            key={item.id || index}
                            className={cn(
                                'absolute inset-0 transition-opacity duration-500 ease-in-out',
                                isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                            )}
                        >
                            <img
                                src={imageUrl}
                                alt={item.name || 'Artcile'}
                                className="w-full h-full object-cover"
                                loading="eager"
                            />
                        </div>
                    );
                })}
            </div>

            {/* Boutons de navigation */}
            {items.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all z-10"
                        aria-label="Précédent"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white transition-all z-10"
                        aria-label="Suivant"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicateurs de slide */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={cn(
                                    'w-2 h-2 rounded-full transition-all',
                                    index === currentIndex
                                        ? 'bg-white scale-110'
                                        : 'bg-white/50 hover:bg-white/70'
                                )}
                                aria-label={`Aller à la slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

export default Carousel;
