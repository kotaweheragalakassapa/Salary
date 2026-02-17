import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Loader from "@/components/VisualEffects/Loader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Institute Payroll System",
    description: "Payroll management for educational institutes",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Loader />
                <div className="min-h-screen bg-background font-sans antialiased">
                    {children}
                </div>
            </body>
        </html>
    );
}
