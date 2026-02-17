import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");

        let where = {};
        if (dateStr) {
            where = {
                date: {
                    startsWith: dateStr
                }
            };
        }

        const collections = await prisma.dailyCollection.findMany({
            where,
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

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const collection = await prisma.dailyCollection.create({
            data: {
                ...body,
                date: new Date(body.date),
                amount: parseFloat(body.amount),
                studentCount: parseInt(body.studentCount),
                tuteCostPerStudent: parseFloat(body.tuteCostPerStudent || 0),
                postalFeePerStudent: parseFloat(body.postalFeePerStudent || 0),
                teacherId: parseInt(body.teacherId),
                classId: parseInt(body.classId)
            }
        });
        return NextResponse.json(collection);
    } catch (error) {
        console.error("Collection error:", error);
        return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
    }
}
