import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { CartItem } from '../../components/ui/CartItem';
import { formatPrice } from '../../utils/cn';
import { CartItemSkeleton } from '../../components/ui/Skeleton';

export function Cart() {
    const navigate = useNavigate();
    const { cart, loading, updateQuantity, removeFromCart, clearCart } = useCart();
    const { items = [], total_cents = 0 } = cart || {};
    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = total_cents;
    const shipping = subtotal > 0 ? 990 : 0;
    const total = subtotal + shipping;

    const handleClearCart = async () => {
        if (window.confirm('Voulez-vous vraiment vider votre panier ?')) {
            await clearCart();
        }
    };

    const handleCheckout = () => {
        if (items.length === 0) return;
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Mon panier</h1>
                <div className="space-y-4">
                    <CartItemSkeleton />
                    <CartItemSkeleton />
                    <CartItemSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Mon panier</h1>
                    <p className="text-sm text-text-secondary">
                        {cartCount} article{cartCount > 1 ? 's' : ''} dans votre panier
                    </p>
                </div>
                {items.length > 0 && (
                    <button
                        onClick={handleClearCart}
                        className="flex items-center gap-2 text-sm text-error hover:text-error/80 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Vider le panier
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Liste des items */}
                <div className="lg:col-span-2">
                    {items.length === 0 ? (
                        <div className="card p-12 text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-primary opacity-50" />
                            </div>
                            <h2 className="text-xl font-semibold text-text-primary mb-2">
                                Votre panier est vide
                            </h2>
                            <p className="text-text-secondary mb-6">
                                Ajoutez des articles pour commencer vos achats
                            </p>
                            <Link to="/shop" className="btn btn-primary">
                                Découvrir la boutique
                            </Link>
                        </div>
                    ) : (
                        <div className="card divide-y divide-border">
                            {items.map((item) => (
                                <CartItem
                                    key={item.product_id}
                                    item={item}
                                    onUpdateQuantity={updateQuantity}
                                    onRemove={removeFromCart}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Résumé */}
                {items.length > 0 && (
                    <div className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            <h2 className="text-lg font-semibold text-text-primary mb-6">
                                Résumé de commande
                            </h2>
                            <div className="space-y-4">
                                {/* Sous-total */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Sous-total</span>
                                    <span className="font-medium text-text-primary">
                                        {formatPrice(subtotal)}
                                    </span>
                                </div>
                                {/* Livraison */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Livraison</span>
                                    <span className="font-medium text-text-primary">
                                        {formatPrice(shipping)}
                                    </span>
                                </div>
                                {/* Taxes */}
                                <div className="flex justify-between text-sm text-text-muted">
                                    <span>Taxes estimées (incl.)</span>
                                    <span>
                                        {formatPrice(Math.round(subtotal * 0.2 / 100) * 100)}
                                    </span>
                                </div>
                                {/* Total */}
                                <div className="pt-4 border-t border-border">
                                    <div className="flex justify-between">
                                        <span className="text-lg font-semibold text-text-primary">
                                            Total
                                        </span>
                                        <span className="text-2xl font-bold text-primary">
                                            {formatPrice(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Bouton checkout */}
                            <button
                                onClick={handleCheckout}
                                className="btn btn-primary w-full mt-6 flex items-center justify-center gap-2 py-3"
                            >
                                Passer à la commande
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Continuer shopping */}
                            <Link
                                to="/shop"
                                className="btn btn-secondary w-full mt-3"
                            >
                                Continuer mes achats
                            </Link>

                            {/* Sécurité */}
                            <div className="mt-6 pt-6 border-t border-border text-center">
                                <p className="text-xs text-text-muted flex items-center justify-center gap-2">
                                    <svg
                                        className="w-4 h-4"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 22s8-4 8-10V5l-8-5-8 5v7z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 7v5l3 3"
                                        />
                                    </svg>
                                    Paiement sécurisé par carte bancaire
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
