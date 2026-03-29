import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { orderService } from '../../utils/api';
import { formatPrice, formatDate, getOrderStatusColor, getOrderStatusLabel } from '../../utils/cn';

export function Orders() {
    const { data: orders = [], isLoading, error } = useQuery({
        queryKey: ['account-orders'],
        queryFn: () => orderService.listMine().then((response) => response.data.data),
        staleTime: 60 * 1000,
    });

    if (isLoading) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Mes commandes</h1>
                <div className="card p-6 text-text-secondary">Chargement des commandes...</div>
            </div>
        );
    }

    
    if (error) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Mes commandes</h1>
                <div className="card p-6 text-error">Impossible de charger vos commandes.</div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Mes commandes</h1>
                <Link to="/shop" className="btn btn-secondary">
                    Continuer mes achats
                </Link>
            </div>

            {orders.length === 0 ? (
                <div className="card p-10 text-center">
                    <ShoppingBag className="w-12 h-12 mx-auto text-text-muted mb-3" />
                    <h2 className="text-lg font-semibold text-text-primary mb-2">Aucune commande</h2>
                    <p className="text-text-secondary mb-5">
                        Vous n'avez pas encore passé de commande.
                    </p>
                    <Link to="/shop" className="btn btn-primary">
                        Découvrir la boutique
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card p-5">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                                <div>
                                    <p className="font-semibold text-text-primary">{order.order_number}</p>
                                    <p className="text-sm text-text-secondary">{formatDate(order.placed_at)}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`badge badge-${getOrderStatusColor(order.status)}`}>
                                        {getOrderStatusLabel(order.status)}
                                    </span>
                                    <span className="font-semibold text-text-primary">
                                        {formatPrice(order.total_cents)}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {(order.items_snapshot || []).slice(0, 3).map((item, index) => (
                                    <div key={`${order.id}-item-${index}`} className="flex justify-between text-sm">
                                        <span className="text-text-secondary">
                                            {item.name} × {item.quantity}
                                        </span>
                                        <span className="text-text-primary">{formatPrice(item.line_total_cents)}</span>
                                    </div>
                                ))}
                                {(order.items_snapshot || []).length > 3 && (
                                    <p className="text-xs text-text-muted">
                                        + {(order.items_snapshot || []).length - 3} autre(s) article(s)
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
