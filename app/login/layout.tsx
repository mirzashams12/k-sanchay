import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Sanchayika",
    description: "Login to your Sanchayika account",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            {children}
        </div>
    );
}
