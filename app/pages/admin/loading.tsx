"use client";


export default function Loading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="space-y-2">
                <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                <div className="h-4 w-80 bg-slate-100 dark:bg-slate-800/50 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                            <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800/50 rounded" />
                        </div>
                        <div className="space-y-3">
                            <div className="h-9 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                            <div className="h-4 w-32 bg-slate-100 dark:bg-slate-800/50 rounded" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="h-6 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                    <div className="h-4 w-16 bg-slate-100 dark:bg-slate-800/50 rounded" />
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                                <div className="space-y-2">
                                    <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded" />
                                    <div className="h-3 w-48 bg-slate-100 dark:bg-slate-800/50 rounded" />
                                </div>
                            </div>
                            <div className="text-right space-y-2">
                                <div className="h-3 w-16 bg-slate-100 dark:bg-slate-800/50 rounded ml-auto" />
                                <div className="h-5 w-20 bg-slate-200 dark:bg-slate-800 rounded-full ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}