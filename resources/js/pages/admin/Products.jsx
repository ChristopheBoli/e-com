import { useState, useMemo, useRef } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Package,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-react';
import { useAdminProducts, useProductMutations } from '../../hooks/useProducts';
import { formatPrice, getStockBadgeColor, getStockText, getProductImage } from '../../utils/cn';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { TableSkeleton } from '../../components/ui/Skeleton';
import { Button } from '../../components/ui/Button';
import toast from '../../utils/toast';

export function ProductsAdmin() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingProductId, setDeletingProductId] = useState(null);

    const perPage = 10;
    const fileInputRef = useRef(null);

    const { data: productsData, isLoading } = useAdminProducts({
        page,
        search: search || undefined,
    });

    const {
        createProduct,
        updateProduct,
        deleteProduct,
        isCreating,
        isUpdating,
        isDeleting,
    } = useProductMutations();

    const products = productsData?.data || [];
    const totalPages = productsData?.last_page || 1;
    const total = productsData?.total || 0;

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        description: '',
        price_cents: 0,
        stock_quantity: 0,
        is_active: true,
        image_url: '',
        image: null,
    });

    const filteredProducts = useMemo(() => {
        if (!search) return products;
        return products.filter(
            (p) =>
                p.name?.toLowerCase().includes(search.toLowerCase()) ||
                p.sku?.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedProducts(filteredProducts.map((p) => p.id));
        } else {
            setSelectedProducts([]);
        }
    };

    const handleSelectProduct = (productId) => {
        setSelectedProducts((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId]
        );
    };

    const handleDeleteSelected = async () => {
        try {
            for (const productId of selectedProducts) {
                await deleteProduct(productId);
            }
            setSelectedProducts([]);
            toast.success(`${selectedProducts.length} article(s) supprimé(s)`);
        } catch (error) {
            toast.error('Erreur lors de la suppression');
        }
    };

    const openCreateModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            sku: '',
            description: '',
            price_cents: 0,
            stock_quantity: 0,
            is_active: true,
            image_url: '',
            image: null,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            sku: product.sku || '',
            description: product.description || '',
            price_cents: product.price_cents || 0,
            stock_quantity: product.stock_quantity || 0,
            is_active: product.is_active ?? true,
            image_url: product.image_url || '',
            image: null,
        });
        setIsModalOpen(true);
    };

    const openDeleteModal = (productId) => {
        setDeletingProductId(productId);
        setIsDeleteModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
                image_url: URL.createObjectURL(file),
            }));
        } else {
            // Quand l'utilisateur annule la sélection, remettre à null
            setFormData((prev) => ({
                ...prev,
                image: null,
                image_url: prev.image_url, // Garder l'ancienne URL pour l'affichage
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const productData = new FormData();

            productData.append('name', formData.name || '');
            productData.append('sku', formData.sku || '');
            productData.append('description', formData.description || '');
            productData.append('price_cents', String(formData.price_cents || 0));
            productData.append('stock_quantity', String(formData.stock_quantity || 0));
            productData.append('is_active', formData.is_active ? '1' : '0');

            const fileInput = fileInputRef.current;
            const file = fileInput?.files?.[0];

            if (file) {
                productData.append('image', file);
            }

            if (editingProduct) {
                await updateProduct({ id: editingProduct.id, data: productData });
            } else {
                await createProduct(productData);
            }
            setIsModalOpen(false);
        } catch {
        }
    };

    const handleDelete = async () => {
        if (deletingProductId) {
            await deleteProduct(deletingProductId);
            setIsDeleteModalOpen(false);
            setDeletingProductId(null);
        }
    };

    const stockColor = (quantity) => getStockBadgeColor(quantity);
    const stockText = (quantity) => getStockText(quantity);

    if (isLoading && !products.length) {
        return (
            <div className="animate-fadeIn">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-text-primary">Gestion des articles</h1>
                </div>
                <TableSkeleton />
            </div>
        );
    }

    return (
        <div className="animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-text-primary">Gestion des articles</h1>
                    <p className="text-text-secondary">
                        {total} article{total > 1 ? 's' : ''} au total
                    </p>
                </div>
                <div className="flex gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={search}
                            onChange={handleSearch}
                            className="input !pl-10 w-64"
                        />
                    </div>
                    <Button onClick={openCreateModal}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nouvel article
                    </Button>
                </div>
            </div>

            {/* Bulk actions */}
            {selectedProducts.length > 0 && (
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4 mb-6 flex items-center justify-between">
                    <p className="text-sm text-primary">
                        {selectedProducts.length} article(s) sélectionné(s)
                    </p>
                    <button
                        onClick={handleDeleteSelected}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white hover:bg-error/90 transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                    </button>
                </div>
            )}

            {/* Products Table */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-surface-hover">
                                <th className="w-12 px-4 py-3">
                                    <input
                                        type="checkbox"
                                        checked={filteredProducts.length > 0 && selectedProducts.length === filteredProducts.length}
                                        onChange={handleSelectAll}
                                        className="w-4 h-4"
                                    />
                                </th>
                                <th className="px-4 py-3 text-left">Article</th>
                                <th className="px-4 py-3 text-left">SKU</th>
                                <th className="px-4 py-3 text-left">Prix</th>
                                <th className="px-4 py-3 text-left">Stock</th>
                                <th className="px-4 py-3 text-left">Statut</th>
                                <th className="w-24 px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-12 text-center text-text-secondary">
                                        <Package className="w-12 h-12 mx-auto mb-4 text-text-muted" />
                                        <p>Aucun article trouvé</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="hover:bg-surface-hover transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedProducts.includes(product.id)}
                                                onChange={() => handleSelectProduct(product.id)}
                                                className="w-4 h-4"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={getProductImage(product.image_url, product.name, 40)}
                                                    alt={product.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                    onError={(e) => {
                                                        e.target.src = getProductImage(null, product.name, 40);
                                                    }}
                                                />
                                                <span className="font-medium text-text-primary line-clamp-1">
                                                    {product.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-text-secondary font-mono">
                                            {product.sku}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-text-primary">
                                            {formatPrice(product.price_cents)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge badge-${stockColor(product.stock_quantity)}`}>
                                                {product.stock_quantity} ({stockText(product.stock_quantity)})
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`badge badge-${product.is_active ? 'success' : 'error'}`}>
                                                {product.is_active ? 'Actif' : 'Inactif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(product.id)}
                                                    className="p-2 text-text-secondary hover:text-error hover:bg-error/5 rounded-lg transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                        <p className="text-sm text-text-secondary">
                            Affichage de {(page - 1) * perPage + 1} à {Math.min(page * perPage, total)} sur {total}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                                        page === i + 1
                                            ? 'bg-primary text-white'
                                            : 'border border-border text-text-primary hover:bg-surface-hover'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-border rounded-lg hover:bg-surface-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingProduct ? 'Modifier l\'article' : 'Nouvel article'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Nom de l'article *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleFormChange}
                                required
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleFormChange}
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Description
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleFormChange}
                            rows={4}
                            className="input resize-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Prix (XOF) *
                            </label>
                            <input
                                type="number"
                                name="price_cents"
                                value={Math.round((formData.price_cents || 0) / 100)}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value || '0', 10);
                                    handleFormChange({
                                        target: {
                                            name: 'price_cents',
                                            value: Number.isNaN(value) ? 0 : value * 100,
                                        },
                                    });
                                }}
                                required
                                step="1"
                                min="0"
                                className="input"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">
                                Stock *
                            </label>
                            <input
                                type="number"
                                name="stock_quantity"
                                value={formData.stock_quantity}
                                onChange={handleFormChange}
                                required
                                min="0"
                                className="input"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                            Image de l'article
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="input"
                        />
                        {formData.image_url && (
                            <div className="mt-2">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="h-32 w-auto rounded-lg border border-border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={handleFormChange}
                            className="w-4 h-4"
                        />
                        <label htmlFor="is_active" className="text-sm text-text-primary">
                            Article actif (visible dans la boutique)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-border">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="btn btn-secondary flex-1"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating || isUpdating}
                            className="btn btn-primary flex-1"
                        >
                            {isCreating || isUpdating ? (
                                <>
                                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {editingProduct ? 'Mise à jour...' : 'Création...'}
                                </>
                            ) : (
                                <>
                                    {editingProduct ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Mettre à jour
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4 mr-2" />
                                            Créer l'article
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce article ? Cette action est irréversible."
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
                loading={isDeleting}
            />
        </div>
    );
}
