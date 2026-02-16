import { defineLink } from "@medusajs/framework/utils"
import CustomerModule from "@medusajs/medusa/customer"
import NotificationPreferencesModule from "../modules/notification-preferences"

export default defineLink(
  CustomerModule.linkable.customer,
  NotificationPreferencesModule.linkable.notificationPreference
)
