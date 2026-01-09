import { defineLink } from "@medusajs/framework/utils";
import QuoteModule from "../modules/quote";
import { Modules } from "@medusajs/framework/utils";

/**
 * Link Quote Items to Products
 */
export default defineLink(
  QuoteModule.linkable.quoteItem,
  {
    linkable: Modules.PRODUCT,
    foreignKey: "product_id",
  }
);
