import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({ className, error, ...props }, ref) => {
    return (
        <input
            ref={ref}
            className={cn('input', error && 'border-error focus:ring-error', className)}
            {...props}
        />
    );
});

Input.displayName = 'Input';

export const Label = ({ children, className, ...props }) => {
    return (
        <label className={cn('block text-sm font-medium text-text-primary mb-1.5', className)} {...props}>
            {children}
        </label>
    );
};

export const InputGroup = ({ label, error, children, ...props }) => {
    return (
        <div {...props}>
            {label && <Label>{label}</Label>}
            {children}
            {error && <p className="mt-1 text-xs text-error">{error}</p>}
        </div>
    );
};
