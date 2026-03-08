"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"; // Optimized for newer framer-motion versions
import { Eye, EyeOff, Lock, User } from "lucide-react"; // Changed Mail to User
import { createClient } from "../lib/supabase/client";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
    const router = useRouter();
    const { role, refreshSession } = useApp();
    const [username, setUsername] = useState(""); // Changed from email
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (role) {
            if (role === "admin") {
                router.push("/pages/admin");
            } if (role === "member") {
                router.push("/pages/user");
            }
        }
    }, [router, role]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const supabase = createClient();

        // Convert username to internal email format
        const internalEmail = `${username.toLowerCase().trim()}@sanchayika.com`;

        const { error } = await supabase.auth.signInWithPassword({
            email: internalEmail,
            password
        });

        if (error) {
            console.error("SUPABASE ERROR:", error.status, error.message);
            setError("Invalid username or password");
            setIsLoading(false);
        } else {
            router.refresh();
            refreshSession();
        }
    };

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center mb-8"
            >
                <Link href="/">
                    <Image
                        src="/sanchayika-icon.png"
                        alt="Sanchayika"
                        width={64}
                        height={64}
                        className="rounded-full shadow-lg"
                    />
                </Link>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Sign in to Sanchayika
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                    Manage your Kudumbashree accounts efficiently
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 py-8 px-4 shadow-xl rounded-xl sm:px-10 border border-gray-100 dark:border-gray-700"
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Username Field */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Username
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Password
                        </label>
                        <div className="mt-1 relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                type={showPassword ? "text" : "password"}
                                required
                                className="appearance-none block w-full pl-10 pr-10 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="remember-me"
                                className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                            >
                                Remember me
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>
                    </div>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                New to Sanchayika?
                            </span>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Link href="/signup" className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                            Create an account
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}