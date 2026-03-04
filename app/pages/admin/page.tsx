export const dynamic = 'force-dynamic';
/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import {
    Users,
    TrendingUp,
    AlertCircle,
    Clock
} from "lucide-react";

const stats = [
    {
        label: "Total Members",
        value: "48",
        change: "+3 this month",
        icon: Users,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
        label: "Total Collection",
        value: "₹4,25,000",
        change: "+12% vs last month",
        icon: TrendingUp,
        color: "text-green-600",
        bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
        label: "Pending Approvals",
        value: "5",
        change: "Requires action",
        icon: AlertCircle,
        color: "text-amber-600",
        bg: "bg-amber-100 dark:bg-amber-900/20",
    },
];

const recentActivities = [
    { id: 1, user: "Rahul Sharma", action: "Requested a loan", amount: "₹10,000", time: "2 hours ago", status: "pending" },
    { id: 2, user: "Anjali Nair", action: "Weekly Deposit", amount: "₹500", time: "5 hours ago", status: "completed" },
    { id: 3, user: "Suresh Kumar", action: "New Registration", amount: null, time: "Yesterday", status: "pending" },
];

export default function AdminDashboard() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Administrative Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">Monitor and manage your organization's financial health.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.bg} p-3 rounded-xl`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</span>
                            <span className="text-sm text-slate-500 mt-1">{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-500" />
                        Recent Activity
                    </h3>
                    <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View all</button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {recentActivities.map((activity) => (
                        <div key={activity.id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                                    {activity.user.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.user}</p>
                                    <p className="text-xs text-slate-500">{activity.action} {activity.amount && `• ${activity.amount}`}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-slate-400 mb-1">{activity.time}</p>
                                <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${activity.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30' : 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                    }`}>
                                    {activity.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}