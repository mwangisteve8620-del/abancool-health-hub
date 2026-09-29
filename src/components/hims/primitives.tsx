import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { formatKES } from "@/lib/hims/ids";

/** Renders children only after hydration — keeps SSR markup stable for demo data. */
export function Hydrated({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <>{fallback ?? <LoadingBlock />}</>;
  return <>{children}</>;
}

export function LoadingBlock({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-live="polite">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
}: {
  title: string;
  description?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 border-b border-border pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((b, i) => (
              <span key={`${b.label}-${i}`} className="flex items-center gap-1.5">
                {b.to ? (
                  <Link to={b.to} className="hover:text-foreground hover:underline">
                    {b.label}
                  </Link>
                ) : (
                  <span className="text-foreground">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && <span aria-hidden>/</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="truncate text-2xl font-semibold text-foreground">{title}</h1>
        {description && <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: "default" | "accent" | "warning" | "danger" | "success";
  icon?: ReactNode;
}) {
  const toneClass = {
    default: "text-foreground",
    accent: "text-accent",
    warning: "text-warning",
    danger: "text-destructive",
    success: "text-success",
  }[tone];
  return (
    <div className="surface-card p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-eyebrow">{label}</p>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>
      <p className={cn("mt-2 font-display text-2xl font-semibold tabular-nums", toneClass)}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

const STATUS_TONES: Record<string, string> = {
  // positive
  Completed: "bg-success/10 text-success border-success/20",
  Paid: "bg-success/10 text-success border-success/20",
  Approved: "bg-success/10 text-success border-success/20",
  Active: "bg-success/10 text-success border-success/20",
  Available: "bg-success/10 text-success border-success/20",
  Dispensed: "bg-success/10 text-success border-success/20",
  Confirmed: "bg-success/10 text-success border-success/20",
  Verified: "bg-success/10 text-success border-success/20",
  Present: "bg-success/10 text-success border-success/20",
  Normal: "bg-success/10 text-success border-success/20",
  Received: "bg-success/10 text-success border-success/20",
  Discharged: "bg-success/10 text-success border-success/20",
  // in progress
  "In Consultation": "bg-primary/10 text-primary border-primary/20",
  "In Progress": "bg-primary/10 text-primary border-primary/20",
  "In Theatre": "bg-primary/10 text-primary border-primary/20",
  Processing: "bg-primary/10 text-primary border-primary/20",
  Submitted: "bg-primary/10 text-primary border-primary/20",
  Validated: "bg-primary/10 text-primary border-primary/20",
  Occupied: "bg-primary/10 text-primary border-primary/20",
  Admitted: "bg-primary/10 text-primary border-primary/20",
  Called: "bg-primary/10 text-primary border-primary/20",
  Scheduled: "bg-primary/10 text-primary border-primary/20",
  "Checked In": "bg-primary/10 text-primary border-primary/20",
  Reviewed: "bg-primary/10 text-primary border-primary/20",
  "Sample Collected": "bg-primary/10 text-primary border-primary/20",
  Ordered: "bg-primary/10 text-primary border-primary/20",
  // waiting
  Pending: "bg-warning/15 text-warning-foreground border-warning/30",
  Requested: "bg-warning/15 text-warning-foreground border-warning/30",
  Waiting: "bg-warning/15 text-warning-foreground border-warning/30",
  "Awaiting Report": "bg-warning/15 text-warning-foreground border-warning/30",
  "Awaiting Verification": "bg-warning/15 text-warning-foreground border-warning/30",
  "Partially Paid": "bg-warning/15 text-warning-foreground border-warning/30",
  "Partially Approved": "bg-warning/15 text-warning-foreground border-warning/30",
  "More Information Required": "bg-warning/15 text-warning-foreground border-warning/30",
  "Low Stock": "bg-warning/15 text-warning-foreground border-warning/30",
  "Near Expiry": "bg-warning/15 text-warning-foreground border-warning/30",
  Reserved: "bg-warning/15 text-warning-foreground border-warning/30",
  "Pre-op": "bg-warning/15 text-warning-foreground border-warning/30",
  Recovery: "bg-accent/15 text-accent border-accent/30",
  "On Leave": "bg-warning/15 text-warning-foreground border-warning/30",
  High: "bg-warning/15 text-warning-foreground border-warning/30",
  Low: "bg-warning/15 text-warning-foreground border-warning/30",
  // negative
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Rejected: "bg-destructive/10 text-destructive border-destructive/20",
  "No Show": "bg-destructive/10 text-destructive border-destructive/20",
  "Out of Stock": "bg-destructive/10 text-destructive border-destructive/20",
  Expired: "bg-destructive/10 text-destructive border-destructive/20",
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  Urgent: "bg-destructive/10 text-destructive border-destructive/20",
  Absent: "bg-destructive/10 text-destructive border-destructive/20",
  Skipped: "bg-destructive/10 text-destructive border-destructive/20",
  Maintenance: "bg-destructive/10 text-destructive border-destructive/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const tone = STATUS_TONES[status] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium",
        tone,
        className,
      )}
    >
      {status}
    </span>
  );
}

export function TriageBadge({ level }: { level: "RED" | "ORANGE" | "YELLOW" | "GREEN" }) {
  const map = {
    RED: "bg-destructive text-destructive-foreground",
    ORANGE: "bg-warning text-warning-foreground",
    YELLOW: "bg-chart-4/30 text-warning-foreground border border-warning/40",
    GREEN: "bg-success text-success-foreground",
  } as const;
  return <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-semibold tracking-wide", map[level])}>{level}</span>;
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      {icon && <div className="mb-3 text-muted-foreground">{icon}</div>}
      <p className="font-medium text-foreground">{title}</p>
      {description && <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Money({ value, className }: { value: number; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{formatKES(value)}</span>;
}

export function SectionCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("surface-card", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="text-xs text-muted-foreground">{description}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function DefinitionList({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
      {items.map((it) => (
        <div key={it.label}>
          <dt className="text-eyebrow">{it.label}</dt>
          <dd className="mt-0.5 text-sm text-foreground">{it.value || "—"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function calcAge(dob: string) {
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.max(0, Math.floor(diff / (365.25 * 86400000)));
}

export function formatDate(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateTime(value?: string) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}
