import Link from "next/link";
import { registryItems } from "../src/registry-data";

export default function RegistryIndexPage() {
  const components = registryItems.filter((item) => item.kind === "component");
  const blocks = registryItems.filter((item) => item.kind === "block");
  const pages = registryItems.filter((item) => item.kind === "page");

  return (
    <main className="taxios-registry-page">
      <div className="taxios-registry-shell">
        <p className="taxis-company-page-eyebrow">TaxiOS custom registry</p>
        <h1 className="taxis-company-page-title">TaxiOS v0 Registry</h1>
        <p className="taxis-company-page-description">
          Isolated registry app for TaxiOS UI components, blocks, CSS variables, and workspace tokens.
        </p>

        {pages.length > 0 && (
          <section className="mt-8">
            <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
              Context
            </h2>
            <div className="taxios-registry-nav">
              {pages.map((item) => (
                <Link
                  className="rounded-lg border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 py-2 text-sm font-semibold text-[var(--taxis-workspace-text-strong)] shadow-sm transition hover:border-[var(--taxis-workspace-border-strong)]"
                  href={`/registry/${item.name}`}
                  key={item.name}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
            Components
          </h2>
          <div className="taxios-registry-nav">
            {components.map((item) => (
              <Link
                className="rounded-lg border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 py-2 text-sm font-semibold text-[var(--taxis-workspace-text-strong)] shadow-sm transition hover:border-[var(--taxis-workspace-border-strong)]"
                href={`/registry/${item.name}`}
                key={item.name}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-[var(--taxis-workspace-text-strong)]">
            Blocks
          </h2>
          <div className="taxios-registry-nav">
            {blocks.map((item) => (
              <Link
                className="rounded-lg border border-[var(--taxis-workspace-border)] bg-[var(--taxis-workspace-surface)] px-3 py-2 text-sm font-semibold text-[var(--taxis-workspace-text-strong)] shadow-sm transition hover:border-[var(--taxis-workspace-border-strong)]"
                href={`/registry/${item.name}`}
                key={item.name}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
