"use client";

import { useState, useEffect } from "react";
import {
    UserPlus,
    Loader2
} from "lucide-react";
import MemberList from "@/app/components/admin/members/list";
import CreateMemberModal from "@/app/components/admin/members/create";
import { Member } from "@/app/types/member";

export default function MembersPage() {
    const [searchTerm] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchMembers = async () => {
        try {
            const response = await fetch("/api/members");

            if (response.ok) {
                const data = await response.json();
                setMembers(data);
            }
        } catch (error) {
            console.error("Failed to fetch members:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Member Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage organization members and account approvals.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20"
                >
                    <UserPlus className="w-5 h-5" />
                    Add Member
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-4" />
                    <p className="text-slate-500">Loading members...</p>
                </div>
            ) : (
                <MemberList members={members} searchTerm={searchTerm} />
            )}

            <CreateMemberModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    fetchMembers();
                }}
            />
        </div>
    );
}