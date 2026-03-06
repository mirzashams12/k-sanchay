"use client";

import { Member } from "@/app/types/member";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Mail,
    Calendar,
    Wallet,
    Shield,
    Clock,
    ArrowUpRight,
    ArrowDownLeft,
    History
} from "lucide-react";

interface MemberInfoProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
}

export default function MemberInfoModal({ isOpen, onClose, member }: MemberInfoProps) {
    if (!member) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        {/* Header/Profile Section */}
                        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-cyan-500">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="absolute -bottom-12 left-8">
                                <div className="h-24 w-24 rounded-2xl bg-white dark:bg-slate-800 p-1 shadow-xl border border-slate-100 dark:border-slate-700">
                                    <div className="h-full w-full rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl font-bold text-blue-600">
                                        {member.full_name.charAt(0)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 p-8 space-y-8">
                            {/* Basic Info */}
                            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{member.full_name}</h2>
                                    <p className="text-slate-500 flex items-center gap-1.5 mt-1">
                                        <Mail className="w-4 h-4" />
                                        {member.username}@sanchayika.com
                                    </p>
                                </div>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${String(member.is_activated) === 'active' || member.is_activated === true
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                    }`}>
                                    <Shield className="w-3.5 h-3.5" />
                                    {member.is_activated === true ? 'active' : String(member.is_activated)}
                                </span>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Wallet className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Balance</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{member.balance}</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2 text-slate-500 mb-1">
                                        <Calendar className="w-4 h-4" />
                                        <span className="text-xs font-medium uppercase tracking-wider">Joined</span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 dark:text-white">{member.joined}</p>
                                </div>
                            </div>

                            {/* Recent Activity Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <History className="w-4 h-4 text-blue-500" />
                                        Recent Activity
                                    </h3>
                                    <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">View All</button>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { type: 'deposit', label: 'Weekly Savings', amount: '+₹500', time: '2 days ago' },
                                        { type: 'withdrawal', label: 'Loan Repayment', amount: '-₹1,200', time: '1 week ago' },
                                    ].map((activity, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${activity.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {activity.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{activity.label}</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                                                        <Clock className="w-3 h-3" />
                                                        {activity.time}
                                                    </div>
                                                </div>
                                            </div>
                                            <span className={`text-sm font-bold ${activity.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {activity.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                                >
                                    <User className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}