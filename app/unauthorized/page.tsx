/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md text-center"
            >
                {/* Logo Section */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 mb-12 group transition-transform hover:scale-105"
                >
                    <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-500/20">
                        <Image
                            src="/sanchayika-icon.png"
                            alt="Sanchayika"
                            width={32}
                            height={32}
                            className="brightness-0 invert"
                        />
                    </div>
                    <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                        Sanchayika
                    </span>
                </Link>

                {/* Error Content */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-red-500" />

                    <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-full">
                            <ShieldAlert className="w-12 h-12 text-red-600 dark:text-red-500" />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        Access Denied
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Oops! You don't have the required permissions to view this page. Please contact your administrator if you believe this is a mistake.
                    </p>

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25"
                        >
                            <Home className="w-4 h-4" />
                            Back to Home
                        </Link>
                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Go Back
                        </button>
                    </div>
                </div>

                <p className="mt-8 text-sm text-slate-400 dark:text-slate-600">
                    Error Code: 403 Forbidden
                </p>
            </motion.div>
        </div>
    );
}