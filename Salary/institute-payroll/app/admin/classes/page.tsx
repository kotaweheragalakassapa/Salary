"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";

interface ClassModel {
    id: number;
    name: string;
    feePerStudent?: number;
    instituteFeePercentage?: number;
}

export default function ClassesPage() {
    const [classes, setClasses] = useState<ClassModel[]>([]);
    const [newClass, setNewClass] = useState("");
    const [feePerStudent, setFeePerStudent] = useState("");
    const [instituteFee, setInstituteFee] = useState("");
    const [loading, setLoading] = useState(false);
    const [editingClassId, setEditingClassId] = useState<number | null>(null);

    useEffect(() => {
        fetch("/api/classes")
            .then((res) => res.json())
            .then((data) => setClasses(data));
    }, []);

    const addClass = async () => {
        if (!newClass || !feePerStudent) {
            alert("Please enter class name and fee per student");
            return;
        }
        setLoading(true);

        const payload = {
            name: newClass,
            feePerStudent: parseFloat(feePerStudent) || 0,
            instituteFeePercentage: parseFloat(instituteFee) || 0
        };

        if (editingClassId) {
            // Update existing class
            const res = await fetch("/api/classes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...payload, id: editingClassId }),
            });

            if (res.ok) {
                const updated = await res.json();
                setClasses(classes.map(c => c.id === editingClassId ? updated : c));
                resetForm();
            } else {
                alert("Failed to update class");
            }
        } else {
            // Create new class
            const res = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const saved = await res.json();
            setClasses([...classes, saved]);
            resetForm();
        }
        setLoading(false);
    };

    const resetForm = () => {
        setNewClass("");
        setFeePerStudent("");
        setInstituteFee("");
        setEditingClassId(null);
    };

    const startEditing = (c: ClassModel) => {
        setNewClass(c.name);
        setFeePerStudent(c.feePerStudent?.toString() || "");
        setInstituteFee(c.instituteFeePercentage?.toString() || "");
        setEditingClassId(c.id);
    };

    const deleteClass = async (id: number) => {
        if (!confirm("Are you sure you want to delete this class? This may fail if it's assigned to teachers.")) return;
        const res = await fetch(`/api/classes?id=${id}`, { method: "DELETE" });
        if (res.ok) {
            setClasses(classes.filter((c) => c.id !== id));
        } else {
            alert("Failed to delete class. It might have active collections or rates.");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />
            <div className="container mx-auto py-12 px-6 max-w-5xl">
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Manage Classes</h1>
                    <p className="text-slate-500 mt-2 text-lg">Configure class details and per-student fee structure.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Add New Class Form */}
                    <Card className="border-0 shadow-2xl shadow-blue-100 rounded-[2rem] overflow-hidden">
                        <div className="h-2 bg-blue-600" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-black text-slate-800">
                                {editingClassId ? "Edit Class" : "Add New Class"}
                            </CardTitle>
                            <p className="text-slate-500 text-sm mt-1">
                                {editingClassId ? "Update class details" : "Set up student-based fee structure"}
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Class Name</label>
                                <Input
                                    placeholder="e.g. Prachina Sinhala"
                                    value={newClass}
                                    onChange={(e) => setNewClass(e.target.value)}
                                    className="py-6 rounded-2xl border-slate-100 focus:ring-blue-500 transition-all shadow-sm"
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-blue-500 uppercase tracking-widest ml-1">
                                        💰 Fee Per Student (Rs)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="1000"
                                        value={feePerStudent}
                                        onChange={(e) => setFeePerStudent(e.target.value)}
                                        className="py-6 rounded-2xl border-blue-100 focus:ring-blue-500 transition-all shadow-sm text-lg font-bold"
                                        step="0.01"
                                    />
                                    <p className="text-xs text-slate-400 ml-1">Amount collected from each student</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-rose-500 uppercase tracking-widest ml-1">
                                        🏫 Institute Fee (%)
                                    </label>
                                    <Input
                                        type="number"
                                        placeholder="20"
                                        value={instituteFee}
                                        onChange={(e) => setInstituteFee(e.target.value)}
                                        className="py-6 rounded-2xl border-rose-100 focus:ring-rose-500 transition-all shadow-sm text-lg font-bold"
                                        step="0.01"
                                        max="100"
                                        min="0"
                                    />
                                    <p className="text-xs text-slate-400 ml-1">Percentage deducted from total collection</p>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                {editingClassId && (
                                    <Button
                                        onClick={resetForm}
                                        variant="outline"
                                        className="py-7 text-lg font-bold rounded-2xl w-1/3"
                                    >
                                        Cancel
                                    </Button>
                                )}
                                <Button
                                    onClick={addClass}
                                    disabled={loading || !newClass || !feePerStudent}
                                    className={`py-7 text-lg font-bold rounded-2xl shadow-xl transition-all active:scale-[0.98] ${editingClassId ? 'w-2/3 bg-green-600 hover:bg-green-700 shadow-green-200' : 'w-full shadow-blue-200 hover:shadow-blue-300'}`}
                                >
                                    {loading ? (editingClassId ? "Updating..." : "Creating...") : (editingClassId ? "Update Class" : "Create Class")}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Existing Classes List */}
                    <Card className="border-0 shadow-2xl shadow-slate-100 rounded-[2rem] overflow-hidden">
                        <div className="h-2 bg-slate-900" />
                        <CardHeader>
                            <CardTitle className="text-2xl font-black text-slate-800">Existing Classes</CardTitle>
                            <p className="text-slate-500 text-sm mt-1">{classes.length} {classes.length === 1 ? 'class' : 'classes'} configured</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                {classes.map((c) => (
                                    <div key={c.id} className="p-6 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-extrabold text-xl text-slate-900">{c.name}</h3>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-all rounded-xl opacity-0 group-hover:opacity-100"
                                                    onClick={() => startEditing(c)}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all rounded-xl"
                                                    onClick={() => deleteClass(c.id)}
                                                >
                                                    🗑️ Delete
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Fee/Student</p>
                                                <p className="text-lg font-black text-blue-600 mt-1">Rs. {c.feePerStudent?.toLocaleString() || 0}</p>
                                            </div>
                                            <div className="bg-rose-50 p-3 rounded-xl border border-rose-100 text-center">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Inst. Fee</p>
                                                <p className="text-lg font-black text-rose-600 mt-1">{c.instituteFeePercentage || 0}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {classes.length === 0 && (
                                    <div className="text-center py-20 text-slate-300">
                                        <p className="text-xl font-black uppercase tracking-widest opacity-20">No classes yet</p>
                                        <p className="text-sm mt-2">Create your first class to get started</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

