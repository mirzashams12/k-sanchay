"use client";

import { useApp } from "@/app/context/AppContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ('admin' | 'member')[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { role, loading } = useApp();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!role || !allowedRoles.includes(role as 'admin' | 'member'))) {
            router.push("/unauthorized");
        }
    }, [role, loading, allowedRoles, router]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Only render children if the role matches
    if (role && allowedRoles.includes(role as 'admin' | 'member')) {
        return <>{children}</>;
    }

    return null;
}