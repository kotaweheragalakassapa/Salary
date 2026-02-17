import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { teacherId, classId, percentage } = body;

        // Upsert logic
        const existing = await prisma.teacherRate.findUnique({
            where: {
                teacherId_classId: {
                    teacherId: parseInt(teacherId),
                    classId: parseInt(classId)
                }
            }
        });

        if (existing) {
            const updated = await prisma.teacherRate.update({
                where: { id: existing.id },
                data: { percentage: parseFloat(percentage) }
            });
            return NextResponse.json(updated);
        }

        const created = await prisma.teacherRate.create({
            data: {
                teacherId: parseInt(teacherId),
                classId: parseInt(classId),
                percentage: parseFloat(percentage)
            }
        });
        return NextResponse.json(created);
    } catch (error) {
        return NextResponse.json({ error: "Failed to handle rate" }, { status: 500 });
    }
}
