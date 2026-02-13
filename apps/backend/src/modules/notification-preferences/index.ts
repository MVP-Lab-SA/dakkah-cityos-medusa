import { Module } from "@medusajs/framework/utils"
import NotificationPreferencesModuleService from "./service.js"

export const NOTIFICATION_PREFERENCES_MODULE = "notificationPreferences"

export default Module(NOTIFICATION_PREFERENCES_MODULE, {
  service: NotificationPreferencesModuleService,
})
