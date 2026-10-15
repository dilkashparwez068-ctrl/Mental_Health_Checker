"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function FloatingPaths({
    position,
    strokeWidth = 1.4,
    className = "text-zinc-300 dark:text-zinc-200",
}: {
    position: number;
    strokeWidth?: number;
    className?: string;
}) {
    const paths = Array.from({ length: 24 }, (_, i) => {
        const x_val = 380 - i * 14 * position;
        const y_val = 190 + i * 16;
        const x0 = -x_val;
        const y0 = -y_val;
        const cx1 = -(312 - i * 12 * position);
        const cy1 = 216 - i * 8;
        const cx2 = 152 - i * 10 * position;
        const cy2 = 343 - i * 8;
        const cx3 = 616 - i * 8 * position;
        const cy3 = 470 - i * 6;
        const x1 = 684 - i * 8 * position;
        const y1 = 875 - i * 6;

        return {
            id: i,
            d: `M${x0} ${y0}C${x0} ${y0} ${cx1} ${cy1} ${cx2} ${cy2}C${cx3} ${cy3} ${x1} ${y1} ${x1} ${y1}`,
            width: strokeWidth + (i % 3) * 0.2,
        };
    });

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className={`w-full h-full ${className}`}
                viewBox="-500 -350 1350 1250"
                preserveAspectRatio="none"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.28 + (path.id / 24) * 0.28}
                        initial={{ pathLength: 0.35, opacity: 0.4 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.35, 0.75, 0.35],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + (path.id % 6) * 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
}: {
    title?: string;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-neutral-900 to-neutral-700/80 
                                        dark:from-white dark:to-white/80"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    <div
                        className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                    >
                        <Button
                            variant="ghost"
                            className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                            text-black dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
                        >
                            <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                Discover Excellence
                            </span>
                            <span
                                className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                transition-all duration-300"
                            >
                                →
                            </span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default BackgroundPaths;
