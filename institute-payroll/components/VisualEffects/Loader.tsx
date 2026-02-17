"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Loader() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 4000); // 6 seconds splash screen
        return () => clearTimeout(timer);
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
                >
                    <div className="relative flex flex-col items-center gap-6 p-8">
                        {/* Company Logo */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: [0.8, 1.05, 1], opacity: 1 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="relative w-32 h-32 flex items-center justify-center mb-4"
                        >
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                            <Image
                                src={`${process.env.BASE_PATH || ''}/uploads/Dev-logo.png`}
                                alt="GK Software Developers"
                                width={128}
                                height={128}
                                className="relative z-10 object-contain drop-shadow-2xl"
                                priority
                            />
                        </motion.div>

                        {/* Text Content */}
                        <div className="text-center space-y-2">
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500"
                            >
                                lording the Fully automated System
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="text-muted-foreground font-medium"
                            >
                                Create By
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="text-primary font-bold text-lg"
                            >
                                Ven K Kassapa

                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2, duration: 0.5 }}
                                className="text-primary font-bold text-lg"
                            >

                                GK Software Developers
                            </motion.p>
                        </div>

                        {/* Loading Bar */}
                        <div className="w-64 h-1.5 bg-secondary rounded-full overflow-hidden mt-4">
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: "100%" }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full bg-primary"
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
