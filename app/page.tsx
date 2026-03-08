
"use client";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import { useApp } from "./context/AppContext";

export default function Component() {
  const { role, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (role) {
      if (role === "admin") {
        router.push("/pages/admin");
      } if (role === "member") {
        router.push("/pages/user");
      }
    }
  }, [router, role]);

  // If loading or if a role exists (meaning redirection is about to happen), 
  // show the landing/splash UI to prevent dashboard flickering
  if (loading || role) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-3">
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
        </div>
        <Link href="/login">
          <button className="px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition-all active:scale-95">
            Sign In
          </button>
        </Link>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6 inline-block">
            Empowering Kudumbasree Units
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">
            Smart Money Management for <span className="text-blue-600">Community.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            A modern, secure, and transparent platform designed to help Kudumbasree members track savings, manage loans, and grow together.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <button className="group flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:opacity-90 transition-all w-full sm:w-auto active:scale-[0.98] touch-manipulation">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full"
        >
          {[
            { icon: ShieldCheck, title: "Secure", desc: "Enterprise-grade security for your funds" },
            { icon: TrendingUp, title: "Transparent", desc: "Real-time tracking of all transactions" },
            { icon: Users, title: "Community", desc: "Built for collective financial growth" }
          ].map((feature, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left">
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      <footer className="py-10 text-center text-slate-400 dark:text-slate-600 text-sm">
        <p>© {new Date().getFullYear()} Sanchayika. All rights reserved.</p>
      </footer>
    </div>
  );
}
