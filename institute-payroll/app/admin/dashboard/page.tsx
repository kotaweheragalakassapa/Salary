"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Users, BookOpen, Banknote, FileText, TrendingUp, ArrowRight, Shield, Activity, PieChart } from "lucide-react";
import { AnimatedBackground } from "@/components/VisualEffects/AnimatedBackground";
import { GlassCard } from "@/components/VisualEffects/GlassCard";
import { PageTransition, StaggerContainer, StaggerItem } from "@/components/VisualEffects/PageTransitions";

export default function DashboardPage() {
    const [stats, setStats] = useState({
        totalCollection: 0,
        grossPay: 0,
        netPay: 0,
        instituteProfit: 0,
        teacherCount: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const month = new Date().toISOString().slice(0, 7) + "-01";
                const [salaryRes, teachersRes] = await Promise.all([
                    fetch(`/api/salary?date=${month}`),
                    fetch(`/api/teachers`)
                ]);

                const salaryData = await salaryRes.json();
                const teachersData = await teachersRes.json();

                // Calculate totals from salary data
                const totals = salaryData.reduce((acc: any, curr: any) => {
                    acc.totalCollection += curr.stats.totalCollection;
                    acc.grossPay += curr.stats.grossPay;
                    acc.netPay += curr.stats.netPay;
                    acc.instituteProfit += curr.stats.instituteRetained;
                    return acc;
                }, { totalCollection: 0, grossPay: 0, netPay: 0, instituteProfit: 0 });

                setStats({
                    ...totals,
                    teacherCount: teachersData.length
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden">
            <AnimatedBackground />
            <Navbar />

            <PageTransition>
                <div className="container mx-auto py-12 px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Admin <span className="text-blue-600">Core</span></h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium flex items-center gap-2">
                                <Activity className="h-5 w-5 text-blue-500 animate-pulse" /> Global institute performance overview
                            </p>
                        </div>
                        <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-xl shadow-slate-200/50 flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Status</p>
                                <p className="text-sm font-bold text-slate-900 leading-none">System Active</p>
                            </div>
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <StaggerContainer delay={0.1}>
                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
                            <StaggerItem>
                                <GlassCard className="p-8 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <Banknote className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Revenue</h3>
                                    <div className="text-3xl font-black text-slate-900">Rs. {stats.totalCollection.toLocaleString()}</div>
                                    <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
                                        +12.5% vs last month
                                    </div>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard className="p-8 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <PieChart className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Institute Profit</h3>
                                    <div className="text-3xl font-black text-green-600">Rs. {stats.instituteProfit.toLocaleString()}</div>
                                    <div className="mt-4 flex items-center text-[10px] font-bold text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
                                        Healthy Margin
                                    </div>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard className="p-8 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <TrendingUp className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Net Payouts</h3>
                                    <div className="text-3xl font-black text-slate-900">Rs. {stats.netPay.toLocaleString()}</div>
                                    <div className="mt-4 flex items-center text-[10px] font-bold text-slate-400 bg-slate-50 w-fit px-2 py-1 rounded-full">
                                        Pay cycle: Monthly
                                    </div>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard className="p-8 group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <Users className="h-6 w-6" />
                                        </div>
                                    </div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Faculty</h3>
                                    <div className="text-3xl font-black text-slate-900">{stats.teacherCount}</div>
                                    <div className="mt-4 flex items-center text-[10px] font-bold text-blue-600 bg-blue-50 w-fit px-2 py-1 rounded-full">
                                        Active Teachers
                                    </div>
                                </GlassCard>
                            </StaggerItem>
                        </div>

                        {/* Management Grid */}
                        <div className="mb-8">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 flex items-center gap-3">
                                <span className="w-12 h-[2px] bg-slate-200"></span>
                                Core Operations
                            </h3>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <StaggerItem>
                                <GlassCard
                                    className="p-10 group cursor-pointer hover:bg-blue-600 transition-all duration-500 h-full"
                                    onClick={() => window.location.href = '/admin/teachers'}
                                >
                                    <div className="bg-blue-600 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-blue-200 group-hover:bg-white group-hover:text-blue-600 transition-colors transform group-hover:rotate-6">
                                        <Users className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-white transition-colors">Faculty Directory</h3>
                                    <p className="text-slate-500 mb-8 font-medium leading-relaxed group-hover:text-blue-100 transition-colors">
                                        Manage your teaching staff, commission rates, and track individual performance metrics.
                                    </p>
                                    <div className="flex items-center gap-2 font-black text-blue-600 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                        <span>User Directory</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard
                                    className="p-10 group cursor-pointer bg-slate-900 border-0 shadow-2xl group-hover:bg-green-600 transition-all duration-500 h-full"
                                    onClick={() => window.location.href = '/admin/salary'}
                                >
                                    <div className="bg-green-500 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-green-900/40 group-hover:bg-white group-hover:text-green-600 transition-colors transform group-hover:-rotate-6">
                                        <FileText className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">Financial Engine</h3>
                                    <p className="text-slate-400 mb-8 font-medium leading-relaxed group-hover:text-green-50 transition-colors">
                                        Generate automated salary reports, process payments, and export professional pay slips.
                                    </p>
                                    <div className="flex items-center gap-2 font-black text-green-400 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                        <span>Payroll Center</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </GlassCard>
                            </StaggerItem>

                            <StaggerItem>
                                <GlassCard
                                    className="p-10 group cursor-pointer hover:bg-purple-600 transition-all duration-500 h-full"
                                    onClick={() => window.location.href = '/admin/teacher-credentials'}
                                    gradient
                                >
                                    <div className="bg-purple-600 text-white p-4 rounded-3xl mb-8 shadow-xl shadow-purple-200 group-hover:bg-white group-hover:text-purple-600 transition-colors transform group-hover:rotate-6">
                                        <Shield className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-white transition-colors">Security & Access</h3>
                                    <p className="text-slate-500 mb-8 font-medium leading-relaxed group-hover:text-purple-100 transition-colors">
                                        Configure teacher portal permissions, manage logins, and handle password security.
                                    </p>
                                    <div className="flex items-center gap-2 font-black text-purple-600 group-hover:text-white transition-colors group-hover:translate-x-2 transition-transform">
                                        <span>Configure Access</span>
                                        <ArrowRight className="h-5 w-5" />
                                    </div>
                                </GlassCard>
                            </StaggerItem>
                        </div>
                    </StaggerContainer>
                </div>
            </PageTransition>
        </main>
    );

}
