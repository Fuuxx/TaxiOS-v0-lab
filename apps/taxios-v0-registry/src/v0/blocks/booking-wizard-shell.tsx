import { Button } from "@taxios-v2/ui/components/ui/button";
import { Input } from "@taxios-v2/ui/components/ui/input";
import { Label } from "@taxios-v2/ui/components/ui/label";
import {
  WorkspaceWizardBody,
  WorkspaceWizardFooter,
  WorkspaceWizardHeader,
  WorkspaceWizardLayout,
  WorkspaceWizardMainPanel,
  WorkspaceWizardPanel,
  WorkspaceWizardRail,
  WorkspaceWizardScroll,
  WorkspaceWizardSection,
  WorkspaceWizardStatusGrid,
  WorkspaceWizardStatusItem
} from "@taxios-v2/ui/components/taxios/workspace/workspace-wizard";

export function BookingWizardShellBlock() {
  return (
    <WorkspaceWizardPanel className="relative h-auto max-h-none w-full">
      <WorkspaceWizardHeader>
        <div>
          <p className="taxis-company-page-eyebrow">Booking wizard</p>
          <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
            New ride request
          </h2>
          <p className="mt-1 text-sm text-[var(--taxis-workspace-text-muted)]">
            Demo shell only. Business validation and transitions stay outside this registry block.
          </p>
        </div>
      </WorkspaceWizardHeader>
      <WorkspaceWizardBody>
        <WorkspaceWizardScroll>
          <WorkspaceWizardLayout>
            <WorkspaceWizardMainPanel>
              <WorkspaceWizardSection>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="booking-wizard-pickup">Pickup</Label>
                    <Input id="booking-wizard-pickup" placeholder="Company HQ" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="booking-wizard-destination">Destination</Label>
                    <Input id="booking-wizard-destination" placeholder="Airport BER" />
                  </div>
                </div>
              </WorkspaceWizardSection>
              <WorkspaceWizardSection>
                <div className="grid gap-2">
                  <Label htmlFor="booking-wizard-passengers">Passengers</Label>
                  <Input id="booking-wizard-passengers" placeholder="M. Weber, A. Kaya" />
                </div>
              </WorkspaceWizardSection>
            </WorkspaceWizardMainPanel>
            <WorkspaceWizardRail>
              <WorkspaceWizardStatusGrid>
                <WorkspaceWizardStatusItem ready>Route ready</WorkspaceWizardStatusItem>
                <WorkspaceWizardStatusItem ready>Passengers added</WorkspaceWizardStatusItem>
                <WorkspaceWizardStatusItem>Provider pending</WorkspaceWizardStatusItem>
              </WorkspaceWizardStatusGrid>
            </WorkspaceWizardRail>
          </WorkspaceWizardLayout>
        </WorkspaceWizardScroll>
      </WorkspaceWizardBody>
      <WorkspaceWizardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Continue</Button>
      </WorkspaceWizardFooter>
    </WorkspaceWizardPanel>
  );
}

export default BookingWizardShellBlock;
