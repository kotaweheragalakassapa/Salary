"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from "recharts";
import { Download, TrendingUp, DollarSign, Users, PieChart as PieChartIcon } from "lucide-react";

interface SalaryData {
    teacher: { id: number; name: string };
    stats: {
        totalCollection: number; // Gross collection
        grossPay: number;       // Teacher's share
        totalDeductions: number;
        netPay: number;
        instituteRetained: number; // Institute's share
    };
    details: {
        byClass: Array<{
            className: string;
            totalCollection: number;
            grossPay: number;
        }>;
    };
}

export default function ReportsPage() {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<SalaryData[]>([]);

    const fetchReportData = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/salary?date=${month}-01`);
            const json = await res.json();
            if (Array.isArray(json)) {
                setData(json);
            } else {
                console.error("Invalid data format received");
                setData([]);
            }
        } catch (error) {
            console.error("Failed to fetch report data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, [month]);

    // Aggregations
    const totalCollection = data.reduce((acc, curr) => acc + curr.stats.totalCollection, 0);
    const totalTeacherPay = data.reduce((acc, curr) => acc + curr.stats.netPay, 0);
    const totalProfit = data.reduce((acc, curr) => acc + curr.stats.instituteRetained, 0);
    const totalDeductions = data.reduce((acc, curr) => acc + curr.stats.totalDeductions, 0);

    // Class Performance Data (Aggregate by class across all teachers)
    const classPerformanceMap = new Map<string, number>();
    data.forEach(teacher => {
        teacher.details.byClass.forEach(cls => {
            const current = classPerformanceMap.get(cls.className) || 0;
            classPerformanceMap.set(cls.className, current + cls.totalCollection);
        });
    });

    const classChartData = Array.from(classPerformanceMap.entries())
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 classes

    // Financial Overview Data
    const financialData = [
        { name: "Collection", amount: totalCollection },
        { name: "Teacher Pay", amount: totalTeacherPay },
        { name: "Profit", amount: totalProfit },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <div className="container mx-auto py-10 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Financial Reports</h1>
                        <p className="text-slate-500">Monthly breakdown of institute performance</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
                        <Input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="w-40 border-0 focus-visible:ring-0"
                        />
                        <Button size="sm" onClick={fetchReportData} disabled={loading}>
                            {loading ? "Refreshing..." : "Refresh"}
                        </Button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid gap-6 md:grid-cols-3 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
                            <DollarSign className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rs. {totalCollection.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">Gross revenue from all classes</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">Rs. {totalProfit.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">After teacher commissions</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Teacher Payouts</CardTitle>
                            <Users className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rs. {totalTeacherPay.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">+ Rs. {totalDeductions.toLocaleString()} in deductions</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 md:grid-cols-2 mb-8">
                    {/* Financial Chart */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Financial Overview</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={financialData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                                    <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Class Performance Chart */}
                    <Card className="col-span-1">
                        <CardHeader>
                            <CardTitle>Top Performing Classes (Revenue)</CardTitle>
                        </CardHeader>
                        <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={classChartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {classChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => `Rs. ${value.toLocaleString()}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
