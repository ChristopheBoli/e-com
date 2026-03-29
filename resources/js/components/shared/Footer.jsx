import { Link } from 'react-router-dom';
import { Globe, Mail, ShoppingCart, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { toast } from '../../utils/toast';

export function Footer() {

    const handleNewsletterSubmit = (event) => {
        event.preventDefault();
        toast.info('La fonctionnalité newsletter sera bientôt disponible !');
    }

    return (
        <footer className="border-t border-border bg-surface mt-auto">
            <div className="container-custom py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Colonne 1: Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <ShoppingCart className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-text-primary">E-com</span>
                        </div>
                        <p className="text-sm text-text-secondary">
                            Votre boutique en ligne moderne et sécurisée.
                        </p>
                        {/* Réseaux sociaux */}
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-primary transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Colonne 2: Boutique */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Boutique</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <Link to="/shop" className="hover:text-primary transition-colors">
                                    Tous les artciles
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?sortBy=created_at&sortOrder=desc" className="hover:text-primary transition-colors">
                                    Nouveautés
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?maxPrice=10000" className="hover:text-primary transition-colors">
                                    Promotions
                                </Link>
                            </li>
                            <li>
                                <Link to="/shop?sortBy=price_cents&sortOrder=desc" className="hover:text-primary transition-colors">
                                    Meilleures ventes
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 3: Aide */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Aide</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">
                                    Livraison
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">
                                    Retours
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Colonne 4: Légal */}
                    <div>
                        <h4 className="font-semibold text-text-primary mb-4">Légal</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>
                                <Link to="/terms" className="hover:text-primary transition-colors">
                                    Conditions générales de vente
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary transition-colors">
                                    Politique de confidentialité
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-primary transition-colors">
                                    Mentions légales
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary transition-colors">
                                    Cookies
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Newsletter */}
                <div className="mt-12 pt-8 border-t border-border">
                    <div className="max-w-md mx-auto text-center">
                        <h4 className="font-semibold text-text-primary mb-2">Restez informé</h4>
                        <p className="text-sm text-text-secondary mb-4">
                            Recevez nos dernières offres et nouveautés par email
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="input flex-1"
                            />
                            <button type="button" onClick={handleNewsletterSubmit} className="btn btn-primary flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                S'inscrire
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-border text-center">
                    <p className="text-sm text-text-secondary">
                        &copy; {new Date().getFullYear()} E-com, By Christophe BOLI. Tous droits réservés. Fait avec{' '}
                        <span className="text-red-500">♥</span> pour la phase de test.
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
