"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, BookOpen, User, CreditCard, LogOut, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface TeacherNavbarProps {
    teacherName?: string;
    teacherImage?: string | null;
}

export function TeacherNavbar({ teacherName, teacherImage }: TeacherNavbarProps) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        sessionStorage.removeItem("teacher");
        window.location.href = "/teacher/login";
    };

    const navItems = [
        { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
        { name: "My Classes", href: "/teacher/class_details", icon: BookOpen },
        { name: "Profile", href: "/teacher/profile", icon: User },
        { name: "Payments", href: "/teacher/monthly_payment_records", icon: CreditCard },
    ];

    return (
        <nav className="sticky top-6 z-50 w-full px-6 mb-6">
            <div className="container mx-auto">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[2rem] px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-10">
                        <Link href="/teacher" className="flex items-center gap-4 group">
                            <div className="relative">
                                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative bg-white p-1.5 rounded-xl shadow-lg group-hover:-rotate-6 transition-transform duration-300">
                                    <img src="/uploads/logo.png" alt="Nexus" className="h-8 w-8 object-contain" />
                                </div>
                            </div>
                            <div className="hidden sm:block">
                                <span className="font-black text-2xl tracking-tighter text-slate-900 block leading-none uppercase">Faculty</span>
                                <span className="text-[10px] font-black text-blue-600 tracking-[0.3em] uppercase opacity-80">Portal</span>
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
                        {teacherName && (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-slate-900 leading-none">{teacherName}</p>
                                </div>
                                <div className="h-10 w-10 bg-slate-100 rounded-xl overflow-hidden border-2 border-white shadow-lg relative group">
                                    {teacherImage ? (
                                        <img src={teacherImage} alt={teacherName} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black">
                                            {teacherName?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="h-8 w-[1px] bg-slate-200 hidden sm:block mx-1" />
                        <button
                            onClick={handleLogout}
                            className="hidden md:flex items-center gap-2 text-xs font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all uppercase tracking-widest text-nowrap"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden lg:block">Sign Out</span>
                        </button>

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
                                    <User className="h-32 w-32" />
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
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-4 w-full p-4 rounded-2xl text-lg font-black text-red-500 bg-red-50/50"
                                        >
                                            <div className="p-2 bg-red-600 text-white rounded-xl">
                                                <LogOut className="h-6 w-6" />
                                            </div>
                                            Secure Logout
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
