import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const deduction = await prisma.deduction.create({
            data: {
                ...body,
                date: new Date(body.date),
                amount: parseFloat(body.amount),
                teacherId: parseInt(body.teacherId)
            }
        });
        return NextResponse.json(deduction);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create deduction" }, { status: 500 });
    }
}
