import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatPrice } from '../../utils/cn';
import { cn } from '../../utils/cn';
import { CartItem } from './CartItem';
import { CartItemSkeleton } from './Skeleton';

/**
 * Drawer/panier latéral glissant
 */
export function CartDrawer({ isOpen, onClose, cart, loading, onQuantityChange, onRemoveItem }) {
    const { items = [], total_cents = 0 } = cart || {};

    // Fermer avec Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    // Empêcher le scroll quand ouvert
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={cn(
                    'fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300',
                    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                )}
                aria-hidden="true"
            />

            {/* Drawer */}
            <div
                className={cn(
                    'fixed top-0 right-0 h-full w-full max-w-md bg-surface shadow-2xl z-[70] transition-transform duration-300 ease-out flex flex-col',
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                )}
                role="dialog"
                aria-modal="true"
                aria-label="Panier d'achat"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <ShoppingBag className="w-6 h-6 text-text-primary" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary">
                            Mon panier
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all"
                        aria-label="Fermer le panier"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="p-4 space-y-4">
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                            <CartItemSkeleton />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
                            </div>
                            <h3 className="text-lg font-semibold text-text-primary mb-2">
                                Votre panier est vide
                            </h3>
                            <p className="text-text-secondary mb-6 max-w-xs">
                                Ajoutez des artciles pour commencer votre shopping
                            </p>
                            <Link
                                to="/shop"
                                onClick={onClose}
                                className="btn btn-primary"
                            >
                                Découvrir la boutique
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {items.map((item, index) => (
                                <CartItem
                                    key={`${item.product_id || index}-${index}`}
                                    item={item}
                                    onUpdateQuantity={onQuantityChange}
                                    onRemove={onRemoveItem}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer avec total et actions */}
                {items.length > 0 && !loading && (
                    <div className="border-t border-border bg-surface p-6 space-y-4">
                        {/* Total */}
                        <div className="flex items-center justify-between">
                            <span className="text-text-secondary">Sous-total</span>
                            <span className="text-2xl font-bold text-text-primary">
                                {formatPrice(total_cents)}
                            </span>
                        </div>
                        <p className="text-xs text-text-muted">
                            Les frais de livraison seront calculés à l'étape suivante
                        </p>

                        {/* Boutons d'action */}
                        <div className="space-y-3">
                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="btn btn-primary w-full flex items-center justify-center gap-2"
                            >
                                Voir le panier complet
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/shop"
                                onClick={onClose}
                                className="btn btn-secondary w-full"
                            >
                                Continuer mes achats
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartDrawer;
