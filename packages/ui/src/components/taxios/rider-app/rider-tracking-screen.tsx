import {
  Phone,
  MessageSquare,
  Share2,
  ShieldCheck,
  Star,
} from "lucide-react";

import type {
  RiderAction,
  RiderAppCopy,
  RiderTrackingPayload,
} from "../../../contracts/rider-app";
import { cn } from "../../../lib/utils";
import {
  RiderActionButton,
  RiderMapPlaceholder,
  RiderSection,
  RiderStatusChip,
} from "./rider-primitives";

/* =====================================================================
 * Rider Live Tracking ("Fahrer ist unterwegs")
 *
 * How to wire with tRPC (no implementation here):
 *   const { data } = api.rider.tracking.useQuery({ tripId });
 *   // live position/eta typically via api.rider.trackingStream.useSubscription
 *   <RiderTrackingScreen payload={data} copy={copy} onAction={...} />
 *
 * The map is a static placeholder (UI-only, no map dependency). ETA, driver,
 * and route come from `payload`. Call / Message / Share and "Ich bin draußen"
 * are rendered only when present in `payload.allowedActions`.
 * ===================================================================== */

const stepStateClass: Record<string, string> = {
  active: "bg-[var(--taxis-workspace-accent)] ring-4 ring-[var(--taxis-workspace-accent-halo)]",
  done: "bg-[var(--taxis-workspace-text-strong)]",
  upcoming: "bg-[var(--taxis-workspace-surface-rim-strong)]",
};

export type RiderTrackingScreenProps = {
  payload: RiderTrackingPayload;
  copy: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
};

export function RiderTrackingScreen({
  onAction,
  payload,
}: RiderTrackingScreenProps) {
  const callAction = payload.allowedActions.find((a) => a.id === "call_driver");
  const messageAction = payload.allowedActions.find(
    (a) => a.id === "message_driver",
  );
  const shareAction = payload.allowedActions.find((a) => a.id === "share_trip");

  return (
    <>
      <section className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-[12px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-taxis-eyebrow">
            {payload.etaLabel}
          </p>
          <h1 className="mt-1 font-semibold text-[26px] text-[var(--taxis-workspace-text-strong)] tabular-nums tracking-tight">
            {payload.etaMinutes} Min.
          </h1>
        </div>
        <RiderStatusChip label={payload.statusLabel} status={payload.status} />
      </section>

      <RiderMapPlaceholder
        destinationAddress={payload.destinationAddress}
        etaLabel={`Ankunft in ${payload.etaMinutes} Min.`}
        pickupAddress={payload.pickupAddress}
      />

      <div className="taxis-rider-card p-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--taxis-workspace-surface-deep)] font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
            {payload.driver.initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-[15px] text-[var(--taxis-workspace-text-strong)]">
              {payload.driver.name}
            </p>
            <p className="flex items-center gap-1.5 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
              <Star
                aria-hidden="true"
                className="fill-[var(--taxis-workspace-accent)] text-[var(--taxis-workspace-accent)]"
                size={13}
              />
              {payload.driver.ratingLabel} · {payload.driver.tripsLabel}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-[var(--taxis-workspace-surface-deep)] px-3 py-2.5">
          <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
            {payload.driver.vehicleColorLabel} {payload.driver.vehicleLabel}
          </span>
          <span className="shrink-0 rounded-md bg-[var(--taxis-workspace-surface)] px-2 py-1 font-mono font-semibold text-[12px] text-[var(--taxis-workspace-text-secondary)] tracking-wider ring-1 ring-[var(--taxis-workspace-surface-rim)]">
            {payload.driver.licensePlate}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          {callAction ? (
            <RiderActionButton
              action={callAction}
              fullWidth
              icon={<Phone aria-hidden="true" size={16} strokeWidth={2} />}
              onAction={onAction}
              variant="secondary"
            />
          ) : null}
          {messageAction ? (
            <RiderActionButton
              action={messageAction}
              fullWidth
              icon={<MessageSquare aria-hidden="true" size={16} strokeWidth={2} />}
              onAction={onAction}
              variant="secondary"
            />
          ) : null}
          {shareAction ? (
            <RiderActionButton
              action={shareAction}
              fullWidth
              icon={<Share2 aria-hidden="true" size={16} strokeWidth={2} />}
              onAction={onAction}
              variant="secondary"
            />
          ) : null}
        </div>
      </div>

      <RiderSection title="Route">
        <ol className="taxis-rider-card flex flex-col gap-4 p-4">
          {payload.steps.map((step) => (
            <li className="flex items-start gap-3" key={step.id}>
              <span
                className={cn(
                  "mt-1 h-3 w-3 shrink-0 rounded-full",
                  stepStateClass[step.state],
                )}
              />
              <div className="flex min-w-0 flex-1 items-center justify-between gap-3">
                <span
                  className={cn(
                    "truncate font-semibold text-[14px]",
                    step.state === "upcoming"
                      ? "text-[var(--taxis-workspace-text-muted)]"
                      : "text-[var(--taxis-workspace-text-strong)]",
                  )}
                >
                  {step.label}
                </span>
                {step.timeLabel ? (
                  <span className="shrink-0 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)] tabular-nums">
                    {step.timeLabel}
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </RiderSection>

      <div className="flex items-start gap-2.5 rounded-2xl bg-[var(--taxis-status-success-bg)] px-4 py-3">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 shrink-0 text-[var(--taxis-status-success-text)]"
          size={16}
          strokeWidth={2}
        />
        <p className="font-medium text-[13px] text-[var(--taxis-status-success-text)] leading-relaxed">
          {payload.safetyHint}
        </p>
      </div>
    </>
  );
}
