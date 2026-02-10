import ErrorBoundary from "@/components/error-boundary"
import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/lib/context/cart"
import { ToastProvider } from "@/lib/context/toast-context"
import { useStoreTheme } from "@/lib/hooks/use-store-theme"
import { ThemeProvider } from "@dakkah-cityos/design-runtime"
import { Outlet } from "@tanstack/react-router"

const Layout = () => {
  if (typeof window === "undefined") {
    return (
      <div id="app-root" className="min-h-screen flex flex-col">
        <main className="relative flex-1">
          <Outlet />
        </main>
      </div>
    )
  }

  return <ClientLayout />
};

function ClientLayout() {
  useStoreTheme()
  
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
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default Layout;
