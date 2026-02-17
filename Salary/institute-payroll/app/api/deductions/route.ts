import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { teacherId, type, amount, description, date } = body;

        const deduction = await prisma.deduction.create({
            data: {
                teacherId: Number(teacherId),
                type,
                amount: Number(amount),
                description,
                date: new Date(date),
            },
        });

        return NextResponse.json(deduction);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to add deduction" }, { status: 500 });
    }
}
