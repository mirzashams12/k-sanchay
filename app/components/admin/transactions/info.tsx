"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Calendar,
    Hash,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    FileText,
    CreditCard,
    ArrowDownLeft,
    ArrowUpRight,
    ShieldCheck
} from "lucide-react";
import { Transaction } from "@/app/types/transaction";

interface TransactionInfoProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction | null;
}

export default function TransactionInfoModal({ isOpen, onClose, transaction }: TransactionInfoProps) {
    if (!transaction) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-900/30';
            case 'pending': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-900/30';
            case 'failed': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30';
            default: return 'text-slate-600 bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-4 h-4" />;
            case 'pending': return <Clock className="w-4 h-4" />;
            case 'failed': return <XCircle className="w-4 h-4" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

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
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Transaction Details</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center text-center space-y-2">
                                <div className={`p-4 rounded-full ${transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                    {transaction.type === 'deposit' ? <ArrowDownLeft className="w-8 h-8" /> : <ArrowUpRight className="w-8 h-8" />}
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-slate-900 dark:text-white">₹{transaction.amount}</p>
                                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{transaction.type.replace('_', ' ')}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <Hash className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Reference ID</span>
                                    </div>
                                    <span className="text-sm font-mono font-medium text-slate-900 dark:text-white">{transaction.reference_id}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Member</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{transaction.member_name}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Status</span>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getStatusColor(transaction.status)}`}>
                                        {getStatusIcon(transaction.status)}
                                        {transaction.status}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Method</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white uppercase">{transaction.payment_method.replace('_', ' ')}</span>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-sm text-slate-500">Date</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{new Date(transaction.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                                </div>

                                {transaction.description && (
                                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-4 h-4 text-slate-400" />
                                            <span className="text-sm text-slate-500">Description</span>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                            {transaction.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                >
                                    Download Receipt
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}