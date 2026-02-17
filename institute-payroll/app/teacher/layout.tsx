"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { TeacherNavbar } from "@/components/TeacherNavbar";

interface Teacher {
    id: number;
    name: string;
    phone: string;
    image?: string | null;
}

export default function TeacherLayout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [teacher, setTeacher] = useState<Teacher | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Skip authentication check for login page
        if (pathname === "/teacher/login") {
            setLoading(false);
            return;
        }

        // Check if teacher is logged in
        const teacherData = sessionStorage.getItem("teacher");

        if (!teacherData) {
            router.push("/teacher/login");
            return;
        }

        try {
            const parsedTeacher = JSON.parse(teacherData);
            setTeacher(parsedTeacher);
            setLoading(false);
        } catch (error) {
            console.error("Error parsing teacher data:", error);
            router.push("/teacher/login");
        }
    }, [pathname, router]);

    // Show login page without navbar
    if (pathname === "/teacher/login") {
        return <>{children}</>;
    }

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-secondary/30">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        );
    }

    // Show protected content with navbar
    return (
        <div className="min-h-screen bg-secondary/30">
            <TeacherNavbar teacherName={teacher?.name} teacherImage={teacher?.image} />
            {children}
        </div>
    );
}
