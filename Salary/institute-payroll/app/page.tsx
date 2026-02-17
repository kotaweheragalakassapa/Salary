"use client";

import Link from "next/link";
import { Users, Calculator, FileText, ArrowRight, Zap, Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/VisualEffects/AnimatedBackground";
import { GlassCard } from "@/components/VisualEffects/GlassCard";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/VisualEffects/PageTransitions";

export default function Home() {
    return (
        <main className="relative min-h-screen overflow-hidden py-12 px-6 md:px-12 lg:px-24">
            <AnimatedBackground />

            <PageTransition>
                {/* Navbar-like Header */}
                <div className="flex justify-between items-center mb-20">
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="flex items-center gap-4 group cursor-pointer"
                    >
                        <div className="relative">
                            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                            <div className="relative bg-white p-1.5 rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                <img src="/uploads/logo.png" alt="Nexus" className="h-7 w-7 object-contain" />
                            </div>
                        </div>
                        <div>
                            <span className="font-black text-2xl tracking-tighter text-slate-900 block leading-none">NEXUS</span>
                            <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase opacity-80">Institute</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="hidden md:flex items-center gap-6"
                    >
                        <Link href="/teacher/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Teacher Portal</Link>
                        <Link href="/admin/login" className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-bold shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all">Admin Access</Link>
                    </motion.div>
                </div>

                {/* Hero Section */}
                <div className="flex flex-col items-center text-center mb-24">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative mb-10"
                    >
                        <div className="absolute inset-0 bg-blue-400 blur-[100px] opacity-20 rounded-full scale-150" />
                        <div className="relative bg-white p-6 rounded-[3rem] shadow-2xl ring-1 ring-slate-100 mb-6 group transition-transform hover:scale-105 duration-500">
                            <img src="/uploads/logo.png" alt="Nexus Institute" className="h-32 w-auto drop-shadow-2xl" />
                        </div>
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-4 -right-4 bg-yellow-400 text-slate-900 p-2 rounded-2xl shadow-lg border-4 border-white"
                        >
                            <Star className="h-6 w-6 fill-current" />
                        </motion.div>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-6 leading-[0.9]">
                        Elevate Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient">Institute's Future.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 max-w-3xl font-medium leading-relaxed mb-10">
                        The ultimate <span className="text-slate-900 font-bold">Payroll & Class Management</span> ecosystem designed for modern educational excellence.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-20">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-slate-700 text-sm font-bold shadow-sm">
                            <Zap className="h-4 w-4 text-yellow-500" /> Fast Execution
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-slate-700 text-sm font-bold shadow-sm">
                            <ShieldCheck className="h-4 w-4 text-green-500" /> Secure Data
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 text-slate-700 text-sm font-bold shadow-sm">
                            <Star className="h-4 w-4 text-blue-500" /> Premium UI
                        </div>
                    </div>
                </div>

                {/* Portals Grid */}
                <StaggerContainer>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        <StaggerItem>
                            <Link href="/staff/login" className="group block h-full">
                                <GlassCard className="h-full p-8 group-hover:border-cyan-200 transition-colors duration-500">
                                    <div className="h-14 w-14 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-8 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                        <Calculator className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-cyan-600 transition-colors">Staff Portal</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        Streamlined daily collection entry and expense management for your ground operations.
                                    </p>
                                    <div className="flex items-center text-cyan-600 font-bold">
                                        Open Portal <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </GlassCard>
                            </Link>
                        </StaggerItem>

                        <StaggerItem>
                            <Link href="/teacher/login" className="group block h-full">
                                <GlassCard className="h-full p-8 group-hover:border-blue-200 transition-colors duration-500" gradient>
                                    <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                        <Users className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">Teacher Portal</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        Empower your faculty with transparent earnings, class details, and automated pay slips.
                                    </p>
                                    <div className="flex items-center text-blue-600 font-bold">
                                        Login Now <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </GlassCard>
                            </Link>
                        </StaggerItem>

                        <StaggerItem>
                            <Link href="/admin/login" className="group block h-full">
                                <GlassCard className="h-full p-8 group-hover:border-purple-200 transition-colors duration-500">
                                    <div className="h-14 w-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-8 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 shadow-inner">
                                        <FileText className="h-7 w-7" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-purple-600 transition-colors">Admin Core</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed mb-8">
                                        The control center for your entire institute. Manage teachers, rates, and payroll with precision.
                                    </p>
                                    <div className="flex items-center text-purple-600 font-bold">
                                        Launch Dashboard <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </GlassCard>
                            </Link>
                        </StaggerItem>
                    </div>
                </StaggerContainer>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 1 }}
                    className="mt-32 text-center text-slate-400 text-sm font-bold uppercase tracking-[0.3em]"
                >
                    Nexus Institute System &copy; {new Date().getFullYear()}
                </motion.div>
            </PageTransition>
        </main>
    );
}
