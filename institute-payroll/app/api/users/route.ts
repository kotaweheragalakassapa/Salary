import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, ...data } = body;
        const user = await prisma.user.update({
            where: { id: parseInt(id) },
            data
        });
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
