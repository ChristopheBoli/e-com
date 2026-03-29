import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { formatPrice, getProductImage } from '../../utils/cn';
import { QuantitySelector } from './QuantitySelector';

/**
 * Item de panier avec image, quantité et prix
 */
export function CartItem({ item, onUpdateQuantity, onRemove, loading = false }) {
    if (!item) return null;

    // Structure backend: { product_id, name, sku, image_url, stock_quantity, quantity, unit_price_cents, line_total_cents }
    const {
        product_id,
        name,
        quantity,
        unit_price_cents,
        line_total_cents,
        image_url,
        stock_quantity,
    } = item || {};

    const lineTotal = line_total_cents || quantity * unit_price_cents;
    const maxQuantity = Math.max(1, stock_quantity || 99);

    const handleQuantityChange = (newQuantity) => {
        if (onUpdateQuantity && product_id) {
            onUpdateQuantity(product_id, newQuantity);
        }
    };

    const handleRemove = () => {
        if (onRemove && product_id) {
            onRemove(product_id);
        }
    };

    return (
        <div className="flex gap-4 p-4 border-b border-border animate-fadeIn hover:bg-surface-hover/50 transition-colors">
            {/* Image produit */}
            <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-background">
                <img
                    src={getProductImage(image_url, name, 80)}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.src = getProductImage(null, name, 80);
                    }}
                />
            </div>

            {/* Informations produit */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div className="min-w-0">
                    <Link
                        to={`/shop/${product_id}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-2"
                    >
                        {name}
                    </Link>
                    <p className="text-sm text-text-secondary mt-1">
                        Prix unitaire: {formatPrice(unit_price_cents)}
                    </p>
                </div>

                {/* Quantité et actions */}
                <div className="flex items-center justify-between gap-4 mt-2">
                    <QuantitySelector
                        value={quantity}
                        onChange={handleQuantityChange}
                        min={1}
                        max={maxQuantity}
                        disabled={loading}
                        size="sm"
                    />
                    <div className="flex items-center gap-3">
                        {/* Prix total */}
                        <span className="font-semibold text-text-primary">
                            {formatPrice(lineTotal)}
                        </span>
                        {/* Bouton supprimer */}
                        <button
                            onClick={handleRemove}
                            disabled={loading}
                            className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                            aria-label="Supprimer du panier"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartItem;
