
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by username and role
        const user = await prisma.user.findFirst({
            where: {
                username: username,
                password: password, // In real app, compare hash
                role: "ADMIN"
            }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid admin credentials" },
                { status: 401 }
            );
        }

        // Return user data (excluding sensitive info if any)
        return NextResponse.json({
            id: user.id,
            username: user.username,
            role: user.role
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
