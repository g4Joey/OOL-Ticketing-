"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TopAppBar } from "@/components/layout/TopAppBar";
import { AdminAuditLog, fetchAdminLogs } from "@/lib/supabase/db";

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);
  const [selectedLog, setSelectedLog] = useState<AdminAuditLog | null>(null);

  useEffect(() => {
    async function loadLogs() {
      const data = await fetchAdminLogs();
      setLogs(data);
    }
    loadLogs();
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE_EVENT":
        return "bg-primary-container text-on-primary-container";
      case "LOGIN":
        return "bg-secondary-container text-on-secondary-container";
      case "UPDATE_EVENT":
        return "bg-tertiary-container text-on-tertiary-container";
      case "DELETE_EVENT":
        return "bg-error-container text-on-error-container";
      default:
        return "bg-surface-container text-on-surface";
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-16 pb-12 selection:bg-primary-container selection:text-on-primary-container">
      <TopAppBar variant="task" title="Audit & Access Logs" />

      <main className="flex-1 flex flex-col p-4 max-w-4xl mx-auto w-full gap-4">
        {/* Header Breadcrumb */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-on-surface-variant mb-1">
              <Link href="/admin" className="hover:underline text-primary">
                Admin
              </Link>
              <span>/</span>
              <span>Audit Trail</span>
            </div>
            <h1 className="font-[family-name:var(--font-montserrat)] text-2xl font-black text-on-surface">
              System & Security Logs
            </h1>
          </div>

          <Link
            href="/admin"
            className="text-xs font-bold text-on-surface-variant hover:text-on-surface p-2 border border-outline-variant rounded-xl"
          >
            ← Back to Admin
          </Link>
        </div>

        {/* Info Banner */}
        <div className="bg-surface-container-lowest rounded-2xl p-4 border border-outline-variant shadow-sm flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-primary">
              security
            </span>
            <span>
              Real-time audit records tracking admin logins, event publishing, and pricing changes.
            </span>
          </div>
          <span className="font-bold text-on-surface">{logs.length} logged entries</span>
        </div>

        {/* Logs Table */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low border-b border-outline-variant/50 text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
                <tr>
                  <th className="p-3.5">Timestamp</th>
                  <th className="p-3.5">Admin Email</th>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Target</th>
                  <th className="p-3.5">IP Address</th>
                  <th className="p-3.5 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30 font-medium">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container/50 transition-colors">
                    <td className="p-3.5 text-on-surface-variant whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-GH", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="p-3.5 font-bold text-on-surface whitespace-nowrap">
                      {log.admin_email}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getActionBadge(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3.5 text-on-surface whitespace-nowrap font-mono text-[11px]">
                      {log.target_id || log.target_type || "N/A"}
                    </td>
                    <td className="p-3.5 text-on-surface-variant font-mono text-[11px] whitespace-nowrap">
                      {log.ip_address || "127.0.0.1"}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-primary font-bold hover:underline"
                      >
                        View JSON
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* JSON Inspector Modal */}
        {selectedLog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-surface-container-lowest rounded-2xl p-5 max-w-lg w-full border border-outline-variant shadow-2xl relative">
              <div className="flex justify-between items-center border-b border-outline-variant/30 pb-3 mb-3">
                <h3 className="font-[family-name:var(--font-montserrat)] text-base font-bold text-on-surface">
                  Log Record Details
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="bg-neutral-900 text-neutral-100 p-3.5 rounded-xl font-mono text-xs overflow-x-auto max-h-72">
                <pre>{JSON.stringify(selectedLog, null, 2)}</pre>
              </div>

              <button
                onClick={() => setSelectedLog(null)}
                className="mt-4 w-full bg-surface-container text-on-surface font-bold py-2.5 rounded-xl hover:bg-surface-container-high transition-colors text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
