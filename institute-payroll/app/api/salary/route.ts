import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date"); // YYYY-MM-DD (e.g., 2026-02-01)

    if (!dateStr) {
        return NextResponse.json({ error: "Date is required" }, { status: 400 });
    }

    const queryDate = parseISO(dateStr);
    const startDate = startOfMonth(queryDate);
    const endDate = endOfMonth(queryDate);

    try {
        const teachers = await prisma.teacher.findMany({
            include: {
                rates: true,
            },
        });

        const salaryData = await Promise.all(
            teachers.map(async (teacher) => {
                // 1. Get Collections for this teacher in the date range
                const collections = await prisma.dailyCollection.findMany({
                    where: {
                        teacherId: teacher.id,
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                    include: {
                        class: true,
                    },
                });



                // 2. Calculate based on student attendance
                let totalCollection = 0;
                let totalStudents = 0;
                let totalTuteCost = 0;
                let totalPostalFee = 0;
                let totalInstituteFee = 0;
                const collectionDetails = [];

                for (const collection of collections) {
                    const studentCount = collection.studentCount || 0;
                    const classData = collection.class;

                    // Calculate costs for this collection (using daily variable costs)
                    const tuteCost = studentCount * (collection.tuteCostPerStudent || 0);
                    const postalFee = studentCount * (collection.postalFeePerStudent || 0);

                    // Calculate Institute Fee (Percentage of total collection)
                    const instFeePercent = classData.instituteFeePercentage || 0;
                    const instituteFee = collection.amount * (instFeePercent / 100);

                    totalCollection += collection.amount;
                    totalStudents += studentCount;
                    totalTuteCost += tuteCost;
                    totalPostalFee += postalFee;
                    totalInstituteFee += instituteFee;

                    collectionDetails.push({
                        date: collection.date,
                        className: classData.name,
                        amount: collection.amount,
                        studentCount: studentCount,
                        feePerStudent: classData.feePerStudent || 0,
                        tuteCostPerStudent: collection.tuteCostPerStudent || 0,
                        postalFeePerStudent: collection.postalFeePerStudent || 0,
                        instituteFeePercentage: instFeePercent,
                        tuteCostTotal: tuteCost,
                        postalFeeTotal: postalFee,
                        instituteFeeTotal: instituteFee
                    });
                }

                // Group by Class for the Report
                const classSummary = collectionDetails.reduce((acc, curr) => {
                    const existing = acc.find(c => c.className === curr.className);
                    if (existing) {
                        existing.totalCollection += curr.amount;
                        existing.totalStudents += curr.studentCount;
                        existing.totalTuteCost += curr.tuteCostTotal;
                        existing.totalPostalFee += curr.postalFeeTotal;
                        existing.totalInstituteFee += curr.instituteFeeTotal;
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
                            grossPay: curr.amount, // Full collection amount
                        });
                    }
                    return acc;
                }, [] as {
                    className: string;
                    totalCollection: number;
                    totalStudents: number;
                    feePerStudent: number;
                    tuteCostPerStudent: number;
                    postalFeePerStudent: number;
                    instituteFeePercentage: number;
                    totalTuteCost: number;
                    totalPostalFee: number;
                    totalInstituteFee: number;
                    grossPay: number;
                }[]);

                // Update grossPay for each class in summary
                classSummary.forEach(cls => {
                    cls.grossPay = cls.totalCollection;
                });

                // Calculate teacher pay: Total Collection - Tute Costs - Postal Fees - Institute Fee
                const grossPay = totalCollection; // Teacher receives all collections
                const automaticDeductions = totalTuteCost + totalPostalFee + totalInstituteFee; // Institute costs


                // 3. Get Manual Deductions (Advances, etc.)
                const deductions = await prisma.deduction.findMany({
                    where: {
                        teacherId: teacher.id,
                        date: {
                            gte: startDate,
                            lte: endDate,
                        },
                    },
                });

                const manualDeductions = deductions.reduce((acc, d) => acc + d.amount, 0);

                // Total deductions = tute + postal + manual deductions
                const totalDeductions = automaticDeductions + manualDeductions;

                // Net pay = Gross - All Deductions
                const netPay = grossPay - totalDeductions;

                // Institute profit = Tute costs + Postal fees
                const instituteRetained = automaticDeductions;

                return {
                    teacherId: teacher.id,
                    teacher: {
                        id: teacher.id,
                        name: teacher.name,
                    },
                    period: {
                        start: startDate,
                        end: endDate,
                    },
                    stats: {
                        totalCollection,
                        totalStudents,
                        grossPay,
                        totalTuteCost,
                        totalPostalFee,
                        totalInstituteFee,
                        automaticDeductions, // tute + postal + inst
                        manualDeductions, // advances, etc.
                        totalDeductions, // automatic + manual
                        netPay,
                        instituteRetained
                    },
                    details: {
                        byClass: classSummary,
                        deductions: deductions.map(d => ({
                            type: d.type,
                            amount: d.amount,
                            date: d.date,
                            description: d.description
                        }))
                    }
                };
            })
        );

        return NextResponse.json(salaryData);

    } catch (error) {
        console.error("Salary Calc Error:", error);
        return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
    }
}

