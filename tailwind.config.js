/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'hsl(var(--color-primary))',
                'primary-hover': 'hsl(var(--color-primary-hover))',
                error: 'hsl(var(--color-error))',
                'error-hover': 'hsl(var(--color-error-hover))',
                success: 'hsl(var(--color-success))',
                warning: 'hsl(var(--color-warning))',

                background: 'hsl(var(--color-background))',
                surface: 'hsl(var(--color-surface))',
                'surface-hover': 'hsl(var(--color-surface-hover))',

                'text-primary': 'hsl(var(--color-text-primary))',
                'text-secondary': 'hsl(var(--color-text-secondary))',
                'text-muted': 'hsl(var(--color-text-muted))',

                border: 'hsl(var(--color-border))',
            },
        },
    },
    plugins: [],
};