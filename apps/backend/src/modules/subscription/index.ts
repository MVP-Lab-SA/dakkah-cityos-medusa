import SubscriptionModuleService from "./service.js";
import { Module } from "@medusajs/framework/utils";

export default Module("subscription", {
  service: SubscriptionModuleService,
});

export * from "./models.js";
