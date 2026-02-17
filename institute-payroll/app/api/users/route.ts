
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // Check if default users exist, if not create them
        const adminUser = await prisma.user.findUnique({ where: { username: "admin" } });
        if (!adminUser) {
            await prisma.user.create({
                data: {
                    username: "admin",
                    password: "1234", // In a real app, hash this!
                    role: "ADMIN"
                }
            });
        }

        const staffUser = await prisma.user.findUnique({ where: { username: "Madhu" } });
        if (!staffUser) {
            await prisma.user.create({
                data: {
                    username: "Madhu",
                    password: "1234", // In a real app, hash this!
                    role: "STAFF"
                }
            });
        }

        const users = await prisma.user.findMany({
            orderBy: { role: 'asc' }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Failed to fetch users:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, username, password } = body;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: { username, password }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
