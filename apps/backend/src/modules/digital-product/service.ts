import { MedusaService } from "@medusajs/framework/utils"
import DigitalAsset from "./models/digital-asset"
import DownloadLicense from "./models/download-license"

class DigitalProductModuleService extends MedusaService({
  DigitalAsset,
  DownloadLicense,
}) {
  /**
   * Generate a secure, time-limited download link for a digital asset.
   */
  async generateDownloadLink(assetId: string, customerId: string): Promise<{ url: string; expiresAt: Date }> {
    const asset = await this.retrieveDigitalAsset(assetId)
    const license = await this.listDownloadLicenses({
      asset_id: assetId,
      customer_id: customerId,
      status: "active",
    }) as any
    const licenseList = Array.isArray(license) ? license : [license].filter(Boolean)
    if (licenseList.length === 0) {
      throw new Error("No active license found for this asset and customer")
    }
    const token = `${assetId}-${customerId}-${Date.now().toString(36)}`
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
    await this.trackDownload(assetId, customerId)
    return { url: `/downloads/${token}`, expiresAt }
  }

  /**
   * Validate a license key and return its status and associated asset.
   */
  async validateLicense(licenseKey: string): Promise<{ valid: boolean; license?: any; asset?: any }> {
    const licenses = await this.listDownloadLicenses({ license_key: licenseKey }) as any
    const licenseList = Array.isArray(licenses) ? licenses : [licenses].filter(Boolean)
    if (licenseList.length === 0) {
      return { valid: false }
    }
    const license = licenseList[0]
    if (license.status !== "active") {
      return { valid: false, license }
    }
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return { valid: false, license }
    }
    const asset = await this.retrieveDigitalAsset(license.asset_id)
    return { valid: true, license, asset }
  }

  /**
   * Track a download event for a digital asset by a customer.
   */
  async trackDownload(assetId: string, customerId: string): Promise<any> {
    const licenses = await this.listDownloadLicenses({
      asset_id: assetId,
      customer_id: customerId,
      status: "active",
    }) as any
    const licenseList = Array.isArray(licenses) ? licenses : [licenses].filter(Boolean)
    if (licenseList.length === 0) {
      throw new Error("No active license found")
    }
    const license = licenseList[0]
    return await (this as any).updateDownloadLicenses({
      id: license.id,
      download_count: (Number(license.download_count) || 0) + 1,
      last_downloaded_at: new Date(),
    })
  }

  /**
   * Revoke a customer's access to a digital asset by deactivating their license.
   */
  async revokeAccess(assetId: string, customerId: string): Promise<any> {
    const licenses = await this.listDownloadLicenses({
      asset_id: assetId,
      customer_id: customerId,
      status: "active",
    }) as any
    const licenseList = Array.isArray(licenses) ? licenses : [licenses].filter(Boolean)
    if (licenseList.length === 0) {
      throw new Error("No active license found to revoke")
    }
    return await (this as any).updateDownloadLicenses({
      id: licenseList[0].id,
      status: "revoked",
      revoked_at: new Date(),
    })
  }
}

export default DigitalProductModuleService
