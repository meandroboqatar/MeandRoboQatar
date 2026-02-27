"use client";

import { useCallback, useEffect, useState } from "react";
import { useAdminAuth } from "@/components/AdminAuthProvider";

interface Lead {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    companyName?: string;
    industry?: string;
    message?: string;
    sourcePage?: string;
    interestedSolutions?: string[];
    status?: string;
    notes?: string;
    assignedTo?: string;
    lastContactAt?: string;
    createdAt?: string;
}

const STATUS_COLORS: Record<string, string> = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    qualified: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-500",
};

const STATUSES = ["new", "contacted", "qualified", "closed"];

export default function AdminLeadsPage() {
    const { token } = useAdminAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

    const fetchLeads = useCallback(
        async (cursor?: string) => {
            if (!token) return;
            setLoading(true);
            try {
                const params = new URLSearchParams({ limit: "25" });
                if (cursor) params.set("startAfter", cursor);
                if (statusFilter) params.set("status", statusFilter);
                if (search.trim()) params.set("search", search.trim());

                const res = await fetch(`/api/admin/leads?${params}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (cursor) {
                    setLeads((prev) => [...prev, ...data.leads]);
                } else {
                    setLeads(data.leads || []);
                }
                setNextCursor(data.nextCursor);
            } catch (err) {
                console.error("Failed to load leads:", err);
            } finally {
                setLoading(false);
            }
        },
        [token, statusFilter, search]
    );

    useEffect(() => {
        const debounce = setTimeout(() => fetchLeads(), 300);
        return () => clearTimeout(debounce);
    }, [fetchLeads]);

    const updateLead = async (id: string, updates: Record<string, unknown>) => {
        if (!token) return;
        try {
            await fetch("/api/admin/leads", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id, ...updates }),
            });
            setLeads((prev) =>
                prev.map((l) => (l.id === id ? { ...l, ...updates } as Lead : l))
            );
        } catch (err) {
            console.error("Failed to update lead:", err);
        }
    };

    const exportCSV = () => {
        const headers = [
            "Name", "Email", "Phone", "Company", "Industry",
            "Solutions", "Status", "Assigned To", "Notes",
            "Last Contact", "Date", "Message",
        ];
        const rows = leads.map((l) => [
            l.fullName, l.email, l.phone,
            l.companyName || "", l.industry || "",
            l.interestedSolutions?.join("; ") || "",
            l.status || "new", l.assignedTo || "", l.notes || "",
            l.lastContactAt ? new Date(l.lastContactAt).toLocaleDateString() : "",
            l.createdAt ? new Date(l.createdAt).toLocaleDateString() : "",
            (l.message || "").replace(/[\n\r]+/g, " "),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <h1 className="text-2xl font-bold text-brand-text">Leads</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-brand-muted">
                        {leads.length} lead{leads.length !== 1 ? "s" : ""}
                    </span>
                    <button
                        onClick={exportCSV}
                        className="btn-secondary text-xs"
                        title="Export as CSV"
                    >
                        ⬇ Export CSV
                    </button>
                </div>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Search leads…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                >
                    <option value="">All Statuses</option>
                    {STATUSES.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {loading && leads.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-20 text-brand-muted">
                    <p className="text-4xl mb-4">📭</p>
                    <p>{search || statusFilter ? "No matching leads." : "No leads yet."}</p>
                </div>
            ) : (
                <>
                    <div className="bg-white border border-brand-surface-border rounded-xl overflow-hidden shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand-surface-border bg-gray-50 text-left">
                                        <th className="px-4 py-3 font-medium text-brand-muted">Name</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted">Email</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden lg:table-cell">Phone</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden xl:table-cell">Company</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted">Status</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Assigned</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead) => (
                                        <tr key={lead.id} className="contents">
                                            <tr
                                                className="border-b border-brand-surface-border hover:bg-gray-50 cursor-pointer transition-colors"
                                                onClick={() =>
                                                    setExpandedId(
                                                        expandedId === lead.id ? null : lead.id
                                                    )
                                                }
                                            >
                                                <td className="px-4 py-3 font-medium">
                                                    {lead.fullName}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted">
                                                    {lead.email}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted hidden lg:table-cell">
                                                    {lead.phone}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted hidden xl:table-cell">
                                                    {lead.companyName || "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={lead.status || "new"}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            updateLead(lead.id, { status: e.target.value });
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[lead.status || "new"] ||
                                                            STATUS_COLORS.new
                                                            }`}
                                                    >
                                                        {STATUSES.map((s) => (
                                                            <option key={s} value={s}>
                                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted text-xs hidden md:table-cell">
                                                    {lead.assignedTo || "—"}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted text-xs hidden md:table-cell">
                                                    {lead.createdAt
                                                        ? new Date(lead.createdAt).toLocaleDateString()
                                                        : "—"}
                                                </td>
                                            </tr>
                                            {expandedId === lead.id && (
                                                <tr key={`${lead.id}-detail`} className="bg-gray-50 border-b border-brand-surface-border">
                                                    <td colSpan={7} className="px-4 py-5">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                                                            <div>
                                                                <p className="text-brand-muted text-xs mb-1">Industry</p>
                                                                <p>{lead.industry || "—"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-brand-muted text-xs mb-1">Source Page</p>
                                                                <p>{lead.sourcePage || "—"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-brand-muted text-xs mb-1">Interested Solutions</p>
                                                                <p>{lead.interestedSolutions?.join(", ") || "—"}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-brand-muted text-xs mb-1">Last Contact</p>
                                                                <p>
                                                                    {lead.lastContactAt
                                                                        ? new Date(lead.lastContactAt).toLocaleDateString()
                                                                        : "—"}
                                                                </p>
                                                            </div>

                                                            {/* Assigned To — editable */}
                                                            <div>
                                                                <p className="text-brand-muted text-xs mb-1">Assigned To</p>
                                                                <input
                                                                    type="text"
                                                                    defaultValue={lead.assignedTo || ""}
                                                                    placeholder="e.g. John"
                                                                    onBlur={(e) => {
                                                                        const val = e.target.value.trim();
                                                                        if (val !== (lead.assignedTo || "")) {
                                                                            updateLead(lead.id, { assignedTo: val });
                                                                        }
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-full px-3 py-1.5 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40"
                                                                />
                                                            </div>

                                                            {/* Mark contacted button */}
                                                            <div className="flex items-end">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        updateLead(lead.id, {
                                                                            lastContactAt: new Date().toISOString(),
                                                                            status: lead.status === "new" ? "contacted" : lead.status,
                                                                        });
                                                                    }}
                                                                    className="btn-secondary text-xs"
                                                                >
                                                                    📞 Mark Contacted Now
                                                                </button>
                                                            </div>

                                                            {/* Message */}
                                                            <div className="md:col-span-2">
                                                                <p className="text-brand-muted text-xs mb-1">Message</p>
                                                                <p className="whitespace-pre-wrap">
                                                                    {lead.message || "—"}
                                                                </p>
                                                            </div>

                                                            {/* Notes — editable */}
                                                            <div className="md:col-span-2">
                                                                <p className="text-brand-muted text-xs mb-1">Admin Notes</p>
                                                                <textarea
                                                                    rows={3}
                                                                    defaultValue={editingNotes[lead.id] ?? lead.notes ?? ""}
                                                                    placeholder="Internal notes about this lead…"
                                                                    onChange={(e) =>
                                                                        setEditingNotes((prev) => ({
                                                                            ...prev,
                                                                            [lead.id]: e.target.value,
                                                                        }))
                                                                    }
                                                                    onBlur={(e) => {
                                                                        const val = e.target.value;
                                                                        if (val !== (lead.notes || "")) {
                                                                            updateLead(lead.id, { notes: val });
                                                                        }
                                                                    }}
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 resize-y"
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {nextCursor && (
                        <div className="text-center mt-6">
                            <button
                                onClick={() => fetchLeads(nextCursor)}
                                disabled={loading}
                                className="btn-secondary text-sm"
                            >
                                {loading ? "Loading…" : "Load More"}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
