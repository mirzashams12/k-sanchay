import React from 'react';

interface QuickActionCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
    isActive?: boolean;
}

export default function QuickActionCard({ title, description, icon, color, onClick, isActive }: QuickActionCardProps) {
    const colorClasses: Record<string, string> = {
        emerald: 'bg-emerald-50/50 text-emerald-600 border-emerald-100 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 hover:border-emerald-200',
        blue: 'bg-blue-50/50 text-blue-600 border-blue-100 hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 hover:border-blue-200',
        indigo: 'bg-indigo-50/50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800 hover:border-indigo-200',
        rose: 'bg-rose-50/50 text-rose-600 border-rose-100 hover:bg-rose-100 dark:bg-rose-900/20 dark:border-rose-800 hover:border-rose-200',
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex flex-col items-start p-5 rounded-2xl border transition-all text-left group hover:shadow-md active:scale-95 ${isActive ? 'ring-2 ring-blue-500 border-transparent shadow-lg' : colorClasses[color]}`}
        >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm mb-3 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg">{title}</span>
            <span className="text-sm opacity-70">{description}</span>
        </button>
    );
}