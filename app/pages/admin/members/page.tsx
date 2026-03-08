"use client";

import { useState } from "react";
import {
    UserPlus
} from "lucide-react";
import MemberList from "@/app/components/admin/members/list";
import CreateMemberModal from "@/app/components/admin/members/create";
import { useApp } from "@/app/context/AppContext";
import Loading from "./loading";

export default function MembersPage() {
    const { members, loading, refreshData } = useApp();
    const [searchTerm] = useState("");
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);



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

            {loading ? (
                <Loading />
            ) : (
                <MemberList members={members} searchTerm={searchTerm} />
            )}

            <CreateMemberModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={() => {
                    setIsCreateModalOpen(false);
                    refreshData();
                }}
            />
        </div>
    );
}