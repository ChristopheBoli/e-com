import { cn } from '../../utils/cn';

export const Card = ({ className, children, ...props }) => {
    return (
        <div className={cn('card', className)} {...props}>
            {children}
        </div>
    );
};

export const CardHeader = ({ className, children, ...props }) => {
    return (
        <div className={cn('card-header', className)} {...props}>
            {children}
        </div>
    );
};

export const CardTitle = ({ className, children, ...props }) => {
    return (
        <h3 className={cn('card-title', className)} {...props}>
            {children}
        </h3>
    );
};

export const CardContent = ({ className, children, ...props }) => {
    return (
        <div className={cn('card-content', className)} {...props}>
            {children}
        </div>
    );
};

export const CardFooter = ({ className, children, ...props }) => {
    return (
        <div className={cn('card-footer', className)} {...props}>
            {children}
        </div>
    );
};
