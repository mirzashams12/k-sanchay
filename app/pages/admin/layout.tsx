//generate a nice and latest kind of layout for admin pages
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/app/lib/supabase/client";
import {
    LayoutDashboard,
    Users,
    History,
    Settings,
    LogOut,
    Bell,
    ShieldCheck,
    Menu,
    X
} from "lucide-react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/pages/admin" },
    { icon: Users, label: "Members", href: "/pages/admin/members" },
    { icon: History, label: "Transactions", href: "/pages/admin/transactions" },
    { icon: Settings, label: "Settings", href: "/pages/admin/settings" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const supabase = createClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col md:flex-row">
            {/* Mobile Header */}
            <header className="md:hidden h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <Image src="/sanchayika-icon.png" alt="Sanchayika" width={28} height={28} className="rounded-full" />
                    <span className="font-bold text-lg text-gray-900 dark:text-white">Admin</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-400"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </header>

            {/* Sidebar */}
            <aside className={`
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
                md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-transform duration-300 ease-in-out flex flex-col
            `}>
                <div className="p-6 flex items-center gap-3">
                    <Image
                        src="/sanchayika-icon.png"
                        alt="Sanchayika"
                        width={32}
                        height={32}
                        className="rounded-full"
                    />
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                        Admin
                    </span>
                </div>

                <nav className="flex-1 px-4 space-y-1 mt-4">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="hidden md:flex h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 items-center justify-between px-8">
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Admin Panel</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            <Bell className="w-5 h-5" />
                        </button>
                        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400" />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}