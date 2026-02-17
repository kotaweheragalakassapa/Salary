"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}

export function GlassCard({ children, className, gradient = false, ...props }: GlassCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={cn(
                "relative overflow-hidden rounded-[2rem] border border-white/40 bg-white/60 backdrop-blur-xl shadow-xl transition-all duration-300",
                gradient && "after:absolute after:inset-0 after:bg-gradient-to-br after:from-blue-500/5 after:to-purple-500/5 after:pointer-events-none",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
