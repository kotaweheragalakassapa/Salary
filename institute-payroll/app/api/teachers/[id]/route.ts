import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                rates: {
                    include: {
                        class: true
                    }
                }
            }
        });
        if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const teacher = await prisma.teacher.update({
            where: { id },
            data: body
        });
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.teacher.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
    }
}
