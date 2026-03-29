import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '../utils/toast';

export function Contact() {

    const handleSubmit = (event) => {
        event.preventDefault();
        toast.info('La fonctionnalité contact sera bientôt disponible !');
    }

    return (
        <div className="animate-fadeIn max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-text-primary mb-4">Contact</h1>
            <p className="text-text-secondary mb-6">
                Notre équipe support est disponible pour vous aider sur vos commandes et votre compte.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Mail className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-text-primary">Email</h2>
                    </div>
                    <p className="text-text-secondary text-sm">support@ecom.com</p>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-text-primary">Téléphone</h2>
                    </div>
                    <p className="text-text-secondary text-sm">+223 00 00 00 00</p>
                </div>

                <div className="card p-5">
                    <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <h2 className="font-semibold text-text-primary">Adresse</h2>
                    </div>
                    <p className="text-text-secondary text-sm">Bamako, Mali</p>
                </div>
            </div>

            <div className="card p-6 mt-6">
                <h2 className="text-lg font-semibold text-text-primary mb-4">Écrivez-nous</h2>
                <form className="space-y-4">
                    <input className="input" placeholder="Votre nom" />
                    <input className="input" placeholder="Votre email" type="email" />
                    <textarea className="input min-h-32 resize-y" placeholder="Votre message" />
                    <button type="button" onClick={handleSubmit} className="btn btn-primary">
                        Envoyer
                    </button>
                </form>
            </div>
        </div>
    );
}
