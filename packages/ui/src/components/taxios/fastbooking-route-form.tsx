"use client";

import { Circle, MapPin, Save } from "lucide-react";
import { useState } from "react";

import { cn } from "@taxios-v2/ui/lib/utils";

export type FastbookingRouteFormData = {
  from: string;
  title: string;
  to: string;
};

export type FastbookingRouteFormProps = {
  className?: string;
  destinationLabel?: string;
  destinationPlaceholder?: string;
  eyebrow?: string;
  heading?: string;
  initialValue?: Partial<FastbookingRouteFormData>;
  onSave: (data: FastbookingRouteFormData) => void;
  pickupLabel?: string;
  pickupPlaceholder?: string;
  routeTitleLabel?: string;
  routeTitlePlaceholder?: string;
  saveLabel?: string;
};

const EMPTY_FORM: FastbookingRouteFormData = { from: "", title: "", to: "" };

/**
 * Reusable inline route-form panel.
 *
 * Visual contract is shared with the Company Dashboard's inline
 * Fastbooking add flow so the same surface can later host a
 * companion auth/login form. The form sits flat on its parent
 * porcelain surface; closing is handled by the parent section header.
 */
export function FastbookingRouteForm({
  className,
  destinationLabel = "Zielort (NACH)",
  destinationPlaceholder = "Zieladresse",
  eyebrow = "Fastbooking",
  heading = "Neue Route",
  initialValue,
  onSave,
  pickupLabel = "Abholort (VON)",
  pickupPlaceholder = "Straße, Stadt",
  routeTitleLabel = "Titel der Route",
  routeTitlePlaceholder = "z.B. Flughafen BER",
  saveLabel = "Route speichern",
}: FastbookingRouteFormProps) {
  const [formData, setFormData] = useState<FastbookingRouteFormData>(() => ({
    ...EMPTY_FORM,
    ...initialValue,
  }));

  const updateField = (field: keyof FastbookingRouteFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave(formData);
    setFormData(EMPTY_FORM);
  };

  return (
    <form
      className={cn(
        "fastbooking-route-form relative flex h-full min-h-[320px] flex-col",
        className,
      )}
      onSubmit={submit}
    >
      <div className="mb-8">
        <p className="mb-2 font-black text-[10px] text-[var(--taxis-workspace-accent)] uppercase tracking-[0.22em]">
          {eyebrow}
        </p>
        <h4 className="font-black text-[26px] text-zinc-950 tracking-tight">
          {heading}
        </h4>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-5 lg:grid-cols-3">
        <label className="group grid content-start gap-2">
          <span className="pl-2 font-black text-[10px] text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-[var(--taxis-workspace-accent)]">
            {routeTitleLabel}
          </span>
          <input
            className="fastbooking-route-input w-full rounded-[18px] border border-zinc-100 bg-white/85 p-4 font-bold text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--taxis-workspace-accent-ring)] focus:bg-white focus:ring-4 focus:ring-[var(--taxis-workspace-focus-ring)]"
            onChange={(event) => updateField("title", event.target.value)}
            placeholder={routeTitlePlaceholder}
            type="text"
            value={formData.title}
          />
        </label>

        <label className="group grid content-start gap-2">
          <span className="pl-2 font-black text-[10px] text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-[var(--taxis-workspace-accent)]">
            {pickupLabel}
          </span>
          <span className="relative block">
            <MapPin
              className="-translate-y-1/2 absolute top-1/2 left-4 text-zinc-300 transition-colors group-focus-within:text-[var(--taxis-workspace-accent)]"
              size={17}
            />
            <input
              className="fastbooking-route-input w-full rounded-[18px] border border-zinc-100 bg-white/85 py-4 pr-4 pl-11 font-bold text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--taxis-workspace-accent-ring)] focus:bg-white focus:ring-4 focus:ring-[var(--taxis-workspace-focus-ring)]"
              onChange={(event) => updateField("from", event.target.value)}
              placeholder={pickupPlaceholder}
              type="text"
              value={formData.from}
            />
          </span>
        </label>

        <label className="group grid content-start gap-2">
          <span className="pl-2 font-black text-[10px] text-zinc-400 uppercase tracking-widest transition-colors group-focus-within:text-[var(--taxis-workspace-accent)]">
            {destinationLabel}
          </span>
          <span className="relative block">
            <Circle
              className="-translate-y-1/2 absolute top-1/2 left-4 text-[var(--taxis-workspace-accent)] transition-colors"
              size={17}
            />
            <input
              className="fastbooking-route-input w-full rounded-[18px] border border-zinc-100 bg-white/85 py-4 pr-4 pl-11 font-bold text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-[var(--taxis-workspace-accent-ring)] focus:bg-white focus:ring-4 focus:ring-[var(--taxis-workspace-focus-ring)]"
              onChange={(event) => updateField("to", event.target.value)}
              placeholder={destinationPlaceholder}
              type="text"
              value={formData.to}
            />
          </span>
        </label>
      </div>

      <div className="mt-8 flex items-center justify-end">
        <button
          className="taxis-button-tone-default flex items-center justify-center gap-2 rounded-2xl px-7 py-3.5 font-black text-[13px] shadow-taxis-lift transition-colors active:scale-95"
          type="submit"
        >
          <Save size={16} />
          {saveLabel}
        </button>
      </div>
    </form>
  );
}

export default FastbookingRouteForm;
