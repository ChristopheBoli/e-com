import { Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Sélecteur de quantité avec boutons -/+
 */
export function QuantitySelector({
    value = 1,
    onChange,
    min = 1,
    max = 99,
    disabled = false,
    size = 'md',
    showInput = true,
}) {
    const sizes = {
        sm: 'w-7 h-7 text-xs',
        md: 'w-9 h-9 text-sm',
        lg: 'w-11 h-11 text-base',
    };

    const canDecrement = value > min;
    const canIncrement = value < max && !disabled;

    const handleDecrement = () => {
        if (canDecrement) {
            onChange(value - 1);
        }
    };

    const handleIncrement = () => {
        if (canIncrement) {
            onChange(value + 1);
        }
    };

    const handleInputChange = (e) => {
        const newValue = parseInt(e.target.value, 10);
        if (!isNaN(newValue) && newValue >= min) {
            onChange(newValue);
        }
    };

    const handleBlur = () => {
        if (value < min) {
            onChange(min);
        } else if (value > max) {
            onChange(max);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {/* Bouton - */}
            <button
                type="button"
                onClick={handleDecrement}
                disabled={!canDecrement || disabled}
                className={cn(
                    'flex items-center justify-center rounded-lg border transition-all',
                    'hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed',
                    'active:scale-95',
                    canDecrement && !disabled
                        ? 'border-border bg-surface text-text-primary hover:border-primary/50'
                        : 'border-border/50 bg-surface-hover text-text-muted',
                    sizes[size]
                )}
                aria-label="Diminuer la quantité"
            >
                <Minus className="w-4 h-4" />
            </button>

            {/* Input number */}
            {showInput && (
                <input
                    type="number"
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    min={min}
                    max={max}
                    disabled={disabled}
                    className={cn(
                        'w-12 text-center font-medium border rounded-lg transition-all',
                        'focus:border-primary focus:ring-2 focus:ring-primary/20',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        disabled && 'bg-surface-hover',
                        size === 'sm' && 'py-1 text-sm',
                        size === 'md' && 'py-2 text-sm',
                        size === 'lg' && 'py-2.5 text-base'
                    )}
                    aria-label="Quantité"
                />
            )}

            {/* Bouton + */}
            <button
                type="button"
                onClick={handleIncrement}
                disabled={!canIncrement || disabled}
                className={cn(
                    'flex items-center justify-center rounded-lg border transition-all',
                    'hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed',
                    'active:scale-95',
                    canIncrement && !disabled
                        ? 'border-border bg-surface text-text-primary hover:border-primary/50'
                        : 'border-border/50 bg-surface-hover text-text-muted',
                    sizes[size]
                )}
                aria-label="Augmenter la quantité"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div>
    );
}

export default QuantitySelector;
