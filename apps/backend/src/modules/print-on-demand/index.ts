import PrintOnDemandModuleService from "./service";
import { Migration20260220000020 } from "./migrations/Migration20260220000020";

export const PRINT_ON_DEMAND_MODULE = "printOnDemand";

export default {
  service: PrintOnDemandModuleService,
  migrations: [Migration20260220000020],
};
