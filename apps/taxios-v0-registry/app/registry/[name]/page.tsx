import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { OpenInV0Button } from "../../../src/open-in-v0-button";
import { registryItems, registryItemByName } from "../../../src/registry-data";

type RegistryItemPageProps = {
  params: Promise<{
    name: string;
  }>;
};

export function generateStaticParams() {
  return registryItems.map((item) => ({ name: item.name }));
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: RegistryItemPageProps) {
  const { name } = await params;
  const item = registryItemByName.get(name);

  return {
    title: item ? `${item.title} - TaxiOS v0 Registry` : "TaxiOS v0 Registry"
  };
}

export default async function RegistryItemPage({
  params
}: RegistryItemPageProps) {
  const { name } = await params;
  const item = registryItemByName.get(name);

  if (!item) {
    notFound();
  }

  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host?.startsWith("localhost") || host?.startsWith("127.0.0.1") ? "http" : "https");
  const registryItemUrl = host ? `${protocol}://${host}/r/${item.name}.json` : `/r/${item.name}.json`;
  const Demo = item.demo;

  return (
    <main className="taxios-registry-page">
      <div className="taxios-registry-shell">
        <Link
          className="text-sm font-semibold text-[var(--taxis-workspace-text-muted)] hover:text-[var(--taxis-workspace-text-strong)]"
          href="/"
        >
          TaxiOS registry
        </Link>
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="taxis-company-page-eyebrow">{item.kind}</p>
            <h1 className="taxis-company-page-title">{item.title}</h1>
            <p className="taxis-company-page-description">{item.description}</p>
          </div>
          <OpenInV0Button itemUrl={registryItemUrl} title={item.title} />
        </div>

        <div className="taxios-registry-demo-frame mt-8">
          <div className="taxios-registry-demo-inner">
            <Demo />
          </div>
        </div>
      </div>
    </main>
  );
}
