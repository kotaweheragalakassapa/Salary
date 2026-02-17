"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-slate-50">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, -60, 0],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute top-1/2 -right-1/4 w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            />
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    x: [0, 100, 0],
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 22,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute -bottom-1/4 left-1/4 w-[700px] h-[700px] bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
            />
        </div>
    );
}
