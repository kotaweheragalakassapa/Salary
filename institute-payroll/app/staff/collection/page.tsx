"use client";

import { useEffect, useState } from "react";
import { getTeachers, getDailyCollections, addDailyCollection, updateDailyCollection, deleteDailyCollection } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { useRouter } from "next/navigation";
import { Trash2, Edit2, History } from "lucide-react";

interface Teacher {
    id: number;
    name: string;
    rates: { classId: number; class: { id: number; name: string; feePerStudent: number } }[];
}

interface Collection {
    id: number;
    date: string;
    teacherId: number;
    classId: number;
    studentCount: number;
    amount: number;
    tuteCostPerStudent: number;
    postalFeePerStudent: number;
    teacher: { name: string };
    class: { name: string; feePerStudent: number };
}

export default function CollectionPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [selectedTeacher, setSelectedTeacher] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [studentCount, setStudentCount] = useState<string>("");
    const [tuteCostPerStudent, setTuteCostPerStudent] = useState<string>("");
    const [postalFeePerStudent, setPostalFeePerStudent] = useState<string>("");
    const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);

    const router = useRouter();

    const fetchData = async () => {
        try {
            const [teachersData, collectionsData] = await Promise.all([
                getTeachers(),
                getDailyCollections()
            ]);
            // Force cast to match local interface - in real app, align types properly
            setTeachers(teachersData as any);
            setCollections(collectionsData as any);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setSelectedTeacher("");
        setSelectedClass("");
        setStudentCount("");
        setTuteCostPerStudent("");
        setPostalFeePerStudent("");
        setDate(new Date().toISOString().split("T")[0]);
        setEditingId(null);
        setMessage("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        if (!selectedTeacher || !selectedClass || !studentCount) {
            setMessage("Please fill all fields");
            setLoading(false);
            return;
        }

        const teacher = teachers.find(t => t.id.toString() === selectedTeacher);
        const classRate = teacher?.rates.find(r => r.classId.toString() === selectedClass);
        const feePerStudent = classRate?.class.feePerStudent || 0;
        const calculatedAmount = feePerStudent * parseInt(studentCount);

        const basePayload = {
            date: date,
            teacherId: parseInt(selectedTeacher),
            classId: parseInt(selectedClass),
            studentCount: parseInt(studentCount),
            amount: calculatedAmount,
            tuteCostPerStudent: parseFloat(tuteCostPerStudent) || 0,
            postalFeePerStudent: parseFloat(postalFeePerStudent) || 0,
        };

        try {
            let success = false;

            if (editingId) {
                const updated = await updateDailyCollection(editingId, basePayload);
                success = !!updated;
                if (success) setMessage("Collection Updated!");
            } else {
                const saved = await addDailyCollection(basePayload);
                success = !!saved;
                if (success) setMessage("Collection Saved!");
            }

            if (success) {
                resetForm();
                fetchData();
            } else {
                setMessage("Failed to save.");
            }
        } catch (error) {
            setMessage("Error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (c: Collection) => {
        setEditingId(c.id);
        setDate(new Date(c.date).toISOString().split("T")[0]);
        setSelectedTeacher(c.teacherId.toString());
        setSelectedClass(c.classId.toString());
        setStudentCount(c.studentCount.toString());
        setTuteCostPerStudent(c.tuteCostPerStudent.toString());
        setPostalFeePerStudent(c.postalFeePerStudent.toString());
        setMessage("");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;
        try {
            const success = await deleteDailyCollection(id);
            if (success) {
                fetchData();
            } else {
                alert("Failed to delete.");
            }
        } catch (err) {
            alert("Error deleting.");
        }
    };

    // Filter classes based on selected teacher
    const availableClasses = selectedTeacher
        ? teachers.find((t) => t.id.toString() === selectedTeacher)?.rates.map((r) => r.class) || []
        : [];

    // Get selected class details for display
    const selectedClassDetails = availableClasses.find(c => c.id.toString() === selectedClass);
    const calculatedTotal = selectedClassDetails && studentCount
        ? selectedClassDetails.feePerStudent * parseInt(studentCount)
        : 0;

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="container max-w-5xl mx-auto py-12 px-6">
                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Entry Form */}
                    <div>
                        <Card className="border-0 shadow-2xl shadow-slate-200 rounded-[2.5rem] overflow-hidden sticky top-12">
                            <div className={`h-3 ${editingId ? 'bg-orange-500' : 'bg-gradient-to-r from-blue-600 to-green-500'}`} />
                            <CardHeader className="pb-4">
                                <CardTitle className="text-3xl font-black text-center text-slate-900">
                                    {editingId ? "Edit Collection" : "Daily Collection Entry"}
                                </CardTitle>
                                <p className="text-center text-sm text-slate-500 font-medium mt-2">
                                    {editingId ? "Update existing attendance record" : "Record student attendance and fees"}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">📅 Date</label>
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            required
                                            className="py-6 rounded-2xl border-slate-100 focus:ring-blue-500 transition-all shadow-sm text-lg font-bold"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">👨‍🏫 Teacher</label>
                                        <select
                                            className="w-full p-4 border rounded-2xl bg-white text-lg font-bold border-slate-100 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                                            value={selectedTeacher}
                                            onChange={(e) => {
                                                setSelectedTeacher(e.target.value);
                                                setSelectedClass("");
                                                setStudentCount("");
                                            }}
                                            required
                                        >
                                            <option value="">Select Teacher</option>
                                            {teachers.map((t) => (
                                                <option key={t.id} value={t.id}>
                                                    {t.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">📚 Class</label>
                                        <select
                                            className="w-full p-4 border rounded-2xl bg-white text-lg font-bold border-slate-100 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-400 transition-all shadow-sm"
                                            value={selectedClass}
                                            onChange={(e) => {
                                                setSelectedClass(e.target.value);
                                                setStudentCount("");
                                            }}
                                            disabled={!selectedTeacher}
                                            required
                                        >
                                            <option value="">Select Class</option>
                                            {availableClasses.length > 0 ? (
                                                availableClasses.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.name} (Rs. {c.feePerStudent}/student)
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>No classes assigned</option>
                                            )}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-green-500 uppercase tracking-widest ml-1">👥 Number of Students Present</label>
                                        <Input
                                            type="number"
                                            placeholder="e.g. 20"
                                            value={studentCount}
                                            onChange={(e) => setStudentCount(e.target.value)}
                                            min="0"
                                            step="1"
                                            required
                                            disabled={!selectedClass}
                                            className="py-8 rounded-2xl border-green-100 focus:ring-green-500 transition-all shadow-sm text-3xl font-black text-center text-green-600"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-orange-500 uppercase tracking-widest ml-1">📄 Tute Cost (per student)</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={tuteCostPerStudent}
                                                onChange={(e) => setTuteCostPerStudent(e.target.value)}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={!selectedClass}
                                                className="py-6 rounded-2xl border-orange-100 focus:ring-orange-500 transition-all shadow-sm text-lg font-black text-center text-orange-600"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">📮 Postal Fee (per student)</label>
                                            <Input
                                                type="number"
                                                placeholder="0.00"
                                                value={postalFeePerStudent}
                                                onChange={(e) => setPostalFeePerStudent(e.target.value)}
                                                min="0"
                                                step="0.01"
                                                required
                                                disabled={!selectedClass}
                                                className="py-6 rounded-2xl border-blue-100 focus:ring-blue-500 transition-all shadow-sm text-lg font-black text-center text-blue-600"
                                            />
                                        </div>
                                    </div>

                                    {calculatedTotal > 0 && (
                                        <div className="p-6 bg-slate-900 rounded-[2rem] text-center">
                                            <p className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-2">Total Collection</p>
                                            <p className="text-5xl font-black text-white tracking-tight">Rs. {calculatedTotal.toLocaleString()}</p>
                                        </div>
                                    )}

                                    {message && (
                                        <div className={`p-4 rounded-2xl text-center font-bold ${message.includes("Success") || message.includes("Updated") || message.includes("Saved") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                            {message}
                                        </div>
                                    )}

                                    <div className="flex gap-3">
                                        {editingId && (
                                            <Button type="button" variant="outline" onClick={resetForm} className="py-8 rounded-2xl font-bold flex-1 border-2">
                                                Cancel
                                            </Button>
                                        )}
                                        <Button type="submit" className={`py-8 rounded-2xl shadow-xl transition-all font-black flex-[2] ${editingId ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`} disabled={loading}>
                                            {loading ? "Saving..." : editingId ? "Update Entry" : "💾 Save Collection"}
                                        </Button>
                                    </div>

                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent History */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 ml-2">
                            <History className="text-slate-400 h-6 w-6" />
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Recent Entries</h2>
                        </div>

                        <div className="space-y-4 max-h-[85vh] overflow-y-auto pr-2 pb-10">
                            {collections.map((c) => (
                                <Card key={c.id} className="border-0 shadow-lg shadow-slate-200/50 rounded-3xl overflow-hidden group hover:shadow-xl transition-all">
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                                                    {new Date(c.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </p>
                                                <h3 className="text-lg font-black text-slate-800 leading-tight mt-1">{c.class.name}</h3>
                                                <p className="text-sm text-slate-500 font-bold">{c.teacher.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xl font-black text-blue-600">Rs. {c.amount.toLocaleString()}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{c.studentCount} Students</p>
                                                <div className="flex flex-col gap-0.5 mt-1">
                                                    <p className="text-[10px] font-bold text-orange-500 whitespace-nowrap">Tute: Rs. {c.tuteCostPerStudent}/ea</p>
                                                    <p className="text-[10px] font-bold text-blue-500 whitespace-nowrap">Mail: Rs. {c.postalFeePerStudent}/ea</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2 pt-3 border-t border-slate-50">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                                                onClick={() => handleEdit(c)}
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50"
                                                onClick={() => handleDelete(c.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                            {collections.length === 0 && (
                                <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                                    <p className="text-slate-300 font-black uppercase tracking-widest text-sm">No recent entries</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


