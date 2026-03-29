import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, Truck, ShieldCheck, RefreshCw, Share2 } from 'lucide-react';
import { useProduct, useProducts } from '../../hooks/useProducts';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { cn, formatPrice, getStockBadgeColor, getStockText, getProductImage } from '../../utils/cn';
import { QuantitySelector } from '../../components/ui/QuantitySelector';
import { Skeleton } from '../../components/ui/Skeleton';
import { ProductCard } from '../../components/ui/ProductCard';
import toast from '../../utils/toast';

export function ProductDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data: productData, isLoading, error } = useProduct(id);
    const { data: relatedData } = useProducts({ limit: 4 });
    const { isAuthenticated } = useAuth();
    const product = productData;
    const relatedProducts = relatedData?.data?.filter((p) => p.id !== parseInt(id)) || [];

    const [quantity, setQuantity] = useState(1);
    const { addToCart, loading: cartLoading } = useCart();

    const handleQuantityChange = (newQuantity) => {
        setQuantity(newQuantity);
    };

    const handleAddToCart = async () => {
        if (!product) return;

        try {
            await addToCart(product.id, quantity, { productName: product.name });
            setQuantity(1);
        } catch (error) {
            // Erreur déjà gérée par le contexte panier
        }
    };

    // Vérifier si l'utilisateur peut ajouter au panier (redirection vers login si non connecté)
    const handleAddToCartClick = () => {
        if (!isAuthenticated) {
            // Stocker le produit et la quantité pour après la connexion
            const pendingProduct = {
                id: product.id,
                quantity,
                productName: product.name,
            };
            localStorage.setItem('pending_cart_add', JSON.stringify(pendingProduct));
            navigate('/login', { replace: true });
            return;
        }
        handleAddToCart();
    };

    const handleShare = async () => {
        if (navigator.share && product) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `${product.name} - ${formatPrice(product.price_cents)}`,
                    url: window.location.href,
                });
            } catch (err) {
                toast.info('Lien copié dans le presse-papier');
                navigator.clipboard?.writeText(window.location.href);
            }
        } else {
            toast.info('Lien copié dans le presse-papier');
            navigator.clipboard?.writeText(window.location.href);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md">
                    <h2 className="text-2xl font-bold text-text-primary mb-4">
                        Article introuvable
                    </h2>
                    <p className="text-text-secondary mb-6">
                        Cet article n'existe pas ou a été supprimé
                    </p>
                    <Link to="/shop" className="btn btn-primary">
                        Retour à la boutique
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading || !product) {
        return (
            <div className="animate-fadeIn">
                <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="aspect-square rounded-xl" />
                    <div className="space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-12 w-1/3" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-1/2" />
                    </div>
                </div>
            </div>
        );
    }

    const stockColor = getStockBadgeColor(product.stock_quantity);
    const stockText = getStockText(product.stock_quantity);
    const isOutOfStock = product.stock_quantity === 0 || !product.is_active;
    const maxQuantity = Math.min(product.stock_quantity, 99);
    const imageUrl = getProductImage(product.image_url, product.name, 600);

    return (
        <div className="animate-fadeIn">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-text-secondary mb-6">
                <Link to="/" className="hover:text-primary">Accueil</Link>
                <span>/</span>
                <Link to="/shop" className="hover:text-primary">Boutique</Link>
                <span>/</span>
                <span className="text-text-primary line-clamp-1">{product.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Image */}
                <div className="space-y-4">
                    <div className="aspect-square bg-background rounded-xl overflow-hidden shadow-sm">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = getProductImage(null, product.name, 600);
                            }}
                        />
                    </div>
                </div>

                {/* Informations */}
                <div className="space-y-6">
                    {/* SKU */}
                    {product.sku && (
                        <div className="text-sm text-text-secondary">
                            Référence: <span className="font-mono">{product.sku}</span>
                        </div>
                    )}

                    {/* Titre */}
                    <h1 className="text-3xl font-bold text-text-primary leading-tight">
                        {product.name}
                    </h1>

                    {/* Prix */}
                    <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-bold text-text-primary">
                            {formatPrice(product.price_cents)}
                        </span>
                        {!product.is_active && (
                            <span className="badge badge-error">Indisponible</span>
                        )}
                    </div>

                    {/* Stock */}
                    <div className="flex items-center gap-3">
                        <span className={`badge badge-${stockColor}`}>
                            {stockText}
                        </span>
                        {product.stock_quantity > 0 && product.stock_quantity < 10 && (
                            <span className="text-sm text-warning flex items-center gap-1">
                                Plus que {product.stock_quantity} en stock
                            </span>
                        )}
                    </div>

                    {/* Quantité et bouton */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Quantité
                            </label>
                            <QuantitySelector
                                value={quantity}
                                onChange={handleQuantityChange}
                                min={1}
                                max={maxQuantity}
                                disabled={isOutOfStock}
                            />
                        </div>

                        <button
                            onClick={handleAddToCartClick}
                            disabled={isOutOfStock || cartLoading}
                            className={cn(
                                'w-full flex items-center justify-center gap-2 rounded-lg font-semibold py-4 transition-all',
                                'active:scale-98',
                                isOutOfStock || cartLoading
                                    ? 'bg-surface-hover text-text-muted cursor-not-allowed'
                                    : 'btn btn-primary hover:shadow-lg'
                            )}
                        >
                            {cartLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Ajout en cours...
                                </>
                            ) : isOutOfStock ? (
                                'Rupture de stock'
                            ) : (
                                'Ajouter au panier'
                            )}
                        </button>
                    </div>

                    {/* Actions secondaires */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleShare}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border text-text-primary hover:bg-surface-hover transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            Partager
                        </button>
                    </div>

                    {/* Avantages */}
                    <div className="space-y-3 pt-6 border-t border-border">
                        <div className="flex items-start gap-3">
                            <Truck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-primary">Livraison rapide</p>
                                <p className="text-xs text-text-secondary">Sous 24-72h en Afrique subsaharienne</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-primary">Paiement sécurisé</p>
                                <p className="text-xs text-text-secondary">Transaction 100% sécurisée</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <RefreshCw className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-text-primary">Retours gratuits</p>
                                <p className="text-xs text-text-secondary">30 jours pour changer d'avis</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                        <div className="pt-6 border-t border-border">
                            <h3 className="font-semibold text-text-primary mb-3">Description</h3>
                            <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Produits similaires */}
            {relatedProducts.length > 0 && (
                <section className="mt-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-text-primary">
                            Articles similaires
                        </h2>
                        <Link to="/shop" className="text-primary font-medium hover:underline flex items-center gap-1">
                            Voir tout
                            <ChevronLeft className="w-4 h-4 rotate-180" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((p) => (
                            <ProductCard key={p.id} product={p} />
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
