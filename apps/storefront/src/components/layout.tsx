import ErrorBoundary from "@/components/error-boundary"
import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import CookieConsentBanner from "@/components/consent/cookie-consent-banner"
import { CartProvider } from "@/lib/context/cart"
import { ToastProvider } from "@/lib/context/toast-context"
import { useStoreTheme } from "@/lib/hooks/use-store-theme"
import { ThemeProvider } from "@dakkah-cityos/design-runtime"
import { Outlet, useLocation } from "@tanstack/react-router"

const Layout = () => {
  useStoreTheme()
  const location = useLocation()
  const isManagePage = /\/[^/]+\/[^/]+\/manage(\/|$)/.test(location.pathname)

  if (isManagePage) {
    return (
      <ThemeProvider>
        <ToastProvider>
          <CartProvider>
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </CartProvider>
        </ToastProvider>
      </ThemeProvider>
    )
  }

  const localeMatch = location.pathname.match(/^\/[^/]+\/([^/]+)/)
  const currentLocale = localeMatch ? localeMatch[1] : "en"

  return (
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />

            <main className="relative flex-1">
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </main>

            <Footer />
          </div>
          <CookieConsentBanner locale={currentLocale} />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default Layout;
