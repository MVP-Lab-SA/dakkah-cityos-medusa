import { MedusaService } from "@medusajs/framework/utils";
import PodProduct from "./models/pod-product";
import PodOrder from "./models/pod-order";

class PrintOnDemandModuleService extends MedusaService({
  PodProduct,
  PodOrder,
}) {
  /**
   * Get the template and customisation options for a product.
   */
  async getProductTemplate(podProductId: string): Promise<{
    templateUrl: string;
    customizationOptions: Record<string, unknown> | null;
  }> {
    const product = await this.retrievePodProduct(podProductId);
    return {
      templateUrl: (product as any).template_url,
      customizationOptions: (product as any).customization_options ?? null,
    };
  }

  /**
   * Submit a print-on-demand order when a purchase is made.
   */
  async submitPodOrder(data: {
    orderId: string;
    podProductId: string;
    customizationData?: Record<string, unknown>;
    quantity?: number;
  }): Promise<any> {
    const product = await this.retrievePodProduct(data.podProductId);

    const podOrder = await (this as any).createPodOrders({
      order_id: data.orderId,
      pod_product_id: data.podProductId,
      customization_data: data.customizationData ?? null,
      quantity: data.quantity ?? 1,
      unit_cost: (product as any).base_cost,
      print_status: "queued",
    });

    return podOrder;
  }

  /**
   * Track the current print + shipping status of a pod order.
   */
  async trackPodOrder(podOrderId: string): Promise<{
    status: string;
    trackingNumber: string | null;
    estimatedDelivery: string | null;
  }> {
    const order = await this.retrievePodOrder(podOrderId);
    return {
      status: (order as any).print_status,
      trackingNumber: (order as any).tracking_number ?? null,
      estimatedDelivery: null, // Populate from shipping provider in production
    };
  }

  /**
   * Cancel a queued pod order (only possible before printing starts).
   */
  async cancelPodOrder(podOrderId: string): Promise<any> {
    const order = await this.retrievePodOrder(podOrderId);
    if ((order as any).print_status !== "queued") {
      throw new Error(
        "Cannot cancel a pod order that has already started printing",
      );
    }
    return await (this as any).updatePodOrders({
      id: podOrderId,
      print_status: "cancelled",
    });
  }
}

export default PrintOnDemandModuleService;
