import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone } = body;

        if (!name || !phone) {
            return NextResponse.json(
                { error: "Name and phone number are required" },
                { status: 400 }
            );
        }

        // Find teacher by username/password (new) OR name/phone (backwards compatible)
        const teacher = await prisma.teacher.findFirst({
            where: {
                OR: [
                    // New authentication method: username + password
                    {
                        username: name.trim(),
                        password: phone.trim(),
                    },
                    // Old authentication method (backwards compatible): name + phone
                    {
                        name: name.trim(),
                        phone: phone.trim(),
                    },
                ],
            },
            include: {
                rates: {
                    include: {
                        class: true
                    }
                }
            }
        });

        if (!teacher) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Return teacher data (excluding sensitive info if any)
        return NextResponse.json({
            id: teacher.id,
            name: teacher.name,
            phone: teacher.phone,
            address: teacher.address,
            image: teacher.image,
            classes: teacher.rates.map(rate => ({
                id: rate.class.id,
                name: rate.class.name,
                percentage: rate.percentage
            }))
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
