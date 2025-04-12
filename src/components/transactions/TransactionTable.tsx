
import { useState } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MoreHorizontal, DollarSign, Gift, PlusCircle, MinusCircle, 
  Clock, ArrowDownLeft, ArrowUpRight, FileSpreadsheet
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { Transaction } from "@/types/transactions";

interface TransactionTableProps {
  transactions: Transaction[];
  filteredCount: number;
  totalCount: number;
  onViewDetails: (transaction: Transaction) => void;
}

export const TransactionTable = ({ 
  transactions, 
  filteredCount, 
  totalCount, 
  onViewDetails 
}: TransactionTableProps) => {
  
  // Helper functions
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
        return <PlusCircle className="h-5 w-5 text-blue-500" />;
      case "payout":
        return <MinusCircle className="h-5 w-5 text-red-500" />;
      case "challenge_earnings":
        return <PlusCircle className="h-5 w-5 text-green-500" />;
      case "gift_received":
        return <Gift className="h-5 w-5 text-green-500" />;
      case "subscription":
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <DollarSign className="h-5 w-5 text-gray-500" />;
    }
  };

  const getAmountWithDirection = (transaction: Transaction) => {
    const amount = formatCurrency(Math.abs(transaction.amount));
    return transaction.amount >= 0 ? (
      <div className="flex items-center">
        <ArrowDownLeft size={16} className="mr-1 text-green-600" />
        <span>{amount}</span>
      </div>
    ) : (
      <div className="flex items-center">
        <ArrowUpRight size={16} className="mr-1 text-red-600" />
        <span>{amount}</span>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Transaction</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Net</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <TableRow key={transaction.id} className="group">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-muted rounded-full">
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="font-medium">
                          {transaction.id}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {transaction.type.replace(/_/g, " ")}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={transaction.user.avatar || undefined} />
                        <AvatarFallback>{transaction.user.username.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {transaction.user.username}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {transaction.user.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px] truncate" title={transaction.description}>
                      {transaction.description}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {getAmountWithDirection(transaction)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.fee)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(transaction.net)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell>
                    <div className="whitespace-nowrap">
                      {formatDate(transaction.created_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onViewDetails(transaction)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <DollarSign size={36} className="mb-2" />
                    <p>No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalCount} transactions
        </div>
        <Button variant="outline" size="sm" disabled={transactions.length === 0}>
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export Transactions
        </Button>
      </CardFooter>
    </Card>
  );
};
