import { useRef, useEffect, useState, Children } from "react";

/**
 * CardMainSection - A scrollable section with scroll-based scaling
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card components to render (each child = one card)
 * @param {string} props.bgColor - Background color of the section (default: #3B28CC)
 * @param {string} props.cardSize - Size preset: 'sm' | 'md' | 'lg' | 'xl' (default: 'lg')
 */
export default function CardMainSection({
    children,
    bgColor = "#3B28CC",
    cardSize = "lg",
}) {
    const cardRefs = useRef([]);
    const [scales, setScales] = useState({});
    const childArray = Children.toArray(children);

    // Size presets
    const sizeClasses = {
        sm: "w-[70vw] h-[60vh]",
        md: "w-[80vw] h-[70vh]",
        lg: "w-[85vw] h-[80vh]",
        xl: "w-[90vw] h-[85vh]",
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-5% 0px -5% 0px",
            threshold: Array.from({ length: 101 }, (_, i) => i / 100),
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const index = entry.target.dataset.cardIndex;
                const ratio = entry.intersectionRatio;

                // Scale: 0.75 (out of view) to 1 (in view)
                const minScale = 0.75;
                const maxScale = 1;
                const scale = minScale + ratio * (maxScale - minScale);

                setScales((prev) => ({ ...prev, [index]: scale }));
            });
        }, observerOptions);

        cardRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, [childArray.length]);

    return (
        <section
            className="flex flex-col items-center py-[10vh] gap-[8vh]"
            style={{ backgroundColor: bgColor }}
        >
            {childArray.map((child, index) => (
                <div
                    key={index}
                    ref={(el) => (cardRefs.current[index] = el)}
                    data-card-index={index}
                    className={`${sizeClasses[cardSize]} transition-transform duration-400 ease-out will-change-transform`}
                    style={{
                        transform: `scale(${scales[index] || 0.85})`,
                        transitionTimingFunction:
                            "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    }}
                >
                    {child}
                </div>
            ))}
        </section>
    );
}
