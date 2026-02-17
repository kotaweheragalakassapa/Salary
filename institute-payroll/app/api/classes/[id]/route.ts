import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const updatedClass = await prisma.class.update({
            where: { id },
            data: body
        });
        return NextResponse.json(updatedClass);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update class" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.class.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete class" }, { status: 500 });
    }
}
