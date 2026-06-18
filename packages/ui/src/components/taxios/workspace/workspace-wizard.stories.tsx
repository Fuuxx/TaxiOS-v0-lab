import type { Meta, StoryObj } from "@storybook/react-vite";
import { CalendarClock, Car, MapPin, Users, X } from "lucide-react";

import { Button } from "../../ui/button";
import "./workspace.css";
import {
  WorkspaceWizardBackdrop,
  WorkspaceWizardBody,
  WorkspaceWizardFooter,
  WorkspaceWizardForm,
  WorkspaceWizardHeader,
  WorkspaceWizardLayout,
  WorkspaceWizardMainPanel,
  WorkspaceWizardOverlay,
  WorkspaceWizardPanel,
  WorkspaceWizardRail,
  WorkspaceWizardScroll,
  WorkspaceWizardSection,
  WorkspaceWizardStatusGrid,
  WorkspaceWizardStatusItem,
} from "./workspace-wizard";

const meta = {
  component: WorkspaceWizardPanel,
  parameters: {
    layout: "fullscreen",
  },
  title: "Taxios/TaxiOS/Workspace/Wizard",
} satisfies Meta<typeof WorkspaceWizardPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

function LeadingDataLabel({ label }: { label: string }) {
  const [dataValue, ...labelParts] = label.split(" ");
  const humanLabel = labelParts.join(" ");

  return (
    <span className="min-w-0 truncate">
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="inline-flex min-w-0 items-baseline gap-1 truncate"
      >
        <span className="taxis-data-inline shrink-0">{dataValue}</span>
        {humanLabel ? (
          <span className="min-w-0 truncate">{humanLabel}</span>
        ) : null}
      </span>
    </span>
  );
}

export const BookingWizard: Story = {
  render: () => (
    <div className="relative min-h-[760px] bg-[var(--taxis-workspace-page-bg)]">
      <WorkspaceWizardOverlay>
        <WorkspaceWizardBackdrop aria-label="Close wizard" tabIndex={-1} />
        <WorkspaceWizardPanel aria-labelledby="workspace-wizard-story-title">
          <WorkspaceWizardForm>
            <WorkspaceWizardHeader>
              <div className="flex items-start justify-between gap-5">
                <div className="min-w-0">
                  <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase">
                    Booking status
                  </p>
                  <h2
                    className="mt-1 font-semibold text-[24px] text-[var(--taxis-workspace-text-strong)] leading-tight"
                    id="workspace-wizard-story-title"
                  >
                    New booking
                  </h2>
                  <p className="mt-1 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
                    Route, time, passengers and vehicles stay visible.
                  </p>
                </div>
                <button
                  aria-label="Close"
                  className="flex h-[var(--taxis-control-h-md)] w-[var(--taxis-control-h-md)] shrink-0 items-center justify-center rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] text-[var(--taxis-workspace-text-muted)] shadow-[var(--taxis-workspace-shadow-overlay)]"
                  type="button"
                >
                  <X aria-hidden="true" size={22} />
                </button>
              </div>
              <WorkspaceWizardStatusGrid>
                {[
                  { data: false, icon: MapPin, label: "Route ready" },
                  { data: false, icon: CalendarClock, label: "Time open" },
                  { data: true, icon: Users, label: "2 passengers" },
                  { data: true, icon: Car, label: "1 vehicle" },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <WorkspaceWizardStatusItem key={item.label}>
                      <Icon aria-hidden="true" size={16} />
                      <span className="min-w-0 truncate font-semibold text-[12px]">
                        {item.data ? (
                          <LeadingDataLabel label={item.label} />
                        ) : (
                          item.label
                        )}
                      </span>
                    </WorkspaceWizardStatusItem>
                  );
                })}
              </WorkspaceWizardStatusGrid>
            </WorkspaceWizardHeader>

            <WorkspaceWizardBody>
              <WorkspaceWizardScroll>
                <WorkspaceWizardLayout>
                  <WorkspaceWizardMainPanel>
                    <WorkspaceWizardSection>
                      <h3 className="font-semibold text-taxis-section-sm text-[var(--taxis-workspace-text-strong)]">
                        Route
                      </h3>
                      <div className="mt-4 grid gap-3 md:grid-cols-2">
                        <div className="min-h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3.5 py-3 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                          Pickup address
                        </div>
                        <div className="min-h-[var(--taxis-control-h-md)] rounded-[var(--taxis-radius-control)] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] px-3.5 py-3 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                          Destination address
                        </div>
                      </div>
                    </WorkspaceWizardSection>
                    <WorkspaceWizardSection>
                      <h3 className="font-semibold text-taxis-section-sm text-[var(--taxis-workspace-text-strong)]">
                        Vehicle
                      </h3>
                      <div className="mt-4 grid gap-2 md:grid-cols-2">
                        <div className="rounded-[18px] border border-[var(--taxis-workspace-accent-ring)] bg-[var(--taxis-workspace-accent-soft)] p-4">
                          Taxi / 4 seats
                        </div>
                        <div className="rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-4">
                          Shuttle / 8 seats
                        </div>
                      </div>
                    </WorkspaceWizardSection>
                  </WorkspaceWizardMainPanel>

                  <WorkspaceWizardRail>
                    <p className="font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase">
                      Booking status
                    </p>
                    <h3 className="mt-1 font-semibold text-taxis-section-md text-[var(--taxis-workspace-text-strong)]">
                      Live plan
                    </h3>
                    <div className="mt-5 rounded-[20px] border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface-soft)] p-4 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                      Summary rail stays visible on desktop.
                    </div>
                  </WorkspaceWizardRail>
                </WorkspaceWizardLayout>
              </WorkspaceWizardScroll>
            </WorkspaceWizardBody>

            <WorkspaceWizardFooter>
              <p className="min-h-5 font-medium text-[12px] text-[var(--taxis-workspace-text-muted)]">
                Ready for review.
              </p>
              <div className="flex flex-col-reverse gap-2 sm:flex-row">
                <Button variant="outline">Cancel</Button>
                <Button variant="brand">Continue</Button>
              </div>
            </WorkspaceWizardFooter>
          </WorkspaceWizardForm>
        </WorkspaceWizardPanel>
      </WorkspaceWizardOverlay>
    </div>
  ),
};
