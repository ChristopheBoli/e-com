import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

// Toast variantes
const TOAST_VARIANTS = {
    success: { icon: CheckCircle, bgColor: 'bg-success', textColor: 'text-white', borderColor: 'border-success' },
    error: { icon: XCircle, bgColor: 'bg-error', textColor: 'text-white', borderColor: 'border-error' },
    warning: { icon: AlertCircle, bgColor: 'bg-warning', textColor: 'text-black', borderColor: 'border-warning' },
    info: { icon: Info, bgColor: 'bg-primary', textColor: 'text-white', borderColor: 'border-primary' },
};

// État global des toasts
let toasts = [];
let listeners = [];

// Générer ID unique
const generateId = () => `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Notifier les listeners
const notifyListeners = () => {
    listeners.forEach((listener) => listener([...toasts]));
};

// Composant Toast interne
function Toast({ id, variant = 'info', title, message, duration = 4000 }) {
    const config = TOAST_VARIANTS[variant] || TOAST_VARIANTS.info;
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            toast.remove(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration]);

    return (
        <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-md animate-slideIn ${config.bgColor} ${config.borderColor}`}>
            <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${config.textColor}`} />
            <div className="flex-1 min-w-0">
                {title && <p className={`font-semibold text-sm ${config.textColor}`}>{title}</p>}
                {message && <p className="text-sm text-white/90 font-medium">{message}</p>}
            </div>
            <button
                onClick={() => toast.remove(id)}
                className="flex-shrink-0 text-white hover:text-text-primary transition-colors"
                aria-label="Fermer"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}

// Composant Container pour les toasts
function ToastContainer() {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 animate-fadeIn">
            {toasts.map((toastData) => (
                <Toast key={toastData.id} {...toastData} />
            ))}
        </div>
    );
}

// Initialiser le container (une seule fois)
let toastRoot = null;
const initToastContainer = () => {
    if (toastRoot) return;

    const container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
    toastRoot = createRoot(container);

    // Rendre initialement
    toastRoot.render(<ToastContainer />);

    // Souscrire aux changements
    listeners.push(() => {
        toastRoot.render(<ToastContainer />);
    });
};

// API publique
export const toast = {
    /**
     * Afficher un toast de succès
     */
    success: (message, options = {}) => {
        if (!toastRoot) initToastContainer();
        const id = generateId();
        toasts.push({ id, variant: 'success', message, ...options });
        notifyListeners();
        return id;
    },

    /**
     * Afficher un toast d'erreur
     */
    error: (message, options = {}) => {
        if (!toastRoot) initToastContainer();
        const id = generateId();
        toasts.push({ id, variant: 'error', message, ...options });
        notifyListeners();
        return id;
    },

    /**
     * Afficher un toast d'avertissement
     */
    warning: (message, options = {}) => {
        if (!toastRoot) initToastContainer();
        const id = generateId();
        toasts.push({ id, variant: 'warning', message, ...options });
        notifyListeners();
        return id;
    },

    /**
     * Afficher un toast d'information
     */
    info: (message, options = {}) => {
        if (!toastRoot) initToastContainer();
        const id = generateId();
        toasts.push({ id, variant: 'info', message, ...options });
        notifyListeners();
        return id;
    },

    /**
     * Supprimer un toast par son ID
     */
    remove: (id) => {
        toasts = toasts.filter((t) => t.id !== id);
        notifyListeners();
    },

    /**
     * Vider tous les toasts
     */
    clear: () => {
        toasts = [];
        notifyListeners();
    },
};

export default toast;
