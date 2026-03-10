/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { User } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { TransactionType } from '@/app/types';

interface TransactionFormFieldsProps {
    activeTab: TransactionType | null;
    formData: any;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isSubmitting: boolean;
    members: any[] | undefined;
    memberSearch: string;
    setMemberSearch: (search: string) => void;
    isDropdownOpen: boolean;
    setIsDropdownOpen: (isOpen: boolean) => void;
    selectedMember: any;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export default function TransactionFormFields({
    activeTab,
    formData,
    handleInputChange,
    isSubmitting,
    members,
    memberSearch,
    setMemberSearch,
    isDropdownOpen,
    setIsDropdownOpen,
    selectedMember,
    dropdownRef,
    setFormData
}: TransactionFormFieldsProps) {
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