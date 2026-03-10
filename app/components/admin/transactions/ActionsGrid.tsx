/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Wallet, Landmark, Receipt, HandCoins } from 'lucide-react';
import QuickActionCard from './QuickActionCard';
import TransactionForm from './TransactionForm';
import { TransactionType } from '@/app/types';
import TransactionCard from './singleTransactionCard';

const actions = [
    { id: 'deposit', title: 'Deposit', desc: 'Member contribution', icon: <Wallet />, color: 'emerald' },
    { id: 'loan_disbursement', title: 'Disburse', desc: 'Issue new loan', icon: <Landmark />, color: 'blue' },
    { id: 'loan_repayment', title: 'Repayment', desc: 'Collect loan due', icon: <Receipt />, color: 'indigo' },
    { id: 'payout', title: 'Payout', desc: 'Withdrawal/Interest', icon: <HandCoins />, color: 'rose' }
];

interface ActionsGridProps {
    activeTab: TransactionType | null;
    setActiveTab: (tab: TransactionType | null) => void;
    isFormOpen: boolean;
    setIsFormOpen: (isOpen: boolean) => void;
    onSuccess: () => void;
    setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
    transactions: any[];
    onDelete: (id: string, type: string) => void;
    onEdit?: (transaction: any) => void;
}

export default function ActionsGrid({
    activeTab,
    setActiveTab,
    isFormOpen,
    setIsFormOpen,
    onSuccess,
    setMessage,
    transactions,
    onDelete,
    onEdit
}: ActionsGridProps) {
    return (
        <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 transition-all duration-500 ease-in-out">
            {actions.map((action) => (
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

                    <TransactionForm
                        action={action}
                        activeTab={activeTab as TransactionType}
                        isFormOpen={isFormOpen}
                        setIsFormOpen={setIsFormOpen}
                        setActiveTab={setActiveTab}
                        onSuccess={onSuccess}
                        setMessage={setMessage}
                    />

                    {activeTab === action.id && !isFormOpen && (
                        <div className="space-y-4">
                            <TransactionCard
                                key={transactions[0]?.id}
                                transaction={transactions[0]}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}