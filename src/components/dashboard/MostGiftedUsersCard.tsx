
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface GiftedUserProps {
  name: string;
  giftsReceived: number;
  giftValue: string;
}

interface MostGiftedUsersCardProps {
  users: GiftedUserProps[];
}

// Coming soon: no gifting model exists in the backend yet, so this card has
// no real data source. Props are kept for the future real shape; body is a
// placeholder rather than fabricated gift counts.
const MostGiftedUsersCard = (_props: MostGiftedUsersCardProps) => {
  return (
    <NotAvailablePanel
      feature="Most Gifted Users"
      reason="No gifting model exists yet, so gift counts/value can't be reported."
    />
  );
};

export default MostGiftedUsersCard;
