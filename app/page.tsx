"use client";
import Image from "next/image";
import {
  ChevronRight,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <Image
            src="/sanchayika-icon.png"
            alt="Sanchayika"
            width={40}
            height={40}
            className="rounded-full"
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Sanchayika
          </h1>
        </div>
      </header>
      <main className="flex-1 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here's a summary of your account.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Balance
            </h3>
            <p className="text-3xl font-bold text-green-500">₹1,25,000</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Loan
            </h3>
            <p className="text-3xl font-bold text-red-500">₹25,000</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Total Fines
            </h3>
            <p className="text-3xl font-bold text-yellow-500">₹500</p>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Recent Transactions
              </h3>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                    <Plus className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Weekly Deposit
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      May 28, 2024
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-500">+₹500</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Balance: ₹1,25,500
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </li>
              <li className="flex items-center justify-between p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 dark:bg-red-900 p-2 rounded-full">
                    <Plus className="w-5 h-5 text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Loan Repayment
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      May 25, 2024
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-red-500">-₹1,000</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Balance: ₹1,25,000
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
