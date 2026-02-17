import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, address, image } = body;

        if (!id) {
            return NextResponse.json(
                { error: "Teacher ID is required" },
                { status: 400 }
            );
        }

        // Update teacher profile
        const updatedTeacher = await prisma.teacher.update({
            where: { id: Number(id) },
            data: {
                name: name || undefined,
                address: address || null,
                image: image || null,
            },
        });

        return NextResponse.json({
            message: "Profile updated successfully",
            teacher: {
                id: updatedTeacher.id,
                name: updatedTeacher.name,
                address: updatedTeacher.address,
                image: updatedTeacher.image,
            }
        });

    } catch (error: any) {
        console.error("Profile update error:", error);

        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: "Name already exists. Please use a different name." },
                { status: 400 }
            );
        }

        if (error.code === 'P2025') {
            return NextResponse.json(
                { error: "Teacher record not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: `Internal server error: ${error.message}` },
            { status: 500 }
        );
    }
}
