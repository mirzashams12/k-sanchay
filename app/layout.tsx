import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/app/components/theme-provider";
import { Toaster } from "@/app/components/ui/sonner";
import { AppProvider } from "./context/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sanchayika",
  description: "Kudumbasree Money Management App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppProvider>
            <main>{children}</main>
            <Toaster />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
