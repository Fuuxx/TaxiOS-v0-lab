import type { ComponentType } from "react";
import registry from "../../../registry.json";
import {
  BadgeDemo,
  ButtonDemo,
  CardDemo,
  InputDemo,
  LabelDemo,
  TableDemo,
  WorkspaceEntityCardDemo,
  WorkspaceInnerCardDemo,
  WorkspaceSectionHeaderDemo,
  WorkspaceStatusChipsDemo,
  WorkspaceSurfaceDemo,
  WorkspaceTableDemo,
  WorkspaceWizardDemo
} from "./v0/component-demos";
import { BookingWizardShellBlock } from "./v0/blocks/booking-wizard-shell";
import { CompanyWorkspacePr46LabBlock } from "./v0/blocks/company-workspace-pr46-lab";
import { DataTableBlock } from "./v0/blocks/data-table";
import { EmptyStateBlock } from "./v0/blocks/empty-state";
import { LoadingStateBlock } from "./v0/blocks/loading-state";
import { RideDetailDrawerBlock } from "./v0/blocks/ride-detail-drawer";
import DesignContextPage from "./v0/entries/design-context";

type RegistryDemoItem = {
  description: string;
  demo: ComponentType;
  kind: "component" | "block" | "page";
  name: string;
  title: string;
};

const demoByName: Record<string, ComponentType> = {
  "taxios-design-context": DesignContextPage,
  badge: BadgeDemo,
  "booking-wizard-shell": BookingWizardShellBlock,
  button: ButtonDemo,
  "button-lab": ButtonDemo,
  card: CardDemo,
  "company-workspace-pr46-lab": CompanyWorkspacePr46LabBlock,
  "data-table": DataTableBlock,
  "empty-state": EmptyStateBlock,
  input: InputDemo,
  label: LabelDemo,
  "loading-state": LoadingStateBlock,
  "ride-detail-drawer": RideDetailDrawerBlock,
  "ride-detail-drawer-lab": RideDetailDrawerBlock,
  table: TableDemo,
  "workspace-entity-card": WorkspaceEntityCardDemo,
  "workspace-inner-card": WorkspaceInnerCardDemo,
  "workspace-section-header": WorkspaceSectionHeaderDemo,
  "workspace-status-chips": WorkspaceStatusChipsDemo,
  "workspace-surface": WorkspaceSurfaceDemo,
  "workspace-table": WorkspaceTableDemo,
  "workspace-table-lab": WorkspaceTableDemo,
  "workspace-wizard": WorkspaceWizardDemo
};

const registryDemoNames = Object.keys(demoByName);

export const registryItems: RegistryDemoItem[] = registry.items
  .filter((item) => registryDemoNames.includes(item.name))
  .map((item) => ({
    description: item.description,
    demo: demoByName[item.name],
    kind: item.type === "registry:block" ? "block" : item.type === "registry:page" ? "page" : "component",
    name: item.name,
    title: item.title
  }));

export const registryItemByName = new Map(
  registryItems.map((item) => [item.name, item])
);
