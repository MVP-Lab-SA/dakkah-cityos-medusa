import CompanyModuleService from "./service";
import { Module } from "@medusajs/framework/utils";

export default Module("company", {
  service: CompanyModuleService,
});

export * from "./models";
