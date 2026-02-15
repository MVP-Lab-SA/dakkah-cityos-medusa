import { MedusaContainer } from "@medusajs/framework/types"
import crypto from "crypto"
import { createLogger } from "../../lib/logger"
const logger = createLogger("integration:orchestrator")

export type SyncSystem = "payload" | "erpnext" | "fleetbase" | "waltid" | "stripe" | "temporal"
export type SyncDirection = "inbound" | "outbound"
export type SyncStatus = "pending" | "in_progress" | "success" | "failed" | "retrying"

export interface ISyncEntry {
  id: string
  system: SyncSystem
  entity_type: string
  entity_id: string
  direction: SyncDirection
  status: SyncStatus
  error_message: string | null
  retry_count: number
  max_retries: number
  payload_hash: string | null
  correlation_id: string
  tenant_id: string | null
  node_id: string | null
  created_at: Date
  updated_at: Date
  completed_at: Date | null
}

export interface SyncStats {
  total: number
  pending: number
  in_progress: number
  success: number
  failed: number
  retrying: number
  by_system: Record<string, { total: number; success: number; failed: number }>
}

export class SyncTracker {
  private container: MedusaContainer
  private entries: Map<string, ISyncEntry> = new Map()

  constructor(container: MedusaContainer) {
    this.container = container
  }

  createSyncEntry(params: {
    system: SyncSystem
    entity_type: string
    entity_id: string
    direction: SyncDirection
    payload_hash?: string
    correlation_id?: string
    tenant_id?: string
    node_id?: string
    max_retries?: number
  }): ISyncEntry {
    const now = new Date()
    const entry: ISyncEntry = {
      id: crypto.randomUUID(),
      system: params.system,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      direction: params.direction,
      status: "pending",
      error_message: null,
      retry_count: 0,
      max_retries: params.max_retries ?? 3,
      payload_hash: params.payload_hash ?? null,
      correlation_id: params.correlation_id ?? crypto.randomUUID(),
      tenant_id: params.tenant_id ?? null,
      node_id: params.node_id ?? null,
      created_at: now,
      updated_at: now,
      completed_at: null,
    }

    this.entries.set(entry.id, entry)
    logger.info(`[IntegrationOrchestrator] Sync entry created: ${entry.id} | ${entry.system} | ${entry.entity_type}:${entry.entity_id} | ${entry.direction}`)
    return entry
  }

  updateSyncStatus(id: string, status: SyncStatus, errorMessage?: string): ISyncEntry | null {
    const entry = this.entries.get(id)
    if (!entry) {
      logger.info(`[IntegrationOrchestrator] Sync entry not found: ${id}`)
      return null
    }

    entry.status = status
    entry.updated_at = new Date()
    if (errorMessage !== undefined) {
      entry.error_message = errorMessage
    }
    if (status === "retrying") {
      entry.retry_count += 1
    }

    this.entries.set(id, entry)
    return entry
  }

  markSuccess(id: string): ISyncEntry | null {
    const entry = this.entries.get(id)
    if (!entry) return null

    entry.status = "success"
    entry.updated_at = new Date()
    entry.completed_at = new Date()
    entry.error_message = null

    this.entries.set(id, entry)
    logger.info(`[IntegrationOrchestrator] Sync success: ${entry.id} | ${entry.system} | ${entry.entity_type}:${entry.entity_id}`)
    return entry
  }

  markFailed(id: string, errorMessage: string): ISyncEntry | null {
    const entry = this.entries.get(id)
    if (!entry) return null

    entry.status = "failed"
    entry.error_message = errorMessage
    entry.updated_at = new Date()
    entry.completed_at = new Date()

    this.entries.set(id, entry)
    logger.info(`[IntegrationOrchestrator] Sync failed: ${entry.id} | ${entry.system} | ${entry.entity_type}:${entry.entity_id} | ${errorMessage}`)
    return entry
  }

  getRecentSyncs(limit: number = 50): ISyncEntry[] {
    const all = Array.from(this.entries.values())
    all.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime())
    return all.slice(0, limit)
  }

  getPendingSyncs(): ISyncEntry[] {
    return Array.from(this.entries.values()).filter(
      (e) => e.status === "pending" || e.status === "in_progress"
    )
  }

  getFailedSyncs(): ISyncEntry[] {
    return Array.from(this.entries.values()).filter(
      (e) => e.status === "failed" && e.retry_count < e.max_retries
    )
  }

  getSyncStats(): SyncStats {
    const all = Array.from(this.entries.values())
    const bySystem: Record<string, { total: number; success: number; failed: number }> = {}

    for (const entry of all) {
      if (!bySystem[entry.system]) {
        bySystem[entry.system] = { total: 0, success: 0, failed: 0 }
      }
      bySystem[entry.system].total++
      if (entry.status === "success") bySystem[entry.system].success++
      if (entry.status === "failed") bySystem[entry.system].failed++
    }

    return {
      total: all.length,
      pending: all.filter((e) => e.status === "pending").length,
      in_progress: all.filter((e) => e.status === "in_progress").length,
      success: all.filter((e) => e.status === "success").length,
      failed: all.filter((e) => e.status === "failed").length,
      retrying: all.filter((e) => e.status === "retrying").length,
      by_system: bySystem,
    }
  }
}
