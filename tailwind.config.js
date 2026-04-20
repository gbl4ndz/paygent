import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                brand: {
                    navy:       '#1B3461',
                    'navy-700': '#243E73',
                    'navy-800': '#152A4E',
                    green:      '#00D084',
                    'green-600':'#00B870',
                    teal:       '#00C4B4',
                },
            },
        },
    },

    plugins: [forms],
};
