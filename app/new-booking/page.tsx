import { MainDashboardHarness } from "../../components/main-dashboard-harness";
import { NewBookingOverlayHarness } from "../../components/new-booking-overlay-harness";

export default function NewBookingPage() {
  return (
    <>
      <MainDashboardHarness />
      <NewBookingOverlayHarness />
    </>
  );
}
