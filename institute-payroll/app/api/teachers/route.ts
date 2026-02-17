import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            include: {
                rates: {
                    include: {
                        class: true
                    }
                }
            }
        });
        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, phone, address, image } = body;

        const teacher = await prisma.teacher.create({
            data: {
                name,
                phone,
                address,
                image,
                username: name,
                password: phone,
            }
        });
        return NextResponse.json(teacher);
    } catch (error) {
        console.error("Create teacher error:", error);
        return NextResponse.json({ error: "Failed to create teacher" }, { status: 500 });
    }
}
