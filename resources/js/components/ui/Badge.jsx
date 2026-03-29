import { cn } from '../../utils/cn';

const badgeVariants = {
    primary: 'badge badge-primary',
    error: 'badge badge-error',
    success: 'badge badge-success',
    warning: 'badge badge-warning',
};

export const Badge = ({ variant = 'primary', className, children, ...props }) => {
    return (
        <span className={cn(badgeVariants[variant], className)} {...props}>
            {children}
        </span>
    );
};
