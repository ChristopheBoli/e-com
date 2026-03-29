import { useEffect, useState } from 'react';
import { SlidersHorizontal, Grid, List, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { ProductCard } from '../../components/ui/ProductCard';
import { ProductGridSkeleton } from '../../components/ui/Skeleton';
import { cn } from '../../utils/cn';

export function ProductList() {
    const location = useLocation();
    const [filters, setFilters] = useState({
        search: '',
        minPrice: 0,
        maxPrice: 100000,
        sortBy: 'created_at',
        sortOrder: 'desc',
    });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('grid');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get('search') || '';
        setFilters((prev) => ({
            ...prev,
            search,
        }));
    }, [location.search]);

    const { data: productsData, isLoading, error, refetch } = useProducts(filters);
    const products = productsData?.data || [];

    const handleSearch = (e) => {
        setFilters((prev) => ({ ...prev, search: e.target.value }));
    };

    const handlePriceChange = (type, value) => {
        const price = parseInt(value, 10) || 0;
        setFilters((prev) => ({
            ...prev,
            [type === 'min' ? 'minPrice' : 'maxPrice']: price,
        }));
    };

    const handleSort = (sortBy) => {
        setFilters((prev) => ({
            ...prev,
            sortBy,
            sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
        }));
    };

    const sortOptions = [
        { value: 'name', label: 'Nom' },
        { value: 'price_cents', label: 'Prix' },
        { value: 'created_at', label: 'Nouveautés' },
    ];

    const filteredCount = products.length;
    const isFiltered = filters.search || filters.minPrice > 0 || filters.maxPrice < 100000;

    if (error) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-error mb-4">
                        Une erreur s'est produite lors du chargement des articles
                    </p>
                    <button
                        onClick={() => refetch()}
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
            {/* Header avec titre et filtres mobile */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Boutique</h1>
                    <p className="text-sm text-text-secondary">
                        {filteredCount} article{filteredCount > 1 ? 's' : ''} trouvé{filteredCount > 1 ? 's' : ''}
                        {isFiltered && ' (filtré)'}
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    {/* Search input (desktop) */}
                    <div className="hidden md:flex relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={filters.search}
                            onChange={handleSearch}
                            className="input !pl-10 w-64"
                        />
                    </div>

                    {/* Filtres button mobile */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg border transition-all',
                            'hover:bg-surface-hover',
                            showFilters ? 'bg-primary/10 border-primary text-primary' : 'border-border'
                        )}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">Filtres</span>
                        {isFiltered && <span className="w-2 h-2 bg-primary rounded-full" />}
                    </button>

                    {/* View mode toggle */}
                    <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={cn(
                                'p-2 transition-all',
                                viewMode === 'grid'
                                    ? 'bg-surface-hover text-primary'
                                    : 'text-text-muted hover:text-primary'
                            )}
                            aria-label="Vue grille"
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={cn(
                                'p-2 transition-all',
                                viewMode === 'list'
                                    ? 'bg-surface-hover text-primary'
                                    : 'text-text-muted hover:text-primary'
                            )}
                            aria-label="Vue liste"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Search input mobile */}
            <div className="md:hidden mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                    <input
                        type="text"
                        placeholder="Rechercher un article..."
                        value={filters.search}
                        onChange={handleSearch}
                        className="input pl-10"
                    />
                </div>
            </div>

            {/* Filtres panel */}
            {showFilters && (
                <div className="card p-6 mb-6 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Recherche */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Recherche
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                                <input
                                    type="text"
                                    placeholder="Mot-clé..."
                                    value={filters.search}
                                    onChange={handleSearch}
                                    className="input pl-10"
                                />
                            </div>
                        </div>

                        {/* Prix */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Prix (XOF)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={filters.minPrice === 0 ? '' : filters.minPrice / 100}
                                    onChange={(e) => handlePriceChange('min', (e.target.value || 0) * 100)}
                                    className="input"
                                />
                                <span className="text-text-muted">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={filters.maxPrice === 100000 ? '' : filters.maxPrice / 100}
                                    onChange={(e) => handlePriceChange('max', (e.target.value || 0) * 100)}
                                    className="input"
                                />
                            </div>
                        </div>

                        {/* Tri */}
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Trier par
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {sortOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        onClick={() => handleSort(option.value)}
                                        className={cn(
                                            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                                            filters.sortBy === option.value
                                                ? 'bg-primary text-white'
                                                : 'border border-border text-text-secondary hover:border-primary hover:text-primary'
                                        )}
                                    >
                                        {option.label}
                                        {filters.sortBy === option.value && (
                                            <span className="ml-1">
                                                {filters.sortOrder === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Products */}
            {isLoading ? (
                <ProductGridSkeleton count={8} />
            ) : products.length > 0 ? (
                <div
                    className={cn(
                        'gap-6',
                        viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                            : 'flex flex-col'
                    )}
                >
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            compact={viewMode === 'list'}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 card">
                    <div className="max-w-sm mx-auto">
                        <Search className="w-16 h-16 mx-auto text-text-muted mb-4" />
                        <h3 className="text-xl font-semibold text-text-primary mb-2">
                            Aucun article trouvé
                        </h3>
                        <p className="text-text-secondary mb-6">
                            {isFiltered
                                ? 'Essayez de modifier vos filtres de recherche'
                                : 'Il n\'y a pas encore de articles dans notre boutique'}
                        </p>
                        {isFiltered && (
                            <button
                                onClick={() =>
                                    setFilters({ search: '', minPrice: 0, maxPrice: 100000, sortBy: 'created_at', sortOrder: 'desc' })
                                }
                                className="btn btn-secondary"
                            >
                                Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
