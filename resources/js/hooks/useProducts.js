import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService, adminService } from '../utils/api';
import toast from '../utils/toast';

/**
 * Hook pour la liste des produits avec filtres
 */
export function useProducts(params = {}) {
    return useQuery({
        queryKey: ['products', params],
        queryFn: () => productService.list(params).then((response) => response.data.data),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook pour un produit spécifique
 */
export function useProduct(id) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.show(id).then((response) => response.data.data),
        enabled: !!id,
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
}

/**
 * Hook pour les produits admin (avec filtres avancés)
 */
export function useAdminProducts(params = {}) {
    return useQuery({
        queryKey: ['admin-products', params],
        queryFn: () => adminService.products.list(params).then((response) => response.data.data),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook pour un produit admin spécifique
 */
export function useAdminProduct(id) {
    return useQuery({
        queryKey: ['admin-product', id],
        queryFn: () => adminService.products.show(id).then((response) => response.data.data),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

/**
 * Hook pour les mutations de produits admin (CRUD)
 */
export function useProductMutations() {
    const queryClient = useQueryClient();

    // Créer un produit
    const createProduct = useMutation({
        mutationFn: (data) => adminService.products.create(data),
        onSuccess: () => {
            toast.success('Article créé avec succès');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la création';
            toast.error(message);
        },
    });

    // Mettre à jour un produit
    const updateProduct = useMutation({
        mutationFn: ({ id, data }) => adminService.products.update(id, data),
        onSuccess: () => {
            toast.success('Article mis à jour avec succès');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['admin-product'] });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la mise à jour';
            toast.error(message);
        },
    });

    // Supprimer un produit
    const deleteProduct = useMutation({
        mutationFn: (id) => adminService.products.delete(id),
        onSuccess: () => {
            toast.success('Article supprimé avec succès');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la suppression';
            toast.error(message);
        },
    });

    // Mise à jour en masse du stock
    const bulkUpdateStock = useMutation({
        mutationFn: (items) => adminService.products.bulkUpdateStock(items),
        onSuccess: () => {
            toast.success('Stock mis à jour avec succès');
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error) => {
            const message = error.response?.data?.message || 'Erreur lors de la mise à jour du stock';
            toast.error(message);
        },
    });

    return {
        createProduct: createProduct.mutateAsync,
        updateProduct: updateProduct.mutateAsync,
        deleteProduct: deleteProduct.mutateAsync,
        bulkUpdateStock: bulkUpdateStock.mutateAsync,
        isCreating: createProduct.isPending,
        isUpdating: updateProduct.isPending,
        isDeleting: deleteProduct.isPending,
        isBulkUpdating: bulkUpdateStock.isPending,
    };
}

export default { useProducts, useProduct, useAdminProducts, useAdminProduct, useProductMutations };
