/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { TransactionType } from '@/app/types';
import { HandCoins } from 'lucide-react';
import PageHeader from '@/app/components/admin/transactions/PageHeader';
import Notification from '@/app/components/admin/transactions/Notification';
import ActionsGrid from '@/app/components/admin/transactions/ActionsGrid';
import TransactionList from '@/app/components/admin/transactions/TransactionList';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TransactionType | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string } | null>(null);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    useEffect(() => {
        fetchTransactions();
    }, []);

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

    const confirmDelete = async () => {
        if (!deleteTarget) return;
        try {
            const res = await fetch(`/api/transactions?id=${deleteTarget.id}&type=${deleteTarget.type}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete');

            setMessage({ text: 'Deleted successfully', type: 'success' });
            await fetchTransactions();
            setDeleteTarget(null);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to delete transaction', type: 'error' });
        }
    };

    const handleEdit = async (transaction: any) => {
        try {
            const res = await fetch(`/api/transactions?id=${transaction.reference_id}&type=${transaction.type}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction),
            });

            if (!res.ok) throw new Error('Failed to update');

            setMessage({ text: 'Updated successfully', type: 'success' });
            fetchTransactions();
            setIsFormOpen(false);
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Failed to update transaction', type: 'error' });
        }
    };

    const filteredTransactions = transactions.filter(t => t.type === (activeTab || 'deposit')); //get first 3 transactions
    const recentTransactions = filteredTransactions.slice(0, 3);


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 lg:pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <PageHeader />

                {message && (
                    <Notification message={message} onClose={() => setMessage(null)} />
                )}

                <ActionsGrid
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    isFormOpen={isFormOpen}
                    setIsFormOpen={setIsFormOpen}
                    onSuccess={fetchTransactions}
                    setMessage={setMessage}
                    transactions={transactions}
                    onDelete={(id, type) => setDeleteTarget({ id, type })}
                    onEdit={handleEdit}
                />

                {!activeTab && (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <HandCoins className="w-10 h-10 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Select a category to manage</h3>
                        <p className="text-slate-500 mt-2">Choose an action above to view history and record new entries</p>
                    </div>
                )}

                {activeTab && (
                    <TransactionList
                        transactions={recentTransactions}
                        loading={loading}
                        onDelete={(id, type) => setDeleteTarget({ id, type })}
                    />
                )}
            </div>

            <AnimatePresence>
                {deleteTarget && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setDeleteTarget(null)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 text-center"
                        >
                            <div className="mx-auto w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Transaction?</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                                This action cannot be undone. The transaction record will be permanently removed from the ledger.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTarget(null)}
                                    className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-rose-500/20"
                                >
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}