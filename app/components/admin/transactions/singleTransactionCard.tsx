/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState } from 'react';
import { Calendar, ArrowUpRight, ArrowDownLeft, Trash2, Edit2, User, X, Check } from 'lucide-react';

interface TransactionCardProps {
    transaction: any;
    onDelete: (id: string, type: string) => void;
    onEdit?: (transaction: any) => void;
}

export default function TransactionCard({ transaction, onDelete, onEdit }: TransactionCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editAmount, setEditAmount] = useState(transaction.amount);
    const [editDate, setEditDate] = useState(transaction.date);

    const isCredit = transaction.type === 'deposit' || transaction.type === 'loan_repayment';

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (onEdit) {
            onEdit({
                ...transaction,
                amount: editAmount,
                date: editDate
            });
        }
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleUpdate} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border-2 border-blue-500 shadow-lg animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-blue-500 uppercase">Editing Transaction</span>
                    <button type="button" onClick={() => setIsEditing(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
                <div className="space-y-3">
                    <input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                        <Check className="w-4 h-4" /> Save Changes
                    </button>
                </div>
            </form>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isCredit
                        ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'
                        : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30'
                        }`}>
                        {isCredit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {transaction.type.replace('_', ' ')}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[140px]">
                                {transaction.member_name}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className={`text-lg font-bold ${isCredit ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isCredit ? '+' : '-'}₹{parseFloat(transaction.amount).toLocaleString()}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(transaction.date).toLocaleDateString('en-IN')}
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-medium rounded-md">
                    ID: {transaction.reference_id || transaction.id.slice(0, 8)}
                </span>
                <div className="flex items-center gap-2">
                    {onEdit && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(transaction.reference_id, transaction.type)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}