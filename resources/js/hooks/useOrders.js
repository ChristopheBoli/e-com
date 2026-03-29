import { useQuery } from '@tanstack/react-query';
import { adminService } from '../utils/api';
import toast from '../utils/toast';

/**
 * Hook pour la liste des commandes admin
 */
export function useAdminOrders(params = {}) {
    return useQuery({
        queryKey: ['admin-orders', params],
        queryFn: () => adminService.orders.list(params).then((response) => response.data.data),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
}

/**
 * Hook pour une commande admin spécifique
 */
export function useAdminOrder(id) {
    return useQuery({
        queryKey: ['admin-order', id],
        queryFn: () => adminService.orders.show(id).then((response) => response.data.data),
        enabled: !!id,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

export default { useAdminOrders, useAdminOrder };
