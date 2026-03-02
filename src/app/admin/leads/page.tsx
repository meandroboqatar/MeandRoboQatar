"use client";

import { useCallback, useEffect, useState, useRef } from "react";
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
    source?: string;
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

const SOURCE_COLORS: Record<string, string> = {
    manual: "bg-purple-100 text-purple-700",
    chatbot: "bg-teal-100 text-teal-700",
    "contact-form": "bg-blue-100 text-blue-700",
    "consultation-form": "bg-orange-100 text-orange-700",
};

const SOURCE_LABELS: Record<string, string> = {
    manual: "Manual",
    chatbot: "Chatbot",
    "contact-form": "Contact Form",
    "consultation-form": "Consultation",
};

const STATUSES = ["new", "contacted", "qualified", "closed"];
const SOURCES = ["manual", "chatbot", "contact-form", "consultation-form"];

const EMPTY_LEAD: Partial<Lead> = {
    fullName: "",
    email: "",
    phone: "",
    companyName: "",
    industry: "",
    message: "",
    status: "new",
    assignedTo: "",
    notes: "",
};

export default function AdminLeadsPage() {
    const { token } = useAdminAuth();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [sourceFilter, setSourceFilter] = useState("");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [assignedFilter, setAssignedFilter] = useState("");

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);
    const [modalSaving, setModalSaving] = useState(false);
    const [modalError, setModalError] = useState("");

    // Delete
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Editable inline fields
    const [editingNotes, setEditingNotes] = useState<Record<string, string>>({});

    const formRef = useRef<HTMLFormElement>(null);

    const hasActiveFilters = !!(search || statusFilter || sourceFilter || dateFrom || dateTo || assignedFilter);

    // Derive unique assignedTo values from loaded leads
    const assignedValues = Array.from(
        new Set(leads.map((l) => l.assignedTo).filter(Boolean) as string[])
    ).sort();

    const fetchLeads = useCallback(
        async (cursor?: string) => {
            if (!token) return;
            setLoading(true);
            try {
                const params = new URLSearchParams({ limit: "50" });
                if (cursor) params.set("startAfter", cursor);
                if (statusFilter) params.set("status", statusFilter);
                if (sourceFilter) params.set("source", sourceFilter);
                if (dateFrom) params.set("dateFrom", dateFrom);
                if (dateTo) params.set("dateTo", dateTo);
                if (assignedFilter) params.set("assignedTo", assignedFilter);
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
        [token, statusFilter, sourceFilter, dateFrom, dateTo, assignedFilter, search]
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

    const handleSaveLead = async () => {
        if (!token || !editingLead) return;
        setModalSaving(true);
        setModalError("");

        try {
            if (!editingLead.fullName?.trim()) {
                setModalError("Full name is required.");
                setModalSaving(false);
                return;
            }

            if (editingLead.id) {
                // Edit existing
                await fetch("/api/admin/leads", {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingLead),
                });
                setLeads((prev) =>
                    prev.map((l) =>
                        l.id === editingLead.id ? { ...l, ...editingLead } as Lead : l
                    )
                );
            } else {
                // Create new
                const res = await fetch("/api/admin/leads", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(editingLead),
                });
                const data = await res.json();
                if (!res.ok) {
                    setModalError(data.error || "Failed to create lead");
                    setModalSaving(false);
                    return;
                }
                // Refresh the list
                fetchLeads();
            }
            setModalOpen(false);
            setEditingLead(null);
        } catch (err) {
            console.error("Save lead error:", err);
            setModalError("An error occurred. Please try again.");
        } finally {
            setModalSaving(false);
        }
    };

    const handleDeleteLead = async () => {
        if (!token || !deleteId) return;
        setDeleting(true);
        try {
            await fetch("/api/admin/leads", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ id: deleteId }),
            });
            setLeads((prev) => prev.filter((l) => l.id !== deleteId));
            setDeleteId(null);
        } catch (err) {
            console.error("Delete lead error:", err);
        } finally {
            setDeleting(false);
        }
    };

    const clearAllFilters = () => {
        setSearch("");
        setStatusFilter("");
        setSourceFilter("");
        setDateFrom("");
        setDateTo("");
        setAssignedFilter("");
    };

    const exportCSV = () => {
        const headers = [
            "Name", "Email", "Phone", "Company", "Industry",
            "Source", "Solutions", "Status", "Assigned To", "Notes",
            "Last Contact", "Date", "Message",
        ];
        const rows = leads.map((l) => [
            l.fullName, l.email, l.phone,
            l.companyName || "", l.industry || "",
            SOURCE_LABELS[l.source || ""] || l.source || "",
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

    // Stats
    const totalLeads = leads.length;
    const manualCount = leads.filter((l) => l.source === "manual").length;
    const websiteCount = totalLeads - manualCount;

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-brand-text">Leads</h1>
                    <div className="flex items-center gap-4 mt-1 text-xs text-brand-muted">
                        <span>{totalLeads} total</span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                            {manualCount} manual
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-teal-400 inline-block"></span>
                            {websiteCount} website
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setEditingLead({ ...EMPTY_LEAD });
                            setModalError("");
                            setModalOpen(true);
                        }}
                        className="btn-primary text-sm"
                    >
                        + Add Lead
                    </button>
                    <button
                        onClick={exportCSV}
                        className="btn-secondary text-xs"
                        title="Export as CSV"
                    >
                        ⬇ Export CSV
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            <div className="bg-white border border-brand-surface-border rounded-xl p-4 mb-6 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <input
                        type="text"
                        placeholder="Search leads…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                    />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                    >
                        <option value="">All Statuses</option>
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                            </option>
                        ))}
                    </select>
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                    >
                        <option value="">All Sources</option>
                        {SOURCES.map((s) => (
                            <option key={s} value={s}>
                                {SOURCE_LABELS[s]}
                            </option>
                        ))}
                    </select>
                    <input
                        type="date"
                        value={dateFrom}
                        onChange={(e) => setDateFrom(e.target.value)}
                        placeholder="From date"
                        title="From date"
                        className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                    />
                    <input
                        type="date"
                        value={dateTo}
                        onChange={(e) => setDateTo(e.target.value)}
                        placeholder="To date"
                        title="To date"
                        className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                    />
                    {assignedValues.length > 0 ? (
                        <select
                            value={assignedFilter}
                            onChange={(e) => setAssignedFilter(e.target.value)}
                            className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                        >
                            <option value="">All Assigned</option>
                            {assignedValues.map((v) => (
                                <option key={v} value={v}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="px-3 py-2 border border-brand-surface-border rounded-lg text-sm text-brand-muted bg-gray-50">
                            No assignments
                        </div>
                    )}
                </div>
                {hasActiveFilters && (
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            onClick={clearAllFilters}
                            className="text-xs text-red-500 hover:underline font-medium"
                        >
                            ✕ Clear all filters
                        </button>
                    </div>
                )}
            </div>

            {/* Table */}
            {loading && leads.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-green" />
                </div>
            ) : leads.length === 0 ? (
                <div className="text-center py-20 text-brand-muted">
                    <p className="text-4xl mb-4">📭</p>
                    <p>{hasActiveFilters ? "No matching leads." : "No leads yet."}</p>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="mt-3 text-brand-green text-sm hover:underline"
                        >
                            Clear all filters
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="bg-white border border-brand-surface-border rounded-xl overflow-hidden shadow-card">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-brand-surface-border bg-gray-50 text-left">
                                        <th className="px-4 py-3 font-medium text-brand-muted">Name</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden sm:table-cell">Email</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden lg:table-cell">Phone</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden xl:table-cell">Company</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted">Source</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted">Status</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Assigned</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted hidden md:table-cell">Date</th>
                                        <th className="px-4 py-3 font-medium text-brand-muted text-right">Actions</th>
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
                                                <td className="px-4 py-3 text-brand-muted hidden sm:table-cell">
                                                    {lead.email}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted hidden lg:table-cell">
                                                    {lead.phone}
                                                </td>
                                                <td className="px-4 py-3 text-brand-muted hidden xl:table-cell">
                                                    {lead.companyName || "—"}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${SOURCE_COLORS[lead.source || ""] || "bg-gray-100 text-gray-500"}`}
                                                    >
                                                        {SOURCE_LABELS[lead.source || ""] || lead.source || "Unknown"}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <select
                                                        value={lead.status || "new"}
                                                        onChange={(e) => {
                                                            e.stopPropagation();
                                                            updateLead(lead.id, { status: e.target.value });
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={`text-xs font-medium px-2.5 py-1 rounded-full border-0 cursor-pointer ${STATUS_COLORS[lead.status || "new"] || STATUS_COLORS.new}`}
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
                                                <td className="px-4 py-3 text-right space-x-2">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setEditingLead({ ...lead });
                                                            setModalError("");
                                                            setModalOpen(true);
                                                        }}
                                                        className="text-brand-green hover:underline text-xs"
                                                        title="Edit lead"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteId(lead.id);
                                                        }}
                                                        className="text-red-500 hover:underline text-xs"
                                                        title="Delete lead"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedId === lead.id && (
                                                <tr key={`${lead.id}-detail`} className="bg-gray-50 border-b border-brand-surface-border">
                                                    <td colSpan={9} className="px-4 py-5">
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

            {/* ─── Add / Edit Lead Modal ─── */}
            {modalOpen && editingLead && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => { setModalOpen(false); setEditingLead(null); }}
                    />
                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-brand-surface-border px-6 py-4 rounded-t-2xl flex items-center justify-between">
                            <h2 className="text-lg font-bold text-brand-text">
                                {editingLead.id ? "Edit Lead" : "Add New Lead"}
                            </h2>
                            <button
                                onClick={() => { setModalOpen(false); setEditingLead(null); }}
                                className="text-brand-muted hover:text-brand-text text-xl leading-none"
                            >
                                ✕
                            </button>
                        </div>

                        <form
                            ref={formRef}
                            onSubmit={(e) => { e.preventDefault(); handleSaveLead(); }}
                            className="p-6 space-y-4"
                        >
                            {modalError && (
                                <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-lg border border-red-200">
                                    {modalError}
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={editingLead.fullName || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, fullName: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingLead.email || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        value={editingLead.phone || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">Company</label>
                                    <input
                                        type="text"
                                        value={editingLead.companyName || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, companyName: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">Industry</label>
                                    <input
                                        type="text"
                                        value={editingLead.industry || ""}
                                        onChange={(e) => setEditingLead({ ...editingLead, industry: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-brand-muted mb-1">Status</label>
                                    <select
                                        value={editingLead.status || "new"}
                                        onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value })}
                                        className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                    >
                                        {STATUSES.map((s) => (
                                            <option key={s} value={s}>
                                                {s.charAt(0).toUpperCase() + s.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-brand-muted mb-1">Assigned To</label>
                                <input
                                    type="text"
                                    value={editingLead.assignedTo || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, assignedTo: e.target.value })}
                                    placeholder="e.g. John"
                                    className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-brand-muted mb-1">Message</label>
                                <textarea
                                    rows={3}
                                    value={editingLead.message || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, message: e.target.value })}
                                    className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green resize-y"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-brand-muted mb-1">Admin Notes</label>
                                <textarea
                                    rows={3}
                                    value={editingLead.notes || ""}
                                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                                    placeholder="Internal notes…"
                                    className="w-full px-3 py-2 border border-brand-surface-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/40 focus:border-brand-green resize-y"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-surface-border">
                                <button
                                    type="button"
                                    onClick={() => { setModalOpen(false); setEditingLead(null); }}
                                    className="btn-secondary text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={modalSaving}
                                    className="btn-primary text-sm disabled:opacity-50"
                                >
                                    {modalSaving
                                        ? "Saving…"
                                        : editingLead.id
                                            ? "Save Changes"
                                            : "Add Lead"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Delete Confirmation Dialog ─── */}
            {deleteId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setDeleteId(null)}
                    />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
                        <div className="text-4xl mb-4">🗑️</div>
                        <h3 className="text-lg font-bold text-brand-text mb-2">
                            Delete this lead?
                        </h3>
                        <p className="text-sm text-brand-muted mb-6">
                            This action cannot be undone. The lead will be permanently removed.
                        </p>
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="btn-secondary text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteLead}
                                disabled={deleting}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
                            >
                                {deleting ? "Deleting…" : "Delete Lead"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
