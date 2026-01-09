import QuoteModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export default Module("quote", {
  service: QuoteModuleService,
});

export * from "./models";
