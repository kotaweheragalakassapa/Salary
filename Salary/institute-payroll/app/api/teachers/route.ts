import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    try {
        if (id) {
            const teacher = await prisma.teacher.findUnique({
                where: { id: Number(id) },
                include: {
                    rates: {
                        include: {
                            class: true,
                        },
                    },
                },
            });
            return NextResponse.json(teacher);
        }

        const teachers = await prisma.teacher.findMany({
            include: {
                rates: {
                    include: {
                        class: true,
                    },
                },
            },
            orderBy: {
                name: "asc",
            },
        });
        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone } = body;
        const teacher = await prisma.teacher.create({
            data: {
                name,
                phone,
                username: name, // Auto-generate username as teacher's name
                password: phone, // Auto-generate password as phone number
            },
        });
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.teacher.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete teacher. They might have active records." }, { status: 500 });
    }
}

