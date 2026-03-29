import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, MapPin, ShoppingBag, Settings, Mail } from 'lucide-react';

export function Account() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        navigate('/', { replace: true });
    };

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary mb-2">Mon compte</h1>
                <p className="text-text-secondary">
                    Bienvenue, {user?.name || 'Utilisateur'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <div className="card p-6 text-center">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-12 h-12 text-primary" />
                        </div>
                        <h2 className="text-lg font-semibold text-text-primary mb-1">
                            {user?.name || 'Utilisateur'}
                        </h2>
                        <p className="text-sm text-text-secondary mb-4">{user?.email}</p>
                        <div className="badge badge-primary inline-block">
                            {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="lg:col-span-2">
                    <div className="card p-6">
                        <h2 className="text-lg font-semibold text-text-primary mb-6">
                            Mes informations
                        </h2>

                        <div className="space-y-4">
                            {/* Profile Info */}
                            <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg hover:bg-surface-hover/80 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <User className="w-5 h-5 text-text-secondary" />
                                    <div>
                                        <p className="font-medium text-text-primary">Mon profil</p>
                                        <p className="text-sm text-text-secondary">
                                            Nom, email, mot de passe
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg hover:bg-surface-hover/80 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-text-secondary" />
                                    <div>
                                        <p className="font-medium text-text-primary">Adresses</p>
                                        <p className="text-sm text-text-secondary">
                                            Gérer vos adresses de livraison
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Orders */}
                            <Link
                                to="/orders"
                                className="flex items-center justify-between p-4 bg-surface-hover rounded-lg hover:bg-surface-hover/80 transition-colors block"
                            >
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="w-5 h-5 text-text-secondary" />
                                    <div>
                                        <p className="font-medium text-text-primary">Mes commandes</p>
                                        <p className="text-sm text-text-secondary">
                                            Historique et suivi des commandes
                                        </p>
                                    </div>
                                </div>
                                <svg className="w-5 h-5 text-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>

                            {/* Settings */}
                            <div className="flex items-center justify-between p-4 bg-surface-hover rounded-lg hover:bg-surface-hover/80 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-5 h-5 text-text-secondary" />
                                    <div>
                                        <p className="font-medium text-text-primary">Paramètres</p>
                                        <p className="text-sm text-text-secondary">
                                            Notifications, préférences
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Danger Zone */}
                        <div className="mt-8 pt-6 border-t border-border">
                            <h3 className="text-sm font-medium text-text-primary mb-4">Danger</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-primary hover:bg-surface-hover transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Déconnexion
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border text-error hover:bg-error/5 hover:border-error/20 transition-colors">
                                    Supprimer mon compte
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Banner */}
                <div className="mt-8 bg-primary/5 border border-primary/10 rounded-lg p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-primary">
                                    Besoin d'aide ?
                                </p>
                                <p className="text-sm text-text-secondary">
                                    Notre équipe est disponible 24/7 pour répondre à vos questions
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/contact"
                            className="btn btn-secondary whitespace-nowrap"
                        >
                            Contacter le support
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
