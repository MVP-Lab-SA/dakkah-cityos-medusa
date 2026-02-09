/**
 * =============================================================================
 * WALT.ID INTEGRATION SPECIFICATION
 * =============================================================================
 *
 * Contract document for the Walt.id integration with Dakkah CityOS Commerce.
 *
 * Walt.id provides decentralized digital identity (SSI/DID) capabilities for the
 * platform: Decentralized Identifiers (DIDs), Verifiable Credentials (VCs),
 * credential verification, and wallet-based identity management.
 *
 * Medusa is the source of truth for user accounts, vendor profiles, tenant
 * records, and membership data. Walt.id is the source of truth for DIDs,
 * Verifiable Credentials, and cryptographic proofs. Both systems integrate
 * via direct API calls and event-driven credential issuance.
 *
 * The platform issues credentials following the W3C Verifiable Credentials
 * Data Model 1.1 specification. A root platform DID (Dakkah issuer DID) is
 * used to sign all platform-issued credentials. Tenants may optionally have
 * delegated issuer DIDs.
 *
 * @module WaltIdSpec
 * @version 1.0.0
 * @lastUpdated 2026-02-09
 */

// Capabilities marked with @planned are contract definitions for future implementation.
// Currently implemented: DID create/resolve, credential issue/verify/list/revoke,
// specialized KYC/Vendor/Membership credential issuance, identity verification.

// ---------------------------------------------------------------------------
// Shared Types
// ---------------------------------------------------------------------------

/** Scope tiers matching Medusa tenant.scope_tier */
export type ScopeTier = "nano" | "micro" | "small" | "medium" | "large" | "mega" | "global"

/** Supported DID methods */
export type DIDMethod = "key" | "web" | "ion" | "ebsi" | "cheqd"

/** Credential status values */
export type CredentialStatus = "active" | "revoked" | "expired" | "suspended"

/** Verification result status */
export type VerificationResult = "valid" | "invalid" | "expired" | "revoked" | "unknown"

/** Platform credential types */
export type PlatformCredentialType =
  | "KYCVerificationCredential"
  | "VendorVerificationCredential"
  | "CityOSMembershipCredential"
  | "TenantOperatorCredential"
  | "POIVerificationCredential"
  | "MarketplaceSellerCredential"

/** KYC verification levels */
export type KYCVerificationLevel = "basic" | "enhanced" | "full"

/** Membership types */
export type MembershipType = "basic" | "premium" | "enterprise" | "vip"

/** Operator roles */
export type OperatorRole = "owner" | "admin" | "manager" | "operator" | "viewer"

/** POI verification types */
export type POIVerificationType = "address_verified" | "site_inspected" | "license_confirmed" | "self_declared"

// ---------------------------------------------------------------------------
// DID Types
// ---------------------------------------------------------------------------

/** Decentralized Identifier (DID) document */
export interface DIDDocument {
  "@context": string[]
  id: string
  verificationMethod: Array<{
    id: string
    type: string
    controller: string
    publicKeyJwk?: Record<string, any>
    publicKeyMultibase?: string
  }>
  authentication: string[]
  assertionMethod?: string[]
  keyAgreement?: string[]
  capabilityInvocation?: string[]
  capabilityDelegation?: string[]
  service?: Array<{
    id: string
    type: string
    serviceEndpoint: string
  }>
}

/** DID creation result */
export interface DIDCreationResult {
  did: string
  document: DIDDocument
}

/** DID resolution result */
export interface DIDResolutionResult {
  did: string
  document: DIDDocument
}

/** Key rotation result */
export interface KeyRotationResult {
  did: string
  new_key_id: string
  previous_key_id: string
  rotated_at: string
}

// ---------------------------------------------------------------------------
// Verifiable Credential Types
// ---------------------------------------------------------------------------

/** W3C Verifiable Credential base structure */
export interface VerifiableCredential {
  "@context": string[]
  id: string
  type: string[]
  issuer: string | { id: string; name?: string }
  issuanceDate: string
  expirationDate?: string
  credentialSubject: Record<string, any> & { id: string }
  credentialStatus?: {
    id: string
    type: "StatusList2021Entry" | "RevocationList2020Status"
    statusPurpose: "revocation" | "suspension"
    statusListIndex: string
    statusListCredential: string
  }
  proof?: {
    type: string
    created: string
    verificationMethod: string
    proofPurpose: string
    jws?: string
    proofValue?: string
  }
}

/** Credential issuance request */
export interface CredentialIssuanceRequest {
  issuerDid: string
  subjectDid: string
  credentialType: PlatformCredentialType
  claims: Record<string, any>
  expirationDate?: string
}

/** Credential issuance result */
export interface CredentialIssuanceResult {
  credential: VerifiableCredential
  credentialId: string
}

/** Credential verification request */
export interface CredentialVerificationRequest {
  credential: string | VerifiableCredential
  policies?: VerificationPolicy[]
}

/** Verification policies to apply */
export type VerificationPolicy =
  | "SignaturePolicy"
  | "ExpirationDatePolicy"
  | "NotBeforeDatePolicy"
  | "RevocationPolicy"
  | "CredentialStatusPolicy"
  | "SchemaValidationPolicy"
  | "TrustedIssuerPolicy"

/** Credential verification result */
export interface CredentialVerificationResult {
  valid: boolean
  checks: string[]
  errors: string[]
  policies_applied: VerificationPolicy[]
}

/** Verifiable Presentation */
export interface VerifiablePresentation {
  "@context": string[]
  type: string[]
  holder: string
  verifiableCredential: VerifiableCredential[]
  proof?: {
    type: string
    created: string
    verificationMethod: string
    proofPurpose: string
    challenge?: string
    domain?: string
    jws?: string
  }
}

/** Presentation exchange definition */
export interface PresentationDefinition {
  id: string
  name: string
  purpose: string
  input_descriptors: Array<{
    id: string
    name: string
    purpose: string
    constraints: {
      fields: Array<{
        path: string[]
        filter?: Record<string, any>
      }>
    }
  }>
}

/** Presentation submission */
export interface PresentationSubmission {
  id: string
  definition_id: string
  descriptor_map: Array<{
    id: string
    format: "jwt_vp" | "ldp_vp"
    path: string
  }>
}

// ---------------------------------------------------------------------------
// Platform Credential Schemas
// ---------------------------------------------------------------------------

/** KYC Verification Credential — issued after successful identity verification */
export interface KYCVerificationCredentialSubject {
  id: string
  customerName: string
  email: string
  verificationLevel: KYCVerificationLevel
  tenantId: string
  nodeId: string
  verifiedAt: string
  documentTypes?: string[]
  countryOfVerification?: string
}

/** Vendor Verification Credential — issued to verified vendors */
export interface VendorVerificationCredentialSubject {
  id: string
  vendorName: string
  businessLicense: string
  tenantId: string
  scope_tier: ScopeTier
  verifiedAt: string
  businessType?: string
  country?: string
  registrationNumber?: string
}

/** CityOS Membership Credential — issued to platform members */
export interface CityOSMembershipCredentialSubject {
  id: string
  memberName: string
  membershipType: MembershipType
  tenantId: string
  nodeId: string
  validUntil: string
  issuedAt: string
  benefits?: string[]
  tier?: string
}

/** Tenant Operator Credential — issued to tenant administrators and operators */
export interface TenantOperatorCredentialSubject {
  id: string
  operatorName: string
  role: OperatorRole
  tenantId: string
  permissions: string[]
  issuedAt: string
  validUntil?: string
  email?: string
  department?: string
}

/** POI Verification Credential — issued for verified physical locations */
export interface POIVerificationCredentialSubject {
  id: string
  poiName: string
  address: string
  verificationType: POIVerificationType
  tenantId: string
  verifiedAt: string
  coordinates?: { lat: number; lng: number }
  poiType?: string
  licenseNumber?: string
}

/** Marketplace Seller Credential — authorizes cross-tenant marketplace selling */
export interface MarketplaceSellerCredentialSubject {
  id: string
  vendorTenantId: string
  hostTenantId: string
  approvedVerticals: string[]
  issuedAt: string
  validUntil?: string
  vendorName?: string
  commissionRate?: number
  maxListings?: number
}

// ---------------------------------------------------------------------------
// Wallet Types
// ---------------------------------------------------------------------------

/** Wallet credential entry */
export interface WalletCredentialEntry {
  credentialId: string
  credentialType: string
  issuer: string
  issuanceDate: string
  expirationDate?: string
  status: CredentialStatus
  credential: VerifiableCredential
}

/** QR code presentation data */
export interface QRPresentationData {
  type: "CredentialOffer" | "PresentationRequest"
  url: string
  qr_data: string
  expires_at: string
}

/** Wallet sharing request */
export interface WalletSharingRequest {
  from_wallet_did: string
  to_wallet_did: string
  credential_ids: string[]
  purpose: string
  expires_at?: string
}

// ---------------------------------------------------------------------------
// Trust Infrastructure Types
// ---------------------------------------------------------------------------

/** Trust registry entry */
export interface TrustRegistryEntry {
  issuer_did: string
  issuer_name: string
  credential_types: PlatformCredentialType[]
  trust_level: "root" | "delegated" | "verified" | "self_declared"
  valid_from: string
  valid_until?: string
  metadata?: Record<string, any>
}

/** Credential schema definition */
export interface CredentialSchema {
  id: string
  type: "JsonSchema" | "JsonSchemaValidator2018"
  schema: Record<string, any>
  version: string
  credential_type: PlatformCredentialType
}

// ---------------------------------------------------------------------------
// 1. WALTID_CAPABILITIES
// ---------------------------------------------------------------------------

/**
 * Defines all required Walt.id API capabilities that the integration must support.
 * Each capability group documents the methods, parameters, and return types.
 *
 * All methods use the Walt.id REST API:
 *   - DIDs: `/v1/did/*`
 *   - Credentials: `/v1/credentials/*`
 *   - Verification: `/v1/credentials/verify`
 *   - Wallet: `/v1/wallet/*`
 *
 * Authentication: `Authorization: Bearer {WALTID_API_KEY}`
 */
export const WALTID_CAPABILITIES = {

  /**
   * =========================================================================
   * DID MANAGEMENT
   * =========================================================================
   * Create, resolve, and manage Decentralized Identifiers. Each entity
   * (platform, tenant, vendor, customer) can have a DID for verifiable
   * identity interactions.
   *
   * The platform uses a root DID (Dakkah issuer DID) for signing all
   * platform-issued credentials. Tenants may have delegated issuer DIDs.
   */
  didManagement: {
    description: "Create, resolve, and manage Decentralized Identifiers (DIDs) using multiple methods",

    createDID: {
      description: "Create a new DID using the specified method. Returns the DID string and its DID Document.",
      parameters: {
        method: "DIDMethod — DID method to use: 'key' (default, fast, no blockchain), 'web' (domain-linked), 'ion' (Bitcoin-anchored), 'ebsi' (EU blockchain), 'cheqd' (Cosmos-based)",
        options: "Record<string, any> | undefined — Method-specific options (e.g., domain for did:web, network for did:ion)",
      },
      returns: "DIDCreationResult — { did: string, document: DIDDocument }",
      errors: ["INVALID_METHOD", "KEY_GENERATION_FAILED", "NETWORK_ERROR"],
      method_recommendations: {
        "did:key": "Default for most entities. Fast, no infrastructure required. Suitable for customers and vendors.",
        "did:web": "Recommended for tenants and the platform. Links DID to a web domain for discoverability.",
        "did:ion": "For entities requiring long-term, immutable DID anchoring. Higher latency for creation.",
      },
    },

    resolveDID: {
      description: "Resolve a DID to its DID Document. Works across all supported DID methods.",
      parameters: {
        did: "string — The DID to resolve (e.g., 'did:key:z6Mk...', 'did:web:dakkah.com')",
      },
      returns: "DIDResolutionResult — { did: string, document: DIDDocument }",
      errors: ["DID_NOT_FOUND", "RESOLUTION_FAILED", "INVALID_DID_FORMAT"],
    },

    /** @planned - Not yet implemented */
    updateDIDDocument: {
      description: "Update a DID Document (add/remove verification methods, services). Only supported for mutable DID methods (did:web, did:ion, did:cheqd).",
      parameters: {
        did: "string — The DID to update",
        updates: "Partial<DIDDocument> — Fields to update (verificationMethod, service, etc.)",
      },
      returns: "{ did: string, document: DIDDocument }",
      errors: ["DID_NOT_FOUND", "METHOD_NOT_MUTABLE", "UNAUTHORIZED", "INVALID_UPDATE"],
    },

    /** @planned - Not yet implemented */
    rotateKey: {
      description: "Rotate the primary key for a DID. Creates a new key pair and updates the DID Document. The old key is retained for verification of previously signed credentials.",
      parameters: {
        did: "string — The DID whose key should be rotated",
      },
      returns: "KeyRotationResult — { did, new_key_id, previous_key_id, rotated_at }",
      errors: ["DID_NOT_FOUND", "KEY_ROTATION_FAILED", "METHOD_NOT_SUPPORTED"],
    },

    /** @planned - Not yet implemented */
    deleteDID: {
      description: "Deactivate a DID. For immutable methods (did:key), this only removes from local storage. For mutable methods, this deactivates the DID Document.",
      parameters: {
        did: "string — The DID to deactivate",
      },
      returns: "{ success: boolean }",
      errors: ["DID_NOT_FOUND", "DID_HAS_ACTIVE_CREDENTIALS"],
    },
  },

  /**
   * =========================================================================
   * CREDENTIAL ISSUANCE
   * =========================================================================
   * Issue Verifiable Credentials following the W3C VC Data Model 1.1.
   * The platform issuer DID signs all credentials. Each credential type
   * has a defined schema for its credentialSubject claims.
   */
  credentialIssuance: {
    description: "Issue Verifiable Credentials (W3C standard) for platform identity verification, vendor authorization, and membership",

    issueCredential: {
      description: "Issue a generic Verifiable Credential. Used as the base method for all credential types.",
      parameters: {
        issuerDid: "string — Issuer DID (typically the platform root DID or tenant delegated DID)",
        subjectDid: "string — Subject DID (the entity receiving the credential)",
        credentialType: "PlatformCredentialType — Type of credential to issue",
        claims: "Record<string, any> — credentialSubject claims (must match schema for the credential type)",
        expirationDate: "string | undefined — ISO 8601 expiration date",
      },
      returns: "CredentialIssuanceResult — { credential: VerifiableCredential, credentialId: string }",
      errors: ["ISSUER_DID_NOT_FOUND", "SUBJECT_DID_NOT_FOUND", "INVALID_CLAIMS", "SCHEMA_VALIDATION_FAILED", "SIGNING_FAILED"],
    },

    issueKYCCredential: {
      description: "Issue a KYCVerificationCredential after successful identity verification. Includes customer name, email, verification level, and tenant/node context.",
      parameters: {
        subjectDid: "string — Customer's DID",
        customerName: "string — Verified customer name",
        customerEmail: "string — Verified email address",
        verificationLevel: "KYCVerificationLevel — 'basic', 'enhanced', or 'full'",
        tenantId: "string — Tenant that performed the verification",
        nodeId: "string — Node where verification occurred",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "KYCVerificationCredential",
        subject_fields: "KYCVerificationCredentialSubject",
        expiration: "1 year from issuance (default)",
      },
    },

    issueVendorCredential: {
      description: "Issue a VendorVerificationCredential to a verified vendor. Proves the vendor has passed business verification.",
      parameters: {
        subjectDid: "string — Vendor's DID",
        vendorName: "string — Verified business name",
        businessLicense: "string — Business license number",
        tenantId: "string — Parent marketplace/platform tenant ID",
        scope_tier: "ScopeTier — Vendor's scope tier",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "VendorVerificationCredential",
        subject_fields: "VendorVerificationCredentialSubject",
        expiration: "2 years from issuance (default)",
      },
    },

    issueMembershipCredential: {
      description: "Issue a CityOSMembershipCredential when a customer enrolls in a membership program.",
      parameters: {
        subjectDid: "string — Member's DID",
        memberName: "string — Member display name",
        membershipType: "MembershipType — 'basic', 'premium', 'enterprise', 'vip'",
        tenantId: "string — Tenant operating the membership program",
        nodeId: "string — Node context",
        validUntil: "string — ISO 8601 membership expiration date",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "CityOSMembershipCredential",
        subject_fields: "CityOSMembershipCredentialSubject",
        expiration: "Set by validUntil parameter",
      },
    },

    /** @planned - Not yet implemented */
    issueTenantOperatorCredential: {
      description: "Issue a TenantOperatorCredential to a tenant admin or operator. Proves their role and permissions within the tenant.",
      parameters: {
        subjectDid: "string — Operator's DID",
        operatorName: "string — Operator display name",
        role: "OperatorRole — 'owner', 'admin', 'manager', 'operator', 'viewer'",
        tenantId: "string — Tenant the operator belongs to",
        permissions: "string[] — List of granted permissions",
        validUntil: "string | undefined — Optional expiration date",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "TenantOperatorCredential",
        subject_fields: "TenantOperatorCredentialSubject",
        expiration: "1 year from issuance (default) or validUntil",
      },
    },

    /** @planned - Not yet implemented */
    issuePOIVerificationCredential: {
      description: "Issue a POIVerificationCredential for a verified physical location. Proves the location has been verified through the specified method.",
      parameters: {
        subjectDid: "string — POI owner's DID (tenant or vendor DID)",
        poiName: "string — Location name",
        address: "string — Full formatted address",
        verificationType: "POIVerificationType — How the location was verified",
        tenantId: "string — Owning tenant ID",
        coordinates: "{ lat: number, lng: number } | undefined — Geo coordinates",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "POIVerificationCredential",
        subject_fields: "POIVerificationCredentialSubject",
        expiration: "3 years from issuance (default)",
      },
    },

    /** @planned - Not yet implemented */
    issueMarketplaceSellerCredential: {
      description: "Issue a MarketplaceSellerCredential authorizing a vendor to sell on a specific marketplace tenant. Proves cross-tenant marketplace authorization.",
      parameters: {
        subjectDid: "string — Vendor's DID",
        vendorTenantId: "string — Vendor's own tenant ID",
        hostTenantId: "string — Marketplace tenant that approved the vendor",
        approvedVerticals: "string[] — List of verticals the vendor is approved to sell in",
        vendorName: "string | undefined — Vendor display name",
        commissionRate: "number | undefined — Agreed commission rate",
        maxListings: "number | undefined — Maximum number of product listings",
      },
      returns: "CredentialIssuanceResult",
      errors: ["ISSUER_DID_NOT_CONFIGURED", "SUBJECT_DID_NOT_FOUND", "SIGNING_FAILED"],
      credential_schema: {
        type: "MarketplaceSellerCredential",
        subject_fields: "MarketplaceSellerCredentialSubject",
        expiration: "1 year from issuance (default)",
      },
    },
  },

  /**
   * =========================================================================
   * CREDENTIAL VERIFICATION
   * =========================================================================
   * Verify Verifiable Credentials and Verifiable Presentations. Checks
   * cryptographic signatures, expiration dates, revocation status, and
   * optionally validates against trusted issuer registries.
   */
  credentialVerification: {
    description: "Verify VCs (signature, expiry, revocation), presentation exchange, selective disclosure",

    verifyCredential: {
      description: "Verify a single Verifiable Credential. Checks signature validity, expiration, and optionally revocation status.",
      parameters: {
        credential: "string | VerifiableCredential — The credential to verify (JWT string or JSON-LD object)",
        policies: "VerificationPolicy[] | undefined — Verification policies to apply (default: all applicable policies)",
      },
      returns: "CredentialVerificationResult — { valid: boolean, checks: string[], errors: string[], policies_applied: VerificationPolicy[] }",
      errors: ["INVALID_CREDENTIAL_FORMAT", "VERIFICATION_FAILED", "NETWORK_ERROR"],
    },

    /** @planned - Not yet implemented */
    verifyPresentation: {
      description: "Verify a Verifiable Presentation containing one or more credentials. Validates the presentation proof, holder binding, and all contained credentials.",
      parameters: {
        presentation: "string | VerifiablePresentation — The presentation to verify",
        challenge: "string | undefined — Expected challenge value (for replay protection)",
        domain: "string | undefined — Expected domain (for audience restriction)",
        definition: "PresentationDefinition | undefined — Presentation definition to validate against",
      },
      returns: "{ valid: boolean, holder: string, credentials: Array<{ credentialId: string, type: string, valid: boolean, errors: string[] }>, errors: string[] }",
      errors: ["INVALID_PRESENTATION_FORMAT", "HOLDER_BINDING_FAILED", "CHALLENGE_MISMATCH", "DOMAIN_MISMATCH"],
    },

    /** @planned - Not yet implemented */
    createPresentationRequest: {
      description: "Create a presentation request that can be sent to a holder's wallet. Defines which credentials and claims are required.",
      parameters: {
        definition: "PresentationDefinition — What credentials/claims are required",
        challenge: "string | undefined — Unique challenge for replay protection",
        domain: "string | undefined — Domain restriction",
        callback_url: "string | undefined — URL to receive the presentation submission",
      },
      returns: "{ request_url: string, request_id: string, qr_data: string, expires_at: string }",
      errors: ["INVALID_DEFINITION"],
    },

    /** @planned - Not yet implemented */
    checkSelectiveDisclosure: {
      description: "Verify a credential with selective disclosure. Only specified claims are revealed; others are cryptographically hidden.",
      parameters: {
        credential: "string | VerifiableCredential — The credential with selective disclosure",
        disclosed_claims: "string[] — List of claim paths that should be disclosed",
      },
      returns: "{ valid: boolean, disclosed: Record<string, any>, undisclosed_count: number, errors: string[] }",
      errors: ["SELECTIVE_DISCLOSURE_NOT_SUPPORTED", "INVALID_CREDENTIAL"],
    },
  },

  /**
   * =========================================================================
   * CREDENTIAL LIFECYCLE
   * =========================================================================
   * Manage the full credential lifecycle: issuance tracking, revocation,
   * renewal, and status list management.
   */
  credentialLifecycle: {
    description: "Credential issuance tracking, revocation, renewal, and status list management",

    listCredentials: {
      description: "List all credentials held by a specific DID. Returns credential metadata without the full credential data.",
      parameters: {
        holderDid: "string — The DID of the credential holder",
        type: "PlatformCredentialType | undefined — Filter by credential type",
        status: "CredentialStatus | undefined — Filter by status (active, revoked, expired)",
      },
      returns: "Array<WalletCredentialEntry>",
      errors: ["DID_NOT_FOUND"],
    },

    revokeCredential: {
      description: "Revoke a previously issued credential. Updates the credential's status in the status list. Revocation is permanent.",
      parameters: {
        credentialId: "string — The credential ID to revoke",
        reason: "string | undefined — Reason for revocation",
      },
      returns: "{ success: boolean, revoked_at: string }",
      errors: ["CREDENTIAL_NOT_FOUND", "ALREADY_REVOKED", "UNAUTHORIZED"],
    },

    /** @planned - Not yet implemented */
    suspendCredential: {
      description: "Temporarily suspend a credential. Unlike revocation, suspension can be reversed.",
      parameters: {
        credentialId: "string — The credential ID to suspend",
        reason: "string | undefined — Reason for suspension",
      },
      returns: "{ success: boolean, suspended_at: string }",
      errors: ["CREDENTIAL_NOT_FOUND", "ALREADY_SUSPENDED", "ALREADY_REVOKED", "UNAUTHORIZED"],
    },

    /** @planned - Not yet implemented */
    reinstateCredential: {
      description: "Reinstate a previously suspended credential. Only works for suspended (not revoked) credentials.",
      parameters: {
        credentialId: "string — The credential ID to reinstate",
      },
      returns: "{ success: boolean, reinstated_at: string }",
      errors: ["CREDENTIAL_NOT_FOUND", "NOT_SUSPENDED", "UNAUTHORIZED"],
    },

    /** @planned - Not yet implemented */
    renewCredential: {
      description: "Renew an expiring or expired credential. Issues a new credential with updated validity dates. The old credential is optionally revoked.",
      parameters: {
        credentialId: "string — The credential ID to renew",
        new_expiration_date: "string — ISO 8601 new expiration date",
        revoke_old: "boolean — Whether to revoke the old credential (default: true)",
      },
      returns: "CredentialIssuanceResult — The newly issued credential",
      errors: ["CREDENTIAL_NOT_FOUND", "INVALID_EXPIRATION_DATE", "UNAUTHORIZED"],
    },

    /** @planned - Not yet implemented */
    getStatusList: {
      description: "Get the status list credential that tracks revocation/suspension status for a batch of credentials.",
      parameters: {
        status_list_id: "string — Status list credential ID",
      },
      returns: "{ statusListCredential: VerifiableCredential, entries: Array<{ index: number, status: CredentialStatus }> }",
      errors: ["STATUS_LIST_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * WALLET INTEGRATION
   * =========================================================================
   * Integration with Walt.id web wallet for credential storage, sharing,
   * and QR code presentation.
   */
  /** @planned - Not yet implemented */
  walletIntegration: {
    description: "Walt.id web wallet for credential storage, wallet-to-wallet sharing, QR code presentation",

    storeCredential: {
      description: "Store a credential in the holder's Walt.id web wallet.",
      parameters: {
        wallet_did: "string — Wallet DID (holder)",
        credential: "VerifiableCredential — The credential to store",
      },
      returns: "{ stored: boolean, credential_id: string }",
      errors: ["WALLET_NOT_FOUND", "CREDENTIAL_ALREADY_STORED", "INVALID_CREDENTIAL"],
    },

    getCredentialFromWallet: {
      description: "Retrieve a specific credential from a wallet.",
      parameters: {
        wallet_did: "string — Wallet DID",
        credential_id: "string — Credential ID to retrieve",
      },
      returns: "{ credential: VerifiableCredential }",
      errors: ["WALLET_NOT_FOUND", "CREDENTIAL_NOT_FOUND"],
    },

    listWalletCredentials: {
      description: "List all credentials in a wallet with optional filtering.",
      parameters: {
        wallet_did: "string — Wallet DID",
        type: "PlatformCredentialType | undefined — Filter by type",
        status: "CredentialStatus | undefined — Filter by status",
      },
      returns: "{ credentials: WalletCredentialEntry[] }",
      errors: ["WALLET_NOT_FOUND"],
    },

    generateQRPresentation: {
      description: "Generate a QR code for presenting a credential. The QR code can be scanned by a verifier to initiate verification.",
      parameters: {
        wallet_did: "string — Wallet DID",
        credential_ids: "string[] — Credential IDs to include in the presentation",
        purpose: "string — Purpose of the presentation",
        expires_in_seconds: "number — QR code validity duration (default: 300)",
      },
      returns: "QRPresentationData — { type, url, qr_data, expires_at }",
      errors: ["WALLET_NOT_FOUND", "CREDENTIAL_NOT_FOUND", "PRESENTATION_CREATION_FAILED"],
    },

    shareCredentials: {
      description: "Share credentials from one wallet to another. Creates a Verifiable Presentation and sends it to the target wallet.",
      parameters: {
        request: "WalletSharingRequest — { from_wallet_did, to_wallet_did, credential_ids, purpose, expires_at }",
      },
      returns: "{ sharing_id: string, status: 'pending' | 'accepted' | 'rejected', presentation: VerifiablePresentation }",
      errors: ["SOURCE_WALLET_NOT_FOUND", "TARGET_WALLET_NOT_FOUND", "CREDENTIAL_NOT_FOUND", "SHARING_REJECTED"],
    },
  },

  /**
   * =========================================================================
   * TRUST INFRASTRUCTURE
   * =========================================================================
   * Trust registries, issuer verification, and credential schemas. Ensures
   * that credentials are only accepted from trusted issuers and follow
   * defined schemas.
   */
  /** @planned - Not yet implemented */
  trustInfrastructure: {
    description: "Trust registries, issuer verification, credential schemas",

    registerTrustedIssuer: {
      description: "Register a DID as a trusted issuer in the platform's trust registry. Only the platform root DID can register new issuers.",
      parameters: {
        issuer_did: "string — DID of the issuer to register",
        issuer_name: "string — Human-readable issuer name",
        credential_types: "PlatformCredentialType[] — Credential types this issuer is authorized to issue",
        trust_level: "'root' | 'delegated' | 'verified' — Trust level assigned",
        valid_from: "string — ISO 8601 start date",
        valid_until: "string | undefined — ISO 8601 end date (omit for indefinite)",
      },
      returns: "{ entry: TrustRegistryEntry }",
      errors: ["ISSUER_ALREADY_REGISTERED", "UNAUTHORIZED", "INVALID_DID"],
    },

    verifyIssuer: {
      description: "Check if a DID is a trusted issuer for a specific credential type.",
      parameters: {
        issuer_did: "string — DID to verify",
        credential_type: "PlatformCredentialType — Credential type to check authorization for",
      },
      returns: "{ trusted: boolean, entry: TrustRegistryEntry | null, trust_level: string | null }",
      errors: [],
    },

    listTrustedIssuers: {
      description: "List all trusted issuers in the platform's trust registry.",
      parameters: {
        credential_type: "PlatformCredentialType | undefined — Filter by credential type",
        trust_level: "string | undefined — Filter by trust level",
      },
      returns: "{ issuers: TrustRegistryEntry[] }",
      errors: [],
    },

    registerCredentialSchema: {
      description: "Register a JSON Schema for a credential type. Used for schema validation during issuance and verification.",
      parameters: {
        credential_type: "PlatformCredentialType — The credential type this schema is for",
        schema: "Record<string, any> — JSON Schema definition",
        version: "string — Schema version (semver)",
      },
      returns: "{ schema: CredentialSchema }",
      errors: ["SCHEMA_ALREADY_EXISTS", "INVALID_SCHEMA"],
    },

    getCredentialSchema: {
      description: "Retrieve the schema for a credential type.",
      parameters: {
        credential_type: "PlatformCredentialType — The credential type",
        version: "string | undefined — Specific version (default: latest)",
      },
      returns: "{ schema: CredentialSchema }",
      errors: ["SCHEMA_NOT_FOUND"],
    },
  },

  /**
   * =========================================================================
   * IDENTITY VERIFICATION (Composite)
   * =========================================================================
   * High-level identity verification that combines DID resolution and
   * credential listing into a single verification check.
   */
  identityVerification: {
    description: "Composite identity verification combining DID resolution and credential checks",

    verifyIdentity: {
      description: "Verify an entity's identity by resolving their DID and listing their credentials. Returns a comprehensive verification result.",
      parameters: {
        did: "string — The DID to verify",
      },
      returns: "{ verified: boolean, did: string, document: DIDDocument, credentials: VerifiableCredential[], errors: string[] }",
      errors: ["DID_NOT_FOUND", "RESOLUTION_FAILED"],
    },
  },
} as const

// ---------------------------------------------------------------------------
// 2. WALTID_WEBHOOKS
// ---------------------------------------------------------------------------

/**
 * Webhooks that Walt.id sends TO Medusa when identity events occur.
 * Walt.id must POST JSON payloads to these Medusa endpoints.
 *
 * Endpoint base: `{MEDUSA_BASE_URL}/admin/webhooks/waltid`
 * Authentication: Shared webhook secret in `x-waltid-signature` header (HMAC-SHA256)
 */
export const WALTID_WEBHOOKS = {

  "credential.issued": {
    event: "credential.issued" as const,
    description: "A Verifiable Credential has been successfully issued. Medusa should store the credential reference.",
    waltid_payload: {
      credential_id: "string — Unique credential ID",
      credential_type: "PlatformCredentialType — Type of credential",
      issuer_did: "string — Issuer DID that signed the credential",
      subject_did: "string — Subject DID that received the credential",
      issuance_date: "string — ISO 8601 issuance date",
      expiration_date: "string | null — ISO 8601 expiration date",
      claims: "Record<string, any> — credentialSubject claims (subset)",
    },
    medusa_action: "Store credential reference in entity metadata (customer.metadata, vendor.metadata, or tenant.metadata). Update verification_status if applicable. Log to audit trail.",
  },

  "credential.verified": {
    event: "credential.verified" as const,
    description: "A credential verification was performed (either passed or failed).",
    waltid_payload: {
      credential_id: "string — Credential ID that was verified",
      credential_type: "PlatformCredentialType — Type of credential",
      subject_did: "string — Subject DID",
      verifier_did: "string | null — Verifier DID (if known)",
      valid: "boolean — Whether verification passed",
      checks: "string[] — Verification checks performed",
      errors: "string[] — Verification errors (if any)",
      verified_at: "string — ISO 8601 verification timestamp",
    },
    medusa_action: "Log verification attempt. If verification failed, flag entity for review. Update last_verified_at on entity metadata.",
  },

  "credential.revoked": {
    event: "credential.revoked" as const,
    description: "A credential has been revoked. Medusa should update the entity's verification status.",
    waltid_payload: {
      credential_id: "string — Revoked credential ID",
      credential_type: "PlatformCredentialType — Type of revoked credential",
      subject_did: "string — Subject DID whose credential was revoked",
      reason: "string | null — Reason for revocation",
      revoked_at: "string — ISO 8601 revocation timestamp",
      revoked_by: "string — DID or identifier of who revoked",
    },
    medusa_action: "Update entity metadata to remove credential reference. If KYCVerificationCredential revoked, update customer verification_status to 'unverified'. If VendorVerificationCredential revoked, trigger vendor review process.",
  },

  "did.created": {
    event: "did.created" as const,
    description: "A new DID has been created. Medusa should store the DID reference on the entity.",
    waltid_payload: {
      did: "string — The newly created DID",
      method: "DIDMethod — DID method used",
      entity_type: "string — Type of entity: 'customer', 'vendor', 'tenant', 'platform'",
      entity_id: "string — Medusa entity ID",
      created_at: "string — ISO 8601 creation timestamp",
    },
    medusa_action: "Store DID on entity metadata (e.g., customer.metadata.did, vendor.metadata.did, tenant.metadata.did).",
  },

  "did.resolved": {
    event: "did.resolved" as const,
    description: "A DID resolution was performed. Informational webhook for audit logging.",
    waltid_payload: {
      did: "string — The DID that was resolved",
      resolved_by: "string | null — Who requested the resolution",
      resolved_at: "string — ISO 8601 resolution timestamp",
      success: "boolean — Whether resolution was successful",
    },
    medusa_action: "Log to audit trail. No data mutation required.",
  },

  "presentation.verified": {
    event: "presentation.verified" as const,
    description: "A Verifiable Presentation has been verified. Contains verification results for all included credentials.",
    waltid_payload: {
      presentation_id: "string — Presentation identifier",
      holder_did: "string — Holder DID who presented",
      verifier_did: "string | null — Verifier DID",
      valid: "boolean — Overall verification result",
      credentials: "Array<{ credential_id: string, type: string, valid: boolean }> — Per-credential results",
      challenge: "string | null — Challenge value used",
      domain: "string | null — Domain restriction used",
      verified_at: "string — ISO 8601 verification timestamp",
    },
    medusa_action: "Log presentation verification. If used for access control (e.g., marketplace access), update authorization status based on credential validity.",
  },
} as const

// ---------------------------------------------------------------------------
// 3. MEDUSA_TO_WALTID_EVENTS
// ---------------------------------------------------------------------------

/**
 * Events that Medusa sends TO Walt.id when platform events require identity
 * operations. Medusa calls Walt.id API directly via WaltIdService.
 *
 * Authentication: `Authorization: Bearer {WALTID_API_KEY}`
 */
export const MEDUSA_TO_WALTID_EVENTS = {

  "vendor.registered": {
    event: "vendor.registered" as const,
    description: "A new vendor has registered on the platform. Create a DID for the vendor and issue a VendorVerificationCredential after KYC.",
    medusa_payload: {
      vendor_id: "string — Medusa vendor ID",
      tenant_id: "string — Parent marketplace/platform tenant ID",
      business_name: "string — Vendor business name",
      business_license: "string — Business license number",
      contact_email: "string — Vendor contact email",
      scope_tier: "ScopeTier — Vendor's scope tier",
    },
    waltid_action: "Step 1: Create a DID for the vendor (did:key default). Step 2: Store DID on vendor metadata. Step 3: After KYC completion, issue VendorVerificationCredential with the vendor's DID as subject.",
  },

  "kyc.completed": {
    event: "kyc.completed" as const,
    description: "KYC verification has been completed for a customer or vendor. Issue a KYCVerificationCredential.",
    medusa_payload: {
      subject_id: "string — Customer or vendor ID",
      subject_type: "'customer' | 'vendor'",
      subject_did: "string — Subject's DID (must be created first)",
      customer_name: "string — Verified name",
      customer_email: "string — Verified email",
      verification_level: "KYCVerificationLevel — 'basic', 'enhanced', or 'full'",
      tenant_id: "string — Tenant where verification was performed",
      node_id: "string — Node where verification occurred",
    },
    waltid_action: "Issue a KYCVerificationCredential using the platform issuer DID. Store credential reference on entity metadata. Set credential expiration to 1 year.",
  },

  "membership.created": {
    event: "membership.created" as const,
    description: "A customer has enrolled in a membership program. Issue a CityOSMembershipCredential.",
    medusa_payload: {
      membership_id: "string — Medusa membership ID",
      customer_id: "string — Customer ID",
      subject_did: "string — Member's DID",
      member_name: "string — Member display name",
      membership_type: "MembershipType — 'basic', 'premium', 'enterprise', 'vip'",
      tenant_id: "string — Tenant operating the membership program",
      node_id: "string — Node context",
      valid_until: "string — ISO 8601 membership expiration date",
    },
    waltid_action: "Issue a CityOSMembershipCredential. Set expiration to validUntil date. Store credential reference on membership metadata.",
  },

  "vendor.approved": {
    event: "vendor.approved" as const,
    description: "A vendor has been approved for a marketplace. Issue a MarketplaceSellerCredential authorizing cross-tenant selling.",
    medusa_payload: {
      vendor_id: "string — Medusa vendor ID",
      vendor_did: "string — Vendor's DID",
      vendor_tenant_id: "string — Vendor's own tenant ID",
      host_tenant_id: "string — Marketplace tenant that approved the vendor",
      approved_verticals: "string[] — List of approved verticals",
      vendor_name: "string — Vendor display name",
      commission_rate: "number | undefined — Agreed commission rate",
    },
    waltid_action: "Issue a MarketplaceSellerCredential with the vendor DID as subject. Include approved verticals and host tenant context. Set expiration to 1 year.",
  },

  "tenant.provisioned": {
    event: "tenant.provisioned" as const,
    description: "A new tenant has been provisioned. Create a tenant DID and issue a TenantOperatorCredential to the owner.",
    medusa_payload: {
      tenant_id: "string — New tenant ID",
      tenant_name: "string — Tenant display name",
      owner_user_id: "string — User ID of the tenant owner",
      owner_name: "string — Owner display name",
      owner_email: "string — Owner email",
      scope_tier: "ScopeTier — Tenant scope tier",
    },
    waltid_action: "Step 1: Create a DID for the tenant (did:web preferred for discoverability). Step 2: Create a DID for the owner (if not exists). Step 3: Issue TenantOperatorCredential to the owner with 'owner' role and full permissions. Step 4: Optionally register the tenant DID as a delegated issuer in the trust registry.",
  },
} as const

// ---------------------------------------------------------------------------
// 4. WALTID_MULTI_TENANT
// ---------------------------------------------------------------------------

/**
 * Multi-tenant considerations for the Walt.id integration.
 * The platform uses a hierarchical trust model with a root issuer DID
 * and optional delegated issuer DIDs for tenants.
 */
export const WALTID_MULTI_TENANT = {

  platform_issuer: {
    description: "The Dakkah platform has a root issuer DID that signs all platform-level credentials. This DID is the ultimate trust anchor.",
    root_did: "WALTID_ISSUER_DID — Configured via environment variable",
    trust_level: "root",
    authorized_credentials: "All PlatformCredentialType values",
    key_management: "Platform root DID keys must be stored in a secure HSM or key vault. Key rotation should be performed annually with a 90-day overlap period.",
  },

  delegated_issuers: {
    description: "Tenants at 'large' tier and above may have their own delegated issuer DIDs. These DIDs are registered in the trust registry by the platform root DID.",
    eligibility: {
      nano: false,
      micro: false,
      small: false,
      medium: false,
      large: true,
      mega: true,
      global: true,
    } as Record<ScopeTier, boolean>,
    authorized_credentials: "Delegated issuers can issue: CityOSMembershipCredential, POIVerificationCredential. They CANNOT issue: KYCVerificationCredential, VendorVerificationCredential, TenantOperatorCredential (these are platform-only).",
    registration: "When a tenant at 'large'+ tier is provisioned, a delegated issuer DID is created and registered in the trust registry with 'delegated' trust level.",
  },

  scope_tier_credential_access: {
    description: "Credential types available per scope tier",
    tiers: {
      nano: {
        available_credentials: ["CityOSMembershipCredential"],
        description: "Basic membership credentials only",
      },
      micro: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential"],
        description: "Membership and basic KYC",
      },
      small: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential", "VendorVerificationCredential"],
        description: "Full verification suite for vendors",
      },
      medium: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential", "VendorVerificationCredential", "POIVerificationCredential"],
        description: "Includes POI verification",
      },
      large: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential", "VendorVerificationCredential", "POIVerificationCredential", "TenantOperatorCredential", "MarketplaceSellerCredential"],
        description: "Full credential suite with delegated issuance",
      },
      mega: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential", "VendorVerificationCredential", "POIVerificationCredential", "TenantOperatorCredential", "MarketplaceSellerCredential"],
        description: "Full credential suite with delegated issuance",
      },
      global: {
        available_credentials: ["CityOSMembershipCredential", "KYCVerificationCredential", "VendorVerificationCredential", "POIVerificationCredential", "TenantOperatorCredential", "MarketplaceSellerCredential"],
        description: "Full unrestricted credential suite",
      },
    } as Record<ScopeTier, { available_credentials: PlatformCredentialType[]; description: string }>,
  },

  vendor_credential_flow: {
    description: "End-to-end flow for vendor identity credentials",
    steps: {
      step_1: "Vendor registers on marketplace (vendor.registered) → Create vendor DID (did:key)",
      step_2: "Platform initiates KYC (kyc.requested) → KYC verification workflow starts",
      step_3: "KYC completes (kyc.completed) → Issue KYCVerificationCredential to vendor DID",
      step_4: "Vendor approved for marketplace (vendor.approved) → Issue VendorVerificationCredential",
      step_5: "Vendor approved for cross-tenant selling → Issue MarketplaceSellerCredential",
      step_6: "Vendor can present credentials to other marketplaces for faster onboarding",
    },
  },
} as const

// ---------------------------------------------------------------------------
// 5. WALTID_CREDENTIAL_SCHEMAS
// ---------------------------------------------------------------------------

/**
 * JSON Schema definitions for each platform credential type.
 * These schemas are registered in the Walt.id credential schema registry
 * and used for validation during issuance and verification.
 */
export const WALTID_CREDENTIAL_SCHEMAS = {

  KYCVerificationCredential: {
    credential_type: "KYCVerificationCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "KYCVerificationCredential"],
    schema: {
      type: "object",
      required: ["customerName", "email", "verificationLevel", "tenantId", "nodeId", "verifiedAt"],
      properties: {
        id: { type: "string", description: "Subject DID" },
        customerName: { type: "string", description: "Verified customer full name" },
        email: { type: "string", format: "email", description: "Verified email address" },
        verificationLevel: { type: "string", enum: ["basic", "enhanced", "full"], description: "KYC verification level achieved" },
        tenantId: { type: "string", description: "Medusa tenant ID where verification was performed" },
        nodeId: { type: "string", description: "CityOS node ID where verification occurred" },
        verifiedAt: { type: "string", format: "date-time", description: "ISO 8601 timestamp of verification" },
        documentTypes: { type: "array", items: { type: "string" }, description: "Types of documents verified" },
        countryOfVerification: { type: "string", description: "Country where verification was performed" },
      },
    },
    default_expiration: "P1Y",
  },

  VendorVerificationCredential: {
    credential_type: "VendorVerificationCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "VendorVerificationCredential"],
    schema: {
      type: "object",
      required: ["vendorName", "businessLicense", "tenantId", "scope_tier", "verifiedAt"],
      properties: {
        id: { type: "string", description: "Subject DID" },
        vendorName: { type: "string", description: "Verified vendor business name" },
        businessLicense: { type: "string", description: "Business license or registration number" },
        tenantId: { type: "string", description: "Parent marketplace/platform tenant ID" },
        scope_tier: { type: "string", enum: ["nano", "micro", "small", "medium", "large", "mega", "global"], description: "Vendor's scope tier" },
        verifiedAt: { type: "string", format: "date-time", description: "ISO 8601 timestamp of verification" },
        businessType: { type: "string", description: "Type of business (e.g., retail, services)" },
        country: { type: "string", description: "Country of registration" },
        registrationNumber: { type: "string", description: "Official business registration number" },
      },
    },
    default_expiration: "P2Y",
  },

  CityOSMembershipCredential: {
    credential_type: "CityOSMembershipCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "CityOSMembershipCredential"],
    schema: {
      type: "object",
      required: ["memberName", "membershipType", "tenantId", "nodeId", "validUntil", "issuedAt"],
      properties: {
        id: { type: "string", description: "Subject DID" },
        memberName: { type: "string", description: "Member display name" },
        membershipType: { type: "string", enum: ["basic", "premium", "enterprise", "vip"], description: "Membership tier" },
        tenantId: { type: "string", description: "Tenant operating the membership program" },
        nodeId: { type: "string", description: "CityOS node context" },
        validUntil: { type: "string", format: "date-time", description: "Membership expiration date" },
        issuedAt: { type: "string", format: "date-time", description: "Credential issuance timestamp" },
        benefits: { type: "array", items: { type: "string" }, description: "List of membership benefits" },
        tier: { type: "string", description: "Optional internal tier classification" },
      },
    },
    default_expiration: "Set by validUntil",
  },

  TenantOperatorCredential: {
    credential_type: "TenantOperatorCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "TenantOperatorCredential"],
    schema: {
      type: "object",
      required: ["operatorName", "role", "tenantId", "permissions", "issuedAt"],
      properties: {
        id: { type: "string", description: "Subject DID" },
        operatorName: { type: "string", description: "Operator display name" },
        role: { type: "string", enum: ["owner", "admin", "manager", "operator", "viewer"], description: "Operator's role within the tenant" },
        tenantId: { type: "string", description: "Tenant the operator belongs to" },
        permissions: { type: "array", items: { type: "string" }, description: "List of granted permissions" },
        issuedAt: { type: "string", format: "date-time", description: "Credential issuance timestamp" },
        validUntil: { type: "string", format: "date-time", description: "Optional expiration date" },
        email: { type: "string", format: "email", description: "Operator email address" },
        department: { type: "string", description: "Operator department" },
      },
    },
    default_expiration: "P1Y",
  },

  POIVerificationCredential: {
    credential_type: "POIVerificationCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "POIVerificationCredential"],
    schema: {
      type: "object",
      required: ["poiName", "address", "verificationType", "tenantId", "verifiedAt"],
      properties: {
        id: { type: "string", description: "Subject DID (tenant or vendor DID)" },
        poiName: { type: "string", description: "Point of Interest name" },
        address: { type: "string", description: "Full formatted address" },
        verificationType: { type: "string", enum: ["address_verified", "site_inspected", "license_confirmed", "self_declared"], description: "How the location was verified" },
        tenantId: { type: "string", description: "Owning tenant ID" },
        verifiedAt: { type: "string", format: "date-time", description: "ISO 8601 timestamp of verification" },
        coordinates: {
          type: "object",
          properties: {
            lat: { type: "number" },
            lng: { type: "number" },
          },
          description: "Geographic coordinates",
        },
        poiType: { type: "string", description: "Type of POI (storefront, warehouse, etc.)" },
        licenseNumber: { type: "string", description: "Business license number at this location" },
      },
    },
    default_expiration: "P3Y",
  },

  MarketplaceSellerCredential: {
    credential_type: "MarketplaceSellerCredential" as const,
    w3c_context: ["https://www.w3.org/2018/credentials/v1"],
    w3c_type: ["VerifiableCredential", "MarketplaceSellerCredential"],
    schema: {
      type: "object",
      required: ["vendorTenantId", "hostTenantId", "approvedVerticals", "issuedAt"],
      properties: {
        id: { type: "string", description: "Subject DID (vendor DID)" },
        vendorTenantId: { type: "string", description: "Vendor's own tenant ID" },
        hostTenantId: { type: "string", description: "Marketplace tenant that approved the vendor" },
        approvedVerticals: { type: "array", items: { type: "string" }, description: "List of approved selling verticals" },
        issuedAt: { type: "string", format: "date-time", description: "Credential issuance timestamp" },
        validUntil: { type: "string", format: "date-time", description: "Authorization expiration date" },
        vendorName: { type: "string", description: "Vendor display name" },
        commissionRate: { type: "number", description: "Agreed commission rate (0-1)" },
        maxListings: { type: "integer", description: "Maximum number of product listings allowed" },
      },
    },
    default_expiration: "P1Y",
  },
} as const

// ---------------------------------------------------------------------------
// 6. WALTID_CONFIG
// ---------------------------------------------------------------------------

/**
 * Configuration requirements for the Walt.id integration.
 * These values must be set as environment variables or secrets.
 */
export const WALTID_CONFIG = {

  required_env_vars: {
    WALTID_API_URL: "string — Walt.id API base URL (e.g., 'https://wallet.dakkah.com/api'). Store as config.",
    WALTID_API_KEY: "string — Walt.id API key for authentication. Store as secret.",
    WALTID_ISSUER_DID: "string — Platform root issuer DID. Used to sign all platform-issued credentials. Store as config.",
  },

  optional_env_vars: {
    WALTID_WALLET_URL: "string — Walt.id web wallet URL for credential storage and presentation. Default: derived from API URL.",
    WALTID_DEFAULT_DID_METHOD: "DIDMethod — Default DID method for new DIDs. Default: 'key'",
    WALTID_CREDENTIAL_STATUS_LIST_URL: "string — Base URL for credential status lists. Default: derived from API URL.",
    WALTID_TRUST_REGISTRY_URL: "string — Trust registry endpoint URL. Default: derived from API URL.",
    WALTID_QR_EXPIRATION_SECONDS: "number — Default QR code expiration time. Default: 300",
    WALTID_WEBHOOK_SECRET: "string — Shared secret for verifying inbound webhooks (HMAC-SHA256). Store as secret.",
  },

  webhook_config: {
    medusa_endpoint: "/admin/webhooks/waltid",
    signature_header: "x-waltid-signature",
    signature_algorithm: "HMAC-SHA256",
    max_retries: 3,
    retry_backoff_base_seconds: 15,
    timeout_seconds: 30,
  },

  rate_limits_per_tier: {
    nano: {
      did_operations: 5,
      credential_issuance: 10,
      verification: 20,
      wallet_operations: 10,
      description: "Nano tier: Basic membership credentials only.",
    },
    micro: {
      did_operations: 10,
      credential_issuance: 25,
      verification: 50,
      wallet_operations: 25,
      description: "Micro tier: Membership and basic KYC.",
    },
    small: {
      did_operations: 25,
      credential_issuance: 50,
      verification: 100,
      wallet_operations: 50,
      description: "Small tier: Full vendor verification.",
    },
    medium: {
      did_operations: 50,
      credential_issuance: 100,
      verification: 200,
      wallet_operations: 100,
      description: "Medium tier: Includes POI verification.",
    },
    large: {
      did_operations: 100,
      credential_issuance: 250,
      verification: 500,
      wallet_operations: 250,
      description: "Large tier: Full suite with delegated issuance.",
    },
    mega: {
      did_operations: 250,
      credential_issuance: 500,
      verification: 1000,
      wallet_operations: 500,
      description: "Mega tier: Enterprise identity operations.",
    },
    global: {
      did_operations: -1,
      credential_issuance: -1,
      verification: -1,
      wallet_operations: -1,
      description: "Global tier: Unlimited. Value -1 means no limit.",
    },
  } as Record<ScopeTier, {
    did_operations: number
    credential_issuance: number
    verification: number
    wallet_operations: number
    description: string
  }>,
} as const
