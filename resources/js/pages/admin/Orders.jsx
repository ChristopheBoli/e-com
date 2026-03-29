import { useState } from 'react';
import {
    ShoppingBag,
    Search,
    Filter,
    ArrowUp,
    ArrowDown,
    Eye,
    Download,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminOrders } from '../../hooks/useOrders';
import {
    formatPrice,
    formatRelativeDate,
    getOrderStatusColor,
    getOrderStatusLabel,
} from '../../utils/cn';
import { TableSkeleton } from '../../components/ui/Skeleton';

export function AdminOrders() {

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const handleStatusFilter = (e) => {
        setStatusFilter(e.target.value);
        setPage(1); // reset pagination
    };

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const perPage = 20;

    const { data: ordersData, isLoading } = useAdminOrders({
        page,
        search: search || undefined,
        status: statusFilter || undefined,
    });

    const orders = ordersData?.data || [];
    const totalPages = ordersData?.last_page || 1;
    const total = ordersData?.total || 0;

    const statusOptions = [
        { value: '', label: 'Tous les statuts' },
        { value: 'pending', label: 'En attente' },
        { value: 'paid', label: 'Payée' }
    ];

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const filteredCount = orders.length;
    const isFiltered = search || statusFilter;

    if (isLoading && !orders.length) {
        return (
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-text-primary">Commandes</h1>
                </div>
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Commandes</h1>
                    <p className="text-sm text-text-secondary">
                        {total} commande{total > 1 ? 's' : ''} au total
                        {isFiltered && ` (${filteredCount} filtrée${filteredCount > 1 ? 's' : ''})`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={handleSearch}
                            className="input !pl-10 w-64"
                        />
                    </div> */}

                    {/* Filter */}
                    <select
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        className="input w-40"
                    >
                        {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-hover">
                                <th className="px-6 py-4 text-left font-medium text-text-primary">N° Commande</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Client</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Date</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Montant</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Statut</th>
                                <th className="px-6 py-4 text-right font-medium text-text-primary">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-text-secondary">
                                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                                        <p>Aucune commande trouvée</p>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-surface-hover transition-colors border-b border-border last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/admin/orders/${order.id}`}
                                                className="text-primary font-medium hover:underline"
                                            >
                                                {order.order_number}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-text-primary">{order.customer?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {formatRelativeDate(order.placed_at)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {formatPrice(order.total_cents)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge badge-${getOrderStatusColor(order.status)}`}>
                                                {getOrderStatusLabel(order.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="text-primary hover:text-primary/80 inline-flex items-center"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                        <p className="text-sm text-text-secondary">
                            Affichage de {(page - 1) * perPage + 1} à {Math.min(page * perPage, total)} sur {total}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                        page === i + 1
                                            ? 'bg-primary text-white'
                                            : 'border border-border text-text-primary hover:bg-surface-hover'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ArrowDown className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <OrderModal
                    order={selectedOrder}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

function OrderModal({ order, onClose }) {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
                <h2 className="text-lg font-bold mb-4">
                    Détails de la commande
                </h2>

                <div className="space-y-3 text-sm">
                    <p><strong>N° :</strong> {order.order_number}</p>
                    <p><strong>Client :</strong> {order.customer?.name || 'N/A'}</p>
                    <p><strong>Date :</strong> {formatRelativeDate(order.placed_at)}</p>
                    <p><strong>Montant :</strong> {formatPrice(order.total_cents)}</p>
                    <p>
                        <strong>Statut :</strong>{' '}
                        <span className={`badge badge-${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusLabel(order.status)}
                        </span>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}