import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarClock, MapPin } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import type {
  RiderAction,
  RiderAppCopy,
  RiderBookingPayload,
} from "../../../contracts/rider-app";
import { RiderActionReason, RiderSection } from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrt planen (Später)
 *
 * Scheduled booking form. Form state is fully owned by react-hook-form
 * + zodResolver. The continue/confirm control is sourced from
 * `payload.allowedActions`.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.booking.schedule.useQuery()
 *   const schedule = trpc.rider.booking.schedule.useMutation()
 *   <RiderScheduleScreen payload={data} copy={copy}
 *     onSubmitSchedule={(values, action) => schedule.mutate({ ...values })} />
 * ===================================================================== */

const scheduleFormSchema = z.object({
  pickupAddress: z.string().min(3, "Bitte Abholadresse angeben."),
  destinationAddress: z.string().min(3, "Bitte Zieladresse angeben."),
  date: z.string().min(1, "Bitte Datum wählen."),
  time: z.string().min(1, "Bitte Uhrzeit wählen."),
  vehicleOptionId: z.string().min(1, "Bitte Fahrzeugklasse wählen."),
});

export type RiderScheduleFormValues = z.infer<typeof scheduleFormSchema>;

export function RiderScheduleScreen({
  copy,
  onAction,
  onSubmitSchedule,
  payload,
}: {
  copy: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  onSubmitSchedule?: (values: RiderScheduleFormValues, action: RiderAction) => void;
  payload: RiderBookingPayload;
}) {
  const primaryAction = useMemo(
    () =>
      payload.allowedActions.find(
        (action) => action.id === "continue_to_riders" || action.id === "schedule_ride",
      ),
    [payload.allowedActions],
  );

  const firstEnabledVehicle = payload.vehicleOptions.find(
    (option) => option.disabled !== true,
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RiderScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      pickupAddress: "",
      destinationAddress: "",
      date: "",
      time: "",
      vehicleOptionId: firstEnabledVehicle?.id ?? "",
    },
  });

  const submit = handleSubmit((values) => {
    if (primaryAction && primaryAction.disabled !== true) {
      onSubmitSchedule?.(values, primaryAction);
    }
  });

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      <div className="taxis-rider-card p-2">
        {/* biome-ignore lint/a11y/useSemanticElements: segmented toggle, not a form fieldset */}
        <div className="taxis-rider-segmented" role="group" aria-label="Buchungsart">
          <button
            className="taxis-rider-segmented-item"
            data-active={payload.mode === "now"}
            onClick={() => {
              const nowAction = payload.allowedActions.find(
                (action) => action.id === "book_ride",
              );
              if (nowAction) onAction?.(nowAction);
            }}
            type="button"
          >
            Jetzt
          </button>
          <span
            className="taxis-rider-segmented-item"
            data-active={payload.mode === "schedule"}
          >
            Später
          </span>
        </div>
      </div>

      <RiderSection title="Zeitpunkt">
        <div className="taxis-rider-card grid grid-cols-2 gap-3 p-4">
          <div>
            <label
              className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              htmlFor="date"
            >
              Datum
            </label>
            <div className="taxis-rider-input-wrap" data-invalid={Boolean(errors.date)}>
              <span className="text-[var(--taxis-workspace-text-subtle)]">
                <CalendarClock size={16} strokeWidth={2} />
              </span>
              <input className="taxis-rider-input" id="date" type="date" {...register("date")} />
            </div>
            {errors.date ? (
              <p className="taxis-rider-field-error">{errors.date.message}</p>
            ) : null}
          </div>
          <div>
            <label
              className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              htmlFor="time"
            >
              Uhrzeit
            </label>
            <div className="taxis-rider-input-wrap" data-invalid={Boolean(errors.time)}>
              <input className="taxis-rider-input" id="time" type="time" {...register("time")} />
            </div>
            {errors.time ? (
              <p className="taxis-rider-field-error">{errors.time.message}</p>
            ) : null}
          </div>
        </div>
      </RiderSection>

      <RiderSection title="Route">
        <div className="taxis-rider-card space-y-3 p-4">
          <div>
            <label
              className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              htmlFor="pickupAddress"
            >
              Abholung
            </label>
            <div
              className="taxis-rider-input-wrap"
              data-invalid={Boolean(errors.pickupAddress)}
            >
              <span className="text-[var(--taxis-workspace-text-subtle)]">
                <MapPin size={16} strokeWidth={2} />
              </span>
              <input
                className="taxis-rider-input"
                id="pickupAddress"
                placeholder="Adresse oder Ort"
                {...register("pickupAddress")}
              />
            </div>
            {errors.pickupAddress ? (
              <p className="taxis-rider-field-error">{errors.pickupAddress.message}</p>
            ) : null}
          </div>
          <div>
            <label
              className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              htmlFor="destinationAddress"
            >
              Ziel
            </label>
            <div
              className="taxis-rider-input-wrap"
              data-invalid={Boolean(errors.destinationAddress)}
            >
              <span className="text-[var(--taxis-workspace-text-subtle)]">
                <MapPin size={16} strokeWidth={2} />
              </span>
              <input
                className="taxis-rider-input"
                id="destinationAddress"
                placeholder="Wohin soll die Fahrt gehen?"
                {...register("destinationAddress")}
              />
            </div>
            {errors.destinationAddress ? (
              <p className="taxis-rider-field-error">{errors.destinationAddress.message}</p>
            ) : null}
          </div>
        </div>
      </RiderSection>

      <RiderSection title="Fahrzeugklasse">
        <Controller
          control={control}
          name="vehicleOptionId"
          render={({ field }) => (
            <div className="space-y-2" role="radiogroup" aria-label="Fahrzeugklasse">
              {payload.vehicleOptions.map((option) => {
                const checked = field.value === option.id;
                return (
                  <label
                    key={option.id}
                    className="taxis-rider-option"
                    data-checked={checked}
                    data-disabled={option.disabled === true}
                  >
                    <input
                      checked={checked}
                      className="sr-only"
                      disabled={option.disabled === true}
                      name={field.name}
                      onChange={() => field.onChange(option.id)}
                      type="radio"
                      value={option.id}
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-[14px] text-[var(--taxis-workspace-text-strong)]">
                        {option.label}
                      </span>
                      <span className="block text-[12px] text-[var(--taxis-workspace-text-muted)]">
                        {option.disabled && option.reason
                          ? option.reason
                          : option.description}
                      </span>
                    </span>
                    <span className="shrink-0 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
                      {option.capacityLabel}
                    </span>
                    <span
                      className="taxis-rider-radio"
                      aria-hidden="true"
                      data-checked={checked}
                    />
                  </label>
                );
              })}
            </div>
          )}
        />
        {errors.vehicleOptionId ? (
          <p className="taxis-rider-field-error">{errors.vehicleOptionId.message}</p>
        ) : null}
      </RiderSection>

      <div className="taxis-rider-bottom-bar">
        {primaryAction ? (
          <>
            <button
              className="taxis-rider-btn-primary w-full"
              disabled={primaryAction.disabled === true}
              type="submit"
            >
              {primaryAction.label}
            </button>
            {primaryAction.disabled && primaryAction.reason ? (
              <RiderActionReason reason={primaryAction.reason} />
            ) : null}
          </>
        ) : null}
        <p className="mt-2 text-center text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {copy.billedToPrefix} {payload.workspace.billedToLabel}
        </p>
      </div>
    </form>
  );
}
