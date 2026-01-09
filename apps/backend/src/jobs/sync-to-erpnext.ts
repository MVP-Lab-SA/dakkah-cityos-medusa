import { MedusaContainer } from "@medusajs/framework/types";
import { ERPNextService } from "../integrations/erpnext";
import { logger } from "../observability";

export default async function syncToERPNextJob(container: MedusaContainer) {
  const startTime = Date.now();
  logger.info("Starting ERPNext sync job");

  const erpnextService = new ERPNextService({
    apiKey: process.env.ERPNEXT_API_KEY!,
    apiSecret: process.env.ERPNEXT_API_SECRET!,
    siteUrl: process.env.ERPNEXT_SITE_URL!,
  });

  const query = container.resolve("query");

  try {
    // Sync completed orders from last 24 hours
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "display_id",
        "status",
        "total",
        "currency_code",
        "customer.first_name",
        "customer.last_name",
        "customer.email",
        "items.*",
        "created_at",
      ],
      filters: {
        status: "completed",
        created_at: { $gte: oneDayAgo.toISOString() },
      },
    });

    let synced = 0;
    let failed = 0;

    for (const order of orders) {
      try {
        // Sync customer first
        const customerName = `${order.customer.first_name} ${order.customer.last_name}`;
        await erpnextService.syncCustomer({
          customer_name: customerName,
          customer_email: order.customer.email,
          customer_type: "Individual",
          medusa_customer_id: order.customer.id,
        });

        // Create invoice
        const invoice = await erpnextService.createInvoice({
          customer_name: customerName,
          customer_email: order.customer.email,
          posting_date: new Date(order.created_at),
          due_date: new Date(order.created_at),
          items: order.items.map((item: any) => ({
            item_code: item.variant_sku || item.product_id,
            item_name: item.product_title,
            quantity: item.quantity,
            rate: item.unit_price,
            amount: item.subtotal,
          })),
          total: order.total,
          grand_total: order.total,
          currency: order.currency_code.toUpperCase(),
          medusa_order_id: order.id,
        });

        synced++;
        logger.info("Order synced to ERPNext", {
          order_id: order.id,
          invoice_name: invoice.name,
        });
      } catch (error) {
        failed++;
        logger.error("Failed to sync order to ERPNext", error as Error, {
          order_id: order.id,
        });
      }
    }

    const duration = (Date.now() - startTime) / 1000;
    logger.info("ERPNext sync job complete", { synced, failed, duration });
  } catch (error) {
    logger.error("ERPNext sync job failed", error as Error);
    throw error;
  }
}
