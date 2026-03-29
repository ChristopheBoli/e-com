import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export function Register() {
    const navigate = useNavigate();
    const { register, loading } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear validation error for this field
        setValidationErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic validation
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Le nom est requis';
        if (!formData.email.trim()) errors.email = 'L\'email est requis';
        if (!formData.password) errors.password = 'Le mot de passe est requis';
        if (formData.password.length < 8) errors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        if (formData.password !== formData.password_confirmation) {
            errors.password_confirmation = 'Les mots de passe ne correspondent pas';
        }

        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }

        try {
            await register(formData);
            navigate('/shop');
        } catch (err) {
            // API validation errors
            if (err.response?.data?.errors) {
                setValidationErrors(err.response.data.errors);
            } else {
                setError(err.response?.data?.message || 'Erreur lors de l\'inscription');
            }
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 animate-fadeIn">
            <div className="w-full max-w-md card p-8">
                <h1 className="text-2xl font-bold text-text-primary text-center mb-8">
                    Créer un compte
                </h1>

                {error && (
                    <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Nom complet
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Christophe Boli"
                            value={formData.name}
                            onChange={handleChange}
                            className="input"
                            autoComplete="name"
                        />
                        {validationErrors.name && (
                            <p className="mt-1 text-sm text-error">{validationErrors.name}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Adresse email
                        </label>
                        <input
                            type="email"
                            name="email"
                            placeholder="votre@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            autoComplete="email"
                        />
                        {validationErrors.email && (
                            <p className="mt-1 text-sm text-error">{validationErrors.email}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Mot de passe
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="•••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            autoComplete="new-password"
                        />
                        {validationErrors.password && (
                            <p className="mt-1 text-sm text-error">{validationErrors.password}</p>
                        )}
                        <p className="mt-1 text-xs text-text-muted">
                            Minimum 8 caractères
                        </p>
                    </div>

                    {/* Password confirmation */}
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Confirmer le mot de passe
                        </label>
                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="•••••••••"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className="input"
                            autoComplete="new-password"
                        />
                        {validationErrors.password_confirmation && (
                            <p className="mt-1 text-sm text-error">
                                {validationErrors.password_confirmation}
                            </p>
                        )}
                    </div>

                    {/* Terms (placeholder) */}
                    <div className="flex items-start gap-2">
                        <input
                            type="checkbox"
                            id="terms"
                            required
                            className="mt-1"
                        />
                        <label htmlFor="terms" className="text-sm text-text-secondary">
                            J'accepte les{' '}
                            <Link to="/terms" className="text-primary hover:underline">
                                conditions générales de vente
                            </Link>{' '}
                            et la{' '}
                            <Link to="/privacy" className="text-primary hover:underline">
                                politique de confidentialité
                            </Link>
                        </label>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Création en cours...' : 'Créer mon compte'}
                    </Button>
                </form>

                {/* Login link */}
                <p className="mt-6 text-center text-sm text-text-secondary">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-primary hover:underline font-medium">
                        Se connecter
                    </Link>
                </p>
            </div>
        </div>
    );
}
