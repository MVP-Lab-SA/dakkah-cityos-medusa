import { defineLink } from "@medusajs/framework/utils"
import ProductModule from "@medusajs/medusa/product"
import AuctionModule from "../modules/auction.js"

export default defineLink(
  ProductModule.linkable.product,
  AuctionModule.linkable.auctionListing
)
