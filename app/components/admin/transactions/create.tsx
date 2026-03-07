"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Loader2,
    CheckCircle2,
    AlertCircle,
    IndianRupee,
    Calendar,
    ArrowDownLeft,
    ArrowUpRight
} from "lucide-react";
import { TransactionType } from "@/app/types/transaction";
import { Member } from "@/app/types/member";

interface CreateTransactionProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateTransactionModal({ isOpen, onClose, onSuccess }: CreateTransactionProps) {
    const [members, setMembers] = useState<Member[]>([]);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [memberSearch, setMemberSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<TransactionType>("deposit");
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("/api/members");
                if (response.ok) {
                    const data = await response.json();
                    setMembers(data);
                }
            } catch (error) {
                console.error("Failed to fetch members:", error);
            }
        };
        if (isOpen) fetchMembers();
    }, [isOpen]);

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.username.toLowerCase().includes(memberSearch.toLowerCase())
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Simulating API call
            //post data to api
            const response = await fetch("/api/transactions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    member_id: selectedMember?.id,
                    amount,
                    type,
                    payment_method: "cash",
                    date,
                    status: "completed"
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create transaction");
            }


            setIsSuccess(true);
            setTimeout(() => {
                onSuccess();
                handleClose();
            }, 1000);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to create transaction");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedMember(null);
        setMemberSearch("");
        setAmount("");
        setError(null);
        setIsSuccess(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Transaction</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {isSuccess && (
                                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 flex items-center gap-3 text-green-600 dark:text-green-400 text-sm">
                                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                                    Transaction recorded successfully!
                                </div>
                            )}

                            <div className="space-y-1.5 relative" ref={dropdownRef}>
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Member</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="text"
                                        value={selectedMember ? selectedMember.full_name : memberSearch}
                                        onChange={(e) => {
                                            setMemberSearch(e.target.value);
                                            setSelectedMember(null);
                                            setIsDropdownOpen(true);
                                        }}
                                        onFocus={() => setIsDropdownOpen(true)}
                                        placeholder="Search or select member..."
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                    />
                                </div>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl"
                                        >
                                            {filteredMembers.length > 0 ? (
                                                filteredMembers.map((member) => (
                                                    <button
                                                        key={member.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedMember(member);
                                                            setMemberSearch(member.full_name);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col border-b border-slate-100 dark:border-slate-800 last:border-0"
                                                    >
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">{member.full_name}</span>
                                                        <span className="text-xs text-slate-500">@{member.username}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-3 text-sm text-slate-500 text-center">No members found</div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Type</label>
                                    <select
                                        value={type}
                                        onChange={(e) => setType(e.target.value as TransactionType)}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                    >
                                        <option value="deposit">Deposit</option>
                                        <option value="withdrawal">Withdrawal</option>
                                        <option value="loan_repayment">Loan Repayment</option>
                                        <option value="interest">Interest</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Amount (₹)</label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        required
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || isSuccess}
                                    className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${type === 'deposit'
                                        ? 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                                        }`}
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            {type === 'deposit' ? (
                                                <ArrowDownLeft className="w-4 h-4" />
                                            ) : (
                                                <ArrowUpRight className="w-4 h-4" />
                                            )}
                                            Create
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}