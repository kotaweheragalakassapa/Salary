"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { FileText, Printer } from "lucide-react";
import Link from "next/link";

interface SalaryRecord {
    teacher: { id: number; name: string };
    stats: {
        totalCollection: number;
        grossPay: number;
        totalDeductions: number;
        netPay: number;
        instituteRetained: number;
    };
}

export default function SalaryPage() {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [salaries, setSalaries] = useState<SalaryRecord[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSalaries = async () => {
        setLoading(true);
        // Send 01 as day to satisfy date parsing
        const dateQuery = `${month}-01`;
        try {
            const res = await fetch(`/api/salary?date=${dateQuery}`);
            const data = await res.json();
            setSalaries(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalaries();
    }, [month]);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="container mx-auto py-12 px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full">
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Payroll Processing</h1>
                            <p className="text-slate-500 mt-2 text-lg">Calculate earnings and generate teacher pay slips.</p>
                        </div>
                        <Link href={`/admin/salary/print?month=${month}`} target="_blank">
                            <Button className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl h-14 px-8 font-black flex items-center gap-3 shadow-xl shadow-blue-200 transition-all active:scale-95">
                                <Printer className="h-5 w-5" /> Download All Slips (PDF)
                            </Button>
                        </Link>
                    </div>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-[1.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
                        <Input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-44 border-0 bg-slate-50 focus-visible:ring-0 font-bold text-slate-700 rounded-xl"
                        />
                        <Button
                            onClick={fetchSalaries}
                            disabled={loading}
                            className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 font-bold transition-all active:scale-95"
                        >
                            {loading ? "Calculating..." : "Update View"}
                        </Button>
                    </div>
                </div>

                <Card className="border-0 shadow-2xl shadow-slate-200/60 rounded-[2.5rem] overflow-hidden bg-white">
                    <CardContent className="p-0">
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-8 py-6 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Faculty Member</th>
                                        <th className="px-6 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Gross Collection</th>
                                        <th className="px-6 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Teacher Share</th>
                                        <th className="px-6 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Deductions</th>
                                        <th className="px-6 py-6 text-right text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Net Payable</th>
                                        <th className="px-8 py-6 text-center text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {salaries.map((record) => (
                                        <tr key={record.teacher.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                                        {record.teacher.name?.charAt(0) || "?"}
                                                    </div>
                                                    <span className="font-bold text-slate-900 text-base">{record.teacher.name || "Unknown Teacher"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-right font-medium text-slate-500">Rs. {record.stats.totalCollection.toLocaleString()}</td>
                                            <td className="px-6 py-6 text-right font-bold text-blue-600">Rs. {record.stats.grossPay.toLocaleString()}</td>
                                            <td className="px-6 py-6 text-right font-bold text-red-400">Rs. {record.stats.totalDeductions.toLocaleString()}</td>
                                            <td className="px-6 py-6 text-right">
                                                <div className="inline-block px-4 py-2 bg-slate-900 rounded-2xl text-white font-black text-lg shadow-lg shadow-slate-200">
                                                    Rs. {record.stats.netPay.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <Link
                                                    href={`/admin/salary/print?teacherId=${record.teacher.id}&month=${month}`}
                                                    target="_blank"
                                                >
                                                    <Button className="rounded-xl h-11 px-5 border-2 border-slate-900 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-white font-bold flex items-center gap-2 transition-all">
                                                        <Printer className="h-4 w-4" /> View Slip
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {salaries.length === 0 && !loading && (
                                        <tr>
                                            <td colSpan={6} className="text-center py-24">
                                                <div className="flex flex-col items-center gap-4 text-slate-300">
                                                    <FileText className="h-16 w-16 opacity-10" />
                                                    <p className="text-xl font-black uppercase tracking-widest opacity-20">No data for this period</p>
                                                    <p className="font-medium text-slate-400">Adjust the month filter to view records.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile Card View for Salaries */}
                        <div className="md:hidden space-y-4 p-4 bg-slate-50/20">
                            {salaries.length > 0 ? (
                                salaries.map((record) => (
                                    <div key={record.teacher.id} className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                                    {record.teacher.name?.charAt(0) || "?"}
                                                </div>
                                                <span className="font-bold text-slate-900 text-lg">{record.teacher.name || "Unknown Teacher"}</span>
                                            </div>
                                            <Link href={`/admin/salary/print?teacherId=${record.teacher.id}&month=${month}`} target="_blank">
                                                <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-slate-200">
                                                    <Printer className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Gross Pay</span>
                                                <span className="font-bold text-blue-600">Rs. {record.stats.grossPay.toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-slate-500 font-medium">Deductions</span>
                                                <span className="font-bold text-red-400">Rs. {record.stats.totalDeductions.toLocaleString()}</span>
                                            </div>
                                            <div className="pt-3 border-t border-slate-50 flex justify-between items-center mt-2">
                                                <span className="font-black text-xs uppercase tracking-widest text-slate-400">Net Payable</span>
                                                <span className="bg-slate-900 text-white px-4 py-1.5 rounded-xl font-black text-base shadow-lg shadow-slate-200">
                                                    Rs. {record.stats.netPay.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                !loading && (
                                    <div className="text-center py-12">
                                        <div className="flex flex-col items-center gap-4 text-slate-300">
                                            <FileText className="h-12 w-12 opacity-10" />
                                            <p className="text-sm font-black uppercase tracking-widest opacity-40">No records found</p>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );

}
