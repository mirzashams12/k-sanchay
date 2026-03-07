"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Eye,
    AlertTriangle,
    Loader2,
    X
} from "lucide-react";
import { Transaction } from "@/app/types/transaction";
import EditTransactionModal from "./edit";
import TransactionInfoModal from "./info";

interface TransactionListProps {
    transactions: Transaction[];
    searchTerm: string;
    onRefresh?: () => void;
}

export default function TransactionList({ transactions, searchTerm, onRefresh }: TransactionListProps) {
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const filteredTransactions = transactions.filter(t =>
        t.member_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsEditModalOpen(true);
    };

    const handleViewInfo = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsInfoModalOpen(true);
    };

    const handleDeleteClick = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedTransaction) return;

        setIsDeleting(true);
        try {
            const response = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                onRefresh?.();
                setIsDeleteModalOpen(false);
                setSelectedTransaction(null);
            }
        } catch (error) {
            console.error("Failed to delete transaction:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Transaction</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Member</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filteredTransactions.map((transaction, index) => (
                            <motion.tr
                                key={transaction.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${transaction.type === 'deposit' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {transaction.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white uppercase">{transaction.type.replace('_', ' ')}</p>
                                            <p className="text-xs text-slate-500 font-mono">{transaction.reference_id}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white">{transaction.member_name}</p>
                                    <p className="text-xs text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">₹{transaction.amount}</p>
                                    <p className="text-[10px] uppercase text-slate-400">{transaction.payment_method}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${transaction.status === 'completed' ? 'bg-green-100 text-green-700' :
                                        transaction.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {transaction.status === 'completed' ? <CheckCircle2 className="w-3 h-3" /> :
                                            transaction.status === 'pending' ? <Clock className="w-3 h-3" /> :
                                                <XCircle className="w-3 h-3" />}
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => handleViewInfo(transaction)}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(transaction)}
                                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedTransaction && (
                <EditTransactionModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedTransaction(null);
                    }}
                    onSuccess={() => {
                        setIsEditModalOpen(false);
                        setSelectedTransaction(null);
                        onRefresh?.();
                    }}
                    transaction={selectedTransaction}
                />
            )}

            {selectedTransaction && (
                <TransactionInfoModal
                    isOpen={isInfoModalOpen}
                    onClose={() => {
                        setIsInfoModalOpen(false);
                        setSelectedTransaction(null);
                    }}
                    transaction={selectedTransaction}
                />
            )}

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && selectedTransaction && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center"
                        >
                            <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Transaction?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                Are you sure you want to delete the transaction <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{selectedTransaction.reference_id}</span>? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    disabled={isDeleting}
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    disabled={isDeleting}
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isDeleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
                                className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}