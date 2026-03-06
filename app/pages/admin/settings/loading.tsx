"use client";

export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                    <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                </div>
                <div className="h-11 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>

            <div className="grid gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
                            <div className="h-11 w-11 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            <div className="space-y-2">
                                <div className="h-5 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                                <div className="h-3 w-56 bg-slate-100 dark:bg-slate-800/50 rounded" />
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {[1, 2].map((j) => (
                                <div key={j} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-9 w-full md:w-64 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}