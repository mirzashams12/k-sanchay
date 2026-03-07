import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
            <div className="relative flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-blue-500/20 rounded-full animate-pulse" />
            </div>
            <h2 className="mt-4 text-lg font-medium text-slate-600 dark:text-slate-400 animate-pulse">
                Loading Sanchayika...
            </h2>
        </div>
    );
}
