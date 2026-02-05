/**
 * SpotlightCard - A card component with grid pattern background
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside the card
 * @param {string} props.className - Additional classes for the card container
 * @param {string} props.bgColor - Background color of the card (default: white)
 * @param {boolean} props.showGrid - Whether to show grid pattern (default: true)
 */
export default function SpotlightCard({ children, className = '', bgColor = 'white', showGrid = true }) {
    return (
        <div className={`relative p-1 ${className}`}>
            {/* Card body */}
            <div
                className="relative w-full h-full rounded-[22px] p-10 md:p-14 lg:p-16 overflow-hidden z-1 flex flex-col justify-center shadow-2xl border-2"
                style={{ backgroundColor: bgColor }}
            >
                {/* Grid pattern */}
                {showGrid && (
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.06) 1px, transparent 1px)',
                            backgroundSize: '50px 50px'
                        }}
                    />
                )}

                {/* Content */}
                <div className="relative z-2">
                    {children}
                </div>
            </div>
        </div>
    );
}
