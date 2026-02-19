import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import { ReplitFileService } from "./service";

export default ModuleProvider(Modules.FILE, {
  services: [ReplitFileService],
});
