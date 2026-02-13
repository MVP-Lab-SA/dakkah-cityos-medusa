import CompanyModuleService from "./service.js";
import { Module } from "@medusajs/framework/utils";

export default Module("company", {
  service: CompanyModuleService,
});

export * from "./models.js";
