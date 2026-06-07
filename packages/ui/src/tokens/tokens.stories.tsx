import type { Meta, StoryObj } from "@storybook/react-vite";

import { StoryCanvas } from "../storybook/story-canvas";
import { TokenSwatch } from "../storybook/token-swatch";
import { type TokenMetadata, tokenCatalog } from "./catalog";

const meta = {
  title: "TaxiOS/Tokens",
  parameters: {
    layout: "fullscreen",
    a11y: { test: "error" },
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

function TokenGrid({
  description,
  tokens,
  title,
}: {
  description: string;
  tokens: readonly TokenMetadata[];
  title: string;
}) {
  return (
    <StoryCanvas maxWidth="1280px" tone="dashboard">
      <section className="grid gap-6">
        <div className="max-w-3xl">
          <h1 className="font-semibold text-3xl text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-[var(--taxis-workspace-text-muted)] text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => (
            <TokenSwatch key={token.variable} token={token} />
          ))}
        </div>
      </section>
    </StoryCanvas>
  );
}

function TypeScaleGrid({
  description,
  tokens,
  title,
}: {
  description: string;
  tokens: readonly TokenMetadata[];
  title: string;
}) {
  return (
    <StoryCanvas maxWidth="1280px" tone="dashboard">
      <section className="grid gap-6">
        <div className="max-w-3xl">
          <h1 className="font-semibold text-3xl text-[var(--taxis-workspace-text-strong)] tracking-tight">
            {title}
          </h1>
          <p className="mt-2 text-[var(--taxis-workspace-text-muted)] text-sm leading-relaxed">
            {description}
          </p>
        </div>
        <div className="grid gap-4">
          {tokens.map((token) => {
            const isEyebrow = token.variable === "--taxis-text-eyebrow";
            return (
              <article
                key={token.variable}
                className="grid gap-2 rounded-lg border border-[var(--taxis-color-border-soft)] bg-[var(--taxis-color-surface)] p-5 shadow-[var(--taxis-shadow-soft)]"
              >
                <p
                  className={`text-[var(--taxis-workspace-text-strong)]${
                    isEyebrow ? " font-semibold uppercase" : ""
                  }`}
                  style={{
                    fontSize: token.value,
                    letterSpacing: isEyebrow
                      ? "var(--taxis-text-eyebrow-tracking)"
                      : undefined,
                  }}
                >
                  TaxiOS operational 0123456789
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[var(--taxis-color-charcoal-950)] text-sm">
                    {token.name}
                  </h3>
                  <code className="rounded-md bg-[var(--taxis-color-surface-muted)] px-2 py-1 font-medium text-[var(--taxis-color-muted)] text-xs">
                    {token.variable}
                  </code>
                </div>
                <p className="text-[var(--taxis-color-muted)] text-xs leading-relaxed">
                  {token.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>
    </StoryCanvas>
  );
}

export const FoundationColors: Story = {
  render: () => (
    <TokenGrid
      description="Foundation colors are shared system-level tokens. Prefer semantic workspace tokens inside workspace components."
      title="Foundation Colors"
      tokens={tokenCatalog.foundation.colors}
    />
  ),
};

export const WorkspaceSurfaces: Story = {
  render: () => (
    <TokenGrid
      description="Workspace surfaces define the porcelain and frosted-glass material system."
      title="Workspace Surfaces"
      tokens={tokenCatalog.workspace.surface}
    />
  ),
};

export const WorkspaceText: Story = {
  render: () => (
    <TokenGrid
      description="Workspace text tokens keep hierarchy stable without raw color decisions in components."
      title="Workspace Text"
      tokens={tokenCatalog.workspace.text}
    />
  ),
};

export const WorkspaceAccent: Story = {
  render: () => (
    <TokenGrid
      description="Orange is reserved for active, selected, focus, status, and halo cues."
      title="Workspace Accent"
      tokens={tokenCatalog.workspace.accent}
    />
  ),
};

export const CompanyStatus: Story = {
  render: () => (
    <TokenGrid
      description="Company status tokens keep operational state colors consistent across tables, cards, timelines, and overlays."
      title="Company Status"
      tokens={tokenCatalog.status.tones}
    />
  ),
};

export const TypeScale: Story = {
  render: () => (
    <TypeScaleGrid
      description="The operational type scale replaces arbitrary text-[Npx] usages with semantic font-size tokens. Consume them as text-taxis-eyebrow, text-taxis-body-sm, text-taxis-section-sm, text-taxis-section-md, and text-taxis-value utilities."
      title="Type Scale"
      tokens={tokenCatalog.foundation.type}
    />
  ),
};

export const Radius: Story = {
  render: () => (
    <TokenGrid
      description="Radius tokens keep controls and framed surfaces predictable."
      title="Radius"
      tokens={tokenCatalog.foundation.radius}
    />
  ),
};

export const Shadows: Story = {
  render: () => (
    <TokenGrid
      description="Shadow tokens express depth. Workspace shadows stay neutral."
      title="Shadows"
      tokens={[
        ...tokenCatalog.foundation.shadow,
        ...tokenCatalog.workspace.shadow,
      ]}
    />
  ),
};

export const Motion: Story = {
  render: () => (
    <TokenGrid
      description="Motion tokens are short, calm, and used only where the workflow benefits."
      title="Motion"
      tokens={tokenCatalog.foundation.motion}
    />
  ),
};
