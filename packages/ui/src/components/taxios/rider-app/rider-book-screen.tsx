import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Clock, MapPin, Users } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import type {
  RiderAction,
  RiderAppCopy,
  RiderBookingPayload,
} from "../../../contracts/rider-app";
import {
  RiderActionButton,
  RiderActionReason,
  RiderSection,
} from "./rider-primitives";

/* =====================================================================
 * Rider — Fahrt buchen (Jetzt)
 *
 * Booking entry form for an on-demand ride. All form state is owned by
 * react-hook-form + zodResolver (no per-field useState). The submit
 * control comes from `payload.allowedActions` — the form's validity
 * only gates whether the backend action fires.
 *
 * How to wire with tRPC:
 *   const { data, isLoading, error } = trpc.rider.booking.now.useQuery()
 *   const create = trpc.rider.booking.create.useMutation()
 *   <RiderBookScreen payload={data} copy={copy}
 *     onSubmitBooking={(values, action) => create.mutate({ ...values })} />
 * ===================================================================== */

const bookingFormSchema = z.object({
  pickupAddress: z.string().min(3, "Bitte Abholadresse angeben."),
  destinationAddress: z.string().min(3, "Bitte Zieladresse angeben."),
  vehicleOptionId: z.string().min(1, "Bitte Fahrzeugklasse wählen."),
  passengerCount: z
    .number({ message: "Bitte Anzahl angeben." })
    .int()
    .min(1, "Mindestens 1 Fahrgast.")
    .max(8, "Maximal 8 Fahrgäste."),
  note: z.string().max(240, "Maximal 240 Zeichen.").optional(),
});

export type RiderBookingFormValues = z.infer<typeof bookingFormSchema>;

export function RiderBookScreen({
  copy,
  onAction,
  onSubmitBooking,
  payload,
}: {
  copy: RiderAppCopy;
  onAction?: (action: RiderAction) => void;
  onSubmitBooking?: (values: RiderBookingFormValues, action: RiderAction) => void;
  payload: RiderBookingPayload;
}) {
  const primaryAction = useMemo(
    () =>
      payload.allowedActions.find(
        (action) => action.id === "continue_to_riders" || action.id === "book_ride",
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
  } = useForm<RiderBookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      pickupAddress: "",
      destinationAddress: "",
      vehicleOptionId: firstEnabledVehicle?.id ?? "",
      passengerCount: 1,
      note: "",
    },
  });

  const submit = handleSubmit((values) => {
    if (primaryAction && primaryAction.disabled !== true) {
      onSubmitBooking?.(values, primaryAction);
    }
  });

  return (
    <form className="space-y-6" noValidate onSubmit={submit}>
      <div className="taxis-rider-card p-2">
        <div className="taxis-rider-segmented" role="group" aria-label="Buchungsart">
          <span className="taxis-rider-segmented-item" data-active={payload.mode === "now"}>
            Jetzt
          </span>
          <button
            className="taxis-rider-segmented-item"
            data-active={payload.mode === "schedule"}
            onClick={() => {
              const scheduleAction = payload.allowedActions.find(
                (action) => action.id === "schedule_ride",
              );
              if (scheduleAction) onAction?.(scheduleAction);
            }}
            type="button"
          >
            Später
          </button>
        </div>
      </div>

      <RiderSection title="Route">
        <div className="taxis-rider-card space-y-3 p-4">
          <RiderField
            error={errors.pickupAddress?.message}
            icon={<MapPin size={16} strokeWidth={2} />}
            id="pickupAddress"
            label="Abholung"
            placeholder="Aktueller Standort oder Adresse"
            register={register("pickupAddress")}
          />
          <RiderField
            error={errors.destinationAddress?.message}
            icon={<MapPin size={16} strokeWidth={2} />}
            id="destinationAddress"
            label="Ziel"
            placeholder="Wohin soll die Fahrt gehen?"
            register={register("destinationAddress")}
          />
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
                    <span className="taxis-rider-radio" aria-hidden="true" data-checked={checked} />
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

      <RiderSection title="Details">
        <div className="taxis-rider-card space-y-3 p-4">
          <RiderField
            error={errors.passengerCount?.message}
            icon={<Users size={16} strokeWidth={2} />}
            id="passengerCount"
            inputMode="numeric"
            label="Fahrgäste"
            placeholder="1"
            register={register("passengerCount", { valueAsNumber: true })}
            type="number"
          />
          <div>
            <label
              className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
              htmlFor="note"
            >
              Hinweis für die Fahrerin / den Fahrer (optional)
            </label>
            <textarea
              className="taxis-rider-textarea"
              id="note"
              placeholder="z. B. Eingang Hinterhof, Gepäck, Kindersitz"
              rows={3}
              {...register("note")}
            />
            {errors.note ? (
              <p className="taxis-rider-field-error">{errors.note.message}</p>
            ) : null}
          </div>
        </div>
      </RiderSection>

      <div className="taxis-rider-card flex items-center gap-2 p-3 text-[12px] text-[var(--taxis-workspace-text-muted)]">
        <Clock aria-hidden="true" size={14} strokeWidth={2} />
        {payload.riderSummaryLabel}
      </div>

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
        {payload.allowedActions
          .filter((action) => action.id === "contact_support")
          .map((action) => (
            <div key={action.id} className="mt-2">
              <RiderActionButton
                action={action}
                fullWidth
                onAction={onAction}
                variant="ghost"
              />
            </div>
          ))}
      </div>
    </form>
  );
}

function RiderField({
  error,
  icon,
  id,
  inputMode,
  label,
  placeholder,
  register,
  type = "text",
}: {
  error?: string;
  icon: React.ReactNode;
  id: string;
  inputMode?: "numeric" | "text";
  label: string;
  placeholder: string;
  register: ReturnType<ReturnType<typeof useForm>["register"]>;
  type?: string;
}) {
  return (
    <div>
      <label
        className="mb-1.5 block font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]"
        htmlFor={id}
      >
        {label}
      </label>
      <div className="taxis-rider-input-wrap" data-invalid={Boolean(error)}>
        <span className="text-[var(--taxis-workspace-text-subtle)]">{icon}</span>
        <input
          className="taxis-rider-input"
          id={id}
          inputMode={inputMode}
          placeholder={placeholder}
          type={type}
          {...register}
        />
      </div>
      {error ? <p className="taxis-rider-field-error">{error}</p> : null}
    </div>
  );
}
