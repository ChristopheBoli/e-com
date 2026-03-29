import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Layout } from './components/shared/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ProductList } from './pages/shop/ProductList';
import { ProductDetail } from './pages/shop/ProductDetail';
import { Cart } from './pages/shop/Cart';
import { Checkout } from './pages/shop/Checkout';
import { Account } from './pages/account/Account';
import { OrderSuccess } from './pages/OrderSuccess';
import { AdminDashboard } from './pages/admin/Dashboard';
import { ProductsAdmin } from './pages/admin/Products';
import { AdminOrders } from './pages/admin/Orders';
import { AdminRevenue } from './pages/admin/Revenue';
import { AdminCustomers } from './pages/admin/Customers';
import { Orders } from './pages/account/Orders';
import { Contact } from './pages/Contact';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import ProtectedRoute from './components/shared/ProtectedRoute';
import AdminRoute from './components/shared/AdminRoute';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <AuthProvider>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Layout />}>
                            <Route index element={<Home />} />
                            <Route path="login" element={<Login />} />
                            <Route path="register" element={<Register />} />
                            <Route path="shop" element={<ProductList />} />
                            <Route path="shop/:id" element={<ProductDetail />} />
                            <Route path="terms" element={<Terms />} />
                            <Route path="privacy" element={<Privacy />} />
                            <Route path="contact" element={<Contact />} />

                            {/* Protected routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="cart" element={<Cart />} />
                                <Route path="checkout" element={<Checkout />} />
                                <Route path="account" element={<Account />} />
                                <Route path="orders" element={<Orders />} />
                                <Route path="order/success" element={<OrderSuccess />} />
                            </Route>

                            {/* Admin routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route element={<AdminRoute />}>
                                    <Route path="admin" element={<AdminDashboard />} />
                                    <Route path="admin/products" element={<ProductsAdmin />} />
                                    <Route path="admin/orders" element={<AdminOrders />} />
                                    <Route path="admin/revenue" element={<AdminRevenue />} />
                                    <Route path="admin/customers" element={<AdminCustomers />} />
                                    <Route path="admin/products/new" element={<Navigate to="/admin/products" replace />} />
                                </Route>
                            </Route>

                            {/* Catch all */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Route>
                    </Routes>
                </AuthProvider>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
