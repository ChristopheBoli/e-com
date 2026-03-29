import { cn } from '../../utils/cn';

/**
 * Skeleton de base
 */
export function Skeleton({ className, ...props }) {
    return (
        <div
            className={cn('animate-pulse bg-[var(--color-border)] rounded', className)}
            {...props}
        />
    );
}

/**
 * Skeleton pour carte produit
 */
export function ProductCardSkeleton() {
    return (
        <div className="card overflow-hidden group">
            {/* Image placeholder */}
            <Skeleton className="w-full aspect-square rounded-t-lg" />
            <div className="p-4 space-y-3">
                {/* Badge placeholder */}
                <Skeleton className="h-6 w-20 rounded-full" />
                {/* Titre */}
                <Skeleton className="h-6 w-3/4" />
                {/* Prix */}
                <Skeleton className="h-5 w-1/3" />
                {/* Bouton */}
                <Skeleton className="h-10 w-full rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Skeleton pour item de panier
 */
export function CartItemSkeleton() {
    return (
        <div className="flex gap-4 p-4 border-b border-border animate-fadeIn">
            {/* Image */}
            <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
                {/* Nom */}
                <Skeleton className="h-5 w-2/3" />
                {/* Prix */}
                <Skeleton className="h-4 w-1/4" />
            </div>
            {/* Quantité et actions */}
            <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
        </div>
    );
}

/**
 * Skeleton pour tableau admin
 */
export function TableSkeleton({ rows = 5, columns = 6 }) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex gap-4 p-3 border-b border-border">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={`header-${i}`} className="h-4 flex-1" />
                ))}
            </div>
            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={`row-${rowIndex}`} className="flex gap-4 p-3 border-b border-border">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton key={`cell-${rowIndex}-${colIndex}`} className="h-10 flex-1" />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * Skeleton pour dashboard stats
 */
export function StatsCardSkeleton() {
    return (
        <div className="card p-6">
            <div className="space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
            </div>
        </div>
    );
}

/**
 * Grid de skeletons pour liste produits
 */
export function ProductGridSkeleton({ count = 8 }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: count }).map((_, i) => (
                <ProductCardSkeleton key={i} />
            ))}
        </div>
    );
}

export default Skeleton;
