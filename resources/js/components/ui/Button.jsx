import { forwardRef } from 'react';
import { cn } from '../../utils/cn';

const buttonVariants = {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    error: 'btn btn-error',
    ghost: 'btn btn-ghost',
};

const buttonSizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
};

export const Button = forwardRef(({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
        <button
            ref={ref}
            className={cn(buttonVariants[variant], buttonSizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
});

Button.displayName = 'Button';
