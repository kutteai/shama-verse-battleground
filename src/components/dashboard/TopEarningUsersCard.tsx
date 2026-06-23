
import NotAvailablePanel from "@/components/shared/NotAvailablePanel";

interface UserProps {
  name: string;
  followers: number;
  earnings: string;
}

interface TopEarningUsersCardProps {
  users: UserProps[];
}

// Coming soon: no earnings model exists in the backend yet. Dashboard.tsx
// currently shows real "Top Followed Users" data in this slot instead
// (see TopFollowedUsers component); this card is kept for when an earnings
// model lands, rather than being deleted.
const TopEarningUsersCard = (_props: TopEarningUsersCardProps) => {
  return (
    <NotAvailablePanel
      feature="Top Earning Users"
      reason="No earnings model exists yet, so per-user earnings can't be reported."
    />
  );
};

export default TopEarningUsersCard;
