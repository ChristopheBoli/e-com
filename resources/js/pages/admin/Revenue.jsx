import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, Package, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatPrice, formatRelativeDate } from '../../utils/cn';
import { adminService } from '../../utils/api';
import { StatsCardSkeleton } from '../../components/ui/Skeleton';

export function AdminRevenue() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-revenue'],
        queryFn: () => adminService.dashboard().then((response) => response.data.data),
        staleTime: 60 * 1000,
    });

    const statsData = data?.stats || {
        revenue_cents: 0,
        orders_count: 0,
        products_count: 0,
        customers_count: 0,
    };

    const recentOrders = data?.recent_orders || [];

    const statsCards = [
        {
            title: 'Chiffre d\'affaires',
            value: formatPrice(statsData.revenue_cents),
            icon: DollarSign,
            color: 'primary',
            trend: '+12.5%',
        },
        {
            title: 'Commandes',
            value: String(statsData.orders_count),
            icon: Package,
            color: 'success',
            trend: '+8.2%',
        },
        {
            title: 'Articles',
            value: String(statsData.products_count),
            icon: Package,
            color: 'warning',
            trend: '+5.1%',
        },
        {
            title: 'Clients',
            value: String(statsData.customers_count),
            icon: Users,
            color: 'error',
            trend: '+15.3%',
        },
    ];

    if (isLoading) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Revenus</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                    <StatsCardSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="animate-fadeIn">
                <h1 className="text-2xl font-bold text-text-primary mb-6">Revenus</h1>
                <div className="card p-8 text-center">
                    <p className="text-text-secondary mb-4">Impossible de charger les statistiques.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-secondary"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Revenus</h1>
                    <p className="text-text-secondary">
                        Vue d'ensemble de vos performances commerciales
                    </p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-secondary flex items-center gap-2"
                >
                    <TrendingUp className="w-4 h-4" />
                    Actualiser
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsCards.map((card, index) => {
                    const Icon = card.icon;
                    return (
                        <div
                            key={index}
                            className="card p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-${card.color}/10`}>
                                    <Icon className={`w-6 h-6 text-${card.color}`} />
                                </div>
                                <span className="text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                                    {card.trend}
                                </span>
                            </div>
                            <p className="text-sm text-text-secondary mb-2">{card.title}</p>
                            <p className="text-2xl font-bold text-text-primary">{card.value}</p>
                        </div>
                    );
                })}
            </div>

            {/* Recent Orders */}
            <div className="card">
                <div className="card-header flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-text-primary">
                        Commandes récentes
                    </h2>
                    <Link
                        to="/admin/orders"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                        Voir tout
                    </Link>
                </div>
                <div className="card-content">
                    {recentOrders.length === 0 ? (
                        <div className="text-center py-8 text-text-secondary">
                            Aucune commande récente
                        </div>
                    ) : (
                        <div className="divide-y divide-border">
                            {recentOrders.slice(0, 5).map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-4 hover:bg-surface-hover transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                            <Package className="w-5 h-5 text-text-muted" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary">
                                                {order.order_number}
                                            </p>
                                            <p className="text-sm text-text-secondary">
                                                {order.customer_name || 'Client inconnu'} • {formatRelativeDate(order.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-primary">
                                            {formatPrice(order.total_cents)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
