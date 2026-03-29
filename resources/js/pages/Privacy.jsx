import { Link } from 'react-router-dom';

export function Privacy() {
    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Politique de confidentialité</h1>
            <p className="text-text-secondary mb-6">
                Cette politique décrit comment vos données sont collectées, utilisées et protégées.
            </p>

            <div className="card p-6 space-y-4">
                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">1. Données collectées</h2>
                    <p className="text-text-secondary">
                        Nous collectons les informations nécessaires à la gestion des comptes, commandes et livraisons.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">2. Utilisation</h2>
                    <p className="text-text-secondary">
                        Les données sont utilisées pour traiter vos commandes, améliorer le service et vous notifier des étapes clés.
                    </p>
                </section>

                <section>
                    <h2 className="text-lg font-semibold text-text-primary mb-2">3. Sécurité</h2>
                    <p className="text-text-secondary">
                        Nous appliquons des mesures techniques et organisationnelles pour protéger vos informations.
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
