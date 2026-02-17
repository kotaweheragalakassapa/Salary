import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.teacherRate.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete rate" }, { status: 500 });
    }
}
