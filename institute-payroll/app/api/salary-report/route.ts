import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const dateStr = searchParams.get("date");
        if (!dateStr) return NextResponse.json({ error: "Date required" }, { status: 400 });

        const queryDate = new Date(dateStr);
        const startOfMonth = new Date(queryDate.getFullYear(), queryDate.getMonth(), 1);
        const endOfMonth = new Date(queryDate.getFullYear(), queryDate.getMonth() + 1, 0, 23, 59, 59);

        const teachers = await prisma.teacher.findMany({
            include: {
                collections: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        }
                    },
                    include: {
                        class: true
                    }
                },
                deductions: {
                    where: {
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth
                        }
                    }
                }
            }
        });

        // Calculate stats server-side (optional, or just return data and let client calculate)
        // For consistency with existing logic, I'll return the data mapped correctly.

        const report = teachers.map(teacher => {
            let totalCollection = 0;
            let totalStudents = 0;
            let totalTuteCost = 0;
            let totalPostalFee = 0;
            let totalInstituteFee = 0;
            const collectionDetails: any[] = [];

            teacher.collections.forEach(collection => {
                const cls = collection.class;
                const studentCount = collection.studentCount || 0;
                const tuteCost = studentCount * (collection.tuteCostPerStudent || 0);
                const postalFee = studentCount * (collection.postalFeePerStudent || 0);
                const instFeePercent = cls.instituteFeePercentage || 0;
                const instituteFee = collection.amount * (instFeePercent / 100);

                totalCollection += collection.amount;
                totalStudents += studentCount;
                totalTuteCost += tuteCost;
                totalPostalFee += postalFee;
                totalInstituteFee += instituteFee;

                collectionDetails.push({
                    date: collection.date,
                    className: cls.name,
                    amount: collection.amount,
                    studentCount: studentCount,
                    feePerStudent: cls.feePerStudent,
                    tuteCostPerStudent: collection.tuteCostPerStudent,
                    postalFeePerStudent: collection.postalFeePerStudent,
                    instituteFeePercentage: instFeePercent,
                    tuteCostTotal: tuteCost,
                    postalFeeTotal: postalFee,
                    instituteFeeTotal: instituteFee
                });
            });

            // Group by Class
            const classSummary = collectionDetails.reduce((acc: any[], curr) => {
                const existing = acc.find(c => c.className === curr.className);
                if (existing) {
                    existing.totalCollection += curr.amount;
                    existing.totalStudents += curr.studentCount;
                    existing.totalTuteCost += curr.tuteCostTotal;
                    existing.totalPostalFee += curr.postalFeeTotal;
                    existing.totalInstituteFee += curr.instituteFeeTotal;
                    existing.grossPay += curr.amount;
                } else {
                    acc.push({
                        className: curr.className,
                        totalCollection: curr.amount,
                        totalStudents: curr.studentCount,
                        feePerStudent: curr.feePerStudent,
                        tuteCostPerStudent: curr.tuteCostPerStudent,
                        postalFeePerStudent: curr.postalFeePerStudent,
                        instituteFeePercentage: curr.instituteFeePercentage,
                        totalTuteCost: curr.tuteCostTotal,
                        totalPostalFee: curr.postalFeeTotal,
                        totalInstituteFee: curr.instituteFeeTotal,
                        grossPay: curr.amount,
                    });
                }
                return acc;
            }, []);

            const automaticDeductions = totalTuteCost + totalPostalFee + totalInstituteFee;
            const manualDeductions = teacher.deductions.reduce((sum, d) => sum + d.amount, 0);
            const totalDeductions = automaticDeductions + manualDeductions;
            const grossPay = totalCollection;
            const netPay = grossPay - totalDeductions;

            return {
                teacherId: teacher.id,
                teacher: { id: teacher.id, name: teacher.name },
                period: { start: startOfMonth, end: endOfMonth },
                stats: {
                    totalCollection,
                    totalStudents,
                    grossPay,
                    totalTuteCost,
                    totalPostalFee,
                    totalInstituteFee,
                    automaticDeductions,
                    manualDeductions,
                    totalDeductions,
                    netPay,
                    instituteRetained: automaticDeductions
                },
                details: {
                    byClass: classSummary,
                    deductions: teacher.deductions
                }
            };
        });

        return NextResponse.json(report);
    } catch (error) {
        console.error("Report error:", error);
        return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
    }
}
