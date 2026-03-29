import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

/**
 * Modal générique avec backdrop et portal
 */
export function Modal({
    isOpen = false,
    onClose,
    title,
    children,
    size = 'md',
    showClose = true,
    closeOnBackdrop = true,
    closeOnEscape = true,
    className,
}) {
    const modalRef = useRef(null);
    const previousActiveElement = useRef(null);

    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-6xl',
    };

    // Gestion du focus trap
    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement;
            if (modalRef.current) {
                modalRef.current.focus();
            }
        } else if (previousActiveElement.current) {
            previousActiveElement.current.focus();
        }
    }, [isOpen]);

    // Fermer avec Escape
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && closeOnEscape && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose, closeOnEscape]);

    // Empêcher le scroll du body
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && closeOnBackdrop) {
            onClose();
        }
    };

    return (
        <div
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
        >
            <div
                ref={modalRef}
                tabIndex={-1}
                className={cn(
                    'bg-surface rounded-xl shadow-2xl w-full animate-slideIn max-h-[90vh] overflow-hidden flex flex-col',
                    sizes[size],
                    className
                )}
            >
                {/* Header */}
                {(title || showClose) && (
                    <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
                        {title && (
                            <h2 id="modal-title" className="text-xl font-semibold text-text-primary">
                                {title}
                            </h2>
                        )}
                        {showClose && (
                            <button
                                onClick={onClose}
                                className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-hover rounded-lg transition-all"
                                aria-label="Fermer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* Contenu */}
                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>
            </div>
        </div>
    );
}

/**
 * Modal de confirmation
 */
export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Confirmer',
    message = 'Êtes-vous sûr de vouloir continuer ?',
    confirmText = 'Confirmer',
    cancelText = 'Annuler',
    variant = 'danger',
    loading = false,
}) {
    const variantStyles = {
        danger: {
            confirm: 'btn-error',
            icon: 'text-error',
        },
        warning: {
            confirm: 'btn-secondary',
            icon: 'text-warning',
        },
        info: {
            confirm: 'btn-primary',
            icon: 'text-primary',
        },
    };

    const styles = variantStyles[variant] || variantStyles.danger;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="sm"
        >
            <div className="space-y-6">
                <p className="text-text-secondary">{message}</p>

                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="btn btn-secondary"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`btn ${styles.confirm} flex items-center gap-2`}
                    >
                        {loading && (
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        )}
                        {confirmText}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default Modal;
