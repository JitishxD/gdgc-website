import {
    useRef,
    useEffect,
    useState,
    Children,
    cloneElement,
    isValidElement,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Size presets
const SIZE_CLASSES = {
    sm: "h-[60vh]",
    md: "h-[70vh]",
    lg: "h-[80vh]",
    xl: "h-[85vh]",
    "2xl": "h-[90vh]",
};

const SIZE_VALUES = {
    sm: 70,
    md: 80,
    lg: 85,
    xl: 90,
    "2xl": 95,
};

const DEFAULT_GAP_VW = 5;

// Utility functions
const getCardWidthVw = (cardSize) => SIZE_VALUES[cardSize] || SIZE_VALUES.lg;
const getInitialOffset = (cardWidthVw) => (100 - cardWidthVw) / 2;

// CardMainSectionDesktop component using GSAP ScrollTrigger
export default function CardMainSectionDesktop({
    children,
    bgColor = "transparent",
    cardSize = "lg",
    scaleLastCard = false,
    lastCardInitialScale = 0.15,
}) {
    const containerRef = useRef(null);
    const trackRef = useRef(null);
    const sectionRef = useRef(null);
    const cardRefs = useRef([]);
    const lastCardInnerRef = useRef(null);
    const [contentOpacity, setContentOpacity] = useState(0);
    const childArray = Children.toArray(children);

    const cardWidthVw = getCardWidthVw(cardSize);
    const cardHeightVh = SIZE_VALUES[cardSize] || 90;
    const gapVw = DEFAULT_GAP_VW;
    const initialOffset = getInitialOffset(cardWidthVw);

    // Calculate scroll distance for horizontal movement (in vw)
    const getScrollDistanceVw = () => {
        const totalCardsWidth = childArray.length * cardWidthVw;
        const totalGapsWidth = (childArray.length - 1) * gapVw;
        const totalPadding = initialOffset * 2;
        return totalCardsWidth + totalGapsWidth + totalPadding - 100; // subtract viewport width (100vw)
    };

    // Calculate full screen scale
    const getFullScreenScale = () => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const cardWidth = (cardWidthVw / 100) * viewportWidth;
        const cardHeight = (cardHeightVh / 100) * viewportHeight;
        const scaleForWidth = viewportWidth / cardWidth;
        const scaleForHeight = viewportHeight / cardHeight;
        return Math.max(scaleForWidth, scaleForHeight);
    };

    useEffect(() => {
        const container = containerRef.current;
        const track = trackRef.current;
        const section = sectionRef.current;
        const lastCard = cardRefs.current[childArray.length - 1];
        const lastCardInner = lastCardInnerRef.current;

        if (!container || !track || !section) return;

        // Calculate total scroll distance for horizontal movement
        const getScrollWidth = () => {
            return Math.max(0, track.scrollWidth - window.innerWidth);
        };

        // Create context for cleanup
        const ctx = gsap.context(() => {
            const scrollWidth = getScrollWidth();
            const scaleDistance = scaleLastCard ? window.innerHeight * 2 : 0;
            const totalDistance = scrollWidth + scaleDistance;

            if (totalDistance <= 0) return;

            // Set initial states
            gsap.set(track, { x: 0 });
            cardRefs.current.forEach((card, index) => {
                if (!card) return;
                const isLast = index === childArray.length - 1;
                if (scaleLastCard && isLast) {
                    gsap.set(card, { scale: lastCardInitialScale });
                } else {
                    gsap.set(card, { scale: 1 });
                }
            });
            if (lastCardInner) {
                gsap.set(lastCardInner, { borderRadius: "24px" });
            }

            // Create main timeline with TWO phases
            const mainTL = gsap.timeline({ paused: true });

            // Calculate durations based on scroll distances
            const phase1Duration = scrollWidth / totalDistance; // Horizontal scroll phase
            const phase2Duration = scaleDistance / totalDistance; // Scale phase

            // PHASE 1: Horizontal scroll only (last card stays small but comes into view)
            mainTL.to(
                track,
                {
                    x: -scrollWidth,
                    ease: "none",
                    duration: phase1Duration,
                },
                0,
            );

            // PHASE 2: Scale last card from small to full screen (after horizontal scroll completes)
            if (scaleLastCard && lastCard) {
                mainTL.to(
                    lastCard,
                    {
                        scale: getFullScreenScale(),
                        ease: "power2.out",
                        duration: phase2Duration,
                    },
                    phase1Duration,
                ); // Start after phase 1
            }

            // Border radius animation during phase 2
            if (scaleLastCard && lastCardInner) {
                mainTL.to(
                    lastCardInner,
                    {
                        borderRadius: "0px",
                        ease: "power2.out",
                        duration: phase2Duration,
                    },
                    phase1Duration,
                ); // Start after phase 1
            }

            // Single ScrollTrigger
            ScrollTrigger.create({
                trigger: container,
                start: "top top",
                end: () => `+=${totalDistance}`,
                pin: section,
                pinSpacing: false,
                scrub: 0.5,
                animation: mainTL,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Content opacity - starts revealing during phase 2 (after horizontal scroll)
                    if (scaleLastCard) {
                        // Phase 1 ends at phase1Duration of total progress
                        const phase2Start = phase1Duration;
                        if (progress >= phase2Start) {
                            // In phase 2 - reveal content
                            const phase2Progress =
                                (progress - phase2Start) / phase2Duration;
                            const opacityProgress = Math.min(
                                1,
                                phase2Progress * 2,
                            ); // Reveal in first half of phase 2
                            setContentOpacity(opacityProgress);
                        } else {
                            // In phase 1 - content hidden
                            setContentOpacity(0);
                        }
                    }

                    // Scale non-last cards based on position
                    const viewportCenter = window.innerWidth / 2;
                    cardRefs.current.forEach((card, index) => {
                        if (!card) return;
                        const isLast = index === childArray.length - 1;

                        if (!isLast) {
                            const rect = card.getBoundingClientRect();
                            const cardCenter = rect.left + rect.width / 2;
                            const distance = Math.abs(
                                viewportCenter - cardCenter,
                            );
                            const maxDistance =
                                window.innerWidth / 2 + rect.width / 2;
                            const proximity =
                                1 - Math.min(1, distance / maxDistance);
                            const scale = 0.8 + proximity * 0.2;
                            gsap.set(card, { scale: scale });
                        }
                    });
                },
            });
        }, container);

        // Handle resize
        const handleResize = () => {
            ScrollTrigger.refresh();
        };
        window.addEventListener("resize", handleResize);

        return () => {
            ctx.revert();
            window.removeEventListener("resize", handleResize);
        };
    }, [
        childArray.length,
        cardWidthVw,
        cardHeightVh,
        scaleLastCard,
        lastCardInitialScale,
    ]);

    // Calculate container height for scroll - horizontal scroll + scale phase
    const scrollDistanceVw = getScrollDistanceVw();
    const scalePhaseHeight = scaleLastCard ? 200 : 0; // vh for scaling animation
    const containerHeight = `calc(100vh + ${scrollDistanceVw}vw + ${scalePhaseHeight}vh)`;

    return (
        <div
            ref={containerRef}
            style={{ height: containerHeight, position: "relative", zIndex: 2 }}
        >
            <section
                ref={sectionRef}
                className="h-screen flex items-center overflow-hidden"
                style={{ backgroundColor: bgColor }}
            >
                <div
                    ref={trackRef}
                    className="flex flex-row items-center will-change-transform"
                    style={{
                        gap: `${gapVw}vw`,
                        paddingLeft: `${initialOffset}vw`,
                        paddingRight: `${initialOffset}vw`,
                    }}
                >
                    {childArray.map((child, index) => {
                        const isLastCard = index === childArray.length - 1;
                        const renderedChild =
                            scaleLastCard && isLastCard && isValidElement(child)
                                ? cloneElement(child, { contentOpacity })
                                : child;

                        return (
                            <div
                                key={index}
                                ref={(el) => (cardRefs.current[index] = el)}
                                className={`${SIZE_CLASSES[cardSize]} shrink-0 will-change-transform`}
                                style={{
                                    width: `${cardWidthVw}vw`,
                                    transformOrigin: "center center",
                                }}
                            >
                                {scaleLastCard && isLastCard ? (
                                    <div
                                        ref={lastCardInnerRef}
                                        className="w-full h-full overflow-hidden"
                                        style={{ borderRadius: "24px" }}
                                    >
                                        {renderedChild}
                                    </div>
                                ) : (
                                    child
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
