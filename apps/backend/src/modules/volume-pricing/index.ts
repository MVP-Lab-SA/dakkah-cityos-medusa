import VolumePricingModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export default Module("volumePricing", {
  service: VolumePricingModuleService,
});

export * from "./models";
