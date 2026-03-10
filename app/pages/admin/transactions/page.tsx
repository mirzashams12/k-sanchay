/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { TransactionType } from '@/app/types';
import { History, Filter, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, Tag, X, Receipt, Landmark, Wallet, HandCoins, User } from 'lucide-react';
import { useApp } from '@/app/context/AppContext';
import { motion, AnimatePresence } from "framer-motion";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { members } = useApp();
    const [activeTab, setActiveTab] = useState<TransactionType | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    // Searchable Member State
    const [memberSearch, setMemberSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        member_id: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        reference_id: '', // Used for loan_id in repayments
    });

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedMember = members?.find(m => m.id === formData.member_id) || null;

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/transactions');
            if (!res.ok) throw new Error('Failed to fetch transactions');
            const data = await res.json();
            setTransactions(data);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to load transactions', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const payload = {
                type: activeTab,
                member_id: formData.member_id,
                amount: parseFloat(formData.amount),
                date: formData.date,
                reference_id: activeTab === 'loan_repayment' ? formData.reference_id : undefined,
            };

            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result.error || 'Transaction failed');
            }

            setMessage({ text: 'Transaction successful!', type: 'success' });
            setFormData({
                member_id: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
                reference_id: '',
            });
            setIsFormOpen(false);
            fetchTransactions(); // Refresh list
            setMemberSearch("");
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            const res = await fetch(`/api/transactions?id=${id}&type=${type}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setMessage({ text: 'Deleted successfully', type: 'success' });
            fetchTransactions();
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to delete transaction', type: 'error' });
        }
    };

    // Filter transactions for the current view
    // Note: This assumes the GET endpoint returns a 'type' field or we infer it.
    // If your view doesn't return 'type', you might need to adjust this filter logic.
    const filteredTransactions = transactions.filter(t => t.type === (activeTab || 'deposit'));

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Ledger</h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Track and record financial movements</p>
                    </div>
                </header>

                {/* Notification Area */}
                {message && (
                    <div className={`p-4 mb-6 rounded-xl flex justify-between items-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage(null)}><X className="w-4 h-4" /></button>
                    </div>
                )}

                {/* Interactive Action Grid */}
                <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 ease-in-out">
                    {[
                        { id: 'deposit', title: 'Deposit', desc: 'Member contribution', icon: <Wallet />, color: 'emerald' },
                        { id: 'loan_disbursement', title: 'Disburse', desc: 'Issue new loan', icon: <Landmark />, color: 'blue' },
                        { id: 'loan_repayment', title: 'Repayment', desc: 'Collect loan due', icon: <Receipt />, color: 'indigo' },
                        { id: 'payout', title: 'Payout', desc: 'Withdrawal/Interest', icon: <HandCoins />, color: 'rose' }
                    ].map((action) => (
                        <div key={action.id} className={`flex flex-col gap-4 transition-all duration-500 ${activeTab === action.id ? 'lg:col-span-2 row-span-2' : ''}`}>
                            <QuickActionCard
                                title={action.title}
                                description={action.desc}
                                icon={React.cloneElement(action.icon as React.ReactElement<any>, { className: "w-6 h-6" })}
                                color={action.color}
                                isActive={activeTab === action.id}
                                onClick={() => {
                                    setActiveTab(action.id as TransactionType);
                                    setIsFormOpen(true);
                                }}
                            />

                            {/* Inline Form - Appears right under the clicked card */}
                            {activeTab === action.id && isFormOpen && (
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-blue-500/20 shadow-xl animate-in zoom-in-95 duration-300">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-bold text-slate-900 dark:text-white">New {action.title}</h3>
                                        <button onClick={() => { setIsFormOpen(false); setActiveTab(null); }} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                                            <X className="w-4 h-4 text-slate-400" />
                                        </button>
                                    </div>
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <TransactionFormFields
                                            activeTab={activeTab}
                                            formData={formData}
                                            handleInputChange={handleInputChange}
                                            isSubmitting={isSubmitting}
                                            members={members}
                                            memberSearch={memberSearch}
                                            setMemberSearch={setMemberSearch}
                                            isDropdownOpen={isDropdownOpen}
                                            setIsDropdownOpen={setIsDropdownOpen}
                                            selectedMember={selectedMember}
                                            dropdownRef={dropdownRef}
                                            setFormData={setFormData}
                                        />
                                    </form>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {!activeTab && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HandCoins className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select a category to manage</h3>
                        <p className="text-slate-500 mt-2">Choose an action above to view history and record new entries</p>
                    </div>
                )}

                {/* Main Content: List */}
                {activeTab && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                    <History className="w-5 h-5 text-slate-400" />
                                    Recent Activity
                                </h2>
                            </div>
                            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                                {filteredTransactions.length} records
                            </span>
                        </div>

                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {loading ? (
                                <div className="p-12 text-center text-slate-500">Loading transactions...</div>
                            ) : filteredTransactions.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Filter className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500">No transactions found for this category.</p>
                                </div>
                            ) : (
                                filteredTransactions.map((t) => (
                                    <div key={t.id} className="p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${t.type === 'deposit' || t.type === 'loan_repayment'
                                                    ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                                                    : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                                                    }`}>
                                                    {t.type === 'deposit' || t.type === 'loan_repayment' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-900 dark:text-white">{t.member_name}</span>
                                                        {t.type === 'loan_repayment' && <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-500">Ref: {t.reference_id}</span>}
                                                    </div>
                                                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(t.date).toLocaleDateString()}</span>
                                                        <span className="flex items-center gap-1 capitalize"><Tag className="w-3 h-3" /> {t.status || 'completed'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className={`text-right font-bold text-lg ${t.type === 'deposit' || t.type === 'loan_repayment' ? 'text-emerald-600' : 'text-rose-600'
                                                    }`}>
                                                    {t.type === 'deposit' || t.type === 'loan_repayment' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                                                </div>
                                                <button
                                                    onClick={() => handleDelete(t.id, t.type)}
                                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickActionCard({ title, description, icon, color, onClick, isActive }: { title: string; description: string; icon: React.ReactNode; color: string; onClick: () => void; isActive?: boolean }) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 hover:border-emerald-200',
        blue: 'bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 hover:border-blue-200',
        indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 hover:border-indigo-200',
        rose: 'bg-rose-50/50 text-rose-600 border-rose-100 hover:bg-rose-100 dark:bg-rose-900/20 dark:border-rose-800 hover:border-rose-200',
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex flex-col items-start p-5 rounded-2xl border transition-all text-left group hover:shadow-md active:scale-95 ${isActive ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : colorClasses[color]}`}
        >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">{title}</span>
            <span className="text-sm opacity-70">{description}</span>
        </button>
    );
}

function TransactionFormFields({ activeTab, formData, handleInputChange, isSubmitting, members, memberSearch, setMemberSearch, isDropdownOpen, setIsDropdownOpen, selectedMember, dropdownRef, setFormData }: any) {
    const filteredMembers = members?.filter((m: any) =>
        m.full_name.toLowerCase().includes(memberSearch.toLowerCase()) ||
        m.username.toLowerCase().includes(memberSearch.toLowerCase())
    ) || [];

    return (
        <>
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
                            setFormData((prev: any) => ({ ...prev, member_id: '' }));
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
                                filteredMembers.map((member: any) => (
                                    <button
                                        key={member.id}
                                        type="button"
                                        onClick={() => {
                                            setFormData((prev: any) => ({ ...prev, member_id: member.id }));
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
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Amount</label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-slate-400">$</span>
                        <input
                            type="number"
                            name="amount"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleInputChange}
                            className="w-full pl-7 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                    <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                </div>
            </div>
            {activeTab === 'loan_repayment' && (
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Loan Ref ID</label>
                    <input
                        type="text"
                        name="reference_id"
                        required
                        value={formData.reference_id}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        placeholder="Loan ID"
                    />
                </div>
            )}
            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 rounded-xl transition-all hover:opacity-90 disabled:opacity-50 mt-2"
            >
                {isSubmitting ? 'Processing...' : 'Confirm Transaction'}
            </button>
        </>
    );
}