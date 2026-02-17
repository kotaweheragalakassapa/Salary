import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const classes = await prisma.class.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, feePerStudent, instituteFeePercentage } = body;
        const newClass = await prisma.class.create({
            data: {
                name,
                feePerStudent: feePerStudent || 0,
                instituteFeePercentage: instituteFeePercentage || 0,
            },
        });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });

    }
}



export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, feePerStudent, instituteFeePercentage } = body;

        const updatedClass = await prisma.class.update({
            where: { id: Number(id) },
            data: {
                name,
                feePerStudent: feePerStudent || 0,
                instituteFeePercentage: instituteFeePercentage || 0,
            },
        });
        return NextResponse.json(updatedClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

        await prisma.class.delete({
            where: { id: Number(id) },
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete class. It might be in use." }, { status: 500 });
    }
}

