import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Lock, MapPin, ArrowRight, CheckCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { checkoutService } from '../../utils/api';
import { formatPrice, getProductImage } from '../../utils/cn';
import { Button } from '../../components/ui/Button';
import toast from '../../utils/toast';

export function Checkout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, loading: cartLoading, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const { items = [], total_cents = 0 } = cart || {};

    const [step, setStep] = useState(1);
    const [processing, setProcessing] = useState(false);

    // Form states
    const [address, setAddress] = useState({
        full_name: '',
        address: '',
        city: '',
        postal_code: '',
        country: 'Mali',
        phone: '',
    });

    const [payment, setPayment] = useState({
        card_number: '',
        card_holder: '',
        expiry_month: '',
        expiry_year: '',
        cvv: '',
    });

    const [errors, setErrors] = useState({});
    const [completedSteps, setCompletedSteps] = useState([]);

    // Rediriger vers login si non connecté avec un panier non vide
    useEffect(() => {
        if (!isAuthenticated && items.length > 0) {
            navigate('/login', {
                state: { from: location.pathname },
                replace: true,
            });
        }
    }, [isAuthenticated, items.length, navigate, location]);

    const subtotal = total_cents;
    const shipping = subtotal > 0 ? 990 : 0;
    const total = subtotal + shipping;

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setPayment((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: null }));
    };

    const validateAddress = () => {
        const newErrors = {};
        if (!address.full_name.trim()) newErrors.full_name = 'Le nom est requis';
        if (!address.address.trim()) newErrors.address = 'L\'adresse est requise';
        if (!address.city.trim()) newErrors.city = 'La ville est requise';
        if (!address.postal_code.trim()) newErrors.postal_code = 'Le code postal est requis';
        if (!address.phone.trim()) newErrors.phone = 'Le téléphone est requis';
        if (!/^[\d\s]+$/.test(address.phone) || address.phone.length < 10) {
            newErrors.phone = 'Numéro de téléphone invalide';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const validatePayment = () => {
        const newErrors = {};

        // Format carte bancaire (pour démo)
        const cardNumber = payment.card_number.replace(/\s/g, '');
        if (!cardNumber || cardNumber.length < 16) {
            newErrors.card_number = 'Numéro de carte invalide';
        }
        if (!payment.card_holder.trim()) newErrors.card_holder = 'Le titulaire est requis';
        if (!payment.expiry_month || !payment.expiry_year) {
            newErrors.expiry_month = 'Date d\'expiration requise';
        }
        if (!payment.cvv || payment.cvv.length < 3) {
            newErrors.cvv = 'CVV invalide';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (step === 1 && validateAddress()) {
            setCompletedSteps([...completedSteps, 1]);
            setStep(2);
        } else if (step === 2 && validatePayment()) {
            setCompletedSteps([...completedSteps, 2]);
            setStep(3);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmitOrder = async () => {
        setProcessing(true);
        try {
            const response = await checkoutService.checkout({
                shipping_address: address,
                payment_method: 'card',
            });

            const orderData = response.data?.data || {};
            await clearCart();

            // Success - redirect
            toast.success('Commande passée avec succès !');
            setTimeout(() => {
                navigate('/order/success', {
                    state: {
                        orderNumber: orderData.order_number,
                        total_cents: orderData.total_cents,
                        items: orderData.items,
                        shippingAddress: address,
                    },
                });
            }, 500);
        } catch (error) {
            setProcessing(false);
            const message = error.response?.data?.message || 'Erreur lors de la commande';
            toast.error(message);
        }
    };

    const steps = [
        { number: 1, title: 'Livraison', icon: MapPin },
        { number: 2, title: 'Paiement', icon: CreditCard },
        { number: 3, title: 'Confirmation', icon: CheckCircle },
    ];

    if (cartLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse-custom">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                        <svg className="h-6 w-6 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-4">Votre panier est vide</p>
                    <Link to="/shop" className="btn btn-primary">
                        Découvrir la boutique
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fadeIn pb-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-text-primary mb-2">Finaliser la commande</h1>
                <p className="text-text-secondary">Complétez les étapes ci-dessous pour passer votre commande</p>
            </div>

            {/* Steps indicator */}
            <div className="flex items-center justify-center mb-8">
                {steps.map((s, index) => {
                    const Icon = s.icon;
                    const isCompleted = completedSteps.includes(s.number);
                    const isCurrent = step === s.number;

                    return (
                        <div key={s.number} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                        isCompleted
                                            ? 'bg-success text-white'
                                            : isCurrent
                                            ? 'bg-primary text-white ring-4 ring-primary/20'
                                            : 'bg-surface-hover text-text-muted'
                                    }`}
                                >
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                </div>
                                <span className="mt-2 text-sm font-medium hidden sm:block">
                                    {s.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`w-16 sm:w-24 h-1 mx-2 ${
                                        isCompleted ? 'bg-success' : 'bg-border'
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Steps */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Step 1: Livraison */}
                    {step === 1 && (
                        <div className="card p-6 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Adresse de livraison
                            </h2>
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Nom complet
                                        </label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            value={address.full_name}
                                            onChange={handleAddressChange}
                                            className="input"
                                        />
                                        {errors.full_name && (
                                            <p className="mt-1 text-sm text-error">{errors.full_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Téléphone
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={address.phone}
                                            onChange={handleAddressChange}
                                            placeholder="06 12 34 56 78"
                                            className="input"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-error">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-primary mb-2">
                                        Adresse
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={address.address}
                                        onChange={handleAddressChange}
                                        placeholder="123 rue de la Paix"
                                        className="input"
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-error">{errors.address}</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Code postal
                                        </label>
                                        <input
                                            type="text"
                                            name="postal_code"
                                            value={address.postal_code}
                                            onChange={handleAddressChange}
                                            placeholder="75001"
                                            className="input"
                                        />
                                        {errors.postal_code && (
                                            <p className="mt-1 text-sm text-error">{errors.postal_code}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Ville
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={address.city}
                                            onChange={handleAddressChange}
                                            placeholder="Paris"
                                            className="input"
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-error">{errors.city}</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Pays
                                        </label>
                                        <select
                                            name="country"
                                            value={address.country}
                                            onChange={handleAddressChange}
                                            className="input"
                                        >
                                            <option value="Mali">Mali</option>
                                            <option value="Guinée">Guinée</option>
                                            <option value="Sénégal">Sénégal</option>
                                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                            <option value="Burkina Faso">Burkina Faso</option>
                                            <option value="Niger">Niger</option>
                                            <option value="Autre">Autre</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={() => navigate('/cart')}>
                                    Retour
                                </Button>
                                <Button onClick={handleNext}>
                                    Continuer
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Paiement */}
                    {step === 2 && (
                        <div className="card p-6 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Informations de paiement
                            </h2>

                            {/* Carte bancaire */}
                            <div className="bg-surface-hover rounded-lg p-4 mb-6">
                                <div className="space-y-4">
                                    {/* Numéro de carte */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Numéro de carte
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="card_number"
                                                value={payment.card_number}
                                                onChange={handlePaymentChange}
                                                placeholder="4242 4242 4242 4242"
                                                maxLength={19}
                                                className="input !pl-12"
                                            />
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        </div>
                                        {errors.card_number && (
                                            <p className="mt-1 text-sm text-error">{errors.card_number}</p>
                                        )}
                                    </div>

                                    {/* Titulaire et date */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Titulaire
                                            </label>
                                            <input
                                                type="text"
                                                name="card_holder"
                                                value={payment.card_holder}
                                                onChange={handlePaymentChange}
                                                placeholder="CHRISTOPHE BOLI"
                                                className="input"
                                            />
                                            {errors.card_holder && (
                                                <p className="mt-1 text-sm text-error">{errors.card_holder}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Expiration
                                            </label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    name="expiry_month"
                                                    value={payment.expiry_month}
                                                    onChange={handlePaymentChange}
                                                    placeholder="MM"
                                                    maxLength={2}
                                                    className="input text-center"
                                                />
                                                <span className="text-text-muted self-center">/</span>
                                                <input
                                                    type="text"
                                                    name="expiry_year"
                                                    value={payment.expiry_year}
                                                    onChange={handlePaymentChange}
                                                    placeholder="AA"
                                                    maxLength={2}
                                                    className="input text-center"
                                                />
                                            </div>
                                            {errors.expiry_month && (
                                                <p className="mt-1 text-sm text-error">{errors.expiry_month}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* CVV */}
                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            CVV
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                name="cvv"
                                                value={payment.cvv}
                                                onChange={handlePaymentChange}
                                                placeholder="123"
                                                maxLength={4}
                                                className="input !pl-12"
                                            />
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                                        </div>
                                        {errors.cvv && (
                                            <p className="mt-1 text-sm text-error">{errors.cvv}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Note de sécurité */}
                            <div className="flex items-start gap-2 text-xs text-text-secondary bg-primary/5 p-3 rounded-lg">
                                <Lock className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <p>
                                    Cette est une simulation de paiement. Aucune transaction réelle ne sera effectuée.
                                    En production, utilisez un service de paiement sécurisé comme Stripe.
                                </p>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={handleBack}>
                                    Retour
                                </Button>
                                <Button onClick={handleNext}>
                                    Continuer
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 3 && (
                        <div className="card p-6 animate-fadeIn">
                            <h2 className="text-lg font-semibold text-text-primary mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Vérifier votre commande
                            </h2>

                            {/* Récapitulatif */}
                            <div className="space-y-4 mb-6">
                                <div className="bg-surface-hover rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-text-primary mb-3">
                                        Adresse de livraison
                                    </h3>
                                    <div className="text-sm text-text-secondary space-y-1">
                                        <p>{address.full_name}</p>
                                        <p>{address.address}</p>
                                        <p>
                                            {address.postal_code} {address.city}
                                        </p>
                                        <p>{address.country}</p>
                                    </div>
                                </div>

                                <div className="bg-surface-hover rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-text-primary mb-3">
                                        Moyen de paiement
                                    </h3>
                                    <div className="text-sm text-text-secondary">
                                        Carte terminant par {payment.card_number?.slice(-4) || '****'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <Button variant="ghost" onClick={handleBack}>
                                    Modifier
                                </Button>
                                <Button onClick={handleSubmitOrder} disabled={processing}>
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Traitement...
                                        </>
                                    ) : (
                                        <>
                                            Confirmer la commande
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="card p-6 sticky top-24">
                        <h2 className="text-lg font-semibold text-text-primary mb-6">
                            Résumé de commande
                        </h2>

                        {/* Items */}
                        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                            {items.map((item, index) => (
                                <div key={`${item.product_id || index}-${index}`} className="flex items-start gap-3">
                                    <img
                                        src={getProductImage(item.image_url, item.name, 40)}
                                        alt={item.name}
                                        className="w-10 h-10 rounded object-cover flex-shrink-0"
                                        onError={(e) => {
                                            e.target.src = getProductImage(null, item.name, 40);
                                        }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-text-primary line-clamp-1">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-text-secondary">
                                            Quantité: {item.quantity}
                                        </p>
                                    </div>
                                    <span className="text-sm font-medium text-text-primary">
                                        {formatPrice(item.line_total_cents)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totaux */}
                        <div className="space-y-3 pt-4 border-t border-border">
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Sous-total</span>
                                <span className="font-medium text-text-primary">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-text-secondary">Livraison</span>
                                <span className="font-medium text-text-primary">
                                    {formatPrice(shipping)}
                                </span>
                            </div>
                            <div className="flex justify-between text-sm text-text-muted">
                                <span>Taxes estimées (incl.)</span>
                                <span>
                                    {formatPrice(Math.round(subtotal * 0.2 / 100) * 100)}
                                </span>
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="flex justify-between">
                                    <span className="text-lg font-semibold text-text-primary">Total</span>
                                    <span className="text-2xl font-bold text-primary">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Sécurité */}
                        <div className="mt-6 pt-6 border-t border-border text-center">
                            <p className="text-xs text-text-muted flex items-center justify-center gap-2">
                                <Lock className="w-4 h-4" />
                                Paiement sécurisé SSL 256-bit
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
