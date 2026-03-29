import { Link } from 'react-router-dom';
import {
    ShoppingBag,
    Users,
    DollarSign,
    Package,
    ArrowRight,
    Plus,
    Edit,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import {
    formatPrice,
    formatRelativeDate,
    getOrderStatusColor,
    getOrderStatusLabel,
} from '../../utils/cn';
import { StatsCardSkeleton } from '../../components/ui/Skeleton';
import { adminService } from '../../utils/api';

export function AdminDashboard() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['admin-dashboard'],
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

    const stats = [
        {
            title: 'Chiffre d\'affaires',
            value: formatPrice(statsData.revenue_cents),
            icon: DollarSign,
            color: 'primary',
            link: '/admin/revenue',
        },
        {
            title: 'Commandes',
            value: String(statsData.orders_count),
            icon: ShoppingBag,
            color: 'success',
            link: '/admin/orders',
        },
        {
            title: 'Articles',
            value: String(statsData.products_count),
            icon: Package,
            color: 'warning',
            link: '/admin/products',
        },
        {
            title: 'Clients',
            value: String(statsData.customers_count),
            icon: Users,
            color: 'error',
            link: '/admin/customers',
        },
    ];

    const quickActions = [
        {
            title: 'Listes des articles',
            description: 'Créer et gérer vos articles',
            icon: Plus,
            link: '/admin/products/new',
            color: 'primary',
        },
        {
            title: 'Gérer le stock',
            description: 'Mettre à jour les quantités',
            icon: Edit,
            link: '/admin/products',
            color: 'warning',
        },
        {
            title: 'Voir les commandes',
            description: 'Gérer les commandes',
            icon: ShoppingBag,
            link: '/admin/orders',
            color: 'success',
        },
    ];

    if (isLoading) {
        return (
            <div className="animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-text-primary">Tableau de bord</h1>
                        <p className="text-text-secondary">Chargement des statistiques...</p>
                    </div>
                </div>
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
                <div className="card p-8 text-center">
                    <h2 className="text-xl font-semibold text-text-primary mb-2">
                        Impossible de charger le dashboard
                    </h2>
                    <p className="text-text-secondary mb-6">
                        Vérifiez votre connexion puis réessayez.
                    </p>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => window.location.reload()}
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
            <div className="flex items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Tableau de bord</h1>
                    <p className="text-text-secondary">
                        Vue d'ensemble de votre boutique
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={index}
                            to={stat.link}
                            className="card p-6 hover:shadow-md transition-shadow group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-lg bg-${stat.color}/10 group-hover:bg-${stat.color}/20 transition-colors`}>
                                    <Icon className={`w-6 h-6 text-${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-sm text-text-secondary mb-1">{stat.title}</p>
                            <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                        </Link>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-1">
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-6">
                            Actions rapides
                        </h2>
                        <div className="space-y-3">
                            {quickActions.map((action, index) => {
                                const Icon = action.icon;
                                return (
                                    <Link
                                        key={index}
                                        to={action.link}
                                        className="flex items-center gap-4 p-4 rounded-lg bg-surface-hover hover:bg-surface-hover/80 transition-colors"
                                    >
                                        <div className={`p-2 rounded-lg bg-${action.color}/10`}>
                                            <Icon className={`w-5 h-5 text-${action.color}`} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-text-primary">
                                                {action.title}
                                            </p>
                                            <p className="text-sm text-text-secondary">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="w-4 h-4 text-text-muted" />
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-2">
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
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="card-content">
                            {recentOrders.length === 0 ? (
                                <div className="text-center py-8 text-text-secondary">
                                    Aucune commande récente
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {recentOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex items-center justify-between p-4 hover:bg-surface-hover rounded-lg transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                                                    <ShoppingBag className="w-5 h-5 text-text-muted" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-text-primary">
                                                        {order.customer?.name || 'N/A'}
                                                    </p>
                                                    <p className="text-sm text-text-secondary">
                                                        {order.order_number} • {formatRelativeDate(order.placed_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`badge badge-sm badge-${getOrderStatusColor(order.status)}`}>
                                                    {getOrderStatusLabel(order.status)}
                                                </span>
                                                <p className="text-sm font-medium text-text-primary mt-1">
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
            </div>
        </div>
    );
}
