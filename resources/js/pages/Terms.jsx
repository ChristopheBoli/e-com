import { Link } from 'react-router-dom';

export function Terms() {
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Conditions générales</h1>
            <p className="text-text-secondary mb-6">
                Ces conditions encadrent l'utilisation de la plateforme E-com et les achats réalisés en ligne.
            </p>

            <div className="card p-6 space-y-4">
                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">1. Objet</h2>
                    <p className="text-text-secondary">
                        Les présentes conditions définissent les droits et obligations des parties dans le cadre de la vente
                        en ligne des articles proposés sur la boutique.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">2. Commandes et paiement</h2>
                    <p className="text-text-secondary">
                        Toute commande validée implique l'acceptation des prix et descriptions affichés. Les paiements sont
                        traités via des canaux sécurisés.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">3. Livraison et retours</h2>
                    <p className="text-text-secondary">
                        Les délais de livraison sont indicatifs. En cas de problème, contactez le support via la page contact.
                    </p>
                </section>
            </div>

            <div className="mt-6">
                <Link to="/shop" className="btn btn-primary">
                    Retour à la boutique
                </Link>
            </div>
        </div>
    );
}
