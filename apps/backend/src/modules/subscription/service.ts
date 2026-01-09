import { MedusaService } from "@medusajs/framework/utils";
import { Subscription, SubscriptionItem, BillingCycle } from "./models";

class SubscriptionModuleService extends MedusaService({
  Subscription,
  SubscriptionItem,
  BillingCycle,
}) {}

export default SubscriptionModuleService;
