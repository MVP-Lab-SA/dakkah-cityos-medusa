import { useState, useRef } from "react"
import { t } from "@/lib/i18n"
import { useParams } from "@tanstack/react-router"

interface KYCFormData {
  fullName: string
  dateOfBirth: string
  nationality: string
  documentType: "passport" | "national-id" | "drivers-license"
  documentNumber: string
  documentFront?: File
  documentBack?: File
  selfie?: File
  address: {
    line1: string
    line2: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

interface KYCFormProps {
  onSubmit: (data: KYCFormData) => void
  onCancel?: () => void
  isSubmitting?: boolean
}

const TOTAL_STEPS = 4

export function KYCForm({ onSubmit, onCancel, isSubmitting }: KYCFormProps) {
  const { locale } = useParams({ strict: false }) as { locale: string }
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<KYCFormData>({
    fullName: "",
    dateOfBirth: "",
    nationality: "",
    documentType: "passport",
    documentNumber: "",
    address: { line1: "", line2: "", city: "", state: "", postalCode: "", country: "" },
  })

  const fileInputFrontRef = useRef<HTMLInputElement>(null)
  const fileInputBackRef = useRef<HTMLInputElement>(null)
  const fileInputSelfieRef = useRef<HTMLInputElement>(null)

  const updateField = <K extends keyof KYCFormData>(key: K, value: KYCFormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const updateAddress = (key: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [key]: value },
    }))
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1)
  }

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    onSubmit(formData)
  }

  return (
    <div className="bg-ds-background rounded-lg border border-ds-border overflow-hidden">
      <div className="p-4 border-b border-ds-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-ds-foreground">
            {t(locale, "identity.kyc")}
          </h3>
          <span className="text-sm text-ds-muted-foreground">
            Step {currentStep} of {TOTAL_STEPS}
          </span>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i + 1 <= currentStep ? "bg-ds-primary" : "bg-ds-muted"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-ds-foreground mb-4">{t(locale, "identity.personal_information")}</h4>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.full_name")}</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                placeholder={t(locale, "identity.full_name_placeholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.date_of_birth")}</label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => updateField("dateOfBirth", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.nationality")}</label>
              <input
                type="text"
                value={formData.nationality}
                onChange={(e) => updateField("nationality", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                placeholder={t(locale, "identity.nationality_placeholder")}
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-ds-foreground mb-4">{t(locale, "identity.document_upload")}</h4>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.document_type")}</label>
              <select
                value={formData.documentType}
                onChange={(e) => updateField("documentType", e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
              >
                <option value="passport">{t(locale, "identity.document_type_passport")}</option>
                <option value="national-id">{t(locale, "identity.document_type_national_id")}</option>
                <option value="drivers-license">{t(locale, "identity.document_type_drivers_license")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.document_number")}</label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) => updateField("documentNumber", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                placeholder={t(locale, "identity.document_number_placeholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, "identity.document_front")}</label>
              <input
                ref={fileInputFrontRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField("documentFront", e.target.files?.[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputFrontRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-ds-border rounded-lg text-center hover:border-ds-primary transition-colors"
              >
                {formData.documentFront ? (
                  <span className="text-sm text-ds-foreground">{formData.documentFront.name}</span>
                ) : (
                  <>
                    <span className="text-2xl block mb-1">📄</span>
                    <span className="text-sm text-ds-muted-foreground">{t(locale, "identity.upload_document")}</span>
                  </>
                )}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-2">{t(locale, "identity.document_back")}</label>
              <input
                ref={fileInputBackRef}
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => updateField("documentBack", e.target.files?.[0])}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputBackRef.current?.click()}
                className="w-full p-6 border-2 border-dashed border-ds-border rounded-lg text-center hover:border-ds-primary transition-colors"
              >
                {formData.documentBack ? (
                  <span className="text-sm text-ds-foreground">{formData.documentBack.name}</span>
                ) : (
                  <>
                    <span className="text-2xl block mb-1">📄</span>
                    <span className="text-sm text-ds-muted-foreground">{t(locale, "identity.upload_document")}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-ds-foreground mb-4">{t(locale, "identity.selfie_verification")}</h4>
            <p className="text-sm text-ds-muted-foreground mb-4">
              {t(locale, "identity.selfie_instruction")}
            </p>
            <input
              ref={fileInputSelfieRef}
              type="file"
              accept="image/*"
              capture="user"
              onChange={(e) => updateField("selfie", e.target.files?.[0])}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputSelfieRef.current?.click()}
              className="w-full p-12 border-2 border-dashed border-ds-border rounded-lg text-center hover:border-ds-primary transition-colors"
            >
              {formData.selfie ? (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-3xl">✅</span>
                  <span className="text-sm text-ds-foreground">{formData.selfie.name}</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <span className="text-4xl">📸</span>
                  <span className="text-sm text-ds-muted-foreground">
                    {t(locale, "identity.selfie_placeholder")}
                  </span>
                </div>
              )}
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h4 className="text-base font-medium text-ds-foreground mb-4">{t(locale, "identity.address")}</h4>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.address_line_1")}</label>
              <input
                type="text"
                value={formData.address.line1}
                onChange={(e) => updateAddress("line1", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.address_line_2")}</label>
              <input
                type="text"
                value={formData.address.line2}
                onChange={(e) => updateAddress("line2", e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.city")}</label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => updateAddress("city", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.state_province")}</label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => updateAddress("state", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.postal_code")}</label>
                <input
                  type="text"
                  value={formData.address.postalCode}
                  onChange={(e) => updateAddress("postalCode", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ds-foreground mb-1">{t(locale, "identity.country")}</label>
                <input
                  type="text"
                  value={formData.address.country}
                  onChange={(e) => updateAddress("country", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-ds-background text-ds-foreground border border-ds-border focus:outline-none focus:ring-2 focus:ring-ds-primary"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-ds-border flex items-center justify-between">
        <div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-ds-muted-foreground hover:text-ds-foreground transition-colors"
            >
              {t(locale, "common.cancel")}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {currentStep > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 text-sm font-medium bg-ds-muted text-ds-foreground rounded-lg hover:bg-ds-background transition-colors"
            >
              {t(locale, "common.back")}
            </button>
          )}
          {currentStep < TOTAL_STEPS ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
            >
              {t(locale, "identity.next")}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-ds-primary text-ds-primary-foreground rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? t(locale, "common.loading") : t(locale, "common.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
