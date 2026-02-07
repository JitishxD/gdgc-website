import { motion } from 'motion/react';

// Olympic color pattern: Blue, Yellow, Black, Green, Red (repeating)
const OLYMPIC_COLORS = ['#0085C7', '#F4C300', '#000000', '#009F3D', '#DF0024'];


const GoogleOlympicsHeading = ({ show = false, className = '' }) => {
    // Split into two lines: GOOGLE and OLYMPICS
    const lines = ['GOOGLE', 'OLYMPICS'];
    const getLetterColor = (index) => {
        return OLYMPIC_COLORS[index % OLYMPIC_COLORS.length];
    };

    // Container variants for animation
    const containerVariants = {
        hidden: { 
            opacity: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.60,
                staggerChildren: 0.015,
            },
        },
    };

    // Individual letter variants
    const letterVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.92,
            y: 16,
        },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                type: 'spring',
                damping: 18,
                stiffness: 320,
                mass: 0.7,
            },
        },
    };

    return (
        <motion.div
            className={`flex flex-wrap justify-center items-center select-none pointer-events-none ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate={show ? 'visible' : 'hidden'}
        >
            {lines.map((line, lineIndex) => (
                <div key={lineIndex} className="w-full flex justify-center">
                    {line.split('').map((letter, index) => {
                        // Calculate global letter index for color cycling
                        const globalIndex = index + (lineIndex === 1 ? lines[0].length : 0);
                        if (letter === ' ') {
                            return (
                                <span 
                                    key={index} 
                                    className="inline-block w-4 md:w-6 lg:w-8"
                                    aria-hidden="true"
                                />
                            );
                        }
                        return (
                            <motion.span
                                key={index}
                                variants={letterVariants}
                                className="inline-block"
                                style={{
                                    fontFamily: 'Fredericka the Great, cursive',
                                    color: getLetterColor(globalIndex),
                                    textShadow: `
                                        2px 2px 4px rgba(0, 0, 0, 0.3),
                                        0 0 8px rgba(255, 255, 255, 0.5),
                                        0 0 20px rgba(255, 255, 255, 0.3)
                                    `,
                                    fontSize: 'clamp(4rem, 8vw, 6rem)',
                                    lineHeight: 1.1,
                                    fontWeight: 700,
                                }}
                            >
                                {letter}
                            </motion.span>
                        );
                    })}
                </div>
            ))}
        </motion.div>
    );
};

export default GoogleOlympicsHeading;
