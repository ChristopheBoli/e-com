import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Fusionne les classes Tailwind CSS en évitant les conflits
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

/**
 * Formate le prix en centimes (XOF)
 */
export function formatPrice(cents = 0) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF',
    }).format((Number(cents) || 0) / 100);
}

/**
 * Formate la date
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

/**
 * Formate la date en relatif
 */
export function formatRelativeDate(date) {
    if (!date) return '';

    const timestamp = new Date(date).getTime();
    if (Number.isNaN(timestamp)) return '';

    const diffMinutes = Math.floor((Date.now() - timestamp) / 60000);

    if (diffMinutes < 1) return "À l'instant";
    if (diffMinutes < 60) return `Il y a ${diffMinutes} min`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `Il y a ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `Il y a ${diffDays}j`;

    return formatDate(date);
}

/**
 * Tronque le texte
 */
export function truncate(text, length = 100) {
    if (!text) return '';
    if (text.length <= length) return text;
    return text.slice(0, length) + '...';
}

/**
 * Génère une couleur de badge basée sur le stock
 */
export function getStockBadgeColor(quantity) {
    if (quantity === 0) return 'error';
    if (quantity < 10) return 'warning';
    return 'success';
}

/**
 * Génère le texte du stock
 */
export function getStockText(quantity) {
    if (quantity === 0) return 'Rupture de stock';
    if (quantity < 10) return `Plus que ${quantity} en stock`;
    if (quantity < 20) return 'Stock limité';
    return 'En stock';
}

const ORDER_STATUS_LABELS = {
    pending: 'En attente',
    paid: 'Payée',
    shipped: 'Expédiée',
    completed: 'Terminée',
    cancelled: 'Annulée',
};

const ORDER_STATUS_COLORS = {
    pending: 'warning',
    paid: 'success',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'error',
};

/**
 * Libellé lisible du statut de commande
 */
export function getOrderStatusLabel(status) {
    return ORDER_STATUS_LABELS[status] || (status ? String(status) : 'Inconnu');
}

/**
 * Couleur de badge pour statut de commande
 */
export function getOrderStatusColor(status) {
    return ORDER_STATUS_COLORS[status] || 'warning';
}

function sanitizePlaceholderText(text) {
    const safe = String(text ?? 'Image')
        .replace(/[<>&"']/g, '')
        .trim()
        .slice(0, 24);

    return safe || 'Image';
}

/**
 * Génère une image placeholder locale (data URI SVG)
 */
export function getPlaceholderImage(text = 'Image', width = 400, height = 400) {
    const w = Number(width) || 400;
    const h = Number(height) || 400;
    const label = sanitizePlaceholderText(text);
    const fontSize = Math.max(14, Math.floor(Math.min(w, h) / 10));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="100%" height="100%" fill="#e2e8f0"/><text x="50%" y="50%" fill="#64748b" font-family="Arial, sans-serif" font-size="${fontSize}" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

/**
 * Source d'image produit avec fallback local
 */
export function getProductImage(imageUrl, productName = 'Produit', size = 400) {
    return imageUrl || getPlaceholderImage(productName, size, size);
}
