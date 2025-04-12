
export interface User {
  id: string;
  username: string;
  avatar: string | null;
}

export interface Transaction {
  id: string;
  user: User;
  type: string;
  amount: number;
  fee: number;
  net: number;
  status: string;
  description: string;
  created_at: string;
  payment_method: string | null;
  payment_details: string | null;
  related_id: string | null;
  error_message?: string;
}

export interface RevenueData {
  total: number;
  gift_purchases: number;
  challenge_entries: number;
  subscriptions: number;
  other: number;
  timeframe: string;
}

export interface PayoutStats {
  total_paid: number;
  pending_payouts: number;
  average_payout: number;
  users_paid: number;
  next_scheduled: string;
  timeframe: string;
}
