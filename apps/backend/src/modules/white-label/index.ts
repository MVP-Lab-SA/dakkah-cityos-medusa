import WhiteLabelModuleService from "./service";
import { Migration20260220000021 } from "./migrations/Migration20260220000021";

export const WHITE_LABEL_MODULE = "whiteLabel";

export default {
  service: WhiteLabelModuleService,
  migrations: [Migration20260220000021],
};
