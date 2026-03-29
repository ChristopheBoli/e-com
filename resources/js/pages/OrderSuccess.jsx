import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag, Mail, Package } from 'lucide-react';
import { formatPrice } from '../utils/cn';

export function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();

    const orderData = location.state || {};
    const { orderNumber, total_cents = 0, items = [], shippingAddress = {} } = orderData;

    const handleContinueShopping = () => {
        navigate('/shop');
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 animate-fadeIn">
            <div className="w-full max-w-lg">
                {/* Success Card */}
                <div className="card p-8 mb-8 text-center">
                    {/* Success Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center animate-pulse-custom">
                        <CheckCircle className="w-10 h-10 text-success" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Commande confirmée !
                    </h1>
                    <p className="text-text-secondary mb-6">
                        Merci pour votre achat. Vous recevrez un email de confirmation sous peu.
                    </p>

                    {/* Order Number */}
                    {orderNumber && (
                        <div className="bg-surface-hover rounded-lg p-4 mb-6">
                            <p className="text-sm text-text-secondary mb-1">Numéro de commande</p>
                            <p className="text-xl font-mono font-semibold text-primary">
                                #{orderNumber}
                            </p>
                        </div>
                    )}

                    {/* Email info */}
                    <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6">
                        <Mail className="w-4 h-4" />
                        <span>Un email de confirmation a été envoyé à votre adresse</span>
                    </div>
                </div>

                {/* Order Details */}
                <div className="card mb-8">
                    <div className="card-header">
                        <h2 className="text-lg font-semibold text-text-primary">
                            Détails de la commande
                        </h2>
                    </div>
                    <div className="card-content space-y-6">
                        {/* Shipping Address */}
                        {shippingAddress && Object.keys(shippingAddress).length > 0 && (
                            <div className="bg-surface-hover rounded-lg p-4">
                                <h3 className="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Adresse de livraison
                                </h3>
                                <div className="text-sm text-text-secondary space-y-1">
                                    <p>{shippingAddress.full_name}</p>
                                    <p>{shippingAddress.address}</p>
                                    <p>
                                        {shippingAddress.postal_code} {shippingAddress.city}
                                    </p>
                                    <p>{shippingAddress.country}</p>
                                </div>
                            </div>
                        )}

                        {/* Items */}
                        {items.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-text-primary mb-3">
                                    Articles commandés
                                </h3>
                                <div className="space-y-3">
                                    {items.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-12 h-12 rounded bg-background flex items-center justify-center flex-shrink-0">
                                                <ShoppingBag className="w-6 h-6 text-text-muted" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-text-primary line-clamp-1">
                                                    {item.name || 'Artcile'}
                                                </p>
                                                <p className="text-xs text-text-secondary">
                                                    Quantité: {item.quantity}
                                                </p>
                                            </div>
                                            <span className="text-sm font-medium text-text-primary">
                                                {formatPrice(item.line_total_cents || item.total_cents || 0)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Total */}
                        <div className="pt-4 border-t border-border">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold text-text-primary">
                                    Total payé
                                </span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatPrice(total_cents)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/orders"
                        className="btn btn-secondary flex items-center justify-center gap-2"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Voir mes commandes
                    </Link>
                    <button
                        onClick={handleContinueShopping}
                        className="btn btn-primary flex items-center justify-center gap-2"
                    >
                        Continuer mes achats
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Info Banner */}
                <div className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-4 text-center">
                    <p className="text-sm text-text-secondary">
                        <strong className="text-primary">Besoin d'aide ?</strong>{' '}
                        Contactez notre service client à{' '}
                        <a href="mailto:support@ecom.com" className="text-primary hover:underline">
                            support@ecom.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
