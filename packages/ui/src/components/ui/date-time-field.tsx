"use client";

import { cn } from "@taxios-v2/ui/lib/utils";
import * as React from "react";

/**
 * TaxiOS Date & Time fields — formatted-text adapters over canonical strings.
 *
 * Slice 6a. These are NOT calendar pickers and contain NO calendar logic and
 * no date library. They are thin, masked display adapters that:
 *  - render German desktop formats (date "TT.MM.JJJJ", time "HH:mm", 24h),
 *  - read/emit the unchanged canonical strings the form already stores
 *    (date "yyyy-MM-dd", time "HH:mm").
 *
 * Why a text adapter instead of <input type="date|time">: Chromium renders
 * native date/time controls in the *browser* locale (en-US -> "mm/dd/yyyy",
 * 12h AM/PM) regardless of `lang="de"`, which breaks the German + premium goal.
 *
 * Visual contract is identical to the Field Family (Input / SelectTrigger):
 *  height --taxis-control-h-md, radius --taxis-radius-control, porcelain
 *  surface, hairline border, TaxiOS-orange focus-visible ring. Token-only.
 *
 * Controlled + RHF friendly: pass `value` / `onValueChange` (use with
 * react-hook-form <Controller>). `inputRef` forwards RHF's field ref.
 */

const fieldClassName = cn(
  "flex h-[var(--taxis-control-h-md)] w-full min-w-0 rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3.5 text-sm text-[var(--taxis-workspace-text-primary)] tabular-nums shadow-none outline-none transition-[border-color,box-shadow,background-color] duration-150 ease-out",
  "placeholder:text-[var(--taxis-workspace-text-secondary)]",
  "hover:border-[var(--taxis-workspace-border-strong)]",
  "focus-visible:border-taxis-action focus-visible:ring-2 focus-visible:ring-[color:var(--taxis-workspace-focus-ring)]",
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
  "motion-reduce:transition-none",
);

type SharedFieldProps = {
  value: string;
  onValueChange: (canonical: string) => void;
  onBlur?: () => void;
  name?: string;
  id?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  placeholder?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

function digitsOnly(input: string, max: number) {
  return input.replace(/\D/g, "").slice(0, max);
}

/* ----------------------------- Date field ------------------------------ */

const CANONICAL_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** canonical "yyyy-MM-dd" -> display "dd.MM.yyyy" (safe on empty/partial). */
function formatDateDisplay(canonical: string): string {
  const match = CANONICAL_DATE.exec(canonical);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${day}.${month}.${year}`;
}

/** Mask raw keystrokes into "dd.MM.yyyy" without validating ranges. */
function maskDateDisplay(raw: string): string {
  const digits = digitsOnly(raw, 8);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return [day, month, year].filter((part) => part.length > 0).join(".");
}

/** display "dd.MM.yyyy" -> canonical "yyyy-MM-dd", or "" when incomplete/invalid. */
function parseDateCanonical(display: string): string {
  const digits = digitsOnly(display, 8);
  if (digits.length !== 8) return "";
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);
  const isRealDate =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day;
  if (!isRealDate) return "";
  return `${digits.slice(4, 8)}-${digits.slice(2, 4)}-${digits.slice(0, 2)}`;
}

export function TaxiDateField({
  value,
  onValueChange,
  onBlur,
  name,
  id,
  disabled,
  required,
  className,
  placeholder = "TT.MM.JJJJ",
  inputRef,
  ...aria
}: SharedFieldProps) {
  const [text, setText] = React.useState(() => formatDateDisplay(value));
  // Resync display when the canonical value changes externally
  // (e.g. quick-chip buttons calling setValue), but never while it already
  // represents the same canonical the user is typing.
  React.useEffect(() => {
    setText((current) =>
      parseDateCanonical(current) === value ? current : formatDateDisplay(value),
    );
  }, [value]);

  return (
    <input
      aria-describedby={aria["aria-describedby"]}
      aria-invalid={aria["aria-invalid"]}
      autoComplete="off"
      className={cn(fieldClassName, className)}
      data-slot="date-field"
      disabled={disabled}
      id={id}
      inputMode="numeric"
      name={name}
      onBlur={onBlur}
      onChange={(event) => {
        const masked = maskDateDisplay(event.target.value);
        setText(masked);
        onValueChange(parseDateCanonical(masked));
      }}
      placeholder={placeholder}
      ref={inputRef}
      required={required}
      title="Format: Tag, Monat, Jahr — TT.MM.JJJJ"
      type="text"
      value={text}
    />
  );
}

/* ----------------------------- Time field ------------------------------ */

const CANONICAL_TIME = /^(\d{2}):(\d{2})$/;

/** canonical "HH:mm" -> display "HH:mm" (identity, safe on empty/partial). */
function formatTimeDisplay(canonical: string): string {
  return CANONICAL_TIME.test(canonical) ? canonical : "";
}

/** Mask raw keystrokes into "HH:mm" without validating ranges. */
function maskTimeDisplay(raw: string): string {
  const digits = digitsOnly(raw, 4);
  const hours = digits.slice(0, 2);
  const minutes = digits.slice(2, 4);
  return minutes.length > 0 ? `${hours}:${minutes}` : hours;
}

/** display "HH:mm" -> canonical "HH:mm", or "" when incomplete/invalid (24h). */
function parseTimeCanonical(display: string): string {
  const digits = digitsOnly(display, 4);
  if (digits.length !== 4) return "";
  const hours = Number(digits.slice(0, 2));
  const minutes = Number(digits.slice(2, 4));
  if (hours > 23 || minutes > 59) return "";
  return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
}

export function TaxiTimeField({
  value,
  onValueChange,
  onBlur,
  name,
  id,
  disabled,
  required,
  className,
  placeholder = "HH:mm",
  inputRef,
  ...aria
}: SharedFieldProps) {
  const [text, setText] = React.useState(() => formatTimeDisplay(value));
  React.useEffect(() => {
    setText((current) =>
      parseTimeCanonical(current) === value ? current : formatTimeDisplay(value),
    );
  }, [value]);

  return (
    <input
      aria-describedby={aria["aria-describedby"]}
      aria-invalid={aria["aria-invalid"]}
      autoComplete="off"
      className={cn(fieldClassName, className)}
      data-slot="time-field"
      disabled={disabled}
      id={id}
      inputMode="numeric"
      name={name}
      onBlur={onBlur}
      onChange={(event) => {
        const masked = maskTimeDisplay(event.target.value);
        setText(masked);
        onValueChange(parseTimeCanonical(masked));
      }}
      placeholder={placeholder}
      ref={inputRef}
      required={required}
      title="Format: Stunden und Minuten — HH:mm, 24-Stunden"
      type="text"
      value={text}
    />
  );
}

/* --------------------------- Date + time field -------------------------- */

const CANONICAL_DATETIME = /^(\d{4}-\d{2}-\d{2})T(\d{2}:\d{2})$/;

/** Split a combined "yyyy-MM-ddTHH:mm" into its canonical date and time parts. */
function splitDateTime(canonical: string): { date: string; time: string } {
  const match = CANONICAL_DATETIME.exec(canonical);
  if (!match) return { date: "", time: "" };
  return { date: match[1], time: match[2] };
}

/** Join canonical date + time back into "yyyy-MM-ddTHH:mm", or "" if either is missing. */
function joinDateTime(date: string, time: string): string {
  if (!CANONICAL_DATE.test(date) || !CANONICAL_TIME.test(time)) return "";
  return `${date}T${time}`;
}

type TaxiDateTimeFieldProps = Omit<SharedFieldProps, "placeholder"> & {
  /** Optional override for the date sub-field placeholder. */
  datePlaceholder?: string;
  /** Optional override for the time sub-field placeholder. */
  timePlaceholder?: string;
};

/**
 * Composite of {@link TaxiDateField} + {@link TaxiTimeField} that reads and
 * emits a single combined canonical string ("yyyy-MM-ddTHH:mm") — the exact
 * value shape a native `<input type="datetime-local">` produces. This lets it
 * drop into forms that store one `requestedPickupAt`-style field while still
 * showing German desktop formats (TT.MM.JJJJ + HH:mm, 24h).
 *
 * The combined value is only emitted once BOTH parts are complete; a partial
 * entry emits "" (mirrors native datetime-local, which yields no value until
 * both date and time are valid).
 */
export function TaxiDateTimeField({
  value,
  onValueChange,
  onBlur,
  name,
  id,
  disabled,
  required,
  className,
  datePlaceholder,
  timePlaceholder,
  inputRef,
  ...aria
}: TaxiDateTimeFieldProps) {
  const { date, time } = splitDateTime(value);

  return (
    <div className={cn("flex min-w-0 gap-2", className)} id={id}>
      <TaxiDateField
        aria-describedby={aria["aria-describedby"]}
        aria-invalid={aria["aria-invalid"]}
        className="flex-1"
        disabled={disabled}
        inputRef={inputRef}
        name={name ? `${name}-date` : undefined}
        onBlur={onBlur}
        onValueChange={(nextDate) => onValueChange(joinDateTime(nextDate, time))}
        placeholder={datePlaceholder}
        required={required}
        value={date}
      />
      <TaxiTimeField
        aria-invalid={aria["aria-invalid"]}
        className="w-[7.5rem] shrink-0"
        disabled={disabled}
        name={name ? `${name}-time` : undefined}
        onBlur={onBlur}
        onValueChange={(nextTime) => onValueChange(joinDateTime(date, nextTime))}
        placeholder={timePlaceholder}
        required={required}
        value={time}
      />
    </div>
  );
}
