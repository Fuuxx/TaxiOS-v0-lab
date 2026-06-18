export type CompanyFinanceSummary = {
  invoiceCount: number;
  latestInvoiceLabel: string;
  pricedCount: number;
  totalKnownAmountLabel: string;
  unpricedCount: number;
};

export type CompanyFinanceRow = {
  amountLabel: string;
  billingStatusLabel: string;
  bookingId: string;
  bookingPublicId: string | null;
  completedDateLabel: string;
  completedTimeLabel: string;
  costStatusLabel: string;
  createdDateLabel: string;
  createdTimeLabel: string;
  destinationAddress: string;
  invoiceId: string;
  passengerSummary: string;
  pickupAddress: string;
  pickupDateLabel: string;
  pickupTimeLabel: string;
  providerName: string | null;
  publicId: string | null;
  vehicleLabel: string | null;
};

export type CompanyFinancePayload = {
  costRows: CompanyFinanceRow[];
  invoiceRows: CompanyFinanceRow[];
  organizationId: string;
  organizationName: string;
  summary: CompanyFinanceSummary;
};

export type CompanyFinanceCopy = {
  amountColumn: string;
  bookingColumn: string;
  completedColumn: string;
  costStatusColumn: string;
  costsSectionTitle: string;
  emptyDescription: string;
  emptyTitle: string;
  invoiceColumn: string;
  invoicesSectionTitle: string;
  latestInvoiceLabel: string;
  passengerColumn: string;
  providerColumn: string;
  routeColumn: string;
  snapshotCountLabel: string;
  subtitle: string;
  summarySectionTitle: string;
  title: string;
  totalKnownAmountLabel: string;
  unpricedCountLabel: string;
  vehicleColumn: string;
};
