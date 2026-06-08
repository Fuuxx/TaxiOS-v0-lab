import "../workspace/workspace.css";

import { FileText, WalletCards } from "lucide-react";

import type {
  CompanyFinanceCopy,
  CompanyFinancePayload,
  CompanyFinanceRow,
} from "../../../contracts/company-finance";
import {
  WorkspaceSectionHeader,
  WorkspaceSurface,
} from "../workspace/workspace-primitives";
import { WorkspaceStateView } from "../workspace/workspace-state-view";

export type CompanyFinanceWorkspaceContentProps = {
  copy: CompanyFinanceCopy;
  payload: CompanyFinancePayload;
};

function FinanceSummaryTile({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <WorkspaceSurface className="taxis-company-surface-section taxis-company-summary-tile p-5">
      <span className="block font-semibold text-[10px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
        {label}
      </span>
      <p className="mt-2 font-semibold text-[26px] text-[var(--taxis-workspace-text-strong)] leading-none tracking-tight">
        {value}
      </p>
    </WorkspaceSurface>
  );
}

function EmptyState({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <WorkspaceStateView
      className="taxis-company-surface-empty"
      description={description}
      icon={<FileText aria-hidden="true" />}
      title={title}
      variant="empty"
    />
  );
}

function PublicReference({
  fallback,
  value,
}: {
  fallback: string;
  value: string | null;
}) {
  return (
    <span className="font-mono font-semibold text-[11px] text-[var(--taxis-workspace-text-secondary)] tracking-[0.12em]">
      {value ?? fallback}
    </span>
  );
}

const financeHeaderCellClassName =
  "taxis-workspace-table-header-cell taxis-company-table-header-cell border-y px-4 py-3";
const financeBodyCellClassName =
  "taxis-workspace-table-cell taxis-company-table-cell border-y px-4 py-4";

function RouteCell({ row }: { row: CompanyFinanceRow }) {
  return (
    <div className="grid min-w-0 gap-1">
      <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]">
        {row.pickupAddress}
      </span>
      <span className="truncate font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {row.destinationAddress}
      </span>
    </div>
  );
}

function DateTimeCell({ date, time }: { date: string; time: string }) {
  return (
    <div className="grid gap-1">
      <span className="font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]">
        {time}
      </span>
      <span className="font-medium text-[11px] text-[var(--taxis-workspace-text-muted)]">
        {date}
      </span>
    </div>
  );
}

function InvoiceTable({
  copy,
  rows,
}: {
  copy: CompanyFinanceCopy;
  rows: readonly CompanyFinanceRow[];
}) {
  if (rows.length === 0) {
    return (
      <EmptyState description={copy.emptyDescription} title={copy.emptyTitle} />
    );
  }

  return (
    <div className="taxis-workspace-table-scroll taxis-company-table-scroll">
      <table className="taxis-workspace-table taxis-company-table taxis-company-finance-table min-w-[1120px] text-left">
        <thead>
          <tr className="font-semibold text-[10px] uppercase tracking-[0.14em]">
            <th
              className={`${financeHeaderCellClassName} rounded-l-[16px] border-l`}
            >
              {copy.invoiceColumn}
            </th>
            <th className={financeHeaderCellClassName}>{copy.bookingColumn}</th>
            <th className={financeHeaderCellClassName}>
              {copy.completedColumn}
            </th>
            <th className={financeHeaderCellClassName}>{copy.routeColumn}</th>
            <th className={financeHeaderCellClassName}>
              {copy.passengerColumn}
            </th>
            <th className={financeHeaderCellClassName}>
              {copy.providerColumn}
            </th>
            <th className={financeHeaderCellClassName}>{copy.vehicleColumn}</th>
            <th
              className={`${financeHeaderCellClassName} rounded-r-[16px] border-r text-right`}
            >
              {copy.amountColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="taxis-workspace-table-row taxis-company-table-row"
              key={row.invoiceId}
            >
              <td
                className={`${financeBodyCellClassName} rounded-l-[18px] border-l`}
              >
                <PublicReference fallback="-" value={row.publicId} />
                <span className="mt-1 block text-[11px] text-[var(--taxis-workspace-text-muted)]">
                  {row.billingStatusLabel}
                </span>
              </td>
              <td className={financeBodyCellClassName}>
                <PublicReference fallback="-" value={row.bookingPublicId} />
              </td>
              <td className={financeBodyCellClassName}>
                <DateTimeCell
                  date={row.completedDateLabel}
                  time={row.completedTimeLabel}
                />
              </td>
              <td className={financeBodyCellClassName}>
                <RouteCell row={row} />
              </td>
              <td
                className={`${financeBodyCellClassName} font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.passengerSummary}
              </td>
              <td
                className={`${financeBodyCellClassName} font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.providerName ?? "-"}
              </td>
              <td
                className={`${financeBodyCellClassName} font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.vehicleLabel ?? "-"}
              </td>
              <td
                className={`${financeBodyCellClassName} rounded-r-[18px] border-r text-right font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]`}
              >
                {row.amountLabel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CostsTable({
  copy,
  rows,
}: {
  copy: CompanyFinanceCopy;
  rows: readonly CompanyFinanceRow[];
}) {
  if (rows.length === 0) {
    return (
      <EmptyState description={copy.emptyDescription} title={copy.emptyTitle} />
    );
  }

  return (
    <div className="taxis-workspace-table-scroll taxis-company-table-scroll">
      <table className="taxis-workspace-table taxis-company-table taxis-company-finance-table min-w-[920px] text-left">
        <thead>
          <tr className="font-semibold text-[10px] uppercase tracking-[0.14em]">
            <th
              className={`${financeHeaderCellClassName} rounded-l-[16px] border-l`}
            >
              {copy.bookingColumn}
            </th>
            <th className={financeHeaderCellClassName}>{copy.routeColumn}</th>
            <th className={financeHeaderCellClassName}>
              {copy.passengerColumn}
            </th>
            <th className={financeHeaderCellClassName}>
              {copy.completedColumn}
            </th>
            <th className={financeHeaderCellClassName}>
              {copy.costStatusColumn}
            </th>
            <th
              className={`${financeHeaderCellClassName} rounded-r-[16px] border-r text-right`}
            >
              {copy.amountColumn}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="taxis-workspace-table-row taxis-company-table-row"
              key={`${row.invoiceId}-cost`}
            >
              <td
                className={`${financeBodyCellClassName} rounded-l-[18px] border-l`}
              >
                <PublicReference fallback="-" value={row.bookingPublicId} />
              </td>
              <td className={financeBodyCellClassName}>
                <RouteCell row={row} />
              </td>
              <td
                className={`${financeBodyCellClassName} font-medium text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.passengerSummary}
              </td>
              <td className={financeBodyCellClassName}>
                <DateTimeCell
                  date={row.completedDateLabel}
                  time={row.completedTimeLabel}
                />
              </td>
              <td
                className={`${financeBodyCellClassName} font-semibold text-[13px] text-[var(--taxis-workspace-text-secondary)]`}
              >
                {row.costStatusLabel}
              </td>
              <td
                className={`${financeBodyCellClassName} rounded-r-[18px] border-r text-right font-semibold text-[13px] text-[var(--taxis-workspace-text-strong)]`}
              >
                {row.amountLabel}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CompanyFinanceWorkspaceContent({
  copy,
  payload,
}: CompanyFinanceWorkspaceContentProps) {
  return (
    <div className="taxis-company-workspace-content taxis-workspace-content-area">
      <div className="taxis-company-workspace-frame taxis-company-workspace-stack">
        <section className="taxis-company-page-header">
          <span className="taxis-company-page-eyebrow">
            <WalletCards aria-hidden="true" size={14} strokeWidth={1.9} />
            {payload.organizationName}
          </span>
          <h1 className="taxis-company-page-title">{copy.title}</h1>
          <p className="taxis-company-page-description">{copy.subtitle}</p>
        </section>

        <section className="taxis-company-summary-grid grid md:grid-cols-2 xl:grid-cols-4">
          <FinanceSummaryTile
            label={copy.snapshotCountLabel}
            value={payload.summary.invoiceCount}
          />
          <FinanceSummaryTile
            label={copy.unpricedCountLabel}
            value={payload.summary.unpricedCount}
          />
          <FinanceSummaryTile
            label={copy.totalKnownAmountLabel}
            value={payload.summary.totalKnownAmountLabel}
          />
          <FinanceSummaryTile
            label={copy.latestInvoiceLabel}
            value={payload.summary.latestInvoiceLabel}
          />
        </section>

        <WorkspaceSurface className="taxis-company-surface-primary grid gap-4 p-5">
          <WorkspaceSectionHeader
            action={
              <span className="font-semibold text-[11px] text-[var(--taxis-workspace-text-muted)] uppercase tracking-[0.14em]">
                {payload.invoiceRows.length}
              </span>
            }
            title={copy.invoicesSectionTitle}
          />
          <InvoiceTable copy={copy} rows={payload.invoiceRows} />
        </WorkspaceSurface>

        <WorkspaceSurface className="taxis-company-surface-primary grid gap-4 p-5">
          <WorkspaceSectionHeader
            action={<FileText aria-hidden="true" size={16} strokeWidth={1.9} />}
            title={copy.costsSectionTitle}
          />
          <CostsTable copy={copy} rows={payload.costRows} />
        </WorkspaceSurface>
      </div>
    </div>
  );
}
