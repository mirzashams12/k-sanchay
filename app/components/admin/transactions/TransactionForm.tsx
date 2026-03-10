
import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import TransactionFormFields from './TransactionFormFields';
import { TransactionType } from '@/app/types';
import { useApp } from '@/app/context/AppContext';

interface TransactionFormProps {
    action: { id: string; title: string; };
    activeTab: TransactionType;
    isFormOpen: boolean;
    setIsFormOpen: (isOpen: boolean) => void;
    setActiveTab: (tab: TransactionType | null) => void;
    onSuccess: () => void;
    setMessage: (message: { text: string; type: 'success' | 'error' } | null) => void;
}

export default function TransactionForm({
    action,
    activeTab,
    isFormOpen,
    setIsFormOpen,
    setActiveTab,
    onSuccess,
    setMessage,
}: TransactionFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { members } = useApp();

    // Searchable Member State
    const [memberSearch, setMemberSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null!);

    // Form State
    const [formData, setFormData] = useState({
        member_id: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        reference_id: '', // Used for loan_id in repayments
    });

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
            onSuccess(); // Refresh list
            setMemberSearch("");
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'An unknown error occurred';
            setMessage({ text: msg, type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (activeTab !== action.id || !isFormOpen) {
        return null;
    }

    return (
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
    );
}