"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Search,
    ArrowUpRight,
    ArrowDownLeft,
    Filter,
    Download,
    Calendar,
    MoreHorizontal
} from "lucide-react";

const transactions = [
    { id: "TXN-001", user: "Rahul Sharma", type: "deposit", amount: "₹500", date: "May 28, 2024", status: "completed", category: "Weekly Savings" },
    { id: "TXN-002", user: "Anjali Nair", type: "withdrawal", amount: "₹2,000", date: "May 27, 2024", status: "completed", category: "Loan Disbursement" },
    { id: "TXN-003", user: "Suresh Kumar", type: "deposit", amount: "₹500", date: "May 26, 2024", status: "pending", category: "Weekly Savings" },
    { id: "TXN-004", user: "Priya Lakshmi", type: "deposit", amount: "₹1,200", date: "May 25, 2024", status: "completed", category: "Loan Repayment" },
    { id: "TXN-005", user: "Amit Patel", type: "fine", amount: "₹50", date: "May 24, 2024", status: "completed", category: "Late Fee" },
];

export default function TransactionsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Transaction History</h1>
                    <p className="text-slate-500 dark:text-slate-400">Track all financial activities across the organization.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all">
                    <Download className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by user or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Calendar className="w-5 h-5" />
                        Date Range
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction ID</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Category</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions
                                .filter(t => t.user.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((txn, index) => (
                                    <motion.tr
                                        key={txn.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-mono font-medium text-slate-500">{txn.id}</span>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{txn.date}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{txn.user}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {txn.type === 'deposit' ? (
                                                    <ArrowDownLeft className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                                                )}
                                                <span className="text-sm text-slate-600 dark:text-slate-400">{txn.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {txn.type === 'deposit' ? '+' : '-'}{txn.amount}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${txn.status === 'completed'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                                : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                                }`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}