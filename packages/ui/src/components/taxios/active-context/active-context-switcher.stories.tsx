import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../../../storybook/story-canvas";
import { ActiveContextSwitcher } from "./active-context-switcher";

const companyOption = {
  helperText: "Company workspace - company_admin",
  label: "Hoffmann Mobility GmbH",
  selected: true,
  type: "company" as const,
  value: "company-context",
};

const providerOption = {
  helperText: "Provider workspace - provider_admin",
  label: "City Funk Berlin",
  selected: false,
  type: "provider" as const,
  value: "provider-context",
};

const driverOption = {
  contextLabel: "Driver",
  helperText: "Driver context in provider workspace",
  label: "City Funk Berlin",
  selected: false,
  type: "provider" as const,
  value: "driver-context",
};

const meta = {
  title: "Taxios/TaxiOS/Active Context/Switcher",
  component: ActiveContextSwitcher,
  decorators: [
    (Story) => (
      <StoryCanvas maxWidth="420px">
        <Story />
      </StoryCanvas>
    ),
  ],
  args: {
    copy: {
      currentLabel: "Current workspace",
      emptyLabel: "No workspaces available",
      errorFallback: "Workspace could not be switched.",
      label: "Workspace context",
      loadingLabel: "Switching...",
      selectLabel: "Choose workspace",
      submitLabel: "Switch",
      typeLabels: {
        company: "Company",
        provider: "Provider",
      },
    },
    onSelect: () => {
      return;
    },
    options: [companyOption, providerOption],
  },
} satisfies Meta<typeof ActiveContextSwitcher>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleOption: Story = {
  args: {
    options: [companyOption],
  },
};

export const MultipleOptions: Story = {};

export const SelectedProvider: Story = {
  args: {
    options: [
      { ...companyOption, selected: false },
      { ...providerOption, selected: true },
    ],
  },
};

export const SelectedDriver: Story = {
  args: {
    options: [
      { ...companyOption, selected: false },
      { ...providerOption, selected: false },
      { ...driverOption, selected: true },
    ],
  },
};

export const CompactDriver: Story = {
  args: {
    options: [
      { ...companyOption, selected: false },
      { ...providerOption, selected: false },
      { ...driverOption, selected: true },
    ],
    size: "compact",
  },
};

export const SelectedCompany: Story = {
  args: {
    options: [
      { ...companyOption, selected: true },
      { ...providerOption, selected: false },
    ],
  },
};

export const DisabledLoading: Story = {
  args: {
    disabled: true,
    isSubmitting: true,
  },
};

export const ErrorCopy: Story = {
  args: {
    errorMessage: "Selected workspace is no longer available.",
  },
};
