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
    ShieldAlert
} from "lucide-react";
import { Member } from "@/app/types/member";
import EditMemberModal from "./edit";
import MemberInfoModal from "./info";

interface MemberListProps {
    members: Member[];
    searchTerm: string;
}

export default function MemberList({ members, searchTerm }: MemberListProps) {
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const filteredMembers = members.filter(m =>
        m.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.username.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
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
    );
}