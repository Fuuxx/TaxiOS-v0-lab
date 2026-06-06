import type { StatusTone } from "../data/company-dashboard-data";

type StatusChipProps = {
  label: string;
  tone: StatusTone;
};

export function StatusChip({ label, tone }: StatusChipProps) {
  return <span className={`status-chip status-${tone}`}>{label}</span>;
}
