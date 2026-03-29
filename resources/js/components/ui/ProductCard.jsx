import { Link } from 'react-router-dom';
import { ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { formatPrice, getStockBadgeColor, getStockText, getProductImage } from '../../utils/cn';
import { cn } from '../../utils/cn';

/**
 * Carte produit avec image, informations et bouton d'ajout au panier
 */
export function ProductCard({ product, onAddToCart, loading = false, compact = false }) {
    const { isAuthenticated } = useAuth();
    const { addToCart: addToCartContext, loading: cartLoading } = useCart();
    const { id, name, price_cents, stock_quantity, image_url, is_active } = product || {};

    const stockColor = getStockBadgeColor(stock_quantity);
    const stockText = getStockText(stock_quantity);
    const isOutOfStock = stock_quantity === 0 || !is_active;
    const isLoading = loading || cartLoading;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isOutOfStock) return;

        // Si une fonction onAddToCart personnalisée est fournie, l'utiliser
        if (onAddToCart) {
            onAddToCart(id, 1, { productName: name, priceCents: price_cents });
            return;
        }

        try {
            await addToCartContext(id, 1, { productName: name, priceCents: price_cents });
        } catch (error) {
            // déjà gérée par le contexte panier
        }
    };

    const imageUrl = getProductImage(image_url, name, 400);

    if (compact) {
        return (
            <Link
                to={`/shop/${id}`}
                className={cn(
                    'card overflow-hidden group transition-all duration-300',
                    'hover:shadow-md hover:-translate-y-1'
                )}
            >
                <div className="relative aspect-square overflow-hidden bg-background">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            e.target.src = getProductImage(null, name, 400);
                        }}
                    />
                    {isOutOfStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="badge badge-error text-sm px-4 py-2">
                                Rupture de stock
                            </span>
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-medium text-text-primary text-sm line-clamp-2 mb-2">
                        {name}
                    </h3>
                    <p className="font-semibold text-text-primary">
                        {formatPrice(price_cents)}
                    </p>
                </div>
            </Link>
        );
    }

    return (
        <Link
            to={`/shop/${id}`}
            className={cn(
                'card overflow-hidden group transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-1'
            )}
        >
            <div className="relative aspect-square overflow-hidden bg-background">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = getProductImage(null, name, 400);
                    }}
                />
                {/* Badge stock */}
                {stock_quantity > 0 && is_active && (
                    <div className="absolute top-3 left-3">
                        <span className={`badge badge-${stockColor} text-xs`}>
                            {stockText}
                        </span>
                    </div>
                )}
                {isOutOfStock && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center text-white">
                            <Package className="w-12 h-12 mx-auto mb-2 opacity-80" />
                            <p className="font-medium">Rupture de stock</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="p-4 space-y-3">
                {/* Nom */}
                <h3 className="font-semibold text-text-primary line-clamp-2 min-h-[2.5rem]">
                    {name}
                </h3>
                {/* Prix */}
                <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-text-primary">
                        {formatPrice(price_cents)}
                    </p>
                    {stock_quantity > 0 && stock_quantity < 10 && (
                        <span className="text-xs text-warning flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {stockText}
                        </span>
                    )}
                </div>
                {/* Bouton ajouter */}
                <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isLoading}
                    className={cn(
                        'w-full flex items-center justify-center gap-2 rounded-lg font-medium transition-all',
                        'active:scale-95',
                        isOutOfStock || isLoading
                            ? 'bg-surface-hover text-text-muted cursor-not-allowed'
                            : 'btn btn-primary hover:shadow-md'
                    )}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Ajout...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="w-4 h-4" />
                            {isOutOfStock ? 'Indisponible' : 'Ajouter au panier'}
                        </>
                    )}
                </button>
            </div>
        </Link>
    );
}

export default ProductCard;
