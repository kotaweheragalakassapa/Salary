import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password, type } = body;

        if (type === "TEACHER") {
            const teacher = await prisma.teacher.findFirst({
                where: { username, password }
            });
            return NextResponse.json(teacher || null);
        } else {
            const user = await prisma.user.findFirst({
                where: {
                    username,
                    password,
                    role: type // ADMIN or STAFF
                }
            });
            return NextResponse.json(user || null);
        }
    } catch (error) {
        return NextResponse.json({ error: "Auth failed" }, { status: 500 });
    }
}
