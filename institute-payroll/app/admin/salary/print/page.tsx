"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

interface SalaryData {
    teacher: { id: number; name: string };
    period: { start: string; end: string };
    stats: {
        totalCollection: number;
        totalStudents: number;
        grossPay: number;
        totalTuteCost: number;
        totalPostalFee: number;
        totalInstituteFee: number;
        automaticDeductions: number;
        manualDeductions: number;
        totalDeductions: number;
        netPay: number;
        instituteRetained: number;
    };
    details: {
        byClass: {
            className: string;
            totalCollection: number;
            totalStudents: number;
            feePerStudent: number;
            tuteCostPerStudent: number;
            postalFeePerStudent: number;
            totalTuteCost: number;
            totalPostalFee: number;
            grossPay: number;
            instituteFeePercentage: number;
        }[];
        deductions: { type: string; amount: number; description?: string }[];
    };
}

export default function SalarySlipPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-500">Loading Payment System...</div>}>
            <SalarySlipContent />
        </Suspense>
    );
}

function SalarySlipContent() {
    const searchParams = useSearchParams();
    const teacherId = searchParams.get("teacherId");
    const month = searchParams.get("month"); // YYYY-MM
    const [allData, setAllData] = useState<SalaryData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (month) {
            setLoading(true);
            fetch(`/api/salary?date=${month}-01`)
                .then(res => res.json())
                .then((data: SalaryData[]) => {
                    if (teacherId) {
                        const tData = data.find((d: any) => d.teacher.id.toString() === teacherId);
                        setAllData(tData ? [tData] : []);
                    } else {
                        setAllData(data);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [teacherId, month]);

    if (loading) return <div className="p-10 text-center">Loading Salary Slips...</div>;
    if (allData.length === 0) return <div className="p-10 text-center">No salary data found for this period.</div>;

    return (
        <div className="min-h-screen bg-slate-100 print:bg-white p-4 md:p-10 print:p-0 font-sans">
            {/* Control Panel - Hidden on Print */}
            <div className="print:hidden max-w-[210mm] mx-auto mb-8 flex justify-between items-center bg-white p-6 rounded-2xl shadow-xl ring-1 ring-slate-200">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                        {teacherId ? "Salary Slip Preview" : "Bulk Salary Slips Preview"}
                    </h2>
                    <p className="text-slate-500">
                        {teacherId ? "Review and download the teacher's payment record" : `Review and download all ${allData.length} payment records`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => window.history.back()}>Back</Button>
                    <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                        <Printer className="mr-2 h-4 w-4" /> Download PDF / Print All
                    </Button>
                </div>
            </div>

            {allData.map((data, index) => (
                <div key={index} className={`w-full max-w-[210mm] print:max-w-full print:w-full mx-auto bg-white shadow-2xl print:shadow-none overflow-hidden rounded-sm relative mb-12 print:mb-0 ${index < allData.length - 1 ? 'print:page-break-after' : ''}`} id="salary-slip">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0 print:opacity-[0.05]">
                        <img src="/uploads/logo.png" alt="Watermark" className="w-[80%] h-auto grayscale" />
                    </div>

                    {/* Visual Accent */}
                    <div className="h-4 bg-slate-900 relative z-10" />

                    <div className="p-12 print:p-4 relative z-10 min-h-[148mm]">
                        {/* Header */}

                        <div className="mb-12 print:mb-4 border-b-2 border-slate-100 pb-10 print:pb-2">
                            <div className="flex justify-between items-center gap-4">
                                {/* Left: Institute Info */}
                                <div className="text-slate-500 text-sm print:text-[8px] space-y-1 flex-1">
                                    <h1 className="text-4xl print:text-sm font-black uppercase tracking-tighter text-slate-900 leading-none">Nexus Institute</h1>
                                    <p className="text-blue-600 font-bold tracking-widest uppercase text-xs mt-2">අසීමාන්තික කැපවීම මගින් විශිෂ්ට ප්‍රතිඵල සොයා යන සොඳුරුත ම නෞකාව</p>
                                    <div className="mt-6 print:mt-2 text-slate-500 text-sm print:text-xs space-y-1">
                                        <p>Sri Bimbarama temple,</p>
                                        <p>Kadawatha</p>
                                        <p>Contact: +94 788 456 543</p>
                                        <p>Email: nexusinstitute2026@gmail.com</p>
                                    </div>
                                </div>

                                {/* Center: Logo */}
                                <div className="flex-shrink-0 flex items-center justify-center">
                                    <img src="/uploads/logo.png" alt="Logo" className="h-24 print:h-16 w-auto object-contain" />
                                </div>

                                {/* Right: Payment Details */}
                                <div className="text-right flex-1">
                                    <div className="inline-block bg-slate-100 px-6 py-4 print:px-3 print:py-1 rounded-2xl">
                                        <p className="text-xs print:text-[7px] font-bold text-slate-400 uppercase tracking-widest">Payment Period</p>
                                        <p className="text-xl print:text-xs font-black text-slate-800">{month}</p>
                                    </div>
                                    <p className="text-[10px] print:text-[6px] text-slate-400 mt-2 uppercase font-bold">Document ID: NEX-{data.teacher.id}-{Date.now().toString().slice(-6)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recipient Information */}
                        <div className="grid grid-cols-2 gap-8 print:gap-4 mb-12 print:mb-4 bg-slate-50 p-8 print:p-4 rounded-3xl border border-slate-100">
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Payment To</p>
                                <h2 className="text-2xl font-bold text-slate-900">{data.teacher.name}</h2>
                                <p className="text-slate-500">Senior Teacher</p>
                            </div>
                            <div className="text-right flex flex-col justify-end">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Issue Date</p>
                                <p className="text-lg font-bold text-slate-800">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* Earnings Table */}
                        <div className="mb-10 print:mb-4">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Earnings Breakdown (Student-Based)</h3>
                            <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                                <table className="w-full text-sm print:text-[8px]">
                                    <thead>
                                        <tr className="bg-slate-900 text-white">
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-left font-bold uppercase tracking-wider">Class</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-center font-bold uppercase tracking-wider">Students</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-right font-bold uppercase tracking-wider">Fee/Student</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-right font-bold uppercase tracking-wider">Collection</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-right font-bold uppercase tracking-wider">Tute Cost</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-right font-bold uppercase tracking-wider">Postal</th>
                                            <th className="px-6 py-4 print:px-2 print:py-1 text-right font-bold uppercase tracking-wider">Inst. Fee %</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.details.byClass.map((c, i) => (
                                            <tr key={i} className="hover:bg-slate-50/50">
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 font-bold text-slate-700">{c.className}</td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-center">
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold text-xs print:text-[8px]">{c.totalStudents}</span>
                                                </td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-right text-slate-500 font-medium font-mono">Rs. {c.feePerStudent?.toLocaleString() || 0}</td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-right font-black text-blue-600 font-mono">Rs. {c.totalCollection.toLocaleString()}</td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-right text-orange-500 font-medium font-mono">Rs. {c.totalTuteCost?.toLocaleString() || 0}</td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-right text-purple-500 font-medium font-mono">Rs. {c.totalPostalFee?.toLocaleString() || 0}</td>
                                                <td className="px-6 py-4 print:px-2 print:py-0.5 text-right text-rose-500 font-medium">{c.instituteFeePercentage || 0}%</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-50 font-black border-t-2 border-slate-200">
                                            <td className="px-6 py-4 print:px-2 print:py-1 uppercase text-slate-400">Totals</td>
                                            <td className="px-6 py-4 print:px-2 print:py-1 text-center text-blue-700">{data.stats.totalStudents}</td>
                                            <td className="px-6 py-4 print:px-2 print:py-1"></td>
                                            <td className="px-6 py-4 print:px-2 print:py-1 text-right text-xl print:text-md text-blue-600 font-mono">Rs. {data.stats.grossPay.toLocaleString()}</td>
                                            <td className="px-6 py-4 print:px-2 print:py-1 text-right text-orange-600 font-mono text-xs">Rs. {data.stats.totalTuteCost?.toLocaleString() || 0}</td>
                                            <td className="px-6 py-4 print:px-2 print:py-1 text-right text-purple-600 font-mono text-xs">Rs. {data.stats.totalPostalFee?.toLocaleString() || 0}</td>
                                            <td className="px-6 py-4 print:px-2 print:py-1"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Columnar layout for Deductions and Summary */}
                        <div className="grid grid-cols-2 gap-12 print:gap-6 mb-12 print:mb-4">
                            {/* Deductions */}
                            <div className="print:scale-90 print:origin-top-left">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Deductions & Adjustments</h3>
                                <div className="space-y-3 px-2">
                                    <div className="bg-orange-50 rounded-xl p-4 mb-4">
                                        <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-3">Institute Costs (Auto-Deducted)</p>
                                        <div className="flex justify-between text-sm py-1">
                                            <span className="text-slate-600">Tute Materials</span>
                                            <span className="font-bold text-orange-600">Rs. {data.stats.totalTuteCost?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-1">
                                            <span className="text-slate-600">Postal/Delivery</span>
                                            <span className="font-bold text-purple-600">Rs. {data.stats.totalPostalFee?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm py-1">
                                            <span className="text-slate-600">Institute Fee</span>
                                            <span className="font-bold text-rose-600">Rs. {data.stats.totalInstituteFee?.toLocaleString() || 0}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2 mt-2 border-t border-orange-200">
                                            <span className="font-bold text-slate-700">Subtotal</span>
                                            <span className="font-bold text-slate-900">Rs. {data.stats.automaticDeductions?.toLocaleString() || 0}</span>
                                        </div>
                                    </div>

                                    {/* Manual Deductions */}
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Other Deductions</p>
                                        {data.details.deductions.map((d, i) => (
                                            <div key={i} className="flex justify-between text-sm py-2 border-b border-slate-100">
                                                <div>
                                                    <span className="font-bold text-slate-700 uppercase tracking-tight block">{d.type}</span>
                                                    {d.description && <span className="text-xs text-slate-400">{d.description}</span>}
                                                </div>
                                                <span className="font-bold text-red-500">Rs. {d.amount.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        {data.details.deductions.length === 0 && (
                                            <p className="text-xs text-slate-300 italic pt-2">No other deductions for this period.</p>
                                        )}
                                    </div>

                                    <div className="flex justify-between pt-4 font-black border-t-2 border-slate-300">
                                        <span className="text-slate-800 uppercase tracking-tighter">Total Deductions</span>
                                        <span className="text-red-600">Rs. {data.stats.totalDeductions.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Net Pay Grand Box */}
                            <div className="relative print:scale-95 print:origin-top-right">
                                <div className="absolute inset-0 bg-blue-600 blur-2xl opacity-10 rounded-3xl" />
                                <div className="relative bg-slate-900 text-white p-10 print:p-5 rounded-3xl overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                                    <p className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Net Payable Amount</p>
                                    <h2 className="text-5xl print:text-5xl font-black tracking-tighter mb-4 print:mb-2 font-mono">Rs. {data.stats.netPay.toLocaleString()}</h2>
                                    <p className="text-xs text-slate-400 font-medium">This amount has been authorized for immediate bank transfer. Please check your account within 24 hours.</p>
                                </div>
                            </div>
                        </div>

                        {/* Authorization */}
                        <div className="grid grid-cols-2 gap-20 print:gap-10 pt-12 print:pt-4 border-t border-slate-100">
                            <div className="text-center pt-8 border-t border-slate-200">
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Internal Review</p>
                                <p className="text-slate-700 font-bold">Accounts Department</p>
                            </div>
                            <div className="text-center pt-8 border-t border-slate-200 relative">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-20 transform -rotate-12 italic font-serif text-slate-900 text-2xl font-bold border-4 border-slate-900 px-4 py-2 rounded-xl print:text-xl print:border-2 print:-top-8">
                                    AUTHORIZED
                                </div>
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Final Approval</p>
                                <p className="text-slate-700 font-bold">Managing Director</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-20 print:mt-12 pt-10 print:pt-4 text-center text-[10px] text-slate-300 border-t border-slate-50 uppercase tracking-widest font-bold">
                            <p>This is a computer generated document. No physical signature required.</p>
                            <p className="mt-1">Nexus Institute Payment System &copy; 2026 | All Rights Reserved</p>
                        </div>
                    </div>
                </div>
            ))}

            <style jsx global>{`
                @media print {
                    @page { 
                        size: A5; 
                        margin: 0; 
                    }
                    body { 
                        background: white;
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact; 
                    }
                    #salary-slip {
                        border: none !important;
                        box-shadow: none !important;
                        margin: 0 !important;
                        width: 100% !important;
                        max-width: 100% !important;
                        page-break-after: always;
                    }
                    .print-page-break-after {
                        page-break-after: always;
                    }
                    .print\\:hidden { display: none !important; }
                    .shadow-2xl { box-shadow: none !important; }
                    .rounded-sm { border-radius: 0 !important; }
                    
                    /* Scale content for A5 */
                    .p-12 { padding: 5mm !important; }
                    .text-4xl { font-size: 1.5rem !important; }
                    .text-2xl { font-size: 1.25rem !important; }
                    .text-5xl { font-size: 2rem !important; }
                    
                    html {
                        font-size: 11px;
                    }
                }
            `}</style>
        </div>
    );
}

