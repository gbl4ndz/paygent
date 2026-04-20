export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`inline-flex items-center rounded-lg border border-transparent bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 hover:bg-brand-navy-700 focus:outline-none focus:ring-2 focus:ring-brand-green focus:ring-offset-2 active:bg-brand-navy-800 ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
        >
            {children}
        </button>
    );
}
