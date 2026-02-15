import React from 'react'

interface VendorRegisterFormBlockProps {
  heading?: string
  steps?: string[]
  requiredFields?: string[]
  termsUrl?: string
}

export const VendorRegisterFormBlock: React.FC<VendorRegisterFormBlockProps> = (props) => {
  const { heading, description, ...rest } = props;
  const itemsKey = Object.keys(props).find(k => Array.isArray(props[k]));
  const items = itemsKey ? props[itemsKey] : [];
  if ((!items || !items.length) && !heading && !description) return null;
  heading = 'Become a Vendor',
  steps = ['Business Info', 'Contact', 'Documents', 'Review'],
  requiredFields = [],
  termsUrl = '/terms',
}) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [agreedToTerms, setAgreedToTerms] = React.useState(false)

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-ds-foreground">{heading}</h2>
            <p className="text-ds-muted-foreground mt-2">Join our marketplace and start selling today</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index < activeStep
                          ? 'bg-ds-primary text-ds-primary-foreground'
                          : index === activeStep
                          ? 'bg-ds-primary text-ds-primary-foreground ring-4 ring-ds-primary/20'
                          : 'bg-ds-muted text-ds-muted-foreground'
                      }`}
                    >
                      {index < activeStep ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        index + 1
                      )}
                    </div>
                    <span className={`text-xs mt-1 hidden sm:block ${index <= activeStep ? 'text-ds-foreground' : 'text-ds-muted-foreground'}`}>
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 ${index < activeStep ? 'bg-ds-primary' : 'bg-ds-muted'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-ds-card border border-ds-border rounded-lg p-6">
            {activeStep === 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Business Information</h3>
                {['Business Name', 'Business Type', 'Registration Number', 'Tax ID'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-ds-foreground mb-1">{field}</label>
                    <input
                      type="text"
                      placeholder={field}
                      className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-ds-foreground mb-1">Business Description</label>
                  <textarea
                    placeholder="Describe your business..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Contact Details</h3>
                {['Contact Person', 'Email Address', 'Phone Number', 'Website (optional)'].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-ds-foreground mb-1">{field}</label>
                    <input
                      type="text"
                      placeholder={field}
                      className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-ds-foreground mb-1">Business Address</label>
                  <textarea
                    placeholder="Full address..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-md border border-ds-border bg-ds-background text-ds-foreground placeholder:text-ds-muted-foreground focus:outline-none focus:ring-2 focus:ring-ds-primary resize-none"
                  />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Documents</h3>
                {['Business License', 'ID Verification', 'Tax Certificate'].map((doc) => (
                  <div key={doc} className="border-2 border-dashed border-ds-border rounded-lg p-6 text-center hover:border-ds-primary transition-colors cursor-pointer">
                    <svg className="w-8 h-8 mx-auto text-ds-muted-foreground mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm font-medium text-ds-foreground">{doc}</p>
                    <p className="text-xs text-ds-muted-foreground mt-1">Click to upload or drag and drop</p>
                  </div>
                ))}
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-ds-foreground mb-4">Review & Submit</h3>
                <div className="space-y-3">
                  {['Business Info', 'Contact Details', 'Documents'].map((section, i) => (
                    <div key={section} className="flex items-center justify-between p-3 bg-ds-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-ds-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium text-ds-foreground">{section}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep(i)}
                        className="text-xs text-ds-primary hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex items-start gap-2 mt-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 accent-ds-primary"
                  />
                  <span className="text-sm text-ds-muted-foreground">
                    I agree to the{' '}
                    <a href={termsUrl} className="text-ds-primary hover:underline">
                      Terms and Conditions
                    </a>{' '}
                    and Vendor Agreement
                  </span>
                </label>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                disabled={activeStep === 0}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  activeStep === 0
                    ? 'text-ds-muted-foreground cursor-not-allowed'
                    : 'border border-ds-border text-ds-foreground hover:bg-ds-muted'
                }`}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                className="px-6 py-2.5 rounded-lg bg-ds-primary text-ds-primary-foreground text-sm font-semibold hover:bg-ds-primary/90 transition-colors"
              >
                {activeStep === steps.length - 1 ? 'Submit Application' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
