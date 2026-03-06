/* eslint-disable react/no-unescaped-entities */
"use client";

import { motion } from "framer-motion";
import {
    Shield,
    Bell,
    Globe,
    Save
} from "lucide-react";

const settingsSections = [
    {
        title: "General Settings",
        description: "Manage your organization's basic information and preferences.",
        icon: Globe,
        fields: [
            { label: "Organization Name", value: "Sanchayika Kudumbashree", type: "text" },
            { label: "Financial Year Start", value: "April 1st", type: "text" },
            { label: "Currency Symbol", value: "₹ (INR)", type: "text" },
        ]
    },
    {
        title: "Security & Access",
        description: "Control authentication methods and administrative permissions.",
        icon: Shield,
        fields: [
            { label: "Two-Factor Authentication", value: "Enabled", type: "status" },
            { label: "Session Timeout", value: "30 Minutes", type: "text" },
            { label: "Admin Approval for New Users", value: "Required", type: "status" },
        ]
    },
    {
        title: "Notification Preferences",
        description: "Configure how and when you receive system alerts.",
        icon: Bell,
        fields: [
            { label: "Email Alerts for Loans", value: "On", type: "status" },
            { label: "Weekly Summary Reports", value: "On", type: "status" },
            { label: "System Maintenance Alerts", value: "On", type: "status" },
        ]
    }
];

export default function SettingsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">System Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400">Configure the platform to match your organization's needs.</p>
                </div>
                <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all shadow-lg shadow-blue-500/20">
                    <Save className="w-5 h-5" />
                    Save Changes
                </button>
            </div>

            <div className="grid gap-6">
                {settingsSections.map((section, idx) => (
                    <motion.div
                        key={section.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start gap-4">
                            <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                <section.icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 dark:text-white">{section.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{section.description}</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            {section.fields.map((field) => (
                                <div key={field.label} className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {field.label}
                                    </label>
                                    <div className="flex items-center gap-4">
                                        {field.type === 'status' ? (
                                            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full uppercase tracking-wider">
                                                {field.value}
                                            </span>
                                        ) : (
                                            <input type="text" defaultValue={field.value} className="text-sm bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}