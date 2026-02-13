import QuoteModuleService from "./service.js";
import { Module } from "@medusajs/framework/utils";

export default Module("quote", {
  service: QuoteModuleService,
});

export * from "./models.js";
