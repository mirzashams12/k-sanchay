"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    MoreVertical,
    CheckCircle2,
    XCircle,
    Mail,
    Edit2,
    Trash2,
    ShieldAlert,
    Search
} from "lucide-react";
import { Member } from "@/app/types/member";
import EditMemberModal from "./edit";
import MemberInfoModal from "./info";

interface MemberListProps {
    members: Member[];
    searchTerm: string; // This prop is now handled internally or passed from parent
}

export default function MemberList({ members, searchTerm }: MemberListProps) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [localSearch, setLocalSearch] = useState("");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const activeSearch = localSearch || searchTerm;

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        m.username.toLowerCase().includes(activeSearch.toLowerCase())
    );

    const handleEdit = (member: Member) => {
        setSelectedMember(member);
        setIsEditModalOpen(true);
    };

    const handleViewInfo = (member: Member) => {
        setSelectedMember(member);
        setIsInfoModalOpen(true);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar - Responsive */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search members by name or username..."
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                />
            </div>

            <div className="bg-transparent md:bg-white md:dark:bg-slate-900 md:rounded-2xl md:border md:border-slate-200 md:dark:border-slate-800 md:shadow-sm overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Member</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Joined</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Balance</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredMembers.map((member, index) => (
                                <motion.tr
                                    key={member.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td
                                        className="px-6 py-4 cursor-pointer"
                                        onClick={() => handleViewInfo(member)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600">
                                                {member.full_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900 dark:text-white">{member.full_name}</p>
                                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {member.username}@sanchayika.com
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${String(member.is_activated) === 'active' || member.is_activated === true
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                            : String(member.is_activated) === 'pending'
                                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30'
                                            }`}>
                                            {String(member.is_activated) === 'active' || member.is_activated === true ? (
                                                <CheckCircle2 className="w-3 h-3" />
                                            ) : String(member.is_activated) === 'pending' ? (
                                                <XCircle className="w-3 h-3" />
                                            ) : (
                                                <ShieldAlert className="w-3 h-3" />
                                            )}
                                            {member.is_activated === true ? 'active' : String(member.is_activated)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {member.joined}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">
                                        {member.balance}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {String(member.is_activated) === 'pending' && (
                                                <button
                                                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                    title="Approve"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleEdit(member)}
                                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 className="w-5 h-5" />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View: Card-based layout */}
                <div className="md:hidden space-y-4">
                    {filteredMembers.map((member, index) => (
                        <motion.div
                            key={member.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div
                                    className="flex items-center gap-3"
                                    onClick={() => handleViewInfo(member)}
                                >
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center font-bold text-blue-600 text-lg">
                                        {member.full_name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{member.full_name}</p>
                                        <p className="text-xs text-slate-500">{member.username}</p>
                                    </div>
                                </div>
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${String(member.is_activated) === 'active' || member.is_activated === true
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30'
                                    }`}>
                                    {member.is_activated === true ? 'active' : String(member.is_activated)}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 py-3 border-y border-slate-50 dark:border-slate-800/50 mb-4">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Balance</p>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{member.balance}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Joined</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{member.joined}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    {String(member.is_activated) === 'pending' && (
                                        <button className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-xl text-xs font-semibold">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            Approve
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 rounded-xl">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {selectedMember && (
                    <EditMemberModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedMember(null);
                        }}
                        onSuccess={() => {
                            // In a real app, you'd refresh the data here
                            setIsEditModalOpen(false);
                            setSelectedMember(null);
                        }}
                        member={selectedMember}
                    />
                )}

                {selectedMember && (
                    <MemberInfoModal
                        isOpen={isInfoModalOpen}
                        onClose={() => {
                            setIsInfoModalOpen(false);
                            setSelectedMember(null);
                        }}
                        member={selectedMember}
                    />
                )}
            </div>
        </div>
    );
}