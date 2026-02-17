"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Banknote,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FileText,
    History,
    Layers,
    Receipt,
    TrendingDown,
    TrendingUp,
    Printer,
    DollarSign,
    ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { format, addMonths, subMonths, startOfMonth } from "date-fns";

interface DetailByClass {
    className: string;
    totalCollection: number;
    totalStudents: number;
    feePerStudent: number;
    tuteCostPerStudent: number;
    postalFeePerStudent: number;
    instituteFeePercentage: number;
    totalTuteCost: number;
    totalPostalFee: number;
    totalInstituteFee: number;
    grossPay: number;
}

interface DeductionDetail {
    type: string;
    amount: number;
    date: string;
    description: string;
}

interface TeacherSalaryData {
    teacher: {
        id: number;
        name: string;
    };
    stats: {
        totalCollection: number;
        totalStudents: number;
        grossPay: number;
        totalTuteCost: number;
        totalPostalFee: number;
        totalInstituteFee: number;
        automaticDeductions: number;
        manualDeductions: number;
        totalDeductions: number;
        netPay: number;
    };
    details: {
        byClass: DetailByClass[];
        deductions: DeductionDetail[];
    };
}

export default function MonthlyPaymentRecords() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [salaryData, setSalaryData] = useState<TeacherSalaryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState<any>(null);

    useEffect(() => {
        const teacherData = sessionStorage.getItem("teacher");
        if (teacherData) {
            setTeacher(JSON.parse(teacherData));
        }
    }, []);

    useEffect(() => {
        if (teacher) {
            fetchMonthlyData(currentDate);
        }
    }, [teacher, currentDate]);

    const fetchMonthlyData = async (date: Date) => {
        setLoading(true);
        try {
            const dateStr = format(startOfMonth(date), "yyyy-MM-dd");
            const response = await fetch(`/api/salary?date=${dateStr}`);
            const data = await response.json();

            // Find the specific teacher's data
            // Checking both item.teacher.id and item.teacherId for compatibility
            const specificData = data.find((item: any) =>
                (item.teacher && item.teacher.id === teacher.id) ||
                (item.teacherId === teacher.id)
            );
            setSalaryData(specificData || null);
        } catch (error) {
            console.error("Error fetching payment records:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="container mx-auto py-10 px-4 md:px-6">

                {/* Back Button */}
                <div className="mb-8 no-print">
                    <Link href="/teacher">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2 font-bold px-0">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 no-print">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-2xl text-white">
                                <Receipt className="h-8 w-8" />
                            </div>
                            Payment Records
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium text-lg">
                            Detailed breakdown of your monthly earnings and deductions
                        </p>
                    </div>

                    <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevMonth}
                            className="text-slate-600 hover:bg-slate-50 rounded-full h-12 w-12"
                        >
                            <ChevronLeft className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-3 px-6 min-w-[200px] justify-center">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <span className="font-black text-slate-900 text-lg">
                                {format(currentDate, "MMMM yyyy")}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNextMonth}
                            className="text-slate-600 hover:bg-slate-50 rounded-full h-12 w-12"
                        >
                            <ChevronRight className="h-6 w-6" />
                        </Button>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={handlePrint}
                            className="bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-200 rounded-2xl font-bold px-8 h-14 flex gap-2 text-lg transition-all active:scale-95"
                        >
                            <Printer className="h-5 w-5" />
                            Print Report
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100">
                        <div className="relative">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-100 border-b-blue-600" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                            </div>
                        </div>
                        <p className="text-slate-500 font-bold mt-6 text-xl tracking-tight">Loading your records...</p>
                    </div>
                ) : salaryData ? (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                        {/* Summary Stats */}
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <StatCard
                                title="Gross Earnings"
                                value={salaryData.stats.grossPay}
                                icon={<TrendingUp className="h-6 w-6" />}
                                color="blue"
                                subtitle="Total before deductions"
                            />
                            <StatCard
                                title="Automatic Deductions"
                                value={salaryData.stats.automaticDeductions}
                                icon={<Layers className="h-6 w-6" />}
                                color="amber"
                                subtitle="Tute, Postal & Inst. fees"
                            />
                            <StatCard
                                title="Manual Deductions"
                                value={salaryData.stats.manualDeductions}
                                icon={<TrendingDown className="h-6 w-6" />}
                                color="rose"
                                subtitle="Advances & adjustments"
                            />
                            <StatCard
                                title="Net Payment"
                                value={salaryData.stats.netPay}
                                icon={<DollarSign className="h-6 w-6" />}
                                color="emerald"
                                subtitle="Amount to be paid"
                                primary
                            />
                        </div>

                        {/* Class Breakdown */}
                        <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2.5rem]">
                            <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-10 py-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Earnings by Class</CardTitle>
                                            <p className="text-slate-400 font-medium text-sm">Detailed performance per class</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                        {salaryData.details.byClass.length} Classes Active
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50/20">
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Class Name</th>
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-center">Students</th>
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Collection</th>
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Inst. Fee</th>
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Costs</th>
                                                <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Net Share</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {salaryData.details.byClass.map((cls, idx) => (
                                                <tr key={idx} className="hover:bg-blue-50/30 transition-all group cursor-default">
                                                    <td className="px-10 py-6">
                                                        <span className="font-black text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{cls.className}</span>
                                                    </td>
                                                    <td className="px-10 py-6 text-center font-bold text-slate-600">
                                                        <span className="bg-slate-100 px-3 py-1 rounded-lg">{cls.totalStudents}</span>
                                                    </td>
                                                    <td className="px-10 py-6 text-right font-black text-slate-900">
                                                        Rs. {cls.totalCollection.toLocaleString()}
                                                    </td>
                                                    <td className="px-10 py-6 text-right text-rose-500 font-bold whitespace-nowrap">
                                                        <div className="flex flex-col items-end">
                                                            <span>- Rs. {cls.totalInstituteFee.toLocaleString()}</span>
                                                            <span className="text-[10px] text-slate-400 uppercase tracking-widest">{cls.instituteFeePercentage}% Fee</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-10 py-6 text-right text-rose-500 font-bold whitespace-nowrap">
                                                        - Rs. {(cls.totalTuteCost + cls.totalPostalFee).toLocaleString()}
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-2xl font-black text-lg shadow-sm border border-emerald-100">
                                                            Rs. {(cls.totalCollection - cls.totalInstituteFee - cls.totalTuteCost - cls.totalPostalFee).toLocaleString()}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View for Classes */}
                                <div className="md:hidden space-y-4 p-4 bg-slate-50/30">
                                    {salaryData.details.byClass.map((cls, idx) => (
                                        <div key={idx} className="bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
                                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                                <h3 className="font-black text-slate-900 text-lg">{cls.className}</h3>
                                                <span className="bg-slate-200 text-slate-600 px-2 py-1 rounded-lg text-xs font-bold">
                                                    {cls.totalStudents} Students
                                                </span>
                                            </div>
                                            <div className="p-4 space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-500">Collection</span>
                                                    <span className="font-black text-slate-900">Rs. {cls.totalCollection.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-500">Institute Fee ({cls.instituteFeePercentage}%)</span>
                                                    <span className="font-bold text-rose-500 text-sm">- Rs. {cls.totalInstituteFee.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-slate-500">Costs (Tute/Postal)</span>
                                                    <span className="font-bold text-rose-500 text-sm">- Rs. {(cls.totalTuteCost + cls.totalPostalFee).toLocaleString()}</span>
                                                </div>
                                                <div className="pt-3 mt-1 border-t border-slate-100 flex justify-between items-center">
                                                    <span className="font-black text-xs uppercase tracking-widest text-slate-400">Net Share</span>
                                                    <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl font-black shadow-sm border border-emerald-100">
                                                        Rs. {(cls.totalCollection - cls.totalInstituteFee - cls.totalTuteCost - cls.totalPostalFee).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid lg:grid-cols-2 gap-10">
                            {/* Manual Deductions Table */}
                            <Card className="border-0 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden rounded-[2.5rem]">
                                <CardHeader className="bg-rose-50/20 border-b border-rose-100 px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                                            <TrendingDown className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black text-slate-900 tracking-tight">Other Deductions</CardTitle>
                                            <p className="text-slate-400 font-medium text-sm">Manual adjustments and advances</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="border-b border-slate-50 bg-slate-50/10">
                                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Description</th>
                                                    <th className="px-10 py-5 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50">
                                                {salaryData.details.deductions.length > 0 ? (
                                                    salaryData.details.deductions.map((d, idx) => (
                                                        <tr key={idx} className="hover:bg-rose-50/10 transition-colors">
                                                            <td className="px-10 py-5 text-slate-600 font-bold whitespace-nowrap">
                                                                {format(new Date(d.date), "MMM dd, yyyy")}
                                                            </td>
                                                            <td className="px-10 py-5">
                                                                <span className="capitalize font-black text-slate-900">{d.type}</span>
                                                                {d.description && (
                                                                    <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">{d.description}</p>
                                                                )}
                                                            </td>
                                                            <td className="px-10 py-5 text-right font-black text-rose-600 text-lg">
                                                                - Rs. {d.amount.toLocaleString()}
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={3} className="px-10 py-20 text-center">
                                                            <div className="flex flex-col items-center">
                                                                <div className="p-4 bg-slate-50 rounded-full mb-4">
                                                                    <History className="h-8 w-8 text-slate-200" />
                                                                </div>
                                                                <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No manual deductions</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Mobile Card View for Manual Deductions */}
                                    <div className="md:hidden space-y-4 p-4">
                                        {salaryData.details.deductions.length > 0 ? (
                                            salaryData.details.deductions.map((d, idx) => (
                                                <div key={idx} className="bg-white border border-rose-100 shadow-sm rounded-2xl overflow-hidden p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-400 capitalize mb-1">
                                                                {format(new Date(d.date), "MMM dd, yyyy")}
                                                            </p>
                                                            <h4 className="font-black text-slate-900 text-lg capitalize leading-tight">{d.type}</h4>
                                                        </div>
                                                        <span className="font-black text-rose-600 text-lg whitespace-nowrap">
                                                            - Rs. {d.amount.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {d.description && (
                                                        <p className="text-sm text-slate-500 font-medium mt-2 pt-2 border-t border-slate-50">
                                                            {d.description}
                                                        </p>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-10">
                                                <div className="flex flex-col items-center">
                                                    <div className="p-3 bg-slate-50 rounded-full mb-3">
                                                        <History className="h-6 w-6 text-slate-200" />
                                                    </div>
                                                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No manual deductions</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Summary Breakdown */}
                            <Card className="border-0 shadow-2xl shadow-blue-900/10 bg-slate-900 text-white overflow-hidden rounded-[2.5rem] flex flex-col justify-between">
                                <CardHeader className="bg-white/5 border-b border-white/5 px-10 py-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-blue-500 rounded-2xl shadow-xl shadow-blue-500/20">
                                            <Banknote className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-2xl font-black tracking-tight">Monthly Summary</CardTitle>
                                            <p className="text-slate-400 font-medium text-sm">Final calculation results</p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-10 py-10 flex-grow">
                                    <div className="space-y-8">
                                        <div className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Total Earnings</span>
                                                <span className="text-xl font-bold text-white transition-colors">Gross Collection</span>
                                            </div>
                                            <span className="text-2xl font-black text-white">Rs. {salaryData.stats.grossPay.toLocaleString()}</span>
                                        </div>

                                        <div className="flex justify-between items-center group">
                                            <div className="flex flex-col">
                                                <span className="text-rose-400/60 text-xs font-black uppercase tracking-[0.2em] mb-1">Deducted Costs</span>
                                                <span className="text-xl font-bold text-rose-300">Total Deductions</span>
                                            </div>
                                            <span className="text-2xl font-black text-rose-400">- Rs. {salaryData.stats.totalDeductions.toLocaleString()}</span>
                                        </div>

                                        <div className="pt-10 border-t border-white/10 mt-10">
                                            <div className="flex justify-between items-end bg-white/5 p-8 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all duration-500 group">
                                                <div>
                                                    <span className="block text-blue-400 text-sm font-black uppercase tracking-[0.3em] mb-3">Net Payout Amount</span>
                                                    <span className="text-5xl font-black text-emerald-400 tracking-tighter transition-all group-hover:scale-105 inline-block origin-left">
                                                        Rs. {salaryData.stats.netPay.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="bg-emerald-500 text-slate-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                                                        VERIFIED
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Payable for {format(currentDate, "MMMM")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                                <div className="px-10 pb-8 pt-4">
                                    <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-[0.2em]">
                                        Generated on {format(new Date(), "PPpp")}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100 animate-in fade-in zoom-in duration-500">
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] mb-8 border border-slate-100">
                            <History className="h-16 w-16 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No records found</h2>
                        <p className="text-slate-500 font-medium max-w-sm text-center text-lg leading-relaxed">
                            We couldn't find any payment records for <span className="text-slate-900 font-bold">{format(currentDate, "MMMM yyyy")}</span>. Try selecting a different month.
                        </p>
                        <Button
                            variant="outline"
                            onClick={handlePrevMonth}
                            className="mt-10 rounded-2xl border-2 px-8 h-12 font-bold hover:bg-slate-50"
                        >
                            View Previous Month
                        </Button>
                    </div>
                )}
            </div>

            <style jsx global>{`
                @media print {
                    .no-print { display: none !important; }
                    body { background: white !important; font-size: 12pt; }
                    .container { width: 100% !important; max-width: none !important; padding: 0 !important; margin: 0 !important; }
                    .shadow-xl, .shadow-2xl, .shadow-2xl { box-shadow: none !important; border: 1px solid #eee !important; }
                    .rounded-[2.5rem], .rounded-[2rem], .rounded-3xl { border-radius: 1rem !important; }
                    .bg-slate-900 { background-color: #f8fafc !important; color: #000 !important; border: 1px solid #eee !important; }
                    .text-white { color: #000 !important; }
                    .text-emerald-400 { color: #059669 !important; }
                    .text-rose-400 { color: #dc2626 !important; }
                    .bg-white\/5 { background: transparent !important; }
                    .border-white\/10 { border-color: #eee !important; }
                }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, icon, color, subtitle, primary = false }: any) {
    const colorClasses: any = {
        blue: "bg-blue-600",
        emerald: "bg-emerald-500",
        rose: "bg-rose-500",
        amber: "bg-amber-500",
    };

    const lightColorClasses: any = {
        blue: "bg-blue-50 text-blue-600 border-blue-100",
        emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
        rose: "bg-rose-50 text-rose-600 border-rose-100",
        amber: "bg-amber-50 text-amber-600 border-amber-100",
    };

    return (
        <Card className={`border-0 shadow-2xl shadow-${color}-900/5 bg-white overflow-hidden group hover:scale-[1.02] transition-all duration-500 rounded-[2.5rem] border-b-4 border-b-transparent hover:border-b-${color}-500`}>
            <div className={`h-2 ${colorClasses[color]} w-full`} />
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-8 px-8">
                <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">
                    {title}
                </CardTitle>
                <div className={`p-3 rounded-2xl transition-all duration-500 border ${lightColorClasses[color]} group-hover:scale-110 group-hover:rotate-3 shadow-sm`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent className="px-8 pb-8">
                <div className={`text-3xl font-black ${primary ? 'text-slate-900' : 'text-slate-800'} tracking-tight mb-1`}>
                    Rs. {value.toLocaleString()}
                </div>
                {subtitle && (
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
