"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Users,
    DollarSign,
    Percent,
    ArrowLeft,
    Layers,
    Mail,
    GraduationCap,
    Info,
    Star
} from "lucide-react";
import Link from "next/link";
import { getTeacherById } from "@/lib/api-client";

interface ClassDetail {
    id: number;
    name: string;
    feePerStudent: number;
    tuteCostPerStudent: number;
    postalFeePerStudent: number;
    instituteFeePercentage: number;
}

interface TeacherRate {
    id: number;
    percentage: number;
    class: ClassDetail;
}

interface Teacher {
    id: number;
    name: string;
    rates: TeacherRate[];
}

export default function ClassDetailsPage() {
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const teacherData = sessionStorage.getItem("teacher");
        if (teacherData) {
            const parsedTeacher = JSON.parse(teacherData);
            fetchTeacherDetails(parsedTeacher.id);
        }
    }, []);

    const fetchTeacherDetails = async (teacherId: number) => {
        try {
            const data = await getTeacherById(teacherId);
            setTeacher(data as any);
        } catch (error) {
            console.error("Error fetching class details:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] pb-20">
            <div className="container mx-auto py-10 px-4 md:px-6">

                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/teacher">
                        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 gap-2 font-bold px-0">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-purple-600 rounded-2xl text-white">
                            <BookOpen className="h-8 w-8" />
                        </div>
                        My Classes
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium text-lg">
                        Overview of your assigned classes and fee structures
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-100 border-b-purple-600" />
                        <p className="text-slate-500 font-bold mt-6 text-xl tracking-tight text-center">Loading class information...</p>
                    </div>
                ) : teacher && teacher.rates && teacher.rates.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2">
                        {teacher.rates.map((rate) => (
                            <Card key={rate.id} className="group relative overflow-hidden bg-white border-0 shadow-2xl shadow-slate-200/50 hover:shadow-purple-200/50 transition-all duration-500 rounded-[2.5rem] border-t-8 border-t-purple-500">
                                <CardHeader className="p-8 pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-3xl font-black text-slate-900 tracking-tight mb-1">
                                                {rate.class.name}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 text-purple-600 bg-purple-50 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest w-fit border border-purple-100">
                                                <GraduationCap className="h-3 w-3" />
                                                Active Class
                                            </div>
                                        </div>
                                        <div className="p-4 bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white rounded-3xl transition-all duration-500 transform group-hover:rotate-6">
                                            <Layers className="h-6 w-6" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-8 pt-4">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <DetailBox
                                            icon={<Users className="h-4 w-4" />}
                                            label="Class Fee"
                                            sinhalaLabel="පන්ති ගාස්තුව"
                                            value={`Rs. ${rate.class.feePerStudent.toLocaleString()}`}
                                            subtext="per student"
                                            color="blue"
                                        />
                                        <DetailBox
                                            icon={<Percent className="h-4 w-4" />}
                                            label="Institute Fee"
                                            sinhalaLabel="ආයතන ගාස්තුව"
                                            value={`${rate.class.instituteFeePercentage}%`}
                                            subtext="of collection"
                                            color="amber"
                                        />
                                        <DetailBox
                                            icon={<Mail className="h-4 w-4" />}
                                            label="Postal Fee"
                                            sinhalaLabel="තැපැල් ගාස්තුව"
                                            value={`Rs. ${rate.class.postalFeePerStudent.toLocaleString()}`}
                                            subtext="per student"
                                            color="rose"
                                        />
                                        <DetailBox
                                            icon={<Info className="h-4 w-4" />}
                                            label="Tute Cost"
                                            sinhalaLabel="නිබන්ධන පිරිවැය"
                                            value={`Rs. ${rate.class.tuteCostPerStudent.toLocaleString()}`}
                                            subtext="per student"
                                            color="emerald"
                                        />
                                        <DetailBox
                                            icon={<Star className="h-4 w-4" />}
                                            label="Your Rate"
                                            sinhalaLabel="ඔබේ ප්‍රතිශතය"
                                            value={`${rate.percentage}%`}
                                            subtext="your share"
                                            color="indigo"
                                        />
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50">
                                        <div className="flex items-center justify-between bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl shadow-slate-200">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Teacher Earnings (හිමිකම)</p>
                                                <p className="text-2xl font-black">{rate.percentage}% Net</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-slate-400 mb-1">Deducted from gross</p>
                                                <p className="text-sm font-black text-purple-400">Fixed Cost Model</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-100">
                        <div className="bg-slate-50 p-10 rounded-[2.5rem] mb-8 border border-slate-100">
                            <BookOpen className="h-16 w-16 text-slate-200" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">No classes found</h2>
                        <p className="text-slate-500 font-medium max-w-sm text-center text-lg leading-relaxed">
                            It seems you haven't been assigned to any classes yet. Please contact the administrator.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function DetailBox({ icon, label, sinhalaLabel, value, subtext, color }: any) {
    const colorClasses: any = {
        blue: "text-blue-600 bg-blue-50 border-blue-100",
        amber: "text-amber-600 bg-amber-50 border-amber-100",
        rose: "text-rose-600 bg-rose-50 border-rose-100",
        emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
        indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    };

    return (
        <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:border-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
            <div className={`p-2 rounded-xl w-fit mb-3 border ${colorClasses[color]}`}>
                {icon}
            </div>
            <div className="mb-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-tight">{label}</p>
                <p className="text-[9px] font-bold text-slate-300 leading-tight">{sinhalaLabel}</p>
            </div>
            <p className="text-xl font-bold text-slate-900">{value}</p>
            <p className="text-[10px] font-medium text-slate-400">{subtext}</p>
        </div>
    );
}
