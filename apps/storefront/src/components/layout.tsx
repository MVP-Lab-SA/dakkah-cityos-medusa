import ErrorBoundary from "@/components/error-boundary"
import Footer from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { CartProvider } from "@/lib/context/cart"
import { ToastProvider } from "@/lib/context/toast-context"
import { useStoreTheme } from "@/lib/hooks/use-store-theme"
import { Outlet } from "@tanstack/react-router"

const Layout = () => {
  // Apply store-specific theme
  useStoreTheme()
  
  return (
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
  );
};

export default Layout;
