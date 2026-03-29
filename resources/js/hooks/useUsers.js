import { useQuery } from '@tanstack/react-query';
import { adminService } from '../utils/api';
import toast from '../utils/toast';

/**
 * Hook pour la liste des utilisateurs admin
 */
export function useAdminUsers(params = {}) {
    return useQuery({
        queryKey: ['admin-users', params],
        queryFn: () => adminService.users.list(params).then((response) => response.data.data),
        staleTime: 2 * 60 * 1000,
    });
}
