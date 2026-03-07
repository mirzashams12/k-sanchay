"use client";

import { motion } from "framer-motion";
import {
    Wallet,
    TrendingUp,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    PieChart
} from "lucide-react";

const stats = [
    { label: "Total Savings", value: "₹24,500", icon: Wallet, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
    { label: "Active Loans", value: "₹5,000", icon: PieChart, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
    { label: "Monthly Interest", value: "₹120", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { label: "Next Payment", value: "Oct 15", icon: Clock, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/30" },
];

const recentTransactions = [
    { id: 1, type: "deposit", amount: "+₹500", date: "Oct 02, 2023", status: "Completed" },
    { id: 2, type: "loan_repayment", amount: "-₹1,200", date: "Sep 28, 2023", status: "Completed" },
    { id: 3, type: "deposit", amount: "+₹500", date: "Sep 02, 2023", status: "Completed" },
];

export default function UserDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">Track your savings and loan activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className={`${stat.bg} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                            <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                    {recentTransactions.map((tx) => (
                        <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                    {tx.type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-white capitalize">
                                        {tx.type.replace('_', ' ')}
                                    </p>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{tx.date}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold ${tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900 dark:text-white'}`}>
                                    {tx.amount}
                                </p>
                                <p className="text-xs text-slate-400">{tx.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}