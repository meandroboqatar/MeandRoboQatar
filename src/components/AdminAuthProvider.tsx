"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import { onAuthStateChanged, signOut as _signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";

interface AdminAuthCtx {
    user: User | null;
    loading: boolean;
    token: string | null;
    signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthCtx>({
    user: null,
    loading: true,
    token: null,
    signOut: async () => { },
});

export function useAdminAuth() {
    return useContext(AdminAuthContext);
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const result = await firebaseUser.getIdTokenResult();
                    if (result.claims.admin) {
                        setUser(firebaseUser);
                        setToken(result.token);
                        setIsAdmin(true);
                    } else {
                        // Signed in but not admin
                        await _signOut(auth);
                        setUser(null);
                        setToken(null);
                        setIsAdmin(false);
                    }
                } catch {
                    setUser(null);
                    setToken(null);
                    setIsAdmin(false);
                }
            } else {
                setUser(null);
                setToken(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Redirect unauthenticated users to login (except on login page)
    useEffect(() => {
        if (!loading && !isAdmin && pathname !== "/admin/login") {
            router.replace("/admin/login");
        }
    }, [loading, isAdmin, pathname, router]);

    const handleSignOut = async () => {
        await _signOut(auth);
        router.replace("/admin/login");
    };

    // On the login page, render children even if not admin (so login form shows)
    if (pathname === "/admin/login") {
        return (
            <AdminAuthContext.Provider
                value={{ user, loading, token, signOut: handleSignOut }}
            >
                {children}
            </AdminAuthContext.Provider>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
            </div>
        );
    }

    // Not admin and not on login page → the useEffect above will redirect
    if (!isAdmin) {
        return null;
    }

    return (
        <AdminAuthContext.Provider
            value={{ user, loading, token, signOut: handleSignOut }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}
