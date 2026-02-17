import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all teachers with their credentials
export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            select: {
                id: true,
                name: true,
                phone: true,
                username: true,
                password: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return NextResponse.json(teachers);
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

// PUT - Update teacher credentials
export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, username, password } = body;

        if (!id || !username || !password) {
            return NextResponse.json(
                { error: "Teacher ID, username, and password are required" },
                { status: 400 }
            );
        }

        // Check if username is already taken by another teacher
        const existingTeacher = await prisma.teacher.findFirst({
            where: {
                username,
                NOT: {
                    id: Number(id),
                },
            },
        });

        if (existingTeacher) {
            return NextResponse.json(
                { error: "Username is already taken by another teacher" },
                { status: 409 }
            );
        }

        const updatedTeacher = await prisma.teacher.update({
            where: { id: Number(id) },
            data: {
                username,
                password,
            },
        });

        return NextResponse.json(updatedTeacher);
    } catch (error) {
        console.error("Failed to update credentials:", error);
        return NextResponse.json({ error: "Failed to update credentials" }, { status: 500 });
    }
}
