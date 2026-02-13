import VolumePricingModuleService from "./service.js";
import { Module } from "@medusajs/framework/utils";

export default Module("volumePricing", {
  service: VolumePricingModuleService,
});

export * from "./models.js";
