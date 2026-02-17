"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Key, User, Eye, EyeOff, Save, RefreshCw, Lock, Shield, Users as UsersIcon } from "lucide-react";

interface Teacher {
    id: number;
    name: string;
    phone: string;
    username: string;
    password: string;
}

interface SystemUser {
    id: number;
    username: string;
    role: string;
    password?: string;
}

interface EditingCredentials {
    [key: string]: { // key can be "teacher-ID" or "user-ID"
        username: string;
        password: string;
    };
}

export default function CredentialsPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [users, setUsers] = useState<SystemUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [editing, setEditing] = useState<EditingCredentials>({});
    const [showPasswords, setShowPasswords] = useState<{ [key: string]: boolean }>({});
    const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [teachersRes, usersRes] = await Promise.all([
                fetch("/api/teachers/credentials"),
                fetch("/api/users")
            ]);

            const teachersData = await teachersRes.json();
            const usersData = await usersRes.json();

            setTeachers(teachersData);
            setUsers(usersData);
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const startEditing = (id: number, type: 'teacher' | 'user', currentUsername: string, currentPassword?: string) => {
        const key = `${type}-${id}`;
        setEditing({
            ...editing,
            [key]: {
                username: currentUsername,
                password: currentPassword || "",
            },
        });
    };

    const cancelEditing = (id: number, type: 'teacher' | 'user') => {
        const key = `${type}-${id}`;
        const newEditing = { ...editing };
        delete newEditing[key];
        setEditing(newEditing);
    };

    const saveCredentials = async (id: number, type: 'teacher' | 'user') => {
        const key = `${type}-${id}`;
        setSavingIds(new Set(savingIds).add(key));

        try {
            const credentials = editing[key];
            const endpoint = type === 'teacher' ? "/api/teachers/credentials" : "/api/users";

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    username: credentials.username,
                    password: credentials.password,
                }),
            });

            if (response.ok) {
                await fetchAllData();
                cancelEditing(id, type);
            } else {
                alert("Failed to update credentials");
            }
        } catch (error) {
            console.error("Failed to save credentials:", error);
            alert("An error occurred while saving");
        } finally {
            setSavingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const resetToDefault = async (teacherId: number) => {
        const teacher = teachers.find((t) => t.id === teacherId);
        if (!teacher) return;

        if (!confirm(`Reset credentials for ${teacher.name} to default values?\nUsername: ${teacher.name}\nPassword: ${teacher.phone}`)) {
            return;
        }

        const key = `teacher-${teacherId}`;
        setSavingIds(new Set(savingIds).add(key));
        try {
            const response = await fetch("/api/teachers/credentials", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: teacherId,
                    username: teacher.name,
                    password: teacher.phone,
                }),
            });

            if (response.ok) {
                await fetchAllData();
            } else {
                alert("Failed to reset credentials");
            }
        } catch (error) {
            console.error("Failed to reset credentials:", error);
        } finally {
            setSavingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(key);
                return newSet;
            });
        }
    };

    const togglePasswordVisibility = (id: number, type: 'teacher' | 'user') => {
        const key = `${type}-${id}`;
        setShowPasswords({
            ...showPasswords,
            [key]: !showPasswords[key],
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
            <Navbar />
            <div className="container mx-auto py-12 px-4 max-w-7xl">
                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl shadow-xl shadow-purple-200">
                            <Shield className="h-10 w-10 text-white" />
                        </div>
                        <div>
                            <h1 className="text-5xl font-black text-slate-900 tracking-tight">
                                Access Control
                            </h1>
                            <p className="text-slate-500 mt-2 text-lg font-medium">
                                Manage login credentials for System Admins, Staff, and Teachers
                            </p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* System Users Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-slate-900 p-2 rounded-lg text-white">
                                    <UsersIcon className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">System Users</h2>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2">
                                {users.map((user) => {
                                    const key = `user-${user.id}`;
                                    const isEditing = editing[key] !== undefined;
                                    const isSaving = savingIds.has(key);
                                    const showPassword = showPasswords[key] || false;

                                    return (
                                        <Card key={user.id} className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden group hover:shadow-xl transition-all">
                                            <div className={`h-1.5 ${user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-cyan-600'}`} />
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-md ${user.role === 'ADMIN' ? 'bg-purple-600' : 'bg-cyan-600'}`}>
                                                            {user.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-bold text-slate-900 text-lg">{user.username}</h3>
                                                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wide">
                                                                {user.role}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Username</label>
                                                            {isEditing ? (
                                                                <Input
                                                                    value={editing[key].username}
                                                                    onChange={(e) => setEditing({ ...editing, [key]: { ...editing[key], username: e.target.value } })}
                                                                    className="font-bold h-10"
                                                                    disabled={isSaving}
                                                                />
                                                            ) : (
                                                                <div className="font-bold text-slate-700 h-10 flex items-center">{user.username}</div>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password</label>
                                                            <div className="relative">
                                                                {isEditing ? (
                                                                    <Input
                                                                        type={showPassword ? "text" : "password"}
                                                                        value={editing[key].password}
                                                                        onChange={(e) => setEditing({ ...editing, [key]: { ...editing[key], password: e.target.value } })}
                                                                        className="font-bold pr-10 h-10"
                                                                        disabled={isSaving}
                                                                        placeholder="New password"
                                                                    />
                                                                ) : (
                                                                    <div className="font-bold text-slate-700 h-10 flex items-center">••••••••</div>
                                                                )}
                                                                <button onClick={() => togglePasswordVisibility(user.id, 'user')} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600">
                                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="pt-2">
                                                        {isEditing ? (
                                                            <div className="flex gap-2">
                                                                <Button onClick={() => saveCredentials(user.id, 'user')} disabled={isSaving} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 rounded-lg">
                                                                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save Changes"}
                                                                </Button>
                                                                <Button onClick={() => cancelEditing(user.id, 'user')} variant="outline" disabled={isSaving} className="h-10 rounded-lg">Cancel</Button>
                                                            </div>
                                                        ) : (
                                                            <Button onClick={() => startEditing(user.id, 'user', user.username)} className="w-full bg-slate-900 hover:bg-slate-800 text-white h-10 rounded-lg shadow-lg shadow-slate-200">
                                                                <Key className="h-4 w-4 mr-2" /> Edit Credentials
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>

                        <div className="h-px bg-slate-200/60" />

                        {/* Teachers Section */}
                        <section>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="bg-blue-600 p-2 rounded-lg text-white">
                                    <User className="h-5 w-5" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900">Teacher Credentials</h2>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-600 p-5 rounded-xl mb-6">
                                <div className="flex items-start gap-3">
                                    <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-blue-900 mb-1">Default Credentials</h3>
                                        <p className="text-sm text-blue-800 leading-relaxed">
                                            Username = Name, Password = Phone Number. Use the reset button to restore these defaults.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {teachers.map((teacher) => {
                                    const key = `teacher-${teacher.id}`;
                                    const isEditing = editing[key] !== undefined;
                                    const isSaving = savingIds.has(key);
                                    const showPassword = showPasswords[key] || false;

                                    return (
                                        <Card key={teacher.id} className="border-0 shadow-lg shadow-slate-200/50 rounded-2xl overflow-hidden hover:shadow-xl transition-all">
                                            <div className="h-1.5 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600" />
                                            <CardContent className="p-6">
                                                <div className="grid lg:grid-cols-12 gap-6 items-center">
                                                    <div className="lg:col-span-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center text-lg font-black text-blue-600">
                                                                {teacher.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h3 className="font-bold text-slate-900">{teacher.name}</h3>
                                                                <p className="text-xs text-slate-500">{teacher.phone}</p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="lg:col-span-3">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Username</label>
                                                        {isEditing ? (
                                                            <Input
                                                                value={editing[key].username}
                                                                onChange={(e) => setEditing({ ...editing, [key]: { ...editing[key], username: e.target.value } })}
                                                                className="font-bold h-10"
                                                                disabled={isSaving}
                                                            />
                                                        ) : (
                                                            <div className="font-bold text-slate-700 h-10 flex items-center">{teacher.username || <span className="text-slate-400 italic">Not set</span>}</div>
                                                        )}
                                                    </div>

                                                    <div className="lg:col-span-3">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Password</label>
                                                        <div className="relative">
                                                            {isEditing ? (
                                                                <Input
                                                                    type={showPassword ? "text" : "password"}
                                                                    value={editing[key].password}
                                                                    onChange={(e) => setEditing({ ...editing, [key]: { ...editing[key], password: e.target.value } })}
                                                                    className="font-bold pr-10 h-10"
                                                                    disabled={isSaving}
                                                                />
                                                            ) : (
                                                                <div className="font-bold text-slate-700 h-10 flex items-center">
                                                                    {showPassword ? (teacher.password || <span className="text-slate-400 italic">Not set</span>) : "••••••••"}
                                                                </div>
                                                            )}
                                                            <button onClick={() => togglePasswordVisibility(teacher.id, 'teacher')} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600">
                                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                            </button>
                                                        </div>
                                                    </div>

                                                    <div className="lg:col-span-3">
                                                        {isEditing ? (
                                                            <div className="flex gap-2">
                                                                <Button onClick={() => saveCredentials(teacher.id, 'teacher')} disabled={isSaving} className="flex-1 bg-green-600 hover:bg-green-700 text-white h-10 rounded-lg">
                                                                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Save"}
                                                                </Button>
                                                                <Button onClick={() => cancelEditing(teacher.id, 'teacher')} variant="outline" disabled={isSaving} className="h-10 rounded-lg">Cancel</Button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex gap-2">
                                                                <Button onClick={() => startEditing(teacher.id, 'teacher', teacher.username, teacher.password)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white h-10 rounded-lg shadow-lg shadow-blue-200">
                                                                    <Key className="h-4 w-4 mr-2" /> Edit
                                                                </Button>
                                                                <Button onClick={() => resetToDefault(teacher.id)} variant="outline" size="icon" title="Reset defaults" className="h-10 w-10 rounded-lg">
                                                                    <RefreshCw className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
