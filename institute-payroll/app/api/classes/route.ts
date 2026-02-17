import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const classes = await prisma.class.findMany();
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, feePerStudent, instituteFeePercentage } = body;

        const newClass = await prisma.class.create({
            data: {
                name,
                feePerStudent: parseFloat(feePerStudent),
                instituteFeePercentage: parseFloat(instituteFeePercentage)
            }
        });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
    }
}
