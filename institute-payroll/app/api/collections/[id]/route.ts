import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        const body = await req.json();
        const updated = await prisma.dailyCollection.update({
            where: { id },
            data: body
        });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update collection" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.dailyCollection.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
    }
}
