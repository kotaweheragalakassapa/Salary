import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { date, teacherId, classId, amount, studentCount, tuteCostPerStudent, postalFeePerStudent } = body;

        const collection = await prisma.dailyCollection.create({
            data: {
                date: new Date(date),
                teacherId: Number(teacherId),
                classId: Number(classId),
                amount: Number(amount),
                studentCount: Number(studentCount) || 0,
                tuteCostPerStudent: Number(tuteCostPerStudent) || 0,
                postalFeePerStudent: Number(postalFeePerStudent) || 0,
            },
        });

        return NextResponse.json(collection);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add collection" }, { status: 500 });
    }
}


export async function GET(request: Request) {
    // Optional: Get recent collections for display
    try {
        const collections = await prisma.dailyCollection.findMany({
            take: 20,
            orderBy: { createdAt: 'desc' },
            include: {
                teacher: true,
                class: true
            }
        });
        return NextResponse.json(collections);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, date, teacherId, classId, amount, studentCount, tuteCostPerStudent, postalFeePerStudent } = body;

        const updated = await prisma.dailyCollection.update({
            where: { id: Number(id) },
            data: {
                date: new Date(date),
                teacherId: Number(teacherId),
                classId: Number(classId),
                amount: Number(amount),
                studentCount: Number(studentCount) || 0,
                tuteCostPerStudent: Number(tuteCostPerStudent) || 0,
                postalFeePerStudent: Number(postalFeePerStudent) || 0,
            },
        });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        await prisma.dailyCollection.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }
}
