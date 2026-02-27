"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "@/components/AdminAuthProvider";

const navItems = [
    { href: "/admin/leads", label: "Leads", icon: "📋" },
    { href: "/admin/blog", label: "Blog", icon: "📝" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, signOut } = useAdminAuth();

    // On login page, render without shell
    if (pathname === "/admin/login") {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="hidden md:flex md:w-64 flex-col bg-brand-dark text-white">
                <div className="p-6 border-b border-white/10">
                    <Link href="/admin/leads" className="flex items-center gap-3">
                        <span className="text-2xl">🤖</span>
                        <div>
                            <span className="font-bold text-lg">MeandRobo</span>
                            <span className="block text-xs text-gray-400">
                                Admin Portal
                            </span>
                        </div>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${active
                                        ? "bg-brand-green/20 text-brand-green"
                                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-2">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        ← Back to Site
                    </Link>
                    <button
                        onClick={signOut}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors w-full text-left"
                    >
                        🚪 Sign Out
                    </button>
                    {user && (
                        <p className="px-4 text-xs text-gray-500 truncate">
                            {user.email}
                        </p>
                    )}
                </div>
            </aside>

            {/* Mobile top bar */}
            <div className="flex flex-col flex-1 min-w-0">
                <header className="md:hidden bg-brand-dark text-white px-4 py-3 flex items-center justify-between">
                    <Link href="/admin/leads" className="font-bold flex items-center gap-2">
                        <span>🤖</span> Admin
                    </Link>
                    <div className="flex items-center gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`text-sm ${pathname.startsWith(item.href)
                                        ? "text-brand-green"
                                        : "text-gray-300"
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <button
                            onClick={signOut}
                            className="text-sm text-gray-400 hover:text-red-400"
                        >
                            Exit
                        </button>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
