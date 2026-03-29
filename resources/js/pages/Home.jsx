import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, Sparkles } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductGridSkeleton } from '../components/ui/Skeleton';
import { Carousel } from '../components/ui/Carousel';

export function Home() {
    const { data: productsData, isLoading, error } = useProducts({ limit: 8 });
    const products = productsData?.data || [];

    // Filtrer les produits avec images pour le carrousel
    const productsWithImages = products.filter((p) => p.image_url);
    const carouselItems = productsWithImages.length > 0 ? productsWithImages : [{ id: 0, name: 'Nouvelle Collection' }];

    const features = [
        {
            icon: Truck,
            title: 'Livraison rapide',
            description: 'Expédition sous 24-48h partout en Afrique',
        },
        {
            icon: Shield,
            title: 'Paiement sécurisé',
            description: 'Transactions 100% sécurisées par carte bancaire',
        },
        {
            icon: Headphones,
            title: 'Support 24/7',
            description: 'Notre équipe est à votre écoute à tout moment',
        },
        {
            icon: Sparkles,
            title: 'Qualité premium',
            description: 'Produits sélectionnés avec soin pour vous',
        },
    ];

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Une erreur s'est produite
                    </h2>
                    <p className="text-text-secondary mb-6">
                        Veuillez réessayer ultérieurement
                    </p>
                    <Link to="/shop" className="btn btn-primary">
                        Retour à la boutique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-16 md:py-24">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-4xl md:text-5xl font-bold text-text-primary leading-tight">
                                Découvrez notre{' '}
                                <span className="text-primary">nouvelle collection</span>
                            </h1>
                            <p className="text-lg text-text-secondary max-w-lg">
                                Des articles de qualité sélectionnés avec soin pour sublimer votre quotidien.
                                Profitez de nos offres exclusives et d'une livraison rapide.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/shop" className="btn btn-primary text-center sm:text-left flex items-center justify-center sm:justify-start gap-2">
                                    Explorer la boutique
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/login" className="btn btn-secondary text-center sm:text-left">
                                    Me connecter
                                </Link>
                            </div>
                        </div>
                        {/* Hero Carousel */}
                        <div className="relative hidden lg:block">
                            <Carousel items={carouselItems} autoPlay interval={4000} />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-surface">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center group">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Icon className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-text-primary mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-text-secondary">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16">
                <div className="container-custom">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary mb-2">
                                Articles populaires
                            </h2>
                            <p className="text-text-secondary">
                                Découvrez les articles les plus appréciés de notre communauté
                            </p>
                        </div>
                        <Link
                            to="/shop"
                            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:underline"
                        >
                            Voir tous les articles
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <ProductGridSkeleton count={8} />
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    compact={false}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-text-secondary mb-4">
                                Aucun article disponible pour le moment
                            </p>
                            <Link to="/shop" className="btn btn-primary">
                                Parcourir la boutique
                            </Link>
                        </div>
                    )}

                    {/* Mobile "Voir tous" link */}
                    <div className="sm:hidden mt-6 text-center">
                        <Link
                            to="/shop"
                            className="btn btn-secondary w-full flex items-center justify-center gap-2"
                        >
                            Voir tous les articles
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary text-white">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Prêt à commencer ?
                    </h2>
                    <p className="text-white/80 mb-8 max-w-xl mx-auto">
                        Rejoignez des milliers de clients satisfaits et profitez de nos offres exclusives
                    </p>
                    <Link
                        to="/shop"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                        Commencer mes achats
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
