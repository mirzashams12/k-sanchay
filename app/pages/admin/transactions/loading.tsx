"use client";

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-80 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                </div>
                <div className="h-11 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="h-11 flex-1 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                <div className="flex gap-2">
                    <div className="h-11 w-32 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    <div className="h-11 w-28 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="h-12 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800" />
                <div className="p-6 space-y-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="space-y-2">
                                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3 w-32 bg-slate-100 dark:bg-slate-800/50 rounded" />
                            </div>
                            <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                            <div className="h-6 w-20 bg-slate-100 dark:bg-slate-800/50 rounded-full" />
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}