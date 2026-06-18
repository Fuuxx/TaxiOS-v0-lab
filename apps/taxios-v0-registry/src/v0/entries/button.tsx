import type { ReactNode } from "react";
import { Button } from "@taxios-v2/ui/components/ui/button";

function TaxiosLabCanvas({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {children}
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <TaxiosLabCanvas>
      <div className="space-y-2">
        <p className="taxis-company-page-eyebrow">TaxiOS Component Lab</p>
        <h1 className="taxis-company-page-title">Button</h1>
        <p className="taxis-company-page-description">
          Operational action hierarchy with TaxiOS tokens.
        </p>
      </div>

      <div className="rounded-[24px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] p-6 shadow-[var(--taxis-dashboard-shadow-soft)]">
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Confirm ride</Button>
          <Button variant="brand">Priority action</Button>
          <Button variant="outline">Secondary</Button>
          <Button variant="ghost">Quiet action</Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </TaxiosLabCanvas>
  );
}
