//generate a nice and latest kind of layout for user
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
    Home,
    Wallet,
    ArrowUpRight,
    User,
    LogOut,
    Bell,
    CreditCard
} from "lucide-react";

export const metadata: Metadata = {
    title: "Member Dashboard | Sanchayika",
    description: "Manage your personal Sanchayika account",
};

const navItems = [
    { icon: Home, label: "Dashboard", href: "/pages/user" },
    { icon: Wallet, label: "My Savings", href: "/pages/user/savings" },
    { icon: CreditCard, label: "Loans", href: "/pages/user/loans" },
    { icon: ArrowUpRight, label: "Transactions", href: "/pages/user/transactions" },
    { icon: User, label: "Profile", href: "/pages/user/profile" },
];

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
            {/* Sidebar */}
            <aside className="hidden md:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="p-8 flex items-center gap-3">
                    <div className="bg-blue-600 p-1.5 rounded-xl">
                        <Image
                            src="/sanchayika-icon.png"
                            alt="Sanchayika"
                            width={28}
                            height={28}
                            className="brightness-0 invert"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                        Sanchayika
                    </span>
                </div>

                <nav className="flex-1 px-6 space-y-2 mt-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 group"
                        >
                            <item.icon className="w-5 h-5 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                    <button className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Welcome back, Member</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-lg shadow-blue-500/20" />
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6 md:p-10">
                    <div className="max-w-6xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}