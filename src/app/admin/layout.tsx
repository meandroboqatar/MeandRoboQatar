import type { Metadata } from "next";
import { AdminAuthProvider } from "@/components/AdminAuthProvider";
import { AdminShell } from "@/components/AdminShell";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Admin | MeandRobo",
    robots: { index: false, follow: false },
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminAuthProvider>
            <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
    );
}
