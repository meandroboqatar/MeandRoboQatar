"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const result = await cred.user.getIdTokenResult();

            if (!result.claims.admin) {
                setError("Access denied. Admin privileges required.");
                await auth.signOut();
                setLoading(false);
                return;
            }

            router.replace("/admin/leads");
        } catch (err: unknown) {
            const code = (err as { code?: string })?.code;
            switch (code) {
                case "auth/invalid-credential":
                case "auth/wrong-password":
                case "auth/user-not-found":
                    setError("Invalid email or password.");
                    break;
                case "auth/user-disabled":
                    setError("This account has been disabled.");
                    break;
                case "auth/too-many-requests":
                    setError("Too many attempts. Please try again later.");
                    break;
                default:
                    setError("Sign-in failed. Please try again.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <span className="text-5xl">🤖</span>
                    <h1 className="mt-4 text-2xl font-bold text-brand-text">
                        Admin Portal
                    </h1>
                    <p className="text-brand-muted text-sm mt-1">
                        Sign in with your admin credentials
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="bg-white border border-brand-surface-border rounded-xl p-6 shadow-card space-y-5"
                >
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="admin-email"
                            className="block text-sm font-medium text-brand-text mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            id="admin-email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-shadow"
                            placeholder="admin@meandrobo.com.qa"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="admin-password"
                            className="block text-sm font-medium text-brand-text mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            id="admin-password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                                Signing in…
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-brand-muted mt-6">
                    <a href="/" className="hover:text-brand-green transition-colors">
                        ← Back to meandrobo.com.qa
                    </a>
                </p>
            </div>
        </div>
    );
}
