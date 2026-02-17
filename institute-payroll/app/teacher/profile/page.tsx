"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, MapPin, Camera, Save, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface TeacherData {
    id: number;
    name: string;
    phone: string;
    address?: string | null;
    image?: string | null;
}

export default function TeacherProfilePage() {
    const router = useRouter();
    const [teacher, setTeacher] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Form states
    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [image, setImage] = useState<string | null>(null);

    useEffect(() => {
        const teacherData = sessionStorage.getItem("teacher");
        if (teacherData) {
            try {
                const parsed = JSON.parse(teacherData);
                setTeacher(parsed);
                setName(parsed.name || "");
                setAddress(parsed.address || "");
                setImage(parsed.image || null);
            } catch (e) {
                console.error("Failed to parse teacher data");
            }
        }
        setLoading(false);
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) { // 1MB limit
                setError("Image size should be less than 1MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!teacher) return;

        setSaving(true);
        setError("");
        setSuccess(false);

        try {
            const response = await fetch("/api/teacher/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: teacher.id,
                    name,
                    address,
                    image,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update profile");
            }

            // Update session storage with data from server
            const updatedTeacher = { ...teacher, ...data.teacher };
            sessionStorage.setItem("teacher", JSON.stringify(updatedTeacher));
            setTeacher(updatedTeacher);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);

            // Refresh the page to update the layout/navbar
            router.refresh();
            // Small delay to allow session storage to persist before reload
            setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">My Profile</h1>
                    <p className="text-slate-500 font-medium">Manage your personal information and profile picture</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Avatar Upload */}
                    <Card className="md:col-span-1 border-0 shadow-xl bg-white overflow-hidden">
                        <CardHeader className="bg-gradient-to-br from-blue-600 to-purple-600 text-white pb-12">
                            <CardTitle className="text-xl">Profile Photo</CardTitle>
                        </CardHeader>
                        <CardContent className="-mt-10 flex flex-col items-center">
                            <div className="relative group">
                                <div className="h-32 w-32 rounded-2xl bg-white p-1 shadow-2xl overflow-hidden ring-4 ring-white">
                                    {image ? (
                                        <img src={image} alt="Profile" className="h-full w-full object-cover rounded-xl" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-slate-100 text-slate-400">
                                            <User className="h-12 w-12" />
                                        </div>
                                    )}
                                </div>
                                <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:bg-blue-700 transition-all hover:scale-110">
                                    <Camera className="h-5 w-5" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <div className="mt-6 text-center">
                                <h3 className="font-bold text-slate-900 border-b pb-2 mb-2 w-full">{name || "Your Name"}</h3>
                                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Teacher ID: #{teacher?.id}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Information Form */}
                    <Card className="md:col-span-2 border-0 shadow-xl bg-white">
                        <CardContent className="pt-6">
                            <form onSubmit={handleSave} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4" />
                                        Profile updated successfully!
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <User className="h-4 w-4 text-blue-600" />
                                        Full Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="h-12 border-2 focus-visible:ring-0 focus:border-blue-600 transition-colors bg-slate-50/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-purple-600" />
                                        Home Address
                                    </label>
                                    <textarea
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        placeholder="Enter your current address"
                                        className="w-full min-h-[120px] rounded-md border-2 border-input bg-slate-50/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus:border-purple-600 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-5 w-5" />
                                            Save Profile
                                        </>
                                    )}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
