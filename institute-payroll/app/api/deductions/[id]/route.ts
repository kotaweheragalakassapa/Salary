import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = parseInt(params.id);
        await prisma.deduction.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete deduction" }, { status: 500 });
    }
}
