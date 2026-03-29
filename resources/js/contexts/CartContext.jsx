import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../utils/api';
import toast from '../utils/toast';
import { CART_REFRESH_EVENT, AUTH_LOGIN_EVENT, AUTH_LOGOUT_EVENT } from './AuthContext';

const CartContext = createContext(null);

// Storage key pour le panier local (utilisateurs non connectés)
const LOCAL_CART_KEY = 'local_cart';

// Charge le panier local depuis localStorage
function loadLocalCart() {
    try {
        const stored = localStorage.getItem(LOCAL_CART_KEY);
        return stored ? JSON.parse(stored) : { items: [] };
    } catch {
        return { items: [] };
    }
}

// Sauvegarde le panier local dans localStorage
function saveLocalCart(cart) {
    try {
        localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
    } catch (error) {
            }
}

// Supprime le panier local
function clearLocalCart() {
    localStorage.removeItem(LOCAL_CART_KEY);
}

function normalizeCartPayload(cart) {
    if (!cart) {
        return {
            cart_id: null,
            items: [],
            total_cents: 0,
        };
    }

    const items = (cart.items || []).map((item) => ({
        ...item,
        quantity: Number(item.quantity) || 0,
        unit_price_cents: Number(item.unit_price_cents) || 0,
        line_total_cents:
            Number(item.line_total_cents) || (Number(item.quantity) || 0) * (Number(item.unit_price_cents) || 0),
    }));

    const totalCents = items.reduce((sum, item) => sum + item.line_total_cents, 0);

    return {
        ...cart,
        items,
        total_cents: Number(cart.total_cents) || totalCents,
    };
}

export function CartProvider({ children }) {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            fetchCart();
        } else {
            // Utilisateur non connecté : charger le panier local
            const localCart = loadLocalCart();
            setCart(normalizeCartPayload(localCart));
        }
    }, []);

    // Écouter l'événement de rafraîchissement du panier (après connexion avec produit en attente)
    useEffect(() => {
        const handleRefresh = () => {
            if (localStorage.getItem('jwt_token')) {
                fetchCart();
            }
        };

        window.addEventListener(CART_REFRESH_EVENT, handleRefresh);
        return () => window.removeEventListener(CART_REFRESH_EVENT, handleRefresh);
    }, []);

    // Écouter l'événement de connexion pour fusionner le panier local avec le serveur
    useEffect(() => {
        const handleLogin = async () => {
            const localCart = loadLocalCart();

            // Si le panier local contient des articles, les ajouter au panier serveur
            if (localCart.items && localCart.items.length > 0) {
                try {
                    for (const item of localCart.items) {
                        await cartService.add({
                            product_id: item.product_id,
                            quantity: item.quantity,
                        });
                    }
                    // Vider le panier local après fusion
                    clearLocalCart();
                } catch (error) {
                                    }
            }

            // Récupérer le panier serveur
            fetchCart();
        };

        window.addEventListener(AUTH_LOGIN_EVENT, handleLogin);
        return () => window.removeEventListener(AUTH_LOGIN_EVENT, handleLogin);
    }, []);

    // Écouter l'événement de déconnexion pour vider le panier
    useEffect(() => {
        const handleLogout = () => {
            setCart(null);
            setError(null);
        };

        window.addEventListener(AUTH_LOGOUT_EVENT, handleLogout);
        return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleLogout);
    }, []);

    const fetchCart = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await cartService.get();
            setCart(normalizeCartPayload(response.data.data));
        } catch (err) {
                        setCart(null);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (productId, quantity = 1, metadata = {}) => {
        setLoading(true);
        setError(null);

        const isAuthenticated = !!localStorage.getItem('jwt_token');
        const previousCart = cart;

        // Si non connecté, utiliser le panier local
        if (!isAuthenticated) {
            setCart((currentCart) => {
                const baseCart = normalizeCartPayload(currentCart || {});
                const existingItem = baseCart.items.find((item) => item.product_id === productId);

                let nextItems;

                if (existingItem) {
                    nextItems = baseCart.items.map((item) => {
                        if (item.product_id !== productId) return item;
                        const nextQuantity = item.quantity + quantity;
                        return {
                            ...item,
                            quantity: nextQuantity,
                            line_total_cents: nextQuantity * item.unit_price_cents,
                        };
                    });
                } else {
                    nextItems = [
                        ...baseCart.items,
                        {
                            product_id: productId,
                            name: metadata.productName || 'Article',
                            quantity,
                            unit_price_cents: metadata.priceCents || 0,
                            line_total_cents: (metadata.priceCents || 0) * quantity,
                        },
                    ];
                }

                const totalCents = nextItems.reduce((sum, item) => sum + item.line_total_cents, 0);
                const newCart = {
                    ...baseCart,
                    items: nextItems,
                    total_cents: totalCents,
                };

                // Sauvegarder dans localStorage
                saveLocalCart(newCart);

                return newCart;
            });

            if (metadata.productName) {
                toast.success(`${metadata.productName} ajouté au panier`);
            } else {
                toast.success('Produit ajouté au panier');
            }
            setLoading(false);
            return;
        }

        // Si connecté, utiliser l'API

        setCart((currentCart) => {
            const baseCart = normalizeCartPayload(currentCart || {});
            const existingItem = baseCart.items.find((item) => item.product_id === productId);

            let nextItems;

            if (existingItem) {
                nextItems = baseCart.items.map((item) => {
                    if (item.product_id !== productId) return item;
                    const nextQuantity = item.quantity + quantity;
                    return {
                        ...item,
                        quantity: nextQuantity,
                        line_total_cents: nextQuantity * item.unit_price_cents,
                    };
                });
            } else {
                nextItems = [
                    ...baseCart.items,
                    {
                        product_id: productId,
                        name: metadata.productName || 'Article',
                        quantity,
                        unit_price_cents: 0,
                        line_total_cents: 0,
                    },
                ];
            }

            const totalCents = nextItems.reduce((sum, item) => sum + item.line_total_cents, 0);

            return {
                ...baseCart,
                items: nextItems,
                total_cents: totalCents,
            };
        });

        try {
            const response = await cartService.add({ product_id: productId, quantity });
            setCart(normalizeCartPayload(response.data.data));
            if (metadata.productName) {
                toast.success(`${metadata.productName} ajouté au panier`);
            } else {
                toast.success('Produit ajouté au panier');
            }
        } catch (err) {
            setCart(previousCart || null);
            setError(err.response?.data?.message || 'Erreur lors de l\'ajout au panier');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity < 1) {
            await removeFromCart(productId);
            return;
        }

        setLoading(true);
        setError(null);

        const isAuthenticated = !!localStorage.getItem('jwt_token');

        // Si non connecté, utiliser le panier local
        if (!isAuthenticated) {
            setCart((currentCart) => {
                const baseCart = normalizeCartPayload(currentCart || {});
                const nextItems = baseCart.items.map((item) => {
                    if (item.product_id !== productId) return item;
                    return {
                        ...item,
                        quantity,
                        line_total_cents: quantity * item.unit_price_cents,
                    };
                });

                const newCart = {
                    ...baseCart,
                    items: nextItems,
                    total_cents: nextItems.reduce((sum, item) => sum + item.line_total_cents, 0),
                };

                // Sauvegarder dans localStorage
                saveLocalCart(newCart);

                return newCart;
            });
            setLoading(false);
            return;
        }

        // Si connecté, utiliser l'API
        const previousCart = cart;

        setCart((currentCart) => {
            const baseCart = normalizeCartPayload(currentCart || {});
            const nextItems = baseCart.items.map((item) => {
                if (item.product_id !== productId) return item;
                return {
                    ...item,
                    quantity,
                    line_total_cents: quantity * item.unit_price_cents,
                };
            });

            return {
                ...baseCart,
                items: nextItems,
                total_cents: nextItems.reduce((sum, item) => sum + item.line_total_cents, 0),
            };
        });

        try {
            const response = await cartService.update({ product_id: productId, quantity });
            setCart(normalizeCartPayload(response.data.data));
        } catch (err) {
            setCart(previousCart || null);
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeFromCart = async (productId) => {
        setLoading(true);
        setError(null);

        const isAuthenticated = !!localStorage.getItem('jwt_token');

        // Si non connecté, utiliser le panier local
        if (!isAuthenticated) {
            setCart((currentCart) => {
                const baseCart = normalizeCartPayload(currentCart || {});
                const nextItems = baseCart.items.filter((item) => item.product_id !== productId);

                const newCart = {
                    ...baseCart,
                    items: nextItems,
                    total_cents: nextItems.reduce((sum, item) => sum + item.line_total_cents, 0),
                };

                // Sauvegarder dans localStorage
                saveLocalCart(newCart);

                return newCart;
            });
            setLoading(false);
            return;
        }

        // Si connecté, utiliser l'API
        const previousCart = cart;

        setCart((currentCart) => {
            const baseCart = normalizeCartPayload(currentCart || {});
            const nextItems = baseCart.items.filter((item) => item.product_id !== productId);

            return {
                ...baseCart,
                items: nextItems,
                total_cents: nextItems.reduce((sum, item) => sum + item.line_total_cents, 0),
            };
        });

        try {
            const response = await cartService.remove(productId);
            const payload = response.data.data;
            setCart(payload ? normalizeCartPayload(payload) : null);
        } catch (err) {
            setCart(previousCart || null);
            setError(err.response?.data?.message || 'Erreur lors de la suppression');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        setError(null);

        const isAuthenticated = !!localStorage.getItem('jwt_token');

        // Si non connecté, vider le panier local
        if (!isAuthenticated) {
            setCart(normalizeCartPayload({ items: [] }));
            clearLocalCart();
            setLoading(false);
            return;
        }

        // Si connecté, utiliser l'API
        const previousCart = cart;
        setCart(null);

        try {
            await cartService.clear();
        } catch (err) {
            setCart(previousCart || null);
            setError(err.response?.data?.message || 'Erreur lors du vidage du panier');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const cartItems = cart?.items || [];
    const cartCount = cartItems.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const cartTotal = cart?.total_cents || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                error,
                isCartOpen,
                setIsCartOpen,
                cartCount,
                cartTotal,
                fetchCart,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}
