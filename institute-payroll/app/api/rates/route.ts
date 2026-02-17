import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teacherId, classId, percentage } = body;

        // Check if rate exists, update it. If not, create.
        // Use upsert or logic. Since schema has unique constraint on [teacherId, classId], upsert works well.

        const rate = await prisma.teacherRate.upsert({
            where: {
                teacherId_classId: {
                    teacherId: Number(teacherId),
                    classId: Number(classId),
                },
            },
            update: {
                percentage: Number(percentage),
            },
            create: {
                teacherId: Number(teacherId),
                classId: Number(classId),
                percentage: Number(percentage),
            },
        });

        return NextResponse.json(rate);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to set rate" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.teacherRate.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete rate" }, { status: 500 });
    }
}

