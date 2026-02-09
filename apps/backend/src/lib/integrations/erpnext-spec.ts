/**
 * =============================================================================
 * ERPNEXT INTEGRATION SPECIFICATION
 * =============================================================================
 *
 * Contract document for the ERPNext integration with Dakkah CityOS Commerce.
 *
 * ERPNext is the ERP system responsible for finance & accounting, inventory
 * management, warehousing, procurement, HR, and financial reporting across all
 * tenants on the platform.
 *
 * Medusa is the source of truth for commerce transactions (orders, products,
 * customers, pricing). ERPNext is the source of truth for financial records
 * (invoices, payment entries, GL, stock ledger). Both systems sync via webhooks
 * and direct API calls using the ERPNext REST/Frappe API.
 *
 * Each Medusa tenant maps to an ERPNext Company. Vendor-tenants additionally
 * sync as ERPNext Suppliers. Custom fields use the `custom_medusa_*` prefix for
 * all cross-reference IDs stored in ERPNext doctypes.
 *
 * Authentication: Token-based — `Authorization: token {API_KEY}:{API_SECRET}`
 *
 * @module ERPNextSpec
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

// Capabilities marked with @planned are contract definitions for future implementation.
// Currently implemented: Sales Invoice, Customer sync, Item sync, Payment Entry, AR Report.
// Currently handled webhooks: Sales Invoice, Payment Entry, Stock Entry, Customer.

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Scope tiers matching Medusa tenant.scope_tier */
export type ScopeTier = "nano" | "micro" | "small" | "medium" | "large" | "mega" | "global"

/** ERPNext document workflow states */
export type DocStatus = 0 | 1 | 2

/** ERPNext document submission status */
export type SubmissionStatus = "Draft" | "Submitted" | "Cancelled"

/** ERPNext customer types */
export type ERPNextCustomerType = "Individual" | "Company"

/** ERPNext stock entry purpose types */
export type StockEntryType =
  | "Material Receipt"
  | "Material Issue"
  | "Material Transfer"
  | "Manufacture"
  | "Repack"
  | "Send to Subcontractor"

/** ERPNext payment type */
export type PaymentType = "Receive" | "Pay" | "Internal Transfer"

/** ERPNext invoice status */
export type InvoiceStatus =
  | "Draft"
  | "Submitted"
  | "Paid"
  | "Partly Paid"
  | "Unpaid"
  | "Overdue"
  | "Cancelled"
  | "Credit Note Issued"
  | "Return"

/** ERPNext payment entry status */
export type PaymentEntryStatus = "Draft" | "Submitted" | "Cancelled"

/** ERPNext purchase order status */
export type PurchaseOrderStatus =
  | "Draft"
  | "To Receive and Bill"
  | "To Bill"
  | "To Receive"
  | "Completed"
  | "Cancelled"
  | "Closed"

/** Medusa purchase order status (from purchase-order.ts model) */
export type MedusaPurchaseOrderStatus =
  | "draft"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "submitted"
  | "acknowledged"
  | "processing"
  | "partially_fulfilled"
  | "fulfilled"
  | "cancelled"
  | "closed"

/** ERPNext warehouse type */
export type WarehouseType = "Store" | "Transit" | "Rejected" | "Scrap"

/** ERPNext tax charge type */
export type TaxChargeType =
  | "On Net Total"
  | "On Previous Row Amount"
  | "On Previous Row Total"
  | "On Item Quantity"
  | "Actual"

/** Currency code (ISO 4217) */
export type CurrencyCode = string

/** ERPNext territory hierarchy level */
export type TerritoryLevel = "All Territories" | "Region" | "Country" | "City" | "Zone"

// ---------------------------------------------------------------------------
// ERPNext Document Interfaces
// ---------------------------------------------------------------------------

/** ERPNext Sales Invoice */
export interface ERPNextSalesInvoice {
  name: string
  customer: string
  customer_name: string
  customer_email?: string
  company: string
  posting_date: string
  due_date: string
  currency: CurrencyCode
  conversion_rate: number
  items: ERPNextInvoiceItem[]
  taxes: ERPNextTaxEntry[]
  total: number
  net_total: number
  grand_total: number
  outstanding_amount: number
  status: InvoiceStatus
  docstatus: DocStatus
  custom_medusa_order_id?: string
  custom_medusa_tenant_id?: string
  custom_medusa_invoice_id?: string
  is_return: boolean
  return_against?: string
  remarks?: string
  created_at: string
  updated_at: string
}

/** ERPNext Sales Invoice line item */
export interface ERPNextInvoiceItem {
  item_code: string
  item_name: string
  description?: string
  qty: number
  rate: number
  amount: number
  uom: string
  warehouse?: string
  batch_no?: string
  serial_no?: string
  custom_medusa_line_item_id?: string
  custom_medusa_variant_id?: string
}

/** ERPNext tax/charge row */
export interface ERPNextTaxEntry {
  charge_type: TaxChargeType
  account_head: string
  description: string
  rate: number
  tax_amount: number
  total: number
}

/** ERPNext Payment Entry */
export interface ERPNextPaymentEntry {
  name: string
  payment_type: PaymentType
  party_type: "Customer" | "Supplier"
  party: string
  party_name: string
  company: string
  posting_date: string
  paid_amount: number
  received_amount: number
  paid_from: string
  paid_to: string
  reference_no?: string
  reference_date?: string
  mode_of_payment: string
  status: PaymentEntryStatus
  docstatus: DocStatus
  custom_medusa_order_id?: string
  custom_medusa_payment_id?: string
  custom_medusa_tenant_id?: string
  remarks?: string
}

/** ERPNext Credit Note (Sales Invoice with is_return=true) */
export interface ERPNextCreditNote extends ERPNextSalesInvoice {
  is_return: true
  return_against: string
  custom_medusa_refund_id?: string
}

/** ERPNext GL Journal Entry */
export interface ERPNextJournalEntry {
  name: string
  company: string
  posting_date: string
  voucher_type: string
  accounts: Array<{
    account: string
    debit_in_account_currency: number
    credit_in_account_currency: number
    party_type?: string
    party?: string
    cost_center?: string
  }>
  total_debit: number
  total_credit: number
  remark?: string
  custom_medusa_reference_type?: string
  custom_medusa_reference_id?: string
}

/** ERPNext Stock Entry */
export interface ERPNextStockEntry {
  name: string
  company: string
  stock_entry_type: StockEntryType
  posting_date: string
  posting_time: string
  items: ERPNextStockEntryItem[]
  total_incoming_value: number
  total_outgoing_value: number
  docstatus: DocStatus
  custom_medusa_tenant_id?: string
  custom_medusa_reference_type?: string
  custom_medusa_reference_id?: string
}

/** ERPNext Stock Entry item */
export interface ERPNextStockEntryItem {
  item_code: string
  item_name: string
  qty: number
  uom: string
  basic_rate: number
  basic_amount: number
  s_warehouse?: string
  t_warehouse?: string
  batch_no?: string
  serial_no?: string
  custom_medusa_variant_id?: string
}

/** ERPNext Warehouse */
export interface ERPNextWarehouse {
  name: string
  warehouse_name: string
  company: string
  warehouse_type: WarehouseType
  is_group: boolean
  parent_warehouse?: string
  address?: string
  city?: string
  state?: string
  country?: string
  custom_medusa_tenant_id?: string
  custom_medusa_poi_id?: string
  custom_medusa_stock_location_id?: string
}

/** ERPNext Item (Product) */
export interface ERPNextItem {
  name: string
  item_code: string
  item_name: string
  item_group: string
  stock_uom: string
  standard_rate: number
  description?: string
  is_stock_item: boolean
  is_sales_item: boolean
  is_purchase_item: boolean
  has_batch_no: boolean
  has_serial_no: boolean
  has_variants: boolean
  variant_of?: string
  item_defaults: Array<{
    company: string
    default_warehouse?: string
    default_price_list?: string
    expense_account?: string
    income_account?: string
  }>
  custom_medusa_product_id?: string
  custom_medusa_variant_id?: string
  custom_medusa_tenant_id?: string
}

/** ERPNext Customer */
export interface ERPNextCustomer {
  name: string
  customer_name: string
  customer_type: ERPNextCustomerType
  customer_group: string
  territory: string
  email_id?: string
  mobile_no?: string
  default_currency?: CurrencyCode
  default_price_list?: string
  credit_limit: number
  outstanding_amount: number
  custom_medusa_customer_id?: string
  custom_medusa_tenant_id?: string
  custom_medusa_company_id?: string
}

/** ERPNext Supplier (for vendor-tenants) */
export interface ERPNextSupplier {
  name: string
  supplier_name: string
  supplier_group: string
  supplier_type: "Company" | "Individual"
  country: string
  default_currency?: CurrencyCode
  tax_id?: string
  custom_medusa_vendor_id?: string
  custom_medusa_tenant_id?: string
  custom_medusa_vendor_tenant_id?: string
}

/** ERPNext Purchase Order */
export interface ERPNextPurchaseOrder {
  name: string
  company: string
  supplier: string
  supplier_name: string
  transaction_date: string
  schedule_date: string
  currency: CurrencyCode
  items: Array<{
    item_code: string
    item_name: string
    qty: number
    rate: number
    amount: number
    warehouse: string
    schedule_date: string
    custom_medusa_variant_id?: string
  }>
  total: number
  grand_total: number
  status: PurchaseOrderStatus
  docstatus: DocStatus
  custom_medusa_po_id?: string
  custom_medusa_tenant_id?: string
}

/** ERPNext Material Request */
export interface ERPNextMaterialRequest {
  name: string
  company: string
  material_request_type: "Purchase" | "Material Transfer" | "Material Issue" | "Manufacture" | "Customer Provided"
  transaction_date: string
  schedule_date: string
  items: Array<{
    item_code: string
    item_name: string
    qty: number
    warehouse: string
    uom: string
  }>
  status: "Draft" | "Submitted" | "Stopped" | "Cancelled" | "Partially Ordered" | "Ordered" | "Transferred" | "Issued"
  docstatus: DocStatus
  custom_medusa_tenant_id?: string
}

/** ERPNext Bill of Materials (BOM) */
export interface ERPNextBOM {
  name: string
  item: string
  item_name: string
  company: string
  quantity: number
  items: Array<{
    item_code: string
    item_name: string
    qty: number
    rate: number
    amount: number
    uom: string
  }>
  total_cost: number
  is_active: boolean
  is_default: boolean
  custom_medusa_product_id?: string
}

/** ERPNext Pricing Rule */
export interface ERPNextPricingRule {
  name: string
  title: string
  apply_on: "Item Code" | "Item Group" | "Brand" | "Transaction"
  price_or_product_discount: "Price" | "Product"
  selling: boolean
  buying: boolean
  items: Array<{ item_code?: string; item_group?: string }>
  min_qty?: number
  max_qty?: number
  min_amt?: number
  max_amt?: number
  rate_or_discount?: "Rate" | "Discount Percentage" | "Discount Amount"
  rate?: number
  discount_percentage?: number
  discount_amount?: number
  valid_from?: string
  valid_upto?: string
  company?: string
  customer?: string
  customer_group?: string
  territory?: string
  custom_medusa_tenant_id?: string
  custom_medusa_promotion_id?: string
}

/** ERPNext Stock Reconciliation */
export interface ERPNextStockReconciliation {
  name: string
  company: string
  posting_date: string
  posting_time: string
  purpose: "Stock Reconciliation" | "Opening Stock"
  items: Array<{
    item_code: string
    warehouse: string
    qty: number
    valuation_rate: number
    current_qty?: number
    current_valuation_rate?: number
    batch_no?: string
    serial_no?: string
  }>
  docstatus: DocStatus
  custom_medusa_tenant_id?: string
}

// ---------------------------------------------------------------------------
// Report Interfaces
// ---------------------------------------------------------------------------

/** Accounts Receivable report row */
export interface AccountsReceivableRow {
  customer: string
  customer_name: string
  posting_date: string
  due_date: string
  voucher_type: string
  voucher_no: string
  invoiced_amount: number
  paid_amount: number
  outstanding_amount: number
  age: number
  range1: number
  range2: number
  range3: number
  range4: number
  currency: CurrencyCode
}

/** Profit and Loss report row */
export interface ProfitAndLossRow {
  account: string
  account_name: string
  total: number
  currency: CurrencyCode
  indent: number
  parent_account?: string
}

/** Balance Sheet report row */
export interface BalanceSheetRow {
  account: string
  account_name: string
  opening_debit: number
  opening_credit: number
  debit: number
  credit: number
  closing_debit: number
  closing_credit: number
  currency: CurrencyCode
}

/** Stock Ledger report row */
export interface StockLedgerRow {
  item_code: string
  item_name: string
  warehouse: string
  posting_date: string
  posting_time: string
  voucher_type: string
  voucher_no: string
  actual_qty: number
  qty_after_transaction: number
  incoming_rate: number
  valuation_rate: number
  stock_value: number
  batch_no?: string
  serial_no?: string
}

// ---------------------------------------------------------------------------
// Filter Types
// ---------------------------------------------------------------------------

/** Filters for report queries */
export interface ReportFilters {
  company: string
  from_date?: string
  to_date?: string
  cost_center?: string
  project?: string
  finance_book?: string
  custom_medusa_tenant_id?: string
}

/** Filters for stock reports */
export interface StockReportFilters {
  company: string
  warehouse?: string
  item_code?: string
  item_group?: string
  batch_no?: string
  from_date?: string
  to_date?: string
  custom_medusa_tenant_id?: string
}

// ---------------------------------------------------------------------------
// 1. ERPNEXT_CAPABILITIES
// ---------------------------------------------------------------------------

/**
 * Defines all required ERPNext API capabilities that the integration must support.
 * Each capability group documents the methods, parameters, and return types.
 *
 * All methods use the ERPNext REST API (Frappe framework):
 *   - CRUD: `/api/resource/{DocType}/{name}`
 *   - Reports: `/api/method/frappe.desk.query_report.run`
 *   - RPC: `/api/method/{dotted.path}`
 *
 * Authentication: `Authorization: token {API_KEY}:{API_SECRET}`
 */
export const ERPNEXT_CAPABILITIES = {

  /**
   * =========================================================================
   * FINANCE & ACCOUNTING
   * =========================================================================
   * Sales Invoices, Payment Entries, Credit Notes, Journal Entries,
   * multi-currency support, and tax management. Core financial record-keeping
   * for all commerce transactions originating in Medusa.
   *
   * Source of truth: ERPNext (for financial/accounting records)
   * Sync key: custom_medusa_order_id, custom_medusa_invoice_id
   */
  financeAndAccounting: {
    description: "Sales Invoices, Payment Entries, Credit Notes, GL Journal Entries, multi-currency, and tax management",

    createSalesInvoice: {
      description: "Create a Sales Invoice in ERPNext from a Medusa order. Maps order line items to invoice items, applies taxes, and sets payment terms.",
      parameters: {
        customer: "string — ERPNext Customer name (linked via custom_medusa_customer_id)",
        customer_email: "string — Customer email address",
        company: "string — ERPNext Company (mapped from Medusa tenant)",
        posting_date: "string — Invoice date (YYYY-MM-DD)",
        due_date: "string — Payment due date (YYYY-MM-DD)",
        currency: "CurrencyCode — ISO 4217 currency code",
        conversion_rate: "number — Exchange rate to company currency (1.0 if same)",
        items: "ERPNextInvoiceItem[] — Line items from Medusa order",
        taxes: "ERPNextTaxEntry[] — Tax charges from Medusa tax lines",
        custom_medusa_order_id: "string — Medusa order ID for cross-reference",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
        custom_medusa_invoice_id: "string | undefined — Medusa invoice ID if exists",
        payment_terms_template: "string | undefined — ERPNext payment terms template name",
        remarks: "string | undefined — Additional notes",
      },
      returns: "{ name: string, status: InvoiceStatus } — ERPNext Sales Invoice name and status",
      errors: ["CUSTOMER_NOT_FOUND", "ITEM_NOT_FOUND", "INVALID_COMPANY", "DUPLICATE_INVOICE", "RATE_LIMIT_EXCEEDED"],
    },

    /** @planned - Not yet implemented */
    submitSalesInvoice: {
      description: "Submit (finalize) a draft Sales Invoice in ERPNext, making it an accounting entry.",
      parameters: {
        invoice_name: "string — ERPNext Sales Invoice name",
      },
      returns: "{ name: string, status: 'Submitted' }",
      errors: ["INVOICE_NOT_FOUND", "ALREADY_SUBMITTED", "VALIDATION_ERROR"],
    },

    /** @planned - Not yet implemented */
    cancelSalesInvoice: {
      description: "Cancel a submitted Sales Invoice. Creates a reversal GL entry.",
      parameters: {
        invoice_name: "string — ERPNext Sales Invoice name",
        reason: "string — Cancellation reason",
      },
      returns: "{ name: string, status: 'Cancelled' }",
      errors: ["INVOICE_NOT_FOUND", "ALREADY_CANCELLED", "HAS_PAYMENT_ENTRIES", "INVOICE_NOT_SUBMITTED"],
    },

    /** @planned - Not yet implemented */
    createCreditNote: {
      description: "Create a Credit Note (return invoice) against a submitted Sales Invoice. Used for refunds.",
      parameters: {
        return_against: "string — Original Sales Invoice name",
        items: "ERPNextInvoiceItem[] — Items being returned/refunded (quantities as negative)",
        custom_medusa_refund_id: "string — Medusa refund ID",
        posting_date: "string — Credit note date (YYYY-MM-DD)",
        reason: "string — Reason for credit note / refund",
      },
      returns: "{ name: string, status: InvoiceStatus } — ERPNext Credit Note name",
      errors: ["ORIGINAL_INVOICE_NOT_FOUND", "INVOICE_NOT_SUBMITTED", "EXCEEDS_ORIGINAL_AMOUNT", "DUPLICATE_CREDIT_NOTE"],
    },

    createPaymentEntry: {
      description: "Record a payment in ERPNext. Links payment to Sales Invoice for reconciliation.",
      parameters: {
        payment_type: "PaymentType — 'Receive' for customer payments, 'Pay' for supplier payments",
        party_type: "'Customer' | 'Supplier' — Party type",
        party: "string — ERPNext Customer/Supplier name",
        company: "string — ERPNext Company",
        paid_amount: "number — Amount paid in payment currency",
        received_amount: "number — Amount received in company currency",
        paid_from: "string — Source account (e.g., customer's payment gateway account)",
        paid_to: "string — Destination account (e.g., company bank account)",
        reference_no: "string | undefined — External payment reference (e.g., Stripe charge ID)",
        reference_date: "string | undefined — Payment reference date",
        mode_of_payment: "string — Payment mode: Cash, Bank Transfer, Credit Card, Stripe, etc.",
        references: "Array<{ reference_doctype: 'Sales Invoice', reference_name: string, allocated_amount: number }> | undefined — Link to specific invoices",
        custom_medusa_order_id: "string | undefined — Medusa order ID",
        custom_medusa_payment_id: "string | undefined — Medusa payment ID",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ name: string, status: PaymentEntryStatus }",
      errors: ["PARTY_NOT_FOUND", "INVALID_ACCOUNT", "AMOUNT_MISMATCH", "DUPLICATE_PAYMENT", "RATE_LIMIT_EXCEEDED"],
    },

    /** @planned - Not yet implemented */
    createJournalEntry: {
      description: "Create a GL Journal Entry for manual adjustments, inter-company transfers, or commission accruals.",
      parameters: {
        company: "string — ERPNext Company",
        posting_date: "string — Journal entry date (YYYY-MM-DD)",
        accounts: "Array<{ account: string, debit_in_account_currency: number, credit_in_account_currency: number, party_type?: string, party?: string, cost_center?: string }>",
        voucher_type: "string — Journal Entry, Inter Company Journal Entry, etc.",
        remark: "string | undefined — Description of the journal entry",
        custom_medusa_reference_type: "string | undefined — e.g., 'commission', 'payout', 'adjustment'",
        custom_medusa_reference_id: "string | undefined — Medusa reference ID",
      },
      returns: "{ name: string }",
      errors: ["UNBALANCED_ENTRY", "INVALID_ACCOUNT", "INVALID_COMPANY"],
    },

    /** @planned - Not yet implemented */
    getOutstandingAmount: {
      description: "Get the outstanding (unpaid) amount for a specific Sales Invoice.",
      parameters: {
        invoice_name: "string — ERPNext Sales Invoice name",
      },
      returns: "{ outstanding_amount: number, currency: CurrencyCode }",
      errors: ["INVOICE_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * INVENTORY & WAREHOUSING
   * =========================================================================
   * Stock Entries for material movements, warehouse management, batch tracking,
   * stock reconciliation, and reorder level management. Keeps ERPNext stock
   * ledger in sync with Medusa inventory levels.
   *
   * Source of truth: ERPNext (for stock ledger/valuation), Medusa (for sellable inventory)
   * Sync key: custom_medusa_variant_id, custom_medusa_stock_location_id
   */
  inventoryAndWarehousing: {
    description: "Stock Entries, Warehouse management, Batch tracking, Stock Reconciliation, reorder levels",

    createStockEntry: {
      description: "Create a Stock Entry for material receipt, issue, transfer, or manufacture.",
      parameters: {
        company: "string — ERPNext Company",
        stock_entry_type: "StockEntryType — Purpose of the stock entry",
        items: "Array<{ item_code: string, qty: number, basic_rate?: number, s_warehouse?: string, t_warehouse?: string, batch_no?: string, serial_no?: string }> — Items to move",
        posting_date: "string — Date of stock movement (YYYY-MM-DD)",
        posting_time: "string — Time of stock movement (HH:mm:ss)",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
        custom_medusa_reference_type: "string | undefined — e.g., 'order_fulfillment', 'return', 'adjustment'",
        custom_medusa_reference_id: "string | undefined — Medusa reference ID",
      },
      returns: "{ name: string, docstatus: DocStatus }",
      errors: ["ITEM_NOT_FOUND", "WAREHOUSE_NOT_FOUND", "INSUFFICIENT_STOCK", "INVALID_BATCH", "RATE_LIMIT_EXCEEDED"],
    },

    /** @planned - Not yet implemented */
    createWarehouse: {
      description: "Create a warehouse in ERPNext. Maps to a Medusa stock location or TenantPOI.",
      parameters: {
        warehouse_name: "string — Display name of the warehouse",
        company: "string — ERPNext Company",
        warehouse_type: "WarehouseType — Store, Transit, Rejected, or Scrap",
        parent_warehouse: "string | undefined — Parent warehouse for hierarchy",
        address: "string | undefined — Physical address",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
        custom_medusa_poi_id: "string | undefined — Medusa TenantPOI ID",
        custom_medusa_stock_location_id: "string | undefined — Medusa stock location ID",
      },
      returns: "{ name: string }",
      errors: ["DUPLICATE_WAREHOUSE", "INVALID_COMPANY", "PARENT_NOT_FOUND"],
    },

    /** @planned - Not yet implemented */
    getStockBalance: {
      description: "Get current stock balance for an item across all or specific warehouses.",
      parameters: {
        item_code: "string — ERPNext item code",
        warehouse: "string | undefined — Specific warehouse (omit for all)",
        batch_no: "string | undefined — Specific batch number",
      },
      returns: "{ balances: Array<{ warehouse: string, actual_qty: number, reserved_qty: number, projected_qty: number, valuation_rate: number, stock_value: number }> }",
      errors: ["ITEM_NOT_FOUND"],
    },

    /** @planned - Not yet implemented */
    createStockReconciliation: {
      description: "Create a Stock Reconciliation to correct inventory discrepancies between Medusa and ERPNext.",
      parameters: {
        company: "string — ERPNext Company",
        posting_date: "string — Reconciliation date (YYYY-MM-DD)",
        items: "Array<{ item_code: string, warehouse: string, qty: number, valuation_rate: number, batch_no?: string }> — Corrected stock levels",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ name: string, docstatus: DocStatus }",
      errors: ["ITEM_NOT_FOUND", "WAREHOUSE_NOT_FOUND", "NEGATIVE_STOCK_NOT_ALLOWED"],
    },

    /** @planned - Not yet implemented */
    getReorderLevels: {
      description: "Get items that have fallen below their reorder level for a company/warehouse.",
      parameters: {
        company: "string — ERPNext Company",
        warehouse: "string | undefined — Specific warehouse",
      },
      returns: "{ items: Array<{ item_code: string, item_name: string, warehouse: string, actual_qty: number, reorder_level: number, reorder_qty: number }> }",
      errors: ["INVALID_COMPANY"],
    },

    /** @planned - Not yet implemented */
    syncBatchInfo: {
      description: "Create or update batch information for an item. Used for expiry tracking and lot management.",
      parameters: {
        item: "string — ERPNext item code",
        batch_id: "string — Batch identifier",
        expiry_date: "string | undefined — Expiry date (YYYY-MM-DD)",
        manufacturing_date: "string | undefined — Manufacturing date (YYYY-MM-DD)",
        custom_medusa_batch_id: "string | undefined — Medusa batch reference",
      },
      returns: "{ name: string }",
      errors: ["ITEM_NOT_FOUND", "DUPLICATE_BATCH"],
    },
  },

  /**
   * =========================================================================
   * PROCUREMENT
   * =========================================================================
   * Purchase Orders (bi-directional sync with Medusa PurchaseOrder model),
   * Supplier management, and Material Requests. Vendors in Medusa map to
   * Suppliers in ERPNext for procurement workflows.
   *
   * Sync keys: custom_medusa_po_id, custom_medusa_vendor_id
   */
  /** @planned - Not yet implemented */
  procurement: {
    description: "Purchase Orders (bi-directional sync), Supplier management, Material Requests",

    createPurchaseOrder: {
      description: "Create a Purchase Order in ERPNext from an approved Medusa PurchaseOrder. Bi-directional: POs created in ERPNext also sync back to Medusa.",
      parameters: {
        company: "string — ERPNext Company (buyer tenant)",
        supplier: "string — ERPNext Supplier name (vendor-tenant)",
        transaction_date: "string — PO date (YYYY-MM-DD)",
        schedule_date: "string — Expected delivery date (YYYY-MM-DD)",
        currency: "CurrencyCode — PO currency",
        items: "Array<{ item_code: string, qty: number, rate: number, warehouse: string, schedule_date: string, custom_medusa_variant_id?: string }>",
        custom_medusa_po_id: "string — Medusa PurchaseOrder ID",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ name: string, status: PurchaseOrderStatus }",
      errors: ["SUPPLIER_NOT_FOUND", "ITEM_NOT_FOUND", "INVALID_COMPANY", "DUPLICATE_PO"],
    },

    updatePurchaseOrderStatus: {
      description: "Update the status of an ERPNext Purchase Order when Medusa PO status changes (approved, rejected, etc.).",
      parameters: {
        po_name: "string — ERPNext Purchase Order name",
        action: "'submit' | 'cancel' | 'close' — Action to perform",
        reason: "string | undefined — Reason for status change",
      },
      returns: "{ name: string, status: PurchaseOrderStatus }",
      errors: ["PO_NOT_FOUND", "INVALID_STATUS_TRANSITION"],
    },

    createSupplier: {
      description: "Create an ERPNext Supplier from a Medusa vendor-tenant. Called when a vendor registers and is approved.",
      parameters: {
        supplier_name: "string — Vendor business name",
        supplier_group: "string — Supplier group (e.g., 'Local', 'International', by vertical)",
        supplier_type: "'Company' | 'Individual' — Supplier entity type",
        country: "string — Country of origin",
        default_currency: "CurrencyCode | undefined — Default transaction currency",
        tax_id: "string | undefined — Tax identification number",
        custom_medusa_vendor_id: "string — Medusa vendor ID",
        custom_medusa_tenant_id: "string — Medusa tenant ID of the vendor",
        custom_medusa_vendor_tenant_id: "string | undefined — If vendor is a separate tenant",
      },
      returns: "{ name: string }",
      errors: ["DUPLICATE_SUPPLIER", "INVALID_GROUP"],
    },

    updateSupplier: {
      description: "Update an existing ERPNext Supplier when vendor profile changes in Medusa.",
      parameters: {
        supplier_name: "string — ERPNext Supplier name",
        data: "Partial<{ supplier_name: string, country: string, default_currency: CurrencyCode, tax_id: string }>",
      },
      returns: "{ name: string }",
      errors: ["SUPPLIER_NOT_FOUND"],
    },

    createMaterialRequest: {
      description: "Create a Material Request in ERPNext. Triggered by low stock alerts or manual requests from Medusa.",
      parameters: {
        company: "string — ERPNext Company",
        material_request_type: "'Purchase' | 'Material Transfer' | 'Material Issue' | 'Manufacture'",
        items: "Array<{ item_code: string, qty: number, warehouse: string, uom: string }>",
        schedule_date: "string — Required by date (YYYY-MM-DD)",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ name: string }",
      errors: ["ITEM_NOT_FOUND", "WAREHOUSE_NOT_FOUND", "INVALID_COMPANY"],
    },
  },

  /**
   * =========================================================================
   * CUSTOMER MANAGEMENT
   * =========================================================================
   * Customer sync between Medusa and ERPNext. Supports Individual and Company
   * customer types, territory mapping, credit limits, and outstanding balances.
   *
   * Sync key: custom_medusa_customer_id
   */
  customerManagement: {
    description: "Customer sync (Individual/Company), Territory mapping, Credit limits, Outstanding balances",

    syncCustomer: {
      description: "Create or update a Customer in ERPNext from Medusa customer data. Handles both Individual and Company (B2B) customers.",
      parameters: {
        customer_name: "string — Full name or company name",
        customer_type: "ERPNextCustomerType — 'Individual' or 'Company'",
        customer_group: "string — ERPNext customer group (e.g., 'Retail', 'Wholesale', 'B2B')",
        territory: "string — ERPNext territory (mapped from Medusa region/country)",
        email_id: "string — Primary email address",
        mobile_no: "string | undefined — Phone number",
        default_currency: "CurrencyCode | undefined — Preferred currency",
        default_price_list: "string | undefined — Assigned price list",
        credit_limit: "number | undefined — Credit limit in company currency",
        custom_medusa_customer_id: "string — Medusa customer ID",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
        custom_medusa_company_id: "string | undefined — Medusa B2B company ID (if Company type)",
      },
      returns: "{ name: string, is_new: boolean }",
      errors: ["DUPLICATE_EMAIL", "INVALID_TERRITORY", "INVALID_CUSTOMER_GROUP"],
    },

    /** @planned - Not yet implemented */
    getCustomerBalance: {
      description: "Get the outstanding balance and credit status for a customer.",
      parameters: {
        customer_name: "string — ERPNext Customer name",
        company: "string — ERPNext Company",
      },
      returns: "{ outstanding_amount: number, credit_limit: number, credit_available: number, currency: CurrencyCode, overdue_amount: number }",
      errors: ["CUSTOMER_NOT_FOUND"],
    },

    /** @planned - Not yet implemented */
    updateCreditLimit: {
      description: "Update the credit limit for a B2B customer. Enforced at invoice creation time.",
      parameters: {
        customer_name: "string — ERPNext Customer name",
        company: "string — ERPNext Company",
        credit_limit: "number — New credit limit in company currency",
      },
      returns: "{ name: string, credit_limit: number }",
      errors: ["CUSTOMER_NOT_FOUND", "EXCEEDS_OUTSTANDING"],
    },

    /** @planned - Not yet implemented */
    mapTerritory: {
      description: "Create or update an ERPNext Territory node. Maps Medusa regions/nodes to ERPNext territory hierarchy.",
      parameters: {
        territory_name: "string — Territory display name",
        parent_territory: "string — Parent territory (default: 'All Territories')",
        territory_manager: "string | undefined — Assigned territory manager",
      },
      returns: "{ name: string }",
      errors: ["DUPLICATE_TERRITORY", "PARENT_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * PRODUCT CATALOG
   * =========================================================================
   * Item sync between Medusa products/variants and ERPNext Items. Includes
   * Item Groups, UOM management, Pricing Rules, and BOM for bundled products.
   *
   * Sync key: custom_medusa_product_id, custom_medusa_variant_id
   */
  productCatalog: {
    description: "Item sync, Item Groups, UOM, Pricing Rules, BOM (bundled products)",

    syncItem: {
      description: "Create or update an ERPNext Item from a Medusa product variant. Each Medusa variant maps to one ERPNext Item.",
      parameters: {
        item_code: "string — Unique item code (typically Medusa variant SKU)",
        item_name: "string — Display name",
        item_group: "string — ERPNext Item Group (mapped from Medusa product category)",
        stock_uom: "string — Unit of measurement (e.g., 'Nos', 'Kg', 'Ltr')",
        standard_rate: "number — Standard selling rate",
        description: "string | undefined — Item description",
        is_stock_item: "boolean — Whether to track stock (default: true)",
        has_batch_no: "boolean — Whether item uses batch tracking",
        has_serial_no: "boolean — Whether item uses serial numbers",
        item_defaults: "Array<{ company: string, default_warehouse?: string, income_account?: string, expense_account?: string }> | undefined",
        custom_medusa_product_id: "string — Medusa product ID",
        custom_medusa_variant_id: "string — Medusa variant ID",
        custom_medusa_tenant_id: "string — Medusa tenant ID",
      },
      returns: "{ name: string, is_new: boolean }",
      errors: ["DUPLICATE_ITEM_CODE", "INVALID_ITEM_GROUP", "INVALID_UOM", "RATE_LIMIT_EXCEEDED"],
    },

    /** @planned - Not yet implemented */
    syncItemGroup: {
      description: "Create or update an ERPNext Item Group from a Medusa product category.",
      parameters: {
        item_group_name: "string — Group display name",
        parent_item_group: "string — Parent group (default: 'All Item Groups')",
        is_group: "boolean — Whether this is a parent group node",
      },
      returns: "{ name: string }",
      errors: ["DUPLICATE_GROUP", "PARENT_NOT_FOUND"],
    },

    /** @planned - Not yet implemented */
    createPricingRule: {
      description: "Create a Pricing Rule in ERPNext from a Medusa promotion or volume pricing tier.",
      parameters: {
        title: "string — Rule name/description",
        apply_on: "'Item Code' | 'Item Group' | 'Brand' | 'Transaction'",
        items: "Array<{ item_code?: string, item_group?: string }> — Items this rule applies to",
        rate_or_discount: "'Rate' | 'Discount Percentage' | 'Discount Amount'",
        rate: "number | undefined — Fixed rate (if rate_or_discount is 'Rate')",
        discount_percentage: "number | undefined — Discount % (if applicable)",
        discount_amount: "number | undefined — Discount amount (if applicable)",
        min_qty: "number | undefined — Minimum quantity threshold",
        max_qty: "number | undefined — Maximum quantity threshold",
        valid_from: "string | undefined — Start date (YYYY-MM-DD)",
        valid_upto: "string | undefined — End date (YYYY-MM-DD)",
        company: "string | undefined — Limit to specific company",
        custom_medusa_tenant_id: "string | undefined — Medusa tenant ID",
        custom_medusa_promotion_id: "string | undefined — Medusa promotion ID",
      },
      returns: "{ name: string }",
      errors: ["INVALID_ITEM", "INVALID_ITEM_GROUP", "CONFLICTING_RULE"],
    },

    /** @planned - Not yet implemented */
    createBOM: {
      description: "Create a Bill of Materials for a bundled/kit product. Maps Medusa product bundles to ERPNext BOMs.",
      parameters: {
        item: "string — Parent item code (the bundle)",
        company: "string — ERPNext Company",
        quantity: "number — Base quantity of the parent item",
        items: "Array<{ item_code: string, qty: number, rate: number, uom: string }> — Component items",
        is_active: "boolean — Whether BOM is active (default: true)",
        is_default: "boolean — Whether this is the default BOM (default: true)",
        custom_medusa_product_id: "string — Medusa product ID for the bundle",
      },
      returns: "{ name: string }",
      errors: ["PARENT_ITEM_NOT_FOUND", "COMPONENT_ITEM_NOT_FOUND", "CIRCULAR_BOM"],
    },
  },

  /**
   * =========================================================================
   * REPORTING
   * =========================================================================
   * Financial and inventory reports from ERPNext. All reports are scoped by
   * ERPNext Company (mapped from Medusa tenant). Uses ERPNext's built-in
   * report framework via the query_report API.
   */
  reporting: {
    description: "Accounts Receivable, Profit & Loss, Balance Sheet, Stock Ledger, tenant-scoped reports",

    getAccountsReceivable: {
      description: "Get Accounts Receivable report. Shows outstanding customer invoices with aging analysis.",
      parameters: {
        filters: "ReportFilters — company (required), from_date, to_date, customer filter",
        customer: "string | undefined — Filter to specific customer",
        ageing_based_on: "'Posting Date' | 'Due Date' — Basis for aging calculation",
      },
      returns: "{ rows: AccountsReceivableRow[], totals: { total_invoiced: number, total_paid: number, total_outstanding: number } }",
      errors: ["INVALID_COMPANY", "INVALID_DATE_RANGE"],
    },

    /** @planned - Not yet implemented */
    getProfitAndLoss: {
      description: "Get Profit and Loss statement for a company within a date range.",
      parameters: {
        filters: "ReportFilters — company (required), from_date (required), to_date (required)",
        periodicity: "'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly'",
      },
      returns: "{ rows: ProfitAndLossRow[], net_profit: number, currency: CurrencyCode }",
      errors: ["INVALID_COMPANY", "INVALID_DATE_RANGE"],
    },

    /** @planned - Not yet implemented */
    getBalanceSheet: {
      description: "Get Balance Sheet for a company as of a specific date.",
      parameters: {
        filters: "ReportFilters — company (required), to_date (required as 'as of' date)",
        periodicity: "'Monthly' | 'Quarterly' | 'Half-Yearly' | 'Yearly'",
      },
      returns: "{ rows: BalanceSheetRow[], total_asset: number, total_liability: number, total_equity: number, currency: CurrencyCode }",
      errors: ["INVALID_COMPANY", "INVALID_DATE"],
    },

    /** @planned - Not yet implemented */
    getStockLedger: {
      description: "Get Stock Ledger report showing all stock movements for items in a warehouse.",
      parameters: {
        filters: "StockReportFilters — company (required), warehouse, item_code, from_date, to_date",
      },
      returns: "{ rows: StockLedgerRow[] }",
      errors: ["INVALID_COMPANY", "ITEM_NOT_FOUND", "WAREHOUSE_NOT_FOUND"],
    },

    /** @planned - Not yet implemented */
    getStockBalance: {
      description: "Get current stock balance report across all warehouses for a company.",
      parameters: {
        filters: "StockReportFilters — company (required), warehouse (optional), item_group (optional)",
      },
      returns: "{ rows: Array<{ item_code: string, item_name: string, item_group: string, warehouse: string, actual_qty: number, reserved_qty: number, ordered_qty: number, projected_qty: number, valuation_rate: number, stock_value: number }> }",
      errors: ["INVALID_COMPANY"],
    },
  },
} as const

// ---------------------------------------------------------------------------
// 2. ERPNEXT_WEBHOOKS
// ---------------------------------------------------------------------------

/**
 * Webhooks that ERPNext sends TO Medusa when ERP events occur.
 * ERPNext must POST JSON payloads to these Medusa endpoints.
 *
 * Endpoint base: `{MEDUSA_BASE_URL}/admin/webhooks/erpnext`
 * Authentication: Shared webhook secret in `x-erpnext-secret` header (HMAC-SHA256)
 *
 * Payload format: { doctype: string, event: string, data: Record<string, any> }
 */
export const ERPNEXT_WEBHOOKS = {

  "sales_invoice.submitted": {
    event: "sales_invoice.submitted" as const,
    doctype: "Sales Invoice",
    erpnext_event: "on_submit",
    description: "A Sales Invoice has been submitted (finalized) in ERPNext. Update order metadata with invoice reference.",
    erpnext_payload: {
      doctype: "'Sales Invoice'",
      event: "'on_submit' | 'submitted'",
      data: {
        name: "string — ERPNext Sales Invoice name (e.g., 'SINV-00001')",
        customer: "string — ERPNext Customer name",
        grand_total: "number — Invoice grand total",
        outstanding_amount: "number — Remaining unpaid amount",
        currency: "CurrencyCode — Invoice currency",
        status: "InvoiceStatus — Current status",
        custom_medusa_order_id: "string | undefined — Linked Medusa order ID",
        custom_medusa_tenant_id: "string | undefined — Medusa tenant ID",
      },
    },
    medusa_action: "Update order.metadata with erpnext_invoice_name, erpnext_invoice_status='submitted', erpnext_invoice_synced_at. If Medusa invoice module is active, update invoice status.",
  },

  "sales_invoice.paid": {
    event: "sales_invoice.paid" as const,
    doctype: "Sales Invoice",
    erpnext_event: "on_update_after_submit",
    description: "A Sales Invoice has been fully paid. Update order payment status in Medusa.",
    erpnext_payload: {
      doctype: "'Sales Invoice'",
      event: "'on_update_after_submit'",
      data: {
        name: "string — ERPNext Sales Invoice name",
        status: "'Paid'",
        outstanding_amount: "0",
        custom_medusa_order_id: "string | undefined — Linked Medusa order ID",
        paid_amount: "number — Total paid amount",
      },
    },
    medusa_action: "Update order.metadata with erpnext_invoice_status='paid'. Trigger payment.reconciled event if applicable.",
  },

  "sales_invoice.cancelled": {
    event: "sales_invoice.cancelled" as const,
    doctype: "Sales Invoice",
    erpnext_event: "on_cancel",
    description: "A Sales Invoice has been cancelled in ERPNext. Update order metadata accordingly.",
    erpnext_payload: {
      doctype: "'Sales Invoice'",
      event: "'on_cancel' | 'cancelled'",
      data: {
        name: "string — ERPNext Sales Invoice name",
        custom_medusa_order_id: "string | undefined — Linked Medusa order ID",
        amended_from: "string | undefined — If cancelled and amended, the new invoice name",
      },
    },
    medusa_action: "Update order.metadata with erpnext_invoice_status='cancelled', erpnext_invoice_cancelled_at. Remove invoice link if appropriate.",
  },

  "payment_entry.created": {
    event: "payment_entry.created" as const,
    doctype: "Payment Entry",
    erpnext_event: "after_insert",
    description: "A new Payment Entry has been created (draft) in ERPNext.",
    erpnext_payload: {
      doctype: "'Payment Entry'",
      event: "'after_insert'",
      data: {
        name: "string — ERPNext Payment Entry name",
        payment_type: "PaymentType — Receive, Pay, or Internal Transfer",
        party: "string — Customer or Supplier name",
        paid_amount: "number — Payment amount",
        mode_of_payment: "string — Payment method",
        custom_medusa_order_id: "string | undefined — Linked Medusa order ID",
        custom_medusa_payment_id: "string | undefined — Linked Medusa payment ID",
      },
    },
    medusa_action: "Log payment entry creation. No status update until submitted.",
  },

  "payment_entry.submitted": {
    event: "payment_entry.submitted" as const,
    doctype: "Payment Entry",
    erpnext_event: "on_submit",
    description: "A Payment Entry has been submitted in ERPNext, creating GL entries.",
    erpnext_payload: {
      doctype: "'Payment Entry'",
      event: "'on_submit' | 'submitted'",
      data: {
        name: "string — ERPNext Payment Entry name",
        payment_type: "PaymentType",
        party: "string — Customer or Supplier name",
        paid_amount: "number — Payment amount",
        references: "Array<{ reference_doctype: string, reference_name: string, allocated_amount: number }> — Linked invoices",
        custom_medusa_order_id: "string | undefined",
        custom_medusa_payment_id: "string | undefined",
      },
    },
    medusa_action: "Update order payment metadata. If all linked invoices are paid, trigger payment.reconciled event.",
  },

  "stock_entry.posted": {
    event: "stock_entry.posted" as const,
    doctype: "Stock Entry",
    erpnext_event: "on_submit",
    description: "A Stock Entry has been posted (submitted) in ERPNext. Sync inventory changes to Medusa.",
    erpnext_payload: {
      doctype: "'Stock Entry'",
      event: "'on_submit' | 'posted'",
      data: {
        name: "string — ERPNext Stock Entry name",
        stock_entry_type: "StockEntryType — Material Receipt, Transfer, Issue, Manufacture",
        items: "Array<{ item_code: string, qty: number, s_warehouse?: string, t_warehouse?: string, batch_no?: string, serial_no?: string }>",
        custom_medusa_tenant_id: "string | undefined",
      },
    },
    medusa_action: "Update Medusa inventory levels for affected items/variants. Map ERPNext warehouses to Medusa stock locations. Emit inventory.updated events.",
  },

  "customer.modified": {
    event: "customer.modified" as const,
    doctype: "Customer",
    erpnext_event: "on_update",
    description: "A Customer record was modified in ERPNext. Sync changes back to Medusa.",
    erpnext_payload: {
      doctype: "'Customer'",
      event: "'on_update' | 'updated'",
      data: {
        name: "string — ERPNext Customer name",
        customer_name: "string — Updated customer name",
        customer_type: "ERPNextCustomerType",
        email_id: "string | undefined — Email address",
        mobile_no: "string | undefined — Phone number",
        territory: "string — Customer territory",
        credit_limit: "number — Credit limit",
        custom_medusa_customer_id: "string | undefined — Linked Medusa customer ID",
      },
    },
    medusa_action: "Update Medusa customer metadata with ERPNext-managed fields (credit_limit, territory). Do not overwrite Medusa-owned fields.",
  },

  /** @planned - Not yet implemented */
  "purchase_order.approved": {
    event: "purchase_order.approved" as const,
    doctype: "Purchase Order",
    erpnext_event: "on_submit",
    description: "A Purchase Order has been approved and submitted in ERPNext. Sync status to Medusa PO model.",
    erpnext_payload: {
      doctype: "'Purchase Order'",
      event: "'on_submit'",
      data: {
        name: "string — ERPNext PO name",
        supplier: "string — Supplier name",
        grand_total: "number — PO total",
        status: "PurchaseOrderStatus",
        custom_medusa_po_id: "string | undefined — Linked Medusa PurchaseOrder ID",
        custom_medusa_tenant_id: "string | undefined",
      },
    },
    medusa_action: "Update Medusa PurchaseOrder status to 'submitted' or 'acknowledged'. Store ERPNext PO name in PO metadata.",
  },

  /** @planned - Not yet implemented */
  "stock_reorder.triggered": {
    event: "stock_reorder.triggered" as const,
    doctype: "Stock Entry",
    erpnext_event: "reorder_triggered",
    description: "Stock for one or more items has fallen below the reorder level. Notify Medusa for action.",
    erpnext_payload: {
      doctype: "'Item'",
      event: "'reorder_triggered'",
      data: {
        items: "Array<{ item_code: string, item_name: string, warehouse: string, actual_qty: number, reorder_level: number, reorder_qty: number, custom_medusa_variant_id?: string }>",
        company: "string — ERPNext Company",
        custom_medusa_tenant_id: "string | undefined",
      },
    },
    medusa_action: "Emit inventory.low_stock events for each item. Optionally auto-create a Material Request or notify tenant admin.",
  },
} as const

// ---------------------------------------------------------------------------
// 3. MEDUSA_TO_ERPNEXT_EVENTS
// ---------------------------------------------------------------------------

/**
 * Events that Medusa sends TO ERPNext when commerce data changes.
 * Medusa calls ERPNext REST API directly via ERPNextService.
 *
 * Authentication: `Authorization: token {ERPNEXT_API_KEY}:{ERPNEXT_API_SECRET}`
 */
export const MEDUSA_TO_ERPNEXT_EVENTS = {

  "order.placed": {
    event: "order.placed" as const,
    description: "A new order has been placed in Medusa. Create a Sales Invoice in ERPNext.",
    medusa_payload: {
      order_id: "string — Medusa order ID",
      tenant_id: "string — Medusa tenant ID (maps to ERPNext Company)",
      customer_id: "string — Medusa customer ID",
      customer_name: "string — Customer display name",
      customer_email: "string — Customer email",
      currency_code: "CurrencyCode — Order currency",
      items: "Array<{ variant_id: string, sku: string, title: string, quantity: number, unit_price: number, total: number }>",
      tax_total: "number — Total tax amount",
      shipping_total: "number — Total shipping cost",
      discount_total: "number — Total discounts applied",
      subtotal: "number — Order subtotal before tax/shipping",
      total: "number — Order grand total",
      payment_status: "string — Current payment status",
    },
    erpnext_action: "Create a Sales Invoice (draft). Map tenant_id → Company, customer_id → Customer (create if not exists), variant SKUs → Item codes. Apply taxes. Set custom_medusa_order_id. Optionally auto-submit if payment is already captured.",
  },

  "payment.completed": {
    event: "payment.completed" as const,
    description: "Payment has been captured/completed for an order. Record a Payment Entry in ERPNext.",
    medusa_payload: {
      order_id: "string — Medusa order ID",
      payment_id: "string — Medusa payment ID",
      tenant_id: "string — Medusa tenant ID",
      amount: "number — Payment amount",
      currency_code: "CurrencyCode — Payment currency",
      provider_id: "string — Payment provider (stripe, cash, bank_transfer, etc.)",
      reference_id: "string | undefined — External payment reference (e.g., Stripe charge ID)",
    },
    erpnext_action: "Create a Payment Entry (type: Receive). Link to corresponding Sales Invoice. Map provider_id to ERPNext Mode of Payment. Set custom_medusa_payment_id and custom_medusa_order_id.",
  },

  "product.created": {
    event: "product.created" as const,
    description: "A new product and its variants were created in Medusa. Sync as ERPNext Items.",
    medusa_payload: {
      product_id: "string — Medusa product ID",
      tenant_id: "string — Medusa tenant ID",
      title: "string — Product title",
      description: "string | undefined — Product description",
      category: "string | undefined — Product category (maps to Item Group)",
      variants: "Array<{ variant_id: string, sku: string, title: string, price: number, inventory_quantity?: number }>",
    },
    erpnext_action: "Create Item Group if category doesn't exist. Create one ERPNext Item per variant. Set standard_rate from price. Set custom_medusa_product_id and custom_medusa_variant_id.",
  },

  "product.updated": {
    event: "product.updated" as const,
    description: "A product or its variants were updated in Medusa. Sync changes to ERPNext Items.",
    medusa_payload: {
      product_id: "string — Medusa product ID",
      tenant_id: "string — Medusa tenant ID",
      title: "string — Updated product title",
      description: "string | undefined — Updated description",
      category: "string | undefined — Updated category",
      variants: "Array<{ variant_id: string, sku: string, title: string, price: number, inventory_quantity?: number }>",
    },
    erpnext_action: "Update existing ERPNext Items matched by custom_medusa_variant_id. Update item_name, standard_rate, description. Handle new/removed variants.",
  },

  "customer.created": {
    event: "customer.created" as const,
    description: "A new customer registered in Medusa. Create an ERPNext Customer.",
    medusa_payload: {
      customer_id: "string — Medusa customer ID",
      tenant_id: "string — Medusa tenant ID",
      first_name: "string — First name",
      last_name: "string — Last name",
      email: "string — Email address",
      phone: "string | undefined — Phone number",
      company_name: "string | undefined — B2B company name (if applicable)",
      is_b2b: "boolean — Whether this is a B2B/company customer",
    },
    erpnext_action: "Create ERPNext Customer. Set customer_type to 'Company' if is_b2b, else 'Individual'. Map tenant territory. Set custom_medusa_customer_id.",
  },

  "customer.updated": {
    event: "customer.updated" as const,
    description: "Customer profile was updated in Medusa. Sync changes to ERPNext.",
    medusa_payload: {
      customer_id: "string — Medusa customer ID",
      tenant_id: "string — Medusa tenant ID",
      first_name: "string — Updated first name",
      last_name: "string — Updated last name",
      email: "string — Updated email",
      phone: "string | undefined — Updated phone",
      metadata: "Record<string, any> | undefined — Additional metadata",
    },
    erpnext_action: "Find ERPNext Customer by custom_medusa_customer_id. Update customer_name, email_id, mobile_no.",
  },

  "vendor.registered": {
    event: "vendor.registered" as const,
    description: "A new vendor has registered on the platform. Create an ERPNext Supplier.",
    medusa_payload: {
      vendor_id: "string — Medusa vendor ID",
      tenant_id: "string — Medusa tenant ID of the marketplace/platform",
      vendor_tenant_id: "string | undefined — If vendor has own tenant",
      business_name: "string — Vendor business name",
      contact_email: "string — Vendor contact email",
      country: "string — Country of operation",
      business_type: "string — Type of business (maps to Supplier Group)",
    },
    erpnext_action: "Create ERPNext Supplier. Set supplier_group based on business_type. Set custom_medusa_vendor_id and custom_medusa_tenant_id. If vendor has own tenant, set custom_medusa_vendor_tenant_id.",
  },

  "inventory.updated": {
    event: "inventory.updated" as const,
    description: "Inventory levels changed in Medusa. Reconcile stock in ERPNext.",
    medusa_payload: {
      tenant_id: "string — Medusa tenant ID",
      items: "Array<{ variant_id: string, sku: string, stock_location_id: string, quantity: number, previous_quantity: number }>",
    },
    erpnext_action: "Create a Stock Reconciliation if quantities diverge between Medusa and ERPNext. Map stock_location_id to ERPNext warehouse. Only reconcile if ERPNext is not the source of the change (avoid loops).",
  },

  "refund.requested": {
    event: "refund.requested" as const,
    description: "A refund has been requested or processed in Medusa. Create a Credit Note in ERPNext.",
    medusa_payload: {
      order_id: "string — Original Medusa order ID",
      refund_id: "string — Medusa refund ID",
      tenant_id: "string — Medusa tenant ID",
      amount: "number — Refund amount",
      currency_code: "CurrencyCode — Refund currency",
      reason: "string — Refund reason",
      items: "Array<{ variant_id: string, sku: string, quantity: number, unit_price: number }> | undefined — Specific items refunded (if partial)",
    },
    erpnext_action: "Find the original Sales Invoice by custom_medusa_order_id. Create a Credit Note (return invoice) against it. Set custom_medusa_refund_id. If full refund, return all items. If partial, return specified items.",
  },
} as const

// ---------------------------------------------------------------------------
// 4. ERPNEXT_MULTI_TENANT
// ---------------------------------------------------------------------------

/**
 * Multi-tenant mapping and considerations for ERPNext integration.
 * Each Medusa tenant maps to an ERPNext Company. Cross-tenant operations
 * use ERPNext's inter-company accounting features.
 */
export const ERPNEXT_MULTI_TENANT = {

  tenant_to_company_mapping: {
    description: "Each Medusa tenant maps to one ERPNext Company. The mapping is stored in tenant metadata or a configuration table.",
    mapping_fields: {
      medusa_tenant_id: "string — Medusa tenant ID",
      erpnext_company: "string — ERPNext Company name",
      erpnext_abbreviation: "string — Company abbreviation (used in account names)",
      default_currency: "CurrencyCode — Company default currency",
      chart_of_accounts: "string — Chart of Accounts template used",
      fiscal_year_start: "string — Fiscal year start (MM-DD, e.g., '01-01' or '04-01')",
    },
  },

  scope_tier_module_access: {
    description: "ERPNext module access is gated by the tenant's scope tier. Lower tiers get basic invoicing; higher tiers get full ERP.",
    tiers: {
      nano: {
        modules: ["basic_invoicing"],
        description: "Basic Sales Invoice creation and payment tracking only. No inventory management.",
        max_invoices_per_month: 50,
        max_items: 100,
      },
      micro: {
        modules: ["basic_invoicing", "basic_inventory"],
        description: "Invoicing plus basic stock tracking. Single warehouse.",
        max_invoices_per_month: 200,
        max_items: 500,
      },
      small: {
        modules: ["invoicing", "inventory", "basic_procurement"],
        description: "Full invoicing, multi-warehouse inventory, basic PO management.",
        max_invoices_per_month: 1000,
        max_items: 2000,
      },
      medium: {
        modules: ["invoicing", "inventory", "procurement", "customer_credit", "reporting"],
        description: "Full ERP modules including credit management and financial reports.",
        max_invoices_per_month: 5000,
        max_items: 10000,
      },
      large: {
        modules: ["invoicing", "inventory", "procurement", "customer_credit", "reporting", "batch_tracking", "multi_currency"],
        description: "Advanced features: batch/serial tracking, multi-currency transactions.",
        max_invoices_per_month: 20000,
        max_items: 50000,
      },
      mega: {
        modules: ["invoicing", "inventory", "procurement", "customer_credit", "reporting", "batch_tracking", "multi_currency", "inter_company", "bom"],
        description: "Enterprise features: inter-company accounting, BOM for manufacturing.",
        max_invoices_per_month: 100000,
        max_items: -1,
      },
      global: {
        modules: ["all"],
        description: "Full unrestricted access to all ERPNext modules. No limits. Value -1 means unlimited.",
        max_invoices_per_month: -1,
        max_items: -1,
      },
    } as Record<ScopeTier, { modules: string[]; description: string; max_invoices_per_month: number; max_items: number }>,
  },

  vendor_tenant_as_supplier: {
    description: "Vendor-tenants are synced as ERPNext Suppliers under the parent marketplace/platform Company. This enables procurement workflows and inter-company transactions.",
    sync_rules: {
      vendor_registration: "When a vendor registers (vendor.registered event), create an ERPNext Supplier under the marketplace Company.",
      vendor_approval: "When vendor is approved, update Supplier status and enable transactions.",
      vendor_suspension: "When vendor is suspended, disable the ERPNext Supplier to prevent new POs.",
      commission_tracking: "Vendor commissions are tracked via ERPNext Journal Entries between Company and Supplier accounts.",
    },
  },

  cross_tenant_marketplace: {
    description: "When a marketplace order involves products from a vendor-tenant, inter-company invoices are created to track revenue split.",
    workflow: {
      step_1: "Customer places order on marketplace tenant → Sales Invoice created under marketplace Company.",
      step_2: "For each vendor's items → Inter-company Purchase Invoice from marketplace Company to vendor Company.",
      step_3: "Marketplace commission → Journal Entry debiting vendor payable, crediting commission income.",
      step_4: "Vendor payout → Payment Entry from marketplace Company to vendor (Supplier).",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 5. ERPNEXT_CONFIG
// ---------------------------------------------------------------------------

/**
 * Configuration requirements for the ERPNext integration.
 * These values must be set as environment variables or secrets.
 */
export const ERPNEXT_CONFIG = {

  required_env_vars: {
    ERPNEXT_SITE_URL: "string — ERPNext site URL (e.g., https://erp.dakkah.com). No trailing slash. Store as config.",
    ERPNEXT_API_KEY: "string — ERPNext API key for authentication. Store as secret.",
    ERPNEXT_API_SECRET: "string — ERPNext API secret for authentication. Store as secret.",
    ERPNEXT_WEBHOOK_SECRET: "string — Shared secret for verifying inbound webhooks (HMAC-SHA256). Store as secret.",
  },

  optional_env_vars: {
    ERPNEXT_DEFAULT_COMPANY: "string — Default ERPNext Company for single-tenant setups. Default: auto-detect from tenant mapping.",
    ERPNEXT_DEFAULT_CURRENCY: "string — Default currency code. Default: 'SAR'",
    ERPNEXT_AUTO_SUBMIT_INVOICES: "boolean — Whether to auto-submit invoices after creation. Default: false",
    ERPNEXT_SYNC_INVENTORY_INTERVAL_MINUTES: "number — Interval for periodic inventory reconciliation. Default: 60",
    ERPNEXT_CUSTOM_FIELD_PREFIX: "string — Prefix for custom fields on ERPNext doctypes. Default: 'custom_medusa_'",
  },

  custom_fields: {
    description: "Custom fields that must be created on ERPNext doctypes for Medusa integration. All prefixed with 'custom_medusa_'.",
    fields: {
      "Sales Invoice": ["custom_medusa_order_id", "custom_medusa_tenant_id", "custom_medusa_invoice_id"],
      "Payment Entry": ["custom_medusa_order_id", "custom_medusa_payment_id", "custom_medusa_tenant_id"],
      "Customer": ["custom_medusa_customer_id", "custom_medusa_tenant_id", "custom_medusa_company_id"],
      "Supplier": ["custom_medusa_vendor_id", "custom_medusa_tenant_id", "custom_medusa_vendor_tenant_id"],
      "Item": ["custom_medusa_product_id", "custom_medusa_variant_id", "custom_medusa_tenant_id"],
      "Purchase Order": ["custom_medusa_po_id", "custom_medusa_tenant_id"],
      "Stock Entry": ["custom_medusa_tenant_id", "custom_medusa_reference_type", "custom_medusa_reference_id"],
      "Warehouse": ["custom_medusa_tenant_id", "custom_medusa_poi_id", "custom_medusa_stock_location_id"],
      "Journal Entry": ["custom_medusa_reference_type", "custom_medusa_reference_id"],
    },
  },

  webhook_config: {
    medusa_endpoint: "/admin/webhooks/erpnext",
    signature_header: "x-erpnext-secret",
    signature_algorithm: "HMAC-SHA256",
    max_retries: 5,
    retry_backoff_base_seconds: 30,
    timeout_seconds: 30,
    payload_format: "{ doctype: string, event: string, data: Record<string, any> }",
  },

  rate_limits_per_tier: {
    nano: {
      api_calls_per_minute: 20,
      description: "Nano tier: Basic invoicing only. Limited API calls.",
    },
    micro: {
      api_calls_per_minute: 50,
      description: "Micro tier: Small business with basic inventory.",
    },
    small: {
      api_calls_per_minute: 100,
      description: "Small tier: Growing business with procurement.",
    },
    medium: {
      api_calls_per_minute: 200,
      description: "Medium tier: Full ERP access.",
    },
    large: {
      api_calls_per_minute: 500,
      description: "Large tier: Advanced features with high throughput.",
    },
    mega: {
      api_calls_per_minute: 1000,
      description: "Mega tier: Enterprise-grade throughput.",
    },
    global: {
      api_calls_per_minute: -1,
      description: "Global tier: Unlimited API calls. Value -1 means no limit.",
    },
  } as Record<ScopeTier, { api_calls_per_minute: number; description: string }>,
} as const
