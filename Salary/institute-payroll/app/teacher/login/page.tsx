"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Phone, LogIn, Loader2, ArrowLeft, ShieldCheck, Key } from "lucide-react";
import { motion } from "framer-motion";
import { AnimatedBackground } from "@/components/VisualEffects/AnimatedBackground";
import { GlassCard } from "@/components/VisualEffects/GlassCard";
import { PageTransition } from "@/components/VisualEffects/PageTransitions";

export default function TeacherLoginPage() {
    const router = useRouter();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch("/api/teacher/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, phone }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login failed");
                setLoading(false);
                return;
            }

            sessionStorage.setItem("teacher", JSON.stringify(data));
            router.push("/teacher");
        } catch (err) {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
            <AnimatedBackground />

            <PageTransition>
                <div className="w-full max-w-md">
                    {/* Brand Section */}
                    <div className="flex flex-col items-center mb-10">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white p-4 rounded-3xl shadow-2xl ring-1 ring-slate-100 mb-6"
                        >
                            <img src="/uploads/logo.png" alt="Nexus Institute" className="h-16 w-auto" />
                        </motion.div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter text-center leading-tight">
                            Teacher <span className="text-blue-600">Portal</span>
                        </h2>
                        <p className="text-slate-500 font-bold mt-2 text-sm uppercase tracking-widest">Secure Faculty Access</p>
                    </div>

                    <GlassCard className="p-8 md:p-10 shadow-2xl border-white/40">
                        <form onSubmit={handleLogin} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2"
                                >
                                    <ShieldCheck className="h-4 w-4" />
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <User className="h-3 w-3 text-blue-500" /> Authorized Name
                                </label>
                                <div className="relative group">
                                    <Input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="h-14 bg-white/50 border-2 border-white/20 focus:border-blue-500 rounded-2xl px-6 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                                    <Key className="h-3 w-3 text-purple-500" /> Access Key
                                </label>
                                <div className="relative group">
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                        className="h-14 bg-white/50 border-2 border-white/20 focus:border-purple-500 rounded-2xl px-6 transition-all font-medium text-slate-900 placeholder:text-slate-400"
                                        disabled={loading}
                                    />
                                    <div className="absolute inset-0 rounded-2xl ring-2 ring-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black text-base rounded-2xl shadow-2xl transition-all active:scale-[0.98] group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity" />
                                {loading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        Authorize & Enter <LogIn className="h-5 w-5" />
                                    </div>
                                )}
                            </Button>

                            <button
                                type="button"
                                onClick={() => router.push("/")}
                                className="w-full flex items-center justify-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors pt-4"
                            >
                                <ArrowLeft className="h-4 w-4" /> Cancel & Return
                            </button>
                        </form>
                    </GlassCard>
                </div>
            </PageTransition>
        </main>
    );
}
