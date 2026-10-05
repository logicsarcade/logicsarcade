"use client";
import { useState, useTransition, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBooking, getBookedSlots } from "./actions";
import type { BookingInsert } from "@/types/database";

// --- Constants -----------------------------------------------
const SERVICES = [
  { value: "web", label: "Web Development", icon: "??" },
  { value: "mobile", label: "Mobile Apps", icon: "??" },
  { value: "shopify", label: "Shopify Apps", icon: "???" },
  { value: "saas", label: "SaaS Development", icon: "?" },
  { value: "ai", label: "AI Integration", icon: "??" },
  { value: "other", label: "Other / Not Sure", icon: "??" },
];

const BUDGETS = [
  { value: "$1k-$5k", label: "$1k � $5k", sub: "MVP / Small project" },
  { value: "$5k-$15k", label: "$5k � $15k", sub: "Mid-size product" },
  { value: "$15k-$50k", label: "$15k � $50k", sub: "Full platform" },
  { value: "$50k+", label: "$50k+", sub: "Enterprise" },
];

const TIMELINES = [
  { value: "asap", label: "ASAP", sub: "Start within 2 weeks" },
  { value: "1-3mo", label: "1�3 months", sub: "Taking my time" },
  { value: "3-6mo", label: "3�6 months", sub: "Planning ahead" },
  { value: "6mo+", label: "6 months+", sub: "Long-term roadmap" },
];

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];

const TIMEZONES = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Kolkata",
  "Australia/Sydney",
];

// --- Styles helpers ------------------------------------------
const S = {
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    color: "#fff",
    fontSize: 15,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "'Inter', sans-serif",
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#9090aa",
    marginBottom: 8,
    letterSpacing: "0.3px",
  } as React.CSSProperties,
  field: { marginBottom: 24 } as React.CSSProperties,
};

// --- Mini Calendar -------------------------------------------
function Calendar({
  selected,
  blockedDates,
  onChange,
}: {
  selected: string;
  blockedDates: string[];
  onChange: (date: string) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const monthName = new Date(viewYear, viewMonth).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function toIso(day: number) {
    return `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  function isDisabled(day: number) {
    const d = new Date(viewYear, viewMonth, day);
    d.setHours(0, 0, 0, 0);
    if (d < today) return true;
    if (d.getDay() === 0 || d.getDay() === 6) return true; // weekends
    if (blockedDates.includes(toIso(day))) return true;
    return false;
  }

  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 16,
        padding: 20,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <button
          onClick={prevMonth}
          style={{
            background: "none",
            border: "none",
            color: "#9090aa",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
          }}
        >
          �
        </button>
        <span
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 600,
            color: "#fff",
            fontSize: 15,
          }}
        >
          {monthName}
        </span>
        <button
          onClick={nextMonth}
          style={{
            background: "none",
            border: "none",
            color: "#9090aa",
            cursor: "pointer",
            fontSize: 18,
            lineHeight: 1,
            padding: 4,
          }}
        >
          �
        </button>
      </div>

      {/* Day headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 4,
          marginBottom: 8,
        }}
      >
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div
            key={d}
            style={{
              textAlign: "center",
              fontSize: 11,
              color: "#6b6b8a",
              fontWeight: 500,
              padding: "4px 0",
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
          gap: 4,
        }}
      >
        {blanks.map((_, i) => (
          <div key={`b${i}`} />
        ))}
        {days.map((day) => {
          const iso = toIso(day);
          const disabled = isDisabled(day);
          const sel = selected === iso;
          return (
            <button
              key={day}
              onClick={() => !disabled && onChange(iso)}
              disabled={disabled}
              style={{
                aspectRatio: "1",
                borderRadius: 8,
                border: sel ? "1px solid var(--cyan)" : "1px solid transparent",
                background: sel ? "rgba(0,245,255,0.12)" : "transparent",
                color: disabled ? "#333" : sel ? "var(--cyan)" : "#ccc",
                fontSize: 13,
                fontWeight: sel ? 600 : 400,
                cursor: disabled ? "not-allowed" : "pointer",
                transition: "all 0.15s",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// --- Time slot picker ----------------------------------------
function TimeSlots({
  selected,
  bookedSlots,
  onChange,
}: {
  selected: string;
  bookedSlots: string[];
  onChange: (t: string) => void;
}) {
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}
    >
      {TIME_SLOTS.map((slot) => {
        const booked = bookedSlots.includes(slot);
        const sel = selected === slot;
        const label = (() => {
          const [h, m] = slot.split(":").map(Number);
          const ampm = h >= 12 ? "PM" : "AM";
          return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, "0")} ${ampm}`;
        })();
        return (
          <button
            key={slot}
            disabled={booked}
            onClick={() => !booked && onChange(slot)}
            style={{
              padding: "10px 8px",
              borderRadius: 10,
              border: sel
                ? "1px solid var(--cyan)"
                : "1px solid rgba(255,255,255,0.08)",
              background: sel
                ? "rgba(0,245,255,0.1)"
                : booked
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(255,255,255,0.03)",
              color: booked ? "#333" : sel ? "var(--cyan)" : "#9090aa",
              fontSize: 13,
              fontWeight: sel ? 600 : 400,
              cursor: booked ? "not-allowed" : "pointer",
              transition: "all 0.15s",
              textDecoration: booked ? "line-through" : "none",
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

// --- Step indicator ------------------------------------------
function Steps({ current, total }: { current: number; total: number }) {
  const labels = ["Your Info", "Project", "Schedule"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 0,
        marginBottom: 48,
      }}
    >
      {labels.map((label, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              flex: i < labels.length - 1 ? 1 : 0,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  border: `1px solid ${done ? "var(--violet)" : active ? "var(--cyan)" : "rgba(255,255,255,0.1)"}`,
                  background: done
                    ? "var(--violet)"
                    : active
                      ? "rgba(0,245,255,0.1)"
                      : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: done ? "#fff" : active ? "var(--cyan)" : "#444",
                  fontSize: 13,
                  fontWeight: 600,
                  transition: "all 0.3s",
                }}
              >
                {done ? "?" : num}
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: active ? "#fff" : done ? "#a78bfa" : "#444",
                  letterSpacing: "0.5px",
                  whiteSpace: "nowrap",
                }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: done ? "var(--violet)" : "rgba(255,255,255,0.08)",
                  margin: "0 12px",
                  marginBottom: 28,
                  transition: "background 0.3s",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// --- Option card (for service / budget / timeline) -----------
function OptionCard({
  selected,
  value,
  label,
  sub,
  icon,
  onClick,
}: {
  selected: boolean;
  value: string;
  label: string;
  sub?: string;
  icon?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: selected
          ? "rgba(0,245,255,0.06)"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${selected ? "rgba(0,245,255,0.35)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 12,
        padding: "16px 14px",
        cursor: "pointer",
        textAlign: "left",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        gap: 4,
      }}
    >
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: selected ? "var(--cyan)" : "#ccc",
        }}
      >
        {label}
      </span>
      {sub && <span style={{ fontSize: 11, color: "#6b6b8a" }}>{sub}</span>}
    </button>
  );
}

// --- Main form component -------------------------------------
export default function BookingForm({
  blockedDates,
}: {
  blockedDates: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [form, setForm] = useState<Partial<BookingInsert>>({
    timezone: "Asia/Karachi",
    service: "",
    budget: "",
    timeline: "",
    preferred_date: "",
    preferred_time: "",
  });

  const set = (key: keyof BookingInsert, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  // When date changes, fetch booked slots
  const handleDateChange = useCallback(async (date: string) => {
    set("preferred_date", date);
    set("preferred_time", "");
    setLoadingSlots(true);
    try {
      const slots = await getBookedSlots(date);
      setBookedSlots(slots);
    } catch {
      setBookedSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  // Bookings are private, so taken time slots are re-checked every 15s while a date is chosen
  useEffect(() => {
    if (!form.preferred_date) return;
    const date = form.preferred_date;
    const id = setInterval(() => {
      getBookedSlots(date).then(setBookedSlots).catch(() => {});
    }, 15000);
    return () => clearInterval(id);
  }, [form.preferred_date]);

  function validateStep(s: number): string {
    if (s === 1) {
      if (!form.full_name?.trim()) return "Full name is required.";
      if (!form.email?.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(form.email))
        return "Valid email is required.";
    }
    if (s === 2) {
      if (!form.service) return "Please select a service.";
      if (!form.budget) return "Please select a budget range.";
      if (!form.timeline) return "Please select a timeline.";
      if (!form.project_desc?.trim() || form.project_desc.trim().length < 20)
        return "Please describe your project (at least 20 characters).";
    }
    if (s === 3) {
      if (!form.preferred_date) return "Please select a date.";
      if (!form.preferred_time) return "Please select a time slot.";
    }
    return "";
  }

  function next() {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    setStep((s) => s - 1);
  }

  function submit() {
    const err = validateStep(3);
    if (err) {
      setError(err);
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await createBooking(form as BookingInsert);
      console.log(result, "Booking result");

      if (result.status === "error") {
        setError(result.message);
        return;
      }
      if (result.status === "success")
        router.push(`/book/confirmation?id=${result.bookingId}`);
    });
  }

  const inputFocus = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.target.style.borderColor = "rgba(0,245,255,0.4)";
  };
  const inputBlur = (
    e: React.FocusEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)";
  };

  return (
    <div>
      <Steps current={step} total={3} />

      {/* -- Step 1: Contact info -- */}
      {step === 1 && (
        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Let&apos;s get to know you
          </h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginBottom: 36 }}>
            We&apos;ll use this to send your booking confirmation.
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            <div style={S.field}>
              <label style={S.label}>Full Name *</label>
              <input
                style={S.input}
                placeholder="Ahmad Khan"
                value={form.full_name ?? ""}
                onChange={(e) => set("full_name", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Email *</label>
              <input
                style={S.input}
                type="email"
                placeholder="ahmad@company.com"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>
                Phone <span style={{ color: "#444" }}>(optional)</span>
              </label>
              <input
                style={S.input}
                placeholder="+92 300 1234567"
                value={form.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>
                Company <span style={{ color: "#444" }}>(optional)</span>
              </label>
              <input
                style={S.input}
                placeholder="Acme Inc."
                value={form.company ?? ""}
                onChange={(e) => set("company", e.target.value)}
                onFocus={inputFocus}
                onBlur={inputBlur}
              />
            </div>
          </div>
        </div>
      )}

      {/* -- Step 2: Project details -- */}
      {step === 2 && (
        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Tell us about your project
          </h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginBottom: 36 }}>
            Help us prepare for a productive call.
          </p>

          <div style={S.field}>
            <label style={S.label}>What do you need? *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 10,
              }}
            >
              {SERVICES.map((s) => (
                <OptionCard
                  key={s.value}
                  selected={form.service === s.value}
                  value={s.value}
                  label={s.label}
                  icon={s.icon}
                  onClick={() => set("service", s.value)}
                />
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Budget Range *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
              }}
            >
              {BUDGETS.map((b) => (
                <OptionCard
                  key={b.value}
                  selected={form.budget === b.value}
                  value={b.value}
                  label={b.label}
                  sub={b.sub}
                  onClick={() => set("budget", b.value)}
                />
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Timeline *</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                gap: 10,
              }}
            >
              {TIMELINES.map((t) => (
                <OptionCard
                  key={t.value}
                  selected={form.timeline === t.value}
                  value={t.value}
                  label={t.label}
                  sub={t.sub}
                  onClick={() => set("timeline", t.value)}
                />
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>Describe your project *</label>
            <textarea
              style={{ ...S.input, minHeight: 120, resize: "vertical" }}
              placeholder="Tell us what you're building, what problem it solves, and any key features you have in mind..."
              value={form.project_desc ?? ""}
              onChange={(e) => set("project_desc", e.target.value)}
              onFocus={inputFocus}
              onBlur={inputBlur}
            />
            <div style={{ fontSize: 11, color: "#444", marginTop: 6 }}>
              {(form.project_desc ?? "").length} chars (min 20)
            </div>
          </div>
        </div>
      )}

      {/* -- Step 3: Schedule -- */}
      {step === 3 && (
        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.5px",
              marginBottom: 8,
            }}
          >
            Pick a date & time
          </h2>
          <p style={{ color: "#6b6b8a", fontSize: 14, marginBottom: 36 }}>
            30-minute strategy call. Weekdays only.
          </p>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}
          >
            <div>
              <label style={{ ...S.label, marginBottom: 12 }}>
                Choose a date *
              </label>
              <Calendar
                selected={form.preferred_date ?? ""}
                blockedDates={blockedDates}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <label style={{ ...S.label, marginBottom: 12 }}>
                Choose a time *
                {form.preferred_date && (
                  <span
                    style={{ color: "#6b6b8a", fontWeight: 400, marginLeft: 8 }}
                  >
                    {new Date(
                      form.preferred_date + "T00:00:00",
                    ).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                )}
              </label>

              {!form.preferred_date ? (
                <div style={{ color: "#444", fontSize: 13, padding: "20px 0" }}>
                  ? Select a date first
                </div>
              ) : loadingSlots ? (
                <div style={{ color: "#6b6b8a", fontSize: 13 }}>
                  Loading slots�
                </div>
              ) : (
                <TimeSlots
                  selected={form.preferred_time ?? ""}
                  bookedSlots={bookedSlots}
                  onChange={(t) => set("preferred_time", t)}
                />
              )}

              <div style={{ marginTop: 28 }}>
                <label style={S.label}>Your Timezone</label>
                <select
                  style={{ ...S.input, cursor: "pointer" }}
                  value={form.timezone}
                  onChange={(e) => set("timezone", e.target.value)}
                  onFocus={inputFocus}
                  onBlur={inputBlur}
                >
                  {TIMEZONES.map((tz) => (
                    <option
                      key={tz}
                      value={tz}
                      style={{ background: "#0a0a1a" }}
                    >
                      {tz}
                    </option>
                  ))}
                </select>
              </div>

              {/* Summary card */}
              {form.preferred_date && form.preferred_time && (
                <div
                  style={{
                    marginTop: 24,
                    background: "rgba(0,245,255,0.04)",
                    border: "1px solid rgba(0,245,255,0.15)",
                    borderRadius: 14,
                    padding: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--cyan)",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    Your Booking
                  </div>
                  <div style={{ fontSize: 14, color: "#fff", lineHeight: 2 }}>
                    <div>?? {form.full_name}</div>
                    <div>
                      ??{" "}
                      {new Date(
                        form.preferred_date + "T00:00:00",
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div>
                      ?{" "}
                      {(() => {
                        const [h, m] = (form.preferred_time ?? "")
                          .split(":")
                          .map(Number);
                        const ap = h >= 12 ? "PM" : "AM";
                        return `${h > 12 ? h - 12 : h || 12}:${String(m).padStart(2, "0")} ${ap}`;
                      })()}{" "}
                      ({form.timezone})
                    </div>
                    <div>
                      ?? {SERVICES.find((s) => s.value === form.service)?.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* -- Error -- */}
      {error && (
        <div
          style={{
            marginTop: 24,
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12,
            padding: "14px 18px",
            color: "#f87171",
            fontSize: 14,
          }}
        >
          ?? {error}
        </div>
      )}

      {/* -- Navigation buttons -- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 40,
          paddingTop: 32,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {step > 1 ? (
          <button
            onClick={back}
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#9090aa",
              padding: "12px 28px",
              borderRadius: 100,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#9090aa";
            }}
          >
            ? Back
          </button>
        ) : (
          <div />
        )}

        {step < 3 ? (
          <button
            onClick={next}
            style={{
              background: "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff",
              border: "none",
              padding: "14px 36px",
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 0 30px rgba(124,58,237,0.3)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(124,58,237,0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(124,58,237,0.3)";
            }}
          >
            Next ?
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={isPending}
            style={{
              background: isPending
                ? "rgba(124,58,237,0.4)"
                : "linear-gradient(135deg,#7c3aed,#5b21b6)",
              color: "#fff",
              border: "none",
              padding: "14px 40px",
              borderRadius: 100,
              fontSize: 15,
              fontWeight: 600,
              cursor: isPending ? "not-allowed" : "pointer",
              boxShadow: "0 0 30px rgba(124,58,237,0.3)",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            {isPending ? (
              <>
                <span
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Booking�
              </>
            ) : (
              "?? Book My Call"
            )}
          </button>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #444; }
        select option { background: #0a0a1a; color: #fff; }
      `}</style>
    </div>
  );
}
