/* eslint-disable @typescript-eslint/no-explicit-any */
import { History, Filter, ArrowUpRight, ArrowDownLeft, Trash2, Calendar, Tag } from 'lucide-react';

interface TransactionListProps {
    transactions: any[];
    loading: boolean;
    onDelete: (id: string, type: string) => void;
}

export default function TransactionList({ transactions, loading, onDelete }: TransactionListProps) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <History className="w-5 h-5 text-slate-400" />
                        Recent Activity
                    </h2>
                </div>
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium rounded-full">
                    {transactions.length} records
                </span>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-500">No transactions found for this category.</p>
                    </div>
                ) : (
                    transactions.map((t) => (
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
                                        onClick={() => onDelete(t.reference_id, t.type)}
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
    );
}