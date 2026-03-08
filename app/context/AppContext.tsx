/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Member, Transaction } from "@/app/types/index"
import { createClient } from "@/app/lib/supabase/client";

interface AppContextType {
    members: Member[];
    transactions: Transaction[];
    user: any | null;
    role: string | null;
    loading: boolean;
    error: Error | null;
    refreshData: () => Promise<void>;
    refreshTransactions: () => Promise<void>;
    refreshMembers: () => Promise<void>;
    refreshSession: () => Promise<void>;
    logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
    const [members, setMembers] = useState<Member[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [user, setUser] = useState<any | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        try {
            const response = await fetch('/api/members');
            if (!response.ok) throw new Error('Failed to fetch members');
            const data = await response.json();
            setMembers(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch members'));
        }
    };

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/transactions');
            if (!response.ok) throw new Error('Failed to fetch transactions');
            const data = await response.json();
            setTransactions(data);
        } catch (err) {
            console.error('Transaction fetch error:', err);
        }
    };

    const refreshData = async () => {
        setLoading(true);
        await Promise.all([fetchMembers(), fetchTransactions()]);
        setLoading(false);
    };

    const logout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        window.location.href = "/login";
    };

    const checkUser = async () => {
        const supabase = createClient();
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                const { data: profile } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", session.user?.id)
                    .single();

                if (profile) {
                    setRole(profile.role);
                    setUser(session.user);
                    setLoading(false);
                }
            }
        } catch (error) {
            console.error("Error checking user session:", error);
        }
    };

    useEffect(() => {
        checkUser();
        refreshData();
    }, []);

    return (
        <AppContext.Provider value={{
            members,
            transactions,
            user,
            role,
            loading,
            error,
            refreshData,
            refreshTransactions: fetchTransactions,
            refreshMembers: fetchMembers,
            refreshSession: checkUser,
            logout
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useApp must be used within an AppProvider");
    return context;
};