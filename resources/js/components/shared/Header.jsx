import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X, Search, Heart, LayoutDashboard, ShoppingBag, DollarSign, Users, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { Button } from '../ui/Button';
import { CartDrawer } from '../ui/CartDrawer';
import { cn } from '../../utils/cn';
import toast from '../../utils/toast';

export function Header() {
    const navigate = useNavigate();
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const {
        cart,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        loading: cartLoading,
        updateQuantity,
        removeFromCart,
    } = useCart();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [adminMenuOpen, setAdminMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const adminMenuRef = useRef(null);

    const handleLogout = async () => {
        await logout();
        setMobileMenuOpen(false);
    };

    const handleCartClick = () => {
        setIsCartOpen(true);
    };

    const isActive = (path) => location.pathname === path;

    const toggleAdminMenu = () => setAdminMenuOpen(!adminMenuOpen);

    const submitSearch = () => {
        const query = searchQuery.trim();
        navigate(query ? `/shop?search=${encodeURIComponent(query)}` : '/shop');
        setSearchOpen(false);
        setMobileMenuOpen(false);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        submitSearch();
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Escape') {
            setSearchOpen(false);
        }
    };

    // Wishlist et autres fonctionnalités à venir
    const handleWishlistClick = () => {
        toast.info('La fonctionnalité wishlist sera bientôt disponible !');
    }

    // Fermer le menu admin quand on clique ailleurs
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (adminMenuRef.current && !adminMenuRef.current.contains(event.target)) {
                setAdminMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <>
            <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
                <div className="container-custom">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-text-primary">E-com</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                to="/shop"
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-primary',
                                    isActive('/shop') ? 'text-primary' : 'text-text-secondary'
                                )}
                            >
                                Boutique
                            </Link>

                            {isAdmin() && (
                                <div className="relative" ref={adminMenuRef}>
                                    <button
                                        onClick={toggleAdminMenu}
                                        className={cn(
                                            'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
                                            isActive('/admin') || location.pathname.startsWith('/admin')
                                                ? 'text-primary'
                                                : 'text-text-secondary'
                                        )}
                                    >
                                        Administration
                                        <ChevronDown className={`w-4 h-4 transition-transform ${adminMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Admin Dropdown Menu */}
                                    {adminMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-56 bg-surface border border-border rounded-lg shadow-lg z-50 animate-fadeIn">
                                            <div className="py-2">
                                                <Link
                                                    to="/admin"
                                                    onClick={() => setAdminMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors',
                                                        isActive('/admin') ? 'bg-primary/10 text-primary' : 'text-text-primary'
                                                    )}
                                                >
                                                    <LayoutDashboard className="w-4 h-4" />
                                                    <span>Tableau de bord</span>
                                                </Link>
                                                <Link
                                                    to="/admin/orders"
                                                    onClick={() => setAdminMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors',
                                                        isActive('/admin/orders') ? 'bg-primary/10 text-primary' : 'text-text-primary'
                                                    )}
                                                >
                                                    <ShoppingBag className="w-4 h-4" />
                                                    <span>Commandes</span>
                                                </Link>
                                                <Link
                                                    to="/admin/revenue"
                                                    onClick={() => setAdminMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors',
                                                        isActive('/admin/revenue') ? 'bg-primary/10 text-primary' : 'text-text-primary'
                                                    )}
                                                >
                                                    <DollarSign className="w-4 h-4" />
                                                    <span>Revenus</span>
                                                </Link>
                                                <Link
                                                    to="/admin/customers"
                                                    onClick={() => setAdminMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors',
                                                        isActive('/admin/customers') ? 'bg-primary/10 text-primary' : 'text-text-primary'
                                                    )}
                                                >
                                                    <Users className="w-4 h-4" />
                                                    <span>Utilisateurs</span>
                                                </Link>
                                                <div className="h-px bg-border my-2" />
                                                <Link
                                                    to="/admin/products"
                                                    onClick={() => setAdminMenuOpen(false)}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-2 hover:bg-surface-hover transition-colors',
                                                        isActive('/admin/products') ? 'bg-primary/10 text-primary' : 'text-text-primary'
                                                    )}
                                                >
                                                    <Package className="w-4 h-4" />
                                                    <span>Articles</span>
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {isAuthenticated && (
                                <Link
                                    to="/account"
                                    className={cn(
                                        'text-sm font-medium transition-colors hover:text-primary',
                                        isActive('/account') ? 'text-primary' : 'text-text-secondary'
                                    )}
                                >
                                    Mon compte
                                </Link>
                            )}
                        </nav>

                        {/* Desktop Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {/* Search */}
                            <button
                                onClick={() => setSearchOpen(!searchOpen)}
                                className="p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-lg transition-all"
                                aria-label="Rechercher"
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Wishlist (placeholder) */}
                            <button
                                onClick={handleWishlistClick}
                                className="p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-lg transition-all"
                                aria-label="Favoris"
                            >
                                <Heart className="h-5 w-5" />
                            </button>

                            {/* Cart */}
                            <button
                                onClick={handleCartClick}
                                className="relative p-2 text-text-secondary hover:text-primary hover:bg-surface-hover rounded-lg transition-all"
                                aria-label="Panier"
                            >
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* User menu */}
                            {isAuthenticated ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-hover">
                                        <User className="h-4 w-4 text-text-secondary" />
                                        <span className="text-sm font-medium text-text-primary">
                                            {user?.name?.split(' ')[0] || 'Utilisateur'}
                                        </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLogout}
                                        aria-label="Déconnexion"
                                    >
                                        <LogOut className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">Connexion</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button size="sm">S'inscrire</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-text-primary hover:bg-surface-hover rounded-lg"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Menu'}
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Search bar (desktop) */}
                    {searchOpen && (
                        <div className="hidden md:block py-4 border-t border-border animate-fadeIn">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un article..."
                                    className="input !pl-10 pr-4"
                                    autoFocus
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                            </form>
                        </div>
                    )}
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border animate-fadeIn">
                        <nav className="flex flex-col gap-4">
                            <Link
                                to="/shop"
                                className="text-sm font-medium text-text-secondary hover:text-primary"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Boutique
                            </Link>

                            {isAdmin() && (
                                <Link
                                    to="/admin"
                                    className="text-sm font-medium text-text-secondary hover:text-primary"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Admin
                                </Link>
                            )}

                            {isAuthenticated && (
                                <>
                                    <Link
                                        to="/account"
                                        className="text-sm font-medium text-text-secondary hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Mon compte
                                    </Link>
                                    <Link
                                        to="/cart"
                                        className="text-sm font-medium text-text-secondary hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Panier ({cartCount})
                                    </Link>
                                </>
                            )}
                        </nav>

                        <div className="mt-4">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Rechercher un article..."
                                    className="input pl-10"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </form>
                        </div>

                        <div className="mt-6 flex flex-col gap-3">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-hover rounded-lg">
                                        <User className="h-4 w-4 text-text-secondary" />
                                        <span className="text-sm text-text-primary">
                                            {user?.name}
                                        </span>
                                    </div>
                                    <Button variant="error" size="sm" onClick={handleLogout} className="w-full">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Déconnexion
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                        <Button variant="secondary" className="w-full">Connexion</Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                                        <Button className="w-full">S'inscrire</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                loading={cartLoading}
                onQuantityChange={updateQuantity}
                onRemoveItem={removeFromCart}
            />
        </>
    );
}
