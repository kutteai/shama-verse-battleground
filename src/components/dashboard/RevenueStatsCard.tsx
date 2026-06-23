
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

// Coming soon: no transaction/payment/wallet model exists in the backend yet,
// so this card can't show real revenue or gift-purchase figures. Kept as a
// placeholder instead of fabricating numbers — wire up once a payments
// subsystem exists.
const RevenueStatsCard = () => {
  return (
    <NotAvailablePanel
      feature="Revenue Statistics"
      reason="No transaction/payment model exists yet, so revenue figures can't be reported."
    />
  );
};

export default RevenueStatsCard;
