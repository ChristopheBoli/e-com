import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';

export function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, loading } = useAuth();

    const destination = location.state?.from || '/shop';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login({ email, password });
            navigate(destination, { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        }
    };

    return (
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 animate-fadeIn">
            <div className="w-full max-w-md card p-8">
                <h1 className="text-2xl font-bold text-text-primary text-center mb-8">Connexion</h1>

                {error && (
                    <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">Mot de passe</label>
                        <input
                            type="password"
                            placeholder="••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input"
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="text-primary hover:underline font-medium">
                        Créer un compte
                    </Link>
                </p>
            </div>
        </div>
    );
}
