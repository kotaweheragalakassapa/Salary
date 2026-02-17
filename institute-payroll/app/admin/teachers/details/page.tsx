"use client";

import { useEffect, useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { getTeacherById, getClasses, addRate, deleteRate, addDeduction } from "@/lib/api-client";

interface Teacher {
    id: number;
    name: string;
    rates: { id: number; classId: number; percentage: number; class: { name: string } }[];
}

interface ClassModel {
    id: number;
    name: string;
}

function TeacherDetailsContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const router = useRouter();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [classes, setClasses] = useState<ClassModel[]>([]);

    const [selectedClass, setSelectedClass] = useState("");
    const [percentage, setPercentage] = useState("");
    const [loading, setLoading] = useState(false);

    // Deductions State
    const [deductionType, setDeductionType] = useState("ADVANCE");
    const [deductionAmount, setDeductionAmount] = useState("");
    const [deductionDesc, setDeductionDesc] = useState("");

    const refreshData = async () => {
        if (!id) return;
        try {
            const data = await getTeacherById(parseInt(id));
            if (data) setTeacher(data as any);
            else router.push("/admin/teachers");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            refreshData();
            getClasses().then(data => setClasses(data as any));
        }
    }, [id]);

    const handleAddRate = async () => {
        if (!selectedClass || !percentage || !teacher) return;
        setLoading(true);

        const success = await addRate({
            teacherId: teacher.id,
            classId: parseInt(selectedClass),
            percentage: parseFloat(percentage)
        });

        if (success) {
            await refreshData();
            setSelectedClass("");
            setPercentage("");
        }
        setLoading(false);
    };

    const handleAddDeduction = async () => {
        if (!deductionAmount || !teacher) return;
        setLoading(true);

        const success = await addDeduction({
            teacherId: teacher.id,
            type: deductionType,
            amount: parseFloat(deductionAmount),
            description: deductionDesc,
            date: new Date().toISOString()
        });

        if (success) {
            await refreshData();
            setDeductionAmount("");
            setDeductionDesc("");
        }
        setLoading(false);
    };

    const handleRemoveRate = async (rateId: number) => {
        if (!confirm("Remove this class from this teacher?")) return;
        setLoading(true);
        const success = await deleteRate(rateId);
        if (success) {
            await refreshData();
        }
        setLoading(false);
    };

    const editRate = (rate: any) => {
        setSelectedClass(rate.classId.toString());
        setPercentage(rate.percentage.toString());
    };

    if (!teacher) return <div className="p-10 flex justify-center items-center h-screen"><div className="animate-pulse text-2xl font-bold text-slate-400">Loading Teacher Profile...</div></div>;

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Navbar />
            <div className="container mx-auto py-10 px-4 max-w-5xl">
                <Button variant="ghost" onClick={() => router.push('/admin/teachers')} className="mb-6 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teachers
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{teacher.name}</h1>
                        <p className="text-slate-500 mt-1 flex items-center gap-2 text-lg">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Active Faculty Member
                        </p>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Add/Edit Rate Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="shadow-xl border-0 ring-1 ring-slate-200 overflow-hidden">
                            <div className="h-2 bg-blue-500" />
                            <CardHeader>
                                <CardTitle className="text-xl">Assign & Update Class</CardTitle>
                                <p className="text-xs text-slate-400">Set commission percentage for specific classes</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Class</label>
                                    <select
                                        className="w-full p-3 border rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                                        value={selectedClass}
                                        onChange={(e) => setSelectedClass(e.target.value)}
                                    >
                                        <option value="">Choose a class...</option>
                                        {classes.map(c => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Commission (%)</label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder="e.g. 80"
                                            value={percentage}
                                            onChange={(e) => setPercentage(e.target.value)}
                                            min="0" max="100"
                                            className="pl-4 pr-10 py-6 text-2xl font-bold rounded-xl border-slate-200"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xl">%</span>
                                    </div>
                                </div>
                                <Button className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98]" onClick={handleAddRate} disabled={loading || !selectedClass || !percentage}>
                                    {loading ? "Processing..." : (teacher.rates.some(r => r.classId.toString() === selectedClass) ? "Update Rate" : "Assign Class")}
                                </Button>
                                {selectedClass && (
                                    <Button variant="ghost" className="w-full text-slate-400" onClick={() => { setSelectedClass(""); setPercentage(""); }}>
                                        Clear Selection
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Existing Rates List */}
                    <div className="lg:col-span-2">
                        <Card className="shadow-xl border-0 ring-1 ring-slate-200 overflow-hidden">
                            <CardHeader className="border-b bg-white">
                                <CardTitle className="flex justify-between items-center">
                                    <span>Assigned Classes</span>
                                    <span className="text-sm px-3 py-1 bg-blue-50 text-blue-600 rounded-full">{teacher.rates.length} Classes</span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-slate-50/50">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Class Name</th>
                                                <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">Rate</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {teacher.rates.map((rate) => (
                                                <tr key={rate.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-5 font-semibold text-slate-700">{rate.class.name}</td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex justify-center">
                                                            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full font-bold text-md ring-1 ring-blue-100">
                                                                {rate.percentage}%
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right space-x-2">
                                                        <div className="flex justify-end gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="rounded-lg h-9 w-9 p-0 border-slate-200 hover:bg-white hover:text-blue-600 hover:border-blue-600 transition-all"
                                                                onClick={() => editRate(rate)}
                                                                title="Edit Rate"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="rounded-lg h-9 px-3 font-medium text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                onClick={() => handleRemoveRate(rate.id)}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                            {teacher.rates.length === 0 && (
                                                <tr>
                                                    <td colSpan={3} className="py-20 text-center text-slate-400">
                                                        No classes assigned yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile Card View for Rates */}
                                <div className="md:hidden space-y-3 p-4 bg-slate-50/30">
                                    {teacher.rates.length > 0 ? (
                                        teacher.rates.map((rate) => (
                                            <div key={rate.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-extrabold text-slate-800 text-lg">{rate.class.name}</h4>
                                                    <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1 inline-block border border-blue-100">
                                                        {rate.percentage}% Commission
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-10 w-10 p-0 rounded-xl border-slate-200"
                                                        onClick={() => editRate(rate)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-10 px-3 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 font-bold"
                                                        onClick={() => handleRemoveRate(rate.id)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-12 text-center text-slate-400 text-sm font-bold uppercase tracking-wider">
                                            No classes assigned
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TeacherDetailsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <TeacherDetailsContent />
        </Suspense>
    );
}
