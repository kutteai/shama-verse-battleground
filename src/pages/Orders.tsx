import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingBag } from "lucide-react";

import { listOrders, type Order } from "@/lib/ordersAdminApi";
import { queryKeys } from "@/lib/queryKeys";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

const statusBadge = (status: Order["status"]) => {
  switch (status) {
    case "paid":
      return <Badge className="bg-green-500 text-xs">Paid</Badge>;
    case "pending":
      return (
        <Badge variant="outline" className="text-xs">
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="text-xs">
          Failed
        </Badge>
      );
    case "canceled":
      return (
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Canceled
        </Badge>
      );
  }
};

const Orders = () => {
  const [page, setPage] = useState(1);

  const ordersQuery = useQuery({
    queryKey: queryKeys.orders(page),
    queryFn: () => listOrders(page),
  });

  const orders = ordersQuery.data?.results ?? [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Merch orders placed through the shop. The item for sale and its price live on the
            storefront and in this backend's Product record — this page just shows what's come in.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ShoppingBag className="h-5 w-5 mr-2" />
              All Orders
            </CardTitle>
            <CardDescription>{ordersQuery.data?.count ?? 0} order(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <div className="h-24 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : ordersQuery.isError ? (
              <p className="text-sm text-destructive">Failed to load orders.</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders yet.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Buyer Email</TableHead>
                    <TableHead>Placed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.product_name}</TableCell>
                      <TableCell>{order.size}</TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        ${order.total_amount} {order.currency.toUpperCase()}
                      </TableCell>
                      <TableCell>{statusBadge(order.status)}</TableCell>
                      <TableCell>{order.customer_email || "—"}</TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {ordersQuery.data && (ordersQuery.data.next || ordersQuery.data.previous) && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!ordersQuery.data.previous}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!ordersQuery.data.next}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Orders;
