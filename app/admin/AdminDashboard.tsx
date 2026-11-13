"use client";
import { useState, useTransition } from "react";
import type { Booking, BlockedDate } from "@/types/database";
import {
  updateBookingStatus,
  addBlockedDate,
  removeBlockedDate,
} from "@/app/book/actions";

// ─── Constants ───────────────────────────────────────────────
const SERVICE_LABELS: Record<string, string> = {
  web: "Web Dev",
  mobile: "Mobile",
  shopify: "Shopify",
  saas: "SaaS",
  ai: "AI",
  other: "Other",
};
const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.3)",
    color: "#fbbf24",
  },
  confirmed: {
    label: "Confirmed",
    bg: "rgba(74,222,128,0.1)",
    border: "rgba(74,222,128,0.3)",
    color: "#4ade80",
  },
  cancelled: {
    label: "Cancelled",
    bg: "rgba(239,68,68,0.1)",
    border: "rgba(239,68,68,0.25)",
    color: "#f87171",
  },
  completed: {
    label: "Completed",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.3)",
    color: "#fb923c",
  },
};

function fmt12h(t: string) {
  const [h, m] = t.split(":").map(Number);
  return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}
function fmtDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Status badge ─────────────────────────────────────────────
function StatusBadge({ status }: { status: Booking["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        color: cfg.color,
        borderRadius: 100,
        padding: "3px 12px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.5px",
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Booking detail modal ─────────────────────────────────────
function BookingModal({
  booking,
  onClose,
  onUpdated,
}: {
  booking: Booking;
  onClose: () => void;
  onUpdated: (b: Booking) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [notes, setNotes] = useState(booking.admin_notes ?? "");
  const [localStatus, setLocalStatus] = useState(booking.status);
  const [error, setError] = useState("");

  function save(newStatus: Booking["status"]) {
    setError("");
    startTransition(async () => {
      const res = await updateBookingStatus(booking.id, newStatus, notes);
      if (res.error) {
        setError(res.error);
        return;
      }
      setLocalStatus(newStatus);
      onUpdated({ ...booking, status: newStatus, admin_notes: notes });
    });
  }

  const STATUSES: Booking["status"][] = [
    "pending",
    "confirmed",
    "cancelled",
    "completed",
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(6px)",
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          zIndex: 1,
          background: "#0d0d1a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 20,
          padding: 40,
          width: "min(640px,90vw)",
          maxHeight: "85vh",
          overflowY: "auto",
          top: "30px",
          scrollbarWidth: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 28,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: 2,
                color: "var(--cyan)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Booking Details
            </div>
            <h2
              style={{
                fontFamily: "var(--font-sg),sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {booking.full_name}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#6b6b8a",
              fontSize: 24,
              cursor: "pointer",
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        {/* Info grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 32px",
            marginBottom: 28,
          }}
        >
          {[
            ["📧 Email", booking.email],
            ["📞 Phone", booking.phone ?? "—"],
            ["🏢 Company", booking.company ?? "—"],
            ["📅 Date", fmtDate(booking.preferred_date)],
            [
              "⏰ Time",
              `${fmt12h(booking.preferred_time)} (${booking.timezone})`,
            ],
            ["💼 Service", SERVICE_LABELS[booking.service] ?? booking.service],
            ["💰 Budget", booking.budget],
            ["🗓️ Timeline", booking.timeline],
          ].map(([label, value]) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: "#6b6b8a", marginBottom: 4 }}>
                {label}
              </div>
              <div style={{ fontSize: 14, color: "#fff" }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Project desc */}
        <div
          style={{
            marginBottom: 28,
            padding: 16,
            background: "rgba(255,255,255,0.02)",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: 11, color: "#6b6b8a", marginBottom: 8 }}>
            📝 Project Description
          </div>
          <div style={{ fontSize: 14, color: "#ccc", lineHeight: 1.65 }}>
            {booking.project_desc}
          </div>
        </div>

        {/* Admin notes */}
        <div style={{ marginBottom: 28 }}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              color: "#9090aa",
              marginBottom: 8,
            }}
          >
            Admin Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 10,
              padding: "10px 14px",
              color: "#fff",
              fontSize: 14,
              resize: "vertical",
              fontFamily: "Inter,sans-serif",
            }}
            placeholder="Internal notes about this booking..."
          />
        </div>

        {/* Status buttons */}
        <div>
          <div style={{ fontSize: 12, color: "#9090aa", marginBottom: 12 }}>
            Update Status
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s];
              const active = localStatus === s;
              return (
                <button
                  key={s}
                  onClick={() => save(s)}
                  disabled={isPending}
                  style={{
                    padding: "8px 20px",
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: isPending ? "not-allowed" : "pointer",
                    border: `1px solid ${active ? cfg.border : "rgba(255,255,255,0.1)"}`,
                    background: active ? cfg.bg : "transparent",
                    color: active ? cfg.color : "#6b6b8a",
                    transition: "all 0.2s",
                  }}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 16, color: "#f87171", fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}
        {isPending && (
          <div style={{ marginTop: 16, color: "#6b6b8a", fontSize: 13 }}>
            Saving…
          </div>
        )}

        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <code style={{ fontSize: 11, color: "#333" }}>{booking.id}</code>
          <div suppressHydrationWarning style={{ fontSize: 11, color: "#444" }}>
            Booked {new Date(booking.created_at).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Stats bar ────────────────────────────────────────────────
function Stats({ bookings }: { bookings: Booking[] }) {
  const counts = { pending: 0, confirmed: 0, cancelled: 0, completed: 0 };
  bookings.forEach((b) => counts[b.status]++);
  const upcoming = bookings.filter(
    (b) =>
      b.preferred_date >= new Date().toISOString().split("T")[0] &&
      b.status !== "cancelled",
  ).length;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5,1fr)",
        gap: 16,
        marginBottom: 40,
      }}
    >
      {[
        { label: "Total", value: bookings.length, color: "#fff" },
        { label: "Pending", value: counts.pending, color: "#fbbf24" },
        { label: "Confirmed", value: counts.confirmed, color: "#4ade80" },
        { label: "Upcoming", value: upcoming, color: "var(--cyan)" },
        { label: "Completed", value: counts.completed, color: "#fb923c" },
      ].map((s) => (
        <div
          key={s.label}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 14,
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              fontFamily: "var(--font-sg),sans-serif",
              color: s.color,
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: 12, color: "#6b6b8a", marginTop: 4 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Blocked dates panel ──────────────────────────────────────
function BlockedDatesPanel({ initial }: { initial: BlockedDate[] }) {
  const [list, setList] = useState<BlockedDate[]>(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) { setPrevInitial(initial); setList(initial); } // live update from server
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function add() {
    if (!date) {
      setError("Select a date");
      return;
    }
    setError("");
    startTransition(async () => {
      const res = await addBlockedDate(date, reason);
      if (res.error) {
        setError(res.error);
        return;
      }
      setList((l) => [
        ...l,
        {
          id: Date.now().toString(),
          blocked_date: date,
          reason: reason || null,
        },
      ]);
      setDate("");
      setReason("");
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await removeBlockedDate(id);
      setList((l) => l.filter((d) => d.id !== id));
    });
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "10px 14px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter,sans-serif",
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: 28,
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-sg),sans-serif",
          fontSize: 16,
          fontWeight: 600,
          color: "#fff",
          marginBottom: 20,
        }}
      >
        🚫 Blocked Dates
      </h3>

      <div
        style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}
      >
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ ...inputStyle, flex: "0 0 160px" }}
        />
        <input
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          style={{ ...inputStyle, flex: 1, minWidth: 160 }}
        />
        <button
          onClick={add}
          disabled={isPending}
          style={{
            background: "var(--violet)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Block Date
        </button>
      </div>
      {error && (
        <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12 }}>
          ⚠️ {error}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {list.length === 0 && (
          <div style={{ color: "#444", fontSize: 13 }}>No blocked dates.</div>
        )}
        {list.map((d) => (
          <div
            key={d.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(239,68,68,0.05)",
              border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 10,
              padding: "10px 16px",
            }}
          >
            <div>
              <span style={{ fontSize: 14, color: "#fff", fontWeight: 500 }}>
                {fmtDate(d.blocked_date)}
              </span>
              {d.reason && (
                <span
                  style={{ fontSize: 12, color: "#6b6b8a", marginLeft: 12 }}
                >
                  {d.reason}
                </span>
              )}
            </div>
            <button
              onClick={() => remove(d.id)}
              disabled={isPending}
              style={{
                background: "none",
                border: "none",
                color: "#f87171",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────
export default function AdminDashboard({
  bookings: initial,
  blockedDates,
}: {
  bookings: Booking[];
  blockedDates: BlockedDate[];
}) {
  const [bookings, setBookings] = useState<Booking[]>(initial);
  const [prevInitial, setPrevInitial] = useState(initial);
  if (prevInitial !== initial) { setPrevInitial(initial); setBookings(initial); } // live update from server
  const [selected, setSelected] = useState<Booking | null>(null);
  const [filter, setFilter] = useState<"all" | Booking["status"]>("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"bookings" | "blocked">("bookings");

  const today = new Date().toISOString().split("T")[0];

  const filtered = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .filter((b) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        b.full_name.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        (b.company ?? "").toLowerCase().includes(q)
      );
    });

  function onUpdated(updated: Booking) {
    setBookings((bs) => bs.map((b) => (b.id === updated.id ? updated : b)));
    setSelected(updated);
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 10,
    padding: "10px 16px",
    color: "#fff",
    fontSize: 14,
    fontFamily: "Inter,sans-serif",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 40px" }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: 3,
            color: "var(--cyan)",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Admin
        </div>
        <h1
          style={{
            fontFamily: "var(--font-sg),sans-serif",
            fontSize: "clamp(28px,3vw,42px)",
            fontWeight: 700,
            letterSpacing: "-1px",
            color: "#fff",
          }}
        >
          Booking Dashboard
        </h1>
      </div>

      <Stats bookings={bookings} />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 32,
          background: "rgba(255,255,255,0.03)",
          borderRadius: 12,
          padding: 4,
          width: "fit-content",
        }}
      >
        {(["bookings", "blocked"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              border: "none",
              background: tab === t ? "rgba(234,88,12,0.25)" : "transparent",
              color: tab === t ? "#fff" : "#6b6b8a",
              fontSize: 14,
              fontWeight: tab === t ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}
          >
            {t === "bookings"
              ? `📋 Bookings (${bookings.length})`
              : "🚫 Blocked Dates"}
          </button>
        ))}
      </div>

      {tab === "blocked" && <BlockedDatesPanel initial={blockedDates} />}

      {tab === "bookings" && (
        <>
          {/* Filters + search */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              placeholder="Search name, email, company…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...inputStyle, flex: "1 1 240px", minWidth: 200 }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {(
                [
                  "all",
                  "pending",
                  "confirmed",
                  "cancelled",
                  "completed",
                ] as const
              ).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 100,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: `1px solid ${filter === f ? "var(--cyan)" : "rgba(255,255,255,0.1)"}`,
                    background:
                      filter === f ? "rgba(234,88,12,0.12)" : "transparent",
                    color: filter === f ? "var(--cyan)" : "#6b6b8a",
                    transition: "all 0.2s",
                    textTransform: "capitalize",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Table header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 80px",
                gap: 0,
                padding: "12px 24px",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {["Client", "Date & Time", "Service", "Budget", "Status", ""].map(
                (h) => (
                  <div
                    key={h}
                    style={{
                      fontSize: 11,
                      color: "#6b6b8a",
                      fontWeight: 500,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                    }}
                  >
                    {h}
                  </div>
                ),
              )}
            </div>

            {filtered.length === 0 && (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "#444",
                  fontSize: 14,
                }}
              >
                No bookings match your filters.
              </div>
            )}

            {filtered.map((b, i) => {
              const isToday = b.preferred_date === today;
              const isPast = b.preferred_date < today;
              return (
                <div
                  key={b.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.8fr 1.5fr 1fr 1fr 1fr 80px",
                    gap: 0,
                    padding: "16px 24px",
                    borderBottom:
                      i < filtered.length - 1
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                    alignItems: "center",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    background: isToday
                      ? "rgba(234,88,12,0.04)"
                      : "transparent",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(255,255,255,0.03)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = isToday
                      ? "rgba(234,88,12,0.04)"
                      : "transparent")
                  }
                  onClick={() => setSelected(b)}
                >
                  <div>
                    <div
                      style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}
                    >
                      {b.full_name}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b6b8a" }}>
                      {b.email}
                    </div>
                    {b.company && (
                      <div
                        style={{ fontSize: 11, color: "#444", marginTop: 2 }}
                      >
                        {b.company}
                      </div>
                    )}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 13,
                        color: isToday
                          ? "var(--cyan)"
                          : isPast
                            ? "#444"
                            : "#ccc",
                        fontWeight: isToday ? 600 : 400,
                      }}
                    >
                      {isToday ? "🔔 Today" : fmtDate(b.preferred_date)}
                    </div>
                    <div style={{ fontSize: 12, color: "#6b6b8a" }}>
                      {fmt12h(b.preferred_time)}
                    </div>
                  </div>
                  <div style={{ fontSize: 13, color: "#ccc" }}>
                    {SERVICE_LABELS[b.service] ?? b.service}
                  </div>
                  <div style={{ fontSize: 13, color: "#ccc" }}>{b.budget}</div>
                  <div>
                    <StatusBadge status={b.status} />
                  </div>
                  <div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(b);
                      }}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        color: "#9090aa",
                        borderRadius: 8,
                        padding: "5px 12px",
                        fontSize: 12,
                        cursor: "pointer",
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filtered.length > 0 && (
            <div
              style={{
                marginTop: 16,
                fontSize: 12,
                color: "#444",
                textAlign: "right",
              }}
            >
              Showing {filtered.length} of {bookings.length} bookings
            </div>
          )}
        </>
      )}

      {selected && (
        <BookingModal
          booking={selected}
          onClose={() => setSelected(null)}
          onUpdated={onUpdated}
        />
      )}
    </div>
  );
}
