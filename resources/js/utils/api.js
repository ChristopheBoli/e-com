import axios from 'axios';

// Création de l'instance axios
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwt_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(error);
    }
);

// Service d'authentification
export const authService = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (data) => api.post('/auth/register', data),
    me: () => api.get('/auth/me'),
    logout: () => api.post('/auth/logout'),
};

// Service produits
export const productService = {
    list: (params) => api.get('/products', { params }),
    show: (id) => api.get(`/products/${id}`),
};

// Service panier
export const cartService = {
    get: () => api.get('/cart'),
    add: (data) => api.post('/cart/add', data),
    update: (data) => api.put('/cart/update', data),
    remove: (productId) => api.delete(`/cart/remove?product_id=${productId}`),
    clear: () => api.delete('/cart'),
};

// Service commande
export const checkoutService = {
    checkout: (data) => api.post('/checkout', data),
};

export const orderService = {
    list: (params) => api.get('/orders', { params }),
    listMine: (params) => api.get('/orders', { params }),
    show: (id) => api.get(`/orders/${id}`),
};

// Service admin
export const adminService = {
    dashboard: () => api.get('/admin/dashboard'),
    orders: {
        list: (params) => api.get('/admin/orders', { params }),
        show: (id) => api.get(`/admin/orders/${id}`),
        update: (id, data) => api.put(`/admin/orders/${id}`, data),
    },
    products: {
        list: (params) => api.get('/admin/products', { params }),
        show: (id) => api.get(`/admin/products/${id}`),
        create: (data) => api.post('/admin/products', data),
        update: (id, data) => {
            if (data instanceof FormData) {
                if (!data.has('_method')) {
                    data.append('_method', 'PUT');
                }
                return api.post(`/admin/products/${id}`, data);
            }
            return api.put(`/admin/products/${id}`, data);
        },
        delete: (id) => api.delete(`/admin/products/${id}`),
        bulkUpdateStock: (items) => api.post('/admin/products/bulk-stock', { items }),
    },
    users: {
        list: (params) => api.get('/admin/users', { params }),
        show: (id) => api.get(`/admin/users/${id}`),
        create: (data) => api.post('/admin/users', data),
        update: (id, data) => api.put(`/admin/users/${id}`, data),
        delete: (id) => api.delete(`/admin/users/${id}`),
    },
    revenue: {
        getStats: (params) => api.get('/admin/revenue', { params }),
    },
};

// Service pour les utilisateurs (backward compatibility)
export const userService = {
    list: (params) => api.get('/admin/users', { params }),
    show: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    delete: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
