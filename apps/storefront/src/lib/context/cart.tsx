import { createContext, useContext, useState, ReactNode } from "react"

type CartContextType = {
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const defaultCartValue: CartContextType = {
  isOpen: false,
  openCart: () => {},
  closeCart: () => {},
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCartDrawer = () => {
  if (typeof window === "undefined") {
    return defaultCartValue
  }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const context = useContext(CartContext)
  if (!context) {
    return defaultCartValue
  }
  return context
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === "undefined") {
    return (
      <CartContext.Provider value={defaultCartValue}>
        {children}
      </CartContext.Provider>
    )
  }

  return <ClientCartProvider>{children}</ClientCartProvider>
}

const ClientCartProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider value={{ isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}
