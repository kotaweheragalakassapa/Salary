"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, BookOpen, FilePieChart, Settings, LogOut, Menu, X, LogIn } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        // Simple client-side auth check
        const admin = sessionStorage.getItem("admin");
        const staff = sessionStorage.getItem("staff");

        if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
            if (!admin) {
                router.push("/admin/login");
            }
        }

        if (pathname.startsWith("/staff") && pathname !== "/staff/login") {
            if (!staff) {
                router.push("/staff/login");
            }
        }
    }, [pathname, router]);

    const handleLogout = () => {
        sessionStorage.clear();
        router.push("/");
    };

    const navItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Faculty", href: "/admin/teachers", icon: Users },
        { name: "Classes", href: "/admin/classes", icon: BookOpen },
        { name: "Analytics", href: "/admin/reports", icon: FilePieChart },
    ];

    return (
        <nav className="sticky top-6 z-50 w-full px-6 mb-6">
            <div className="container mx-auto">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/admin/dashboard" className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative bg-white p-1.5 rounded-xl shadow-lg group-hover:rotate-6 transition-transform duration-300">
                                    <img src="/uploads/logo.png" alt="Nexus" className="h-8 w-8 object-contain" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-black text-2xl tracking-tighter text-slate-900 block leading-none">NEXUS</span>
                                <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase opacity-80">Institute</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
                                            isActive
                                                ? "bg-slate-900 text-white shadow-xl shadow-slate-200"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                                        )}
                                    >
                                        <Icon className={cn("h-4 w-4", isActive ? "text-blue-400" : "")} />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href={pathname.startsWith("/admin") ? "/staff/collection" : "/admin/dashboard"}
                            className="hidden lg:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
                        >
                            <Settings className="h-4 w-4" /> {pathname.startsWith("/admin") ? "Operations" : "Administration"}
                        </Link>
                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                                    {pathname.startsWith("/admin") ? "Administrator" : "Operations Staff"}
                                </p>
                                <p className="text-sm font-bold text-slate-900 leading-none">
                                    {pathname.startsWith("/admin") ? "Nexus Admin" : "Nexus Staff"}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="h-11 w-11 bg-slate-900 group-hover:bg-blue-600 text-white rounded-2xl flex items-center justify-center transition-all shadow-xl shadow-slate-200 active:scale-90"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Drawer */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute left-6 right-6 top-28 z-40 md:hidden"
                        >
                            <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-6 overflow-hidden relative">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Settings className="h-32 w-32" />
                                </div>

                                <div className="space-y-2 relative z-10">
                                    {navItems.map((item) => {
                                        const Icon = item.icon;
                                        const isActive = pathname === item.href;
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setIsMenuOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-2xl text-lg font-black transition-all duration-300",
                                                    isActive
                                                        ? "bg-slate-900 text-white shadow-xl"
                                                        : "text-slate-500 hover:bg-slate-50"
                                                )}
                                            >
                                                <div className={cn("p-2 rounded-xl", isActive ? "bg-white/10" : "bg-slate-100")}>
                                                    <Icon className="h-6 w-6" />
                                                </div>
                                                {item.name}
                                            </Link>
                                        );
                                    })}

                                    <div className="pt-6 mt-6 border-t border-slate-100">
                                        <Link
                                            href="/staff/collection"
                                            onClick={() => setIsMenuOpen(false)}
                                            className="flex items-center gap-4 p-4 rounded-2xl text-lg font-black text-blue-600 bg-blue-50/50"
                                        >
                                            <div className="p-2 bg-blue-600 text-white rounded-xl">
                                                <Settings className="h-6 w-6" />
                                            </div>
                                            Collection Center
                                        </Link>

                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl text-lg font-black text-rose-600 bg-rose-50/50 mt-2"
                                        >
                                            <div className="p-2 bg-rose-600 text-white rounded-xl">
                                                <LogOut className="h-6 w-6" />
                                            </div>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}

