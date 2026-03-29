import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '../../contexts/AuthContext';
import { CartProvider } from '../../contexts/CartContext';

export function Layout() {
    const { loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-pulse-custom">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <svg className="h-6 w-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <CartProvider>
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="container-custom py-8 flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </CartProvider>
    );
}
