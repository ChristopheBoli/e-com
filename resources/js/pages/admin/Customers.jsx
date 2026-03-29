import { useState } from 'react';
import {
    Users,
    Search,
    Mail,
    Calendar,
    ShoppingBag,
    ChevronLeft,
    ChevronRight,
    Shield,
    ShieldCheck,
    X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatPrice, formatRelativeDate } from '../../utils/cn';
import { adminService } from '../../utils/api';

export function AdminCustomers() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const perPage = 20;

    const { data: usersData, isLoading } = useQuery({
        queryKey: ['admin-users', page, search, roleFilter],
        queryFn: () => adminService.users.list({
            page,
            search: search || undefined,
            role: roleFilter || undefined,
        }).then((response) => response.data.data),
        staleTime: 2 * 60 * 1000,
    });

    const users = usersData?.data || [];
    const totalPages = usersData?.last_page || 1;
    const total = usersData?.total || 0;

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleRoleFilter = (role) => {
        setRoleFilter(role);
        setPage(1);
    };

    const handleViewUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const filteredCount = users.length;
    const isFiltered = search || roleFilter;

    if (isLoading && !users.length) {
        return (
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-text-primary">Utilisateurs</h1>
                </div>
                <div className="card p-6">
                    <p className="text-text-secondary">Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Utilisateurs</h1>
                    <p className="text-sm text-text-secondary">
                        {total} utilisateur{total > 1 ? 's' : ''} au total
                        {isFiltered && ` (${filteredCount} affiché${filteredCount > 1 ? 's' : ''})`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Rechercher un utilisateur..."
                            value={search}
                            onChange={handleSearch}
                            className="input !pl-10 w-64"
                        />
                    </div>

                    {/* Filter */}
                    <select
                        value={roleFilter}
                        onChange={(e) => handleRoleFilter(e.target.value)}
                        className="input w-40"
                    >
                        <option value="">Tous les rôles</option>
                        <option value="admin">Administrateurs</option>
                        <option value="user">Clients</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-hover">
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Utilisateur</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Email</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Rôle</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Commandes</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Total dépensé</th>
                                <th className="px-6 py-4 text-left font-medium text-text-primary">Dernière commande</th>
                                <th className="px-6 py-4 text-right font-medium text-text-primary">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-text-secondary">
                                        <Users className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                                        <p>Aucun utilisateur trouvé</p>
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="hover:bg-surface-hover transition-colors border-b border-border last:border-0"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-sm font-semibold text-primary">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                </div>
                                                <span className="font-medium text-text-primary">
                                                    {user.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                                                {user.role === 'admin' ? (
                                                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                                ) : (
                                                    <Shield className="w-3.5 h-3.5 text-primary/60" />
                                                )}
                                                <span className="text-xs font-medium text-primary ml-1">
                                                    {user.role === 'admin' ? 'Admin' : 'Client'}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-2">
                                                <ShoppingBag className="w-4 h-4 text-text-muted" />
                                                <span className="font-medium text-text-primary">{user.orders_count ?? 0}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-text-primary">
                                            {formatPrice(user.total_spent ?? 0)}
                                        </td>
                                        <td className="px-6 py-4 text-text-secondary">
                                            {user.last_order_date ? formatRelativeDate(user.last_order_date) : 'Jamais'}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewUser(user)}
                                                className="text-primary hover:text-primary/80 hover:underline inline-flex items-center gap-1"
                                            >
                                                Détails
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
                                <ChevronLeft className="w-4 h-4" />
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
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <CustomerModal
                    user={selectedUser}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

function CustomerModal({ user, onClose }) {
    if (!user) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />

            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-fadeIn">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-muted hover:text-text-primary"
                    aria-label="Fermer"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-lg font-bold mb-4 text-text-primary">Détails du client</h2>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-text-secondary">
                        <Mail className="w-4 h-4" />
                        <span>{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span>Inscrit {formatRelativeDate(user.created_at)}</span>
                    </div>

                    <p>
                        <strong>Nom :</strong> {user.name}
                    </p>
                    <p>
                        <strong>Rôle :</strong> {user.role === 'admin' ? 'Administrateur' : 'Client'}
                    </p>
                    <p>
                        <strong>Commandes :</strong> {user.orders_count ?? 0}
                    </p>
                    <p>
                        <strong>Total dépensé :</strong> {formatPrice(user.total_spent ?? 0)}
                    </p>
                    <p>
                        <strong>Dernière commande :</strong>{' '}
                        {user.last_order_date ? formatRelativeDate(user.last_order_date) : 'Jamais'}
                    </p>
                </div>

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

