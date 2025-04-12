
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Transaction } from "@/types/transactions";
import { 
  Tag, Music, Gift, Clock, CreditCard, User 
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface TransactionDetailsProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetails = ({ 
  transaction, 
  open, 
  onOpenChange 
}: TransactionDetailsProps) => {
  if (!transaction) {
    return null;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "MMM d, yyyy h:mm a");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "gift_purchase":
        return <Gift className="h-5 w-5 text-purple-500" />;
      case "challenge_entry":
        return <Tag className="h-5 w-5 text-blue-500" />;
      case "payout":
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case "challenge_earnings":
        return <Tag className="h-5 w-5 text-green-500" />;
      case "gift_received":
        return <Gift className="h-5 w-5 text-green-500" />;
      case "subscription":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            View complete transaction information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-md space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Transaction ID:</span>
              <span className="font-medium">{transaction.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Status:</span>
              {getStatusBadge(transaction.status)}
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Date:</span>
              <span>{formatDate(transaction.created_at)}</span>
            </div>
          </div>
          
          <div className="border-t border-b py-4 space-y-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{transaction.user.username.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{transaction.user.username}</div>
                <div className="text-sm text-muted-foreground">{transaction.user.id}</div>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => {
                  toast.info(`Viewing user ${transaction.user.username}`);
                  onOpenChange(false);
                }}
              >
                <User className="h-4 w-4 mr-1" />
                View User
              </Button>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Transaction Type:</div>
              <div className="flex items-center">
                {getTypeIcon(transaction.type)}
                <span className="ml-2 capitalize">{transaction.type.replace(/_/g, " ")}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Description:</div>
              <div>{transaction.description}</div>
            </div>
            
            {transaction.related_id && (
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">Related Item:</div>
                <div className="flex items-center">
                  {transaction.related_id.startsWith("ch_") && <Tag size={14} className="mr-1" />}
                  {transaction.related_id.startsWith("fs_") && <Music size={14} className="mr-1" />}
                  {transaction.related_id.startsWith("gift_") && <Gift size={14} className="mr-1" />}
                  {transaction.related_id.startsWith("sub_") && <Clock size={14} className="mr-1" />}
                  {transaction.related_id.startsWith("po_") && <CreditCard size={14} className="mr-1" />}
                  <span>{transaction.related_id}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <div className="text-sm font-medium mb-2">Financial Details</div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Amount:</div>
                <div className="text-lg font-bold">
                  {formatCurrency(Math.abs(transaction.amount))}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Platform Fee:</div>
                <div className="text-lg">
                  {formatCurrency(transaction.fee)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Net Amount:</div>
                <div className="text-lg font-bold">
                  {formatCurrency(transaction.net)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Payment Method:</div>
                <div className="text-lg">
                  {transaction.payment_method 
                    ? <span className="capitalize">{transaction.payment_method}</span>
                    : <span className="text-muted-foreground">N/A</span>
                  }
                </div>
              </div>
            </div>

            {transaction.payment_details && (
              <div>
                <div className="text-sm text-muted-foreground">Payment Details:</div>
                <div>{transaction.payment_details}</div>
              </div>
            )}

            {transaction.error_message && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <div className="text-sm font-medium text-red-700">Error Message:</div>
                <div className="text-red-600">{transaction.error_message}</div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
