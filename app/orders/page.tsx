import { Metadata } from "next";
import OrdersPageClient from "./client";

export const metadata: Metadata = {
  title: "Order History | Oniromancy AI",
  description: "View your purchase history and subscription details.",
};

export default function OrdersPage() {
  return <OrdersPageClient />;
}
