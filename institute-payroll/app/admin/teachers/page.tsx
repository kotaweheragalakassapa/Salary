"use client";

import { useEffect, useState } from "react";
import { getTeachers, createTeacher, deleteTeacher } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Plus, Settings, Users, ArrowRight, UserPlus, Phone, Trash2, Award } from "lucide-react";
import { AnimatedBackground } from "@/components/VisualEffects/AnimatedBackground";
import { GlassCard } from "@/components/VisualEffects/GlassCard";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/VisualEffects/PageTransitions";
import { motion } from "framer-motion";

interface Teacher {
    id: number;
    name: string;
    phone: string;
    image?: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [newName, setNewName] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getTeachers().then(setTeachers);
    }, []);

    const addTeacher = async () => {
        if (!newName) return;
        setLoading(true);
        try {
            const saved = await createTeacher({ name: newName, phone: newPhone });
            if (saved) {
                setTeachers([...teachers, saved]);
                setNewName("");
                setNewPhone("");
            }
        } catch (e) {
            alert("Failed to add teacher");
        }
        setLoading(false);
    };

    const handleDeleteTeacher = async (id: number) => {
        if (!confirm("Are you sure you want to delete this teacher? This will remove all their payment records!")) return;
        const success = await deleteTeacher(id);
        if (success) {
            setTeachers(teachers.filter(t => t.id !== id));
        } else {
            alert("Failed to delete teacher. They might have active records or rates.");
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden">
            <AnimatedBackground />
            <Navbar />

            <PageTransition>
                <div className="container mx-auto py-12 px-6 max-w-7xl">
                    <div className="mb-16">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">Faculty <span className="text-blue-600">Core</span></h1>
                        <p className="text-slate-500 text-xl font-medium max-w-2xl leading-relaxed">
                            Organize your teaching staff and manage their global access and commission profiles from a centralized hub.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-12">
                        {/* Registration Panel */}
                        <div className="lg:col-span-4">
                            <GlassCard className="p-8 sticky top-32 overflow-hidden border-white/60 shadow-2xl">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <UserPlus className="h-32 w-32" />
                                </div>

                                <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                    <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    Register Faculty
                                </h2>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
                                        <div className="relative group">
                                            <Input
                                                placeholder="e.g. Dr. John Doe"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                className="h-14 bg-white/50 border-2 border-white/20 focus:border-blue-600 rounded-2xl px-6 transition-all font-medium text-slate-900"
                                            />
                                            <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Intelligence</label>
                                        <div className="relative group">
                                            <Input
                                                placeholder="+94 ..."
                                                value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)}
                                                className="h-14 bg-white/50 border-2 border-white/20 focus:border-blue-600 rounded-2xl px-6 transition-all font-medium text-slate-900"
                                            />
                                            <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                            <Phone className="absolute right-4 top-4 h-5 w-5 text-slate-300" />
                                        </div>
                                    </div>

                                    <Button
                                        className="w-full h-16 text-lg font-black rounded-2xl shadow-xl shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98] bg-slate-900 hover:bg-slate-800 text-white group"
                                        onClick={addTeacher}
                                        disabled={loading || !newName}
                                    >
                                        {loading ? "Registering..." : (
                                            <div className="flex items-center gap-2">
                                                Enlist Member <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </GlassCard>
                        </div>

                        {/* Inventory Panel */}
                        <div className="lg:col-span-8">
                            {teachers.length === 0 ? (
                                <GlassCard className="flex flex-col items-center justify-center py-40 border-dashed border-4 border-white/60">
                                    <div className="bg-slate-100 p-8 rounded-full mb-8 animate-pulse">
                                        <Users className="h-16 w-16 text-slate-300" />
                                    </div>
                                    <p className="text-3xl font-black text-slate-900 opacity-20 uppercase tracking-widest">No Active Faculty</p>
                                    <p className="text-slate-400 font-bold mt-2">Initialize directory by adding members.</p>
                                </GlassCard>
                            ) : (
                                <StaggerContainer>
                                    <div className="grid gap-6">
                                        {teachers.map((teacher, index) => (
                                            <StaggerItem key={teacher.id}>
                                                <GlassCard className="p-2 border-white/40 group hover:shadow-2xl transition-all duration-500 overflow-hidden">
                                                    <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                                                        <div className="flex items-center gap-8">
                                                            <div className="relative">
                                                                <div className="h-24 w-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] flex items-center justify-center text-3xl font-black text-white shadow-2xl relative z-10 overflow-hidden transform group-hover:rotate-6 transition-transform duration-500">
                                                                    {teacher.image ? (
                                                                        <img src={teacher.image} alt={teacher.name || "Teacher"} className="h-full w-full object-cover" />
                                                                    ) : (
                                                                        teacher.name?.charAt(0) || "?"
                                                                    )}
                                                                </div>
                                                                <div className="absolute -inset-2 bg-blue-600/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </div>

                                                            <div>
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <h3 className="font-black text-3xl text-slate-900 tracking-tight leading-none">{teacher.name}</h3>
                                                                    <Award className="h-5 w-5 text-blue-500 opacity-50" />
                                                                </div>
                                                                <div className="flex items-center gap-4">
                                                                    <div className="flex items-center gap-2 text-sm font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full uppercase tracking-tighter">
                                                                        <Phone className="h-3 w-3" /> {teacher.phone || "No Contact"}
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Global Access Enabled
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-3 w-full md:w-auto">
                                                            <Link href={`/admin/teachers/details?id=${teacher.id}`} className="flex-1 md:flex-none">
                                                                <Button variant="outline" className="w-full md:w-auto bg-white/80 border-slate-100 hover:border-slate-900 rounded-2xl h-14 px-10 font-black text-slate-900 flex items-center gap-2 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-xl group-hover:shadow-slate-200 transition-all duration-300">
                                                                    <Settings className="h-5 w-5" /> Manage
                                                                </Button>
                                                            </Link>
                                                            <Button
                                                                variant="ghost"
                                                                className="h-14 w-14 rounded-2xl text-red-500 hover:text-white hover:bg-red-500 shadow-sm border border-transparent hover:border-red-600 transition-all duration-300"
                                                                onClick={() => handleDeleteTeacher(teacher.id)}
                                                            >
                                                                <Trash2 className="h-6 w-6" />
                                                            </Button>
                                                        </div>
                                                    </div>

                                                    {/* Decorative background number */}
                                                    <div className="absolute -right-4 -bottom-10 text-[120px] font-black text-slate-900/[0.03] select-none pointer-events-none group-hover:text-blue-600/[0.05] transition-colors">
                                                        {index + 1}
                                                    </div>
                                                </GlassCard>
                                            </StaggerItem>
                                        ))}
                                    </div>
                                </StaggerContainer>
                            )}
                        </div>
                    </div>
                </div>
            </PageTransition>
        </main>
    );
}
