"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    User,
    Loader2,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Copy,
    Check,
    Key
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/client";
import { toast } from "sonner";

interface CreateMemberProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateMemberModal({ isOpen, onClose, onSuccess }: CreateMemberProps) {
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [copied, setCopied] = useState(false);

    const generatedUsername = useMemo(() => {
        return fullName.toLowerCase().trim().replace(/\s+/g, '_');
    }, [fullName]);

    const generatedPassword = useMemo(() => {
        return generatedUsername ? `${generatedUsername}123` : "";
    }, [generatedUsername]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!fullName.trim()) {
            setError("Full name is required");
            return;
        }

        setIsLoading(true);
        setError(null);

        const supabase = createClient();
        const internalEmail = `${generatedUsername}@sanchayika.com`;

        try {
            // 1. Create Auth User
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: internalEmail,
                password: generatedPassword,
                options: {
                    data: {
                        display_name: fullName,
                        phone: phone || null,
                        address: address || null,
                        is_admin_creation: true
                    },
                },
            });

            if (authError) throw authError;
            if (!authData.user) throw new Error("Failed to create auth user");

            setIsSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        if (isSuccess) onSuccess();
        setFullName("");
        setPhone("");
        setAddress("");
        setError(null);
        setIsSuccess(false);
        onClose();
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success("Credentials copied to clipboard");
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Member</h2>
                            <button
                                onClick={handleClose}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {isSuccess ? (
                            <div className="p-8 text-center space-y-6">
                                <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Member Created!</h3>
                                    <p className="text-slate-500 mt-1">Share these credentials with the member.</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-4 space-y-3 text-left border border-slate-100 dark:border-slate-700">
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Username</label>
                                        <p className="font-mono text-slate-900 dark:text-white">{generatedUsername}</p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] uppercase font-bold text-slate-400">Password</label>
                                        <p className="font-mono text-slate-900 dark:text-white">{generatedPassword}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => copyToClipboard(`Username: ${generatedUsername}\nPassword: ${generatedPassword}`)}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        Copy
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        Done
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            required
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="e.g. Kunjumol Shams"
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                        />
                                    </div>
                                    {fullName && (
                                        <p className="text-[10px] text-slate-500 flex items-center gap-1">
                                            <Key className="w-3 h-3" />
                                            Username will be: <span className="font-mono font-bold">{generatedUsername}</span>
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number (Optional)</label>
                                    <div className="relative">
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 border-r border-slate-200 dark:border-slate-700 pr-2">
                                            <span className="text-base" role="img" aria-label="India Flag">🇮🇳</span>
                                            <span className="text-sm font-medium text-slate-500">+91</span>
                                        </div>
                                        <input
                                            type="tel"
                                            pattern="[0-9]{10}"
                                            maxLength={10}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                            placeholder="00000 00000"
                                            className="w-full pl-20 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address (Optional)</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="Member's residential address"
                                            rows={2}
                                            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-900 dark:text-white resize-none"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        type="button"
                                        onClick={handleClose}
                                        className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !fullName}
                                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Member"}
                                    </button>
                                </div>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
