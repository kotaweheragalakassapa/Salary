import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const admin = await prisma.user.create({
        data: {
            username: "admin",
            password: "password", // Simple for now
            role: "ADMIN"
        }
    });
    console.log("Admin user created:", admin);
    const staff = await prisma.user.create({
        data: {
            username: "staff",
            password: "password",
            role: "STAFF"
        }
    });
    console.log("Staff user created:", staff);
}
main();
