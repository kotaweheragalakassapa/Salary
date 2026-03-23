import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const updated = await prisma.dailyCollection.update({
            where: { id },
            data: {
                ...body,
                date: body.date ? new Date(body.date) : undefined,
                amount: body.amount !== undefined ? parseFloat(body.amount) : undefined,
                studentCount: body.studentCount !== undefined ? parseInt(body.studentCount) : undefined,
                tuteCostPerStudent: body.tuteCostPerStudent !== undefined ? parseFloat(body.tuteCostPerStudent) : undefined,
                postalFeePerStudent: body.postalFeePerStudent !== undefined ? parseFloat(body.postalFeePerStudent) : undefined,
                otherDeductions: body.otherDeductions !== undefined ? parseFloat(body.otherDeductions) : undefined,
                teacherId: body.teacherId !== undefined ? parseInt(body.teacherId) : undefined,
                classId: body.classId !== undefined ? parseInt(body.classId) : undefined
            }
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.dailyCollection.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }
}
