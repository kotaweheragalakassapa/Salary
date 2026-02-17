"use client";

import { useEffect, useState } from "react";
import {
    Users,
    BookOpen,
    Banknote,
    FileText,
    TrendingUp,
    ArrowRight,
    Calendar,
    DollarSign,
    LogOut
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatedBackground } from "@/components/VisualEffects/AnimatedBackground";
import { GlassCard } from "@/components/VisualEffects/GlassCard";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/VisualEffects/PageTransitions";


interface Teacher {
    id: number;
    name: string;
    phone: string;
    image?: string | null;
    classes?: Array<{
        id: number;
        name: string;
        percentage: number;
    }>;
}

interface SalaryData {
    stats: {
        totalCollection: number;
        grossPay: number;
        netPay: number;
    };
}

export default function TeacherDashboardPage() {
    const router = useRouter();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [salaryData, setSalaryData] = useState<SalaryData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teacherData = sessionStorage.getItem("teacher");
        if (teacherData) {
            const parsedTeacher = JSON.parse(teacherData);
            setTeacher(parsedTeacher);
            fetchSalaryData(parsedTeacher.id);
        } else {
            router.push("/teacher/login");
        }
    }, []);

    const fetchSalaryData = async (teacherId: number) => {
        try {
            const month = new Date().toISOString().slice(0, 7) + "-01";
            const response = await fetch(`/api/salary?date=${month}`);
            const data = await response.json();

            // Find this teacher's salary data
            const teacherSalary = data.find((item: any) => item.teacherId === teacherId);
            setSalaryData(teacherSalary || null);
        } catch (error) {
            console.error("Error fetching salary data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("teacher");
        router.push("/");
    };

    const currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <main className="relative min-h-screen overflow-hidden py-12 px-6 md:px-12">
            <AnimatedBackground />

            <PageTransition>
                <div className="container mx-auto">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                        <div className="flex items-center gap-6">
                            <StaggerContainer>
                                <StaggerItem>
                                    <div className="relative group">
                                        <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2.2rem] blur opacity-25 group-hover:opacity-100 transition duration-500 animate-pulse"></div>
                                        <div className="relative h-24 w-24 rounded-[2rem] bg-white p-1 overflow-hidden shadow-2xl">
                                            {teacher?.image ? (
                                                <img src={teacher.image} alt={teacher.name} className="h-full w-full object-cover rounded-[1.8rem]" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 text-white font-black text-4xl rounded-[1.8rem]">
                                                    {teacher?.name?.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </StaggerItem>
                            </StaggerContainer>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                                    Hello, {teacher?.name?.split(' ')[0]}! 👋
                                </h1>
                                <p className="text-slate-500 mt-1 font-bold flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500" /> {currentMonth} Performance
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-6 py-3 bg-white/60 backdrop-blur-md border border-white/50 text-slate-600 hover:text-red-600 font-bold rounded-2xl transition-all hover:bg-white shadow-xl shadow-slate-200/50 group"
                        >
                            <LogOut className="h-5 w-5 group-hover:-translate-x-1 transition-transform" /> Sign Out
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <StaggerContainer delay={0.2}>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                            <StaggerItem>
                                <GlassCard className="p-8 border-l-8 border-l-blue-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total Collection</p>
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                            <Banknote className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-1 leading-none">
                                        Rs. {salaryData?.stats.totalCollection.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold">Gross revenue generated</p>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard className="p-8 border-l-8 border-l-green-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Gross Earnings</p>
                                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-green-600 mb-1 leading-none">
                                        Rs. {salaryData?.stats.grossPay.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold">Based on commission rate</p>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard className="p-8 border-l-8 border-l-purple-500">
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Net Payment</p>
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                                            <DollarSign className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 mb-1 leading-none">
                                        Rs. {salaryData?.stats.netPay.toLocaleString() || 0}
                                    </h2>
                                    <p className="text-sm text-slate-400 font-bold">Final amount after deductions</p>
                                </GlassCard>
                            </StaggerItem>
                        </div>

                        {/* Quick Actions */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-slate-200"></span>
                                Dashboard Actions
                            </h3>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            <StaggerItem>
                                <Link href="/teacher/class_details" className="group block">
                                    <GlassCard className="p-8 h-full group-hover:bg-blue-600 transition-all duration-500">
                                        <div className="bg-blue-600 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-blue-200 group-hover:bg-white group-hover:text-blue-600 transition-colors transform group-hover:rotate-6">
                                            <BookOpen className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-white transition-colors">My Classes</h3>
                                        <p className="text-slate-500 mb-8 font-medium leading-relaxed group-hover:text-blue-100 transition-colors">
                                            Manage your teaching schedule and student attendance details.
                                        </p>
                                        <div className="flex items-center gap-2 font-black text-blue-600 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                            <span>Explore Classes</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </GlassCard>
                                </Link>
                            </StaggerItem>

                            <StaggerItem>
                                <Link href="/teacher/monthly_payment_records" className="group block">
                                    <GlassCard className="p-8 h-full bg-slate-900 border-0 shadow-2xl group-hover:bg-green-600 transition-all duration-500">
                                        <div className="bg-green-500 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-green-900/40 group-hover:bg-white group-hover:text-green-600 transition-colors transform group-hover:-rotate-6">
                                            <FileText className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-white mb-3">Pay History</h3>
                                        <p className="text-slate-400 mb-8 font-medium leading-relaxed group-hover:text-green-50 transition-colors">
                                            Access all your historical payment reports and salary slips.
                                        </p>
                                        <div className="flex items-center gap-2 font-black text-green-400 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                            <span>View Records</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </GlassCard>
                                </Link>
                            </StaggerItem>

                            <StaggerItem>
                                <Link href="/teacher/profile" className="group block">
                                    <GlassCard className="p-8 h-full group-hover:bg-purple-600 transition-all duration-500" gradient>
                                        <div className="bg-purple-600 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-purple-200 group-hover:bg-white group-hover:text-purple-600 transition-colors transform group-hover:rotate-6">
                                            <Users className="h-8 w-8" />
                                        </div>
                                        <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-white transition-colors">Portal Profile</h3>
                                        <p className="text-slate-500 mb-8 font-medium leading-relaxed group-hover:text-purple-100 transition-colors">
                                            Update your professional details and portal preferences.
                                        </p>
                                        <div className="flex items-center gap-2 font-black text-purple-600 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                            <span>Edit Profile</span>
                                            <ArrowRight className="h-5 w-5" />
                                        </div>
                                    </GlassCard>
                                </Link>
                            </StaggerItem>
                        </div>
                    </StaggerContainer>
                </div>
            </PageTransition>
        </main>
    );
}
