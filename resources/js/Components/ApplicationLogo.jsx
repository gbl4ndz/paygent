export default function ApplicationLogo({ className = '' }) {
    return (
        <svg className={className} viewBox="0 0 52 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="pg-grad" x1="4" y1="38" x2="44" y2="68" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#00C4B4" />
                    <stop offset="1" stopColor="#00D084" />
                </linearGradient>
            </defs>
            {/* Navy bowl of P (fill-rule evenodd punches out inner hollow) */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 2 L4 38 L14 38 Q44 38 44 20 Q44 2 14 2 Z M14 10 L14 30 Q36 30 36 20 Q36 10 14 10 Z"
                fill="#1B3461"
            />
            {/* Gradient ribbon — stem + swooping tail */}
            <path
                d="M4 38 L4 64 C6 70 14 70 20 66 L32 56 C42 48 42 40 30 38 Z"
                fill="url(#pg-grad)"
            />
        </svg>
    );
}
