import type { ReactNode } from "react";

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--taxis-workspace-text-muted)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[18px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface)] p-5 shadow-[var(--taxis-workspace-shadow-soft)]">
      {children}
    </div>
  );
}

function Rule({ number, text }: { number: number; text: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--taxis-workspace-accent-soft)] text-xs font-bold text-[var(--taxis-workspace-accent-strong)]">
        {number}
      </span>
      <span className="text-[13px] font-medium leading-relaxed text-[var(--taxis-workspace-text-secondary)]">
        {text}
      </span>
    </li>
  );
}

function StoryLink({ name, path }: { name: string; path: string }) {
  return (
    <a
      className="block rounded-[14px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] px-4 py-3 text-[13px] font-medium text-[var(--taxis-workspace-text-secondary)] transition-colors hover:border-[var(--taxis-workspace-surface-rim-strong)] hover:text-[var(--taxis-workspace-text-strong)]"
      href={path}
      rel="noreferrer"
      target="_blank"
    >
      {name}
    </a>
  );
}

function LabRef({ name, description }: { name: string; description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-[14px] border border-[var(--taxis-workspace-surface-rim)] bg-[var(--taxis-workspace-surface-soft)] px-4 py-3">
      <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-[var(--taxis-workspace-accent)]" />
      <div>
        <p className="text-[13px] font-semibold text-[var(--taxis-workspace-text-strong)]">
          {name}
        </p>
        <p className="text-[12px] text-[var(--taxis-workspace-text-muted)]">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function Component() {
  return (
    <div className="min-h-[100dvh] p-6 md:p-10">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <p className="taxis-company-page-eyebrow">TaxiOS v0 Registry</p>
          <h1 className="taxis-company-page-title">Design Context</h1>
          <p className="taxis-company-page-description">
            Visual design brief, Storybook references, and v0 polish
            instructions for the TaxiOS porcelain UI system. Read this before
            opening any lab block.
          </p>
        </div>

        {/* v0 Instruction Summary */}
        <Section title="v0 Instruction Summary">
          <Card>
            <ol className="space-y-3">
              <Rule
                number={1}
                text='Use the "porcelain" material system: white -> #fcfcfd -> #f5f6f8 gradients. Include ::before glaze and ::after inset edge on primary surfaces.'
              />
              <Rule
                number={2}
                text="All shadows must be neutral rgba(15,23,42,...). No brown, no colored shadows."
              />
              <Rule
                number={3}
                text="Orange (#ff6a00) is reserved for active / selected / focus / status only. Never use orange for borders, shadows, or backgrounds except accent states."
              />
              <Rule
                number={4}
                text="Border radius: 28px primary surfaces, 22px sections, 18px cards, 14px controls."
              />
              <Rule
                number={5}
                text="Text hierarchy: strong (#0f172a) -> secondary (#334155) -> subtle (#475569) -> muted (#64748b)."
              />
              <Rule
                number={6}
                text="Always include the taxios-premium class on <body> and import @/styles/globals.css in layout."
              />
              <Rule
                number={7}
                text="Use CSS custom properties from the tokens system. Never hard-code hex values except in token definitions."
              />
            </ol>
          </Card>
        </Section>

        {/* Storybook References */}
        <Section title="Storybook References">
          <div className="grid gap-2 sm:grid-cols-2">
            <StoryLink
              name="Button"
              path="/?path=/story/taxios-ui-button--default"
            />
            <StoryLink
              name="Badge"
              path="/?path=/story/taxios-ui-badge--default"
            />
            <StoryLink
              name="WorkspaceSurface"
              path="/?path=/story/taxios-taxios-workspace-primitives--workspace-surface-story"
            />
            <StoryLink
              name="WorkspaceInnerCard"
              path="/?path=/story/taxios-taxios-workspace-primitives--workspace-inner-card-story"
            />
            <StoryLink
              name="WorkspaceSectionHeader"
              path="/?path=/story/taxios-taxios-workspace-primitives--workspace-section-header-story"
            />
            <StoryLink
              name="Workspace status chips"
              path="/?path=/story/taxios-taxios-workspace-primitives--workspace-status-chips-story"
            />
            <StoryLink
              name="Operational table"
              path="/?path=/story/taxios-taxios-workspace-table--operational-table"
            />
            <StoryLink
              name="Entity cards"
              path="/?path=/story/taxios-taxios-workspace-entity-card--entity-cards"
            />
            <StoryLink
              name="StateView (empty)"
              path="/?path=/story/taxios-taxios-workspace-stateview--empty"
            />
            <StoryLink
              name="CloseButton"
              path="/?path=/story/taxios-taxios-workspace-controls--close-button"
            />
            <StoryLink
              name="Segmented control"
              path="/?path=/story/taxios-taxios-workspace-controls--segmented"
            />
            <StoryLink
              name="Booking wizard"
              path="/?path=/story/taxios-taxios-workspace-wizard--booking-wizard"
            />
            <StoryLink
              name="Ride Detail Drawer (open)"
              path="/?path=/story/taxios-taxios-company-dashboard-ride-detail-drawer--open"
            />
          </div>
        </Section>

        {/* Registry Labs */}
        <Section title="Registry Labs">
          <div className="grid gap-2">
            <LabRef
              description="Renders all button variants. Storybook truth: TaxiOS/UI/Button."
              name="button-lab"
            />
            <LabRef
              description="Full operational table with header, rows, scroll. Storybook truth: Taxios/TaxiOS/Workspace/Table -> Operational table."
              name="workspace-table-lab"
            />
            <LabRef
              description="Self-contained drawer with inline mock data. Storybook truth: Taxios/TaxiOS/Company Dashboard/Ride Detail Drawer -> Open."
              name="ride-detail-drawer-lab"
            />
          </div>
        </Section>

        {/* Key Visual Tokens */}
        <Section title="Key Visual Tokens">
          <Card>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--taxis-workspace-text-muted)]">
                  Surface
                </p>
                <div className="mt-2 space-y-1 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-surface)] border border-[var(--taxis-workspace-surface-rim)] align-middle mr-2" />
                    --taxis-workspace-surface: #ffffff
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-surface-soft)] border border-[var(--taxis-workspace-surface-rim)] align-middle mr-2" />
                    --taxis-workspace-surface-soft: #fcfcfd
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-surface-deep)] border border-[var(--taxis-workspace-surface-rim)] align-middle mr-2" />
                    --taxis-workspace-surface-deep: #f5f6f8
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--taxis-workspace-text-muted)]">
                  Text
                </p>
                <div className="mt-2 space-y-1 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-text-strong)] align-middle mr-2" />
                    strong: #0f172a
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-text-secondary)] align-middle mr-2" />
                    secondary: #334155
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-text-subtle)] align-middle mr-2" />
                    subtle: #475569
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-text-muted)] align-middle mr-2" />
                    muted: #64748b
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--taxis-workspace-text-muted)]">
                  Accent
                </p>
                <div className="mt-2 space-y-1 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-accent)] align-middle mr-2" />
                    --taxis-workspace-accent: #ff6a00
                  </p>
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-accent-strong)] align-middle mr-2" />
                    --taxis-workspace-accent-strong: #ff5f00
                  </p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--taxis-workspace-text-muted)]">
                  Page
                </p>
                <div className="mt-2 space-y-1 text-[13px] text-[var(--taxis-workspace-text-secondary)]">
                  <p>
                    <span className="inline-block h-3 w-3 rounded-sm bg-[var(--taxis-workspace-page-bg)] border border-[var(--taxis-workspace-surface-rim)] align-middle mr-2" />
                    --taxis-workspace-page-bg: #f8fafc
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Section>

        {/* Full Context Reference */}
        <Section title="Full Context Reference">
          <Card>
            <p className="text-[13px] text-[var(--taxis-workspace-text-secondary)] leading-relaxed">
              The complete design context document is included as{" "}
              <code className="rounded bg-[var(--taxis-workspace-surface-soft)] px-1.5 py-0.5 text-[12px] font-mono text-[var(--taxis-workspace-text-strong)]">
                docs/taxios-design-context.md
              </code>{" "}
              in this registry item. It contains the full Storybook URL map,
              porcelain material system documentation, color system, button
              variants, component-specific notes, and a v0 prompt template.
            </p>
          </Card>
        </Section>
      </div>
    </div>
  );
}
