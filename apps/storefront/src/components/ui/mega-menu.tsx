"use client"

import { t } from "@/lib/i18n"
import { clsx } from "clsx"
import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"

export interface MegaMenuGroup {
  title: string
  items: { label: string; href: string; icon?: string }[]
}

export interface MegaMenuProps {
  groups: MegaMenuGroup[]
  featured?: { title: string; image: string; href: string; description?: string }
  locale: string
}

export function MegaMenu({ groups, featured, locale }: MegaMenuProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState<Record<string, boolean>>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (
        open &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    },
    [open]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, handleClickOutside])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      return () => document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const toggleMobileGroup = (title: string) => {
    setMobileOpen((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  const desktopDropdown = mounted && open ? (
    createPortal(
      <div
        ref={dropdownRef}
        className="fixed inset-x-0 top-16 z-50 bg-ds-background border-b border-ds-border shadow-lg"
        role="menu"
        aria-label={t(locale, "megaMenu.navigation")}
      >
        <div className="content-container py-8">
          <div className="flex gap-8">
            <div className="flex-1 grid grid-cols-3 gap-8">
              {groups.map((group) => (
                <div key={group.title} className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-ds-foreground uppercase tracking-wider">
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-1" role="group" aria-label={group.title}>
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          className="flex items-center gap-2 py-1.5 text-sm text-ds-muted-foreground hover:text-ds-foreground transition-colors"
                          onClick={() => setOpen(false)}
                        >
                          {item.icon && (
                            <span className="text-base" aria-hidden="true">
                              {item.icon}
                            </span>
                          )}
                          {item.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {featured && (
              <div className="w-64 flex-shrink-0">
                <a
                  href={featured.href}
                  className="block group"
                  onClick={() => setOpen(false)}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-ds-muted rounded">
                    <img
                      src={featured.image}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="mt-3 text-sm font-semibold text-ds-foreground group-hover:text-ds-primary transition-colors">
                    {featured.title}
                  </h4>
                  {featured.description && (
                    <p className="mt-1 text-xs text-ds-muted-foreground line-clamp-2">
                      {featured.description}
                    </p>
                  )}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>,
      document.body
    )
  ) : null

  return (
    <>
      <div className="hidden lg:block">
        <button
          ref={triggerRef}
          onClick={() => setOpen((prev) => !prev)}
          onMouseEnter={() => setOpen(true)}
          className={clsx(
            "flex items-center gap-1 h-full text-sm font-medium transition-colors select-none",
            open ? "text-ds-foreground" : "text-ds-muted-foreground hover:text-ds-foreground"
          )}
          aria-expanded={open}
          aria-haspopup="true"
        >
          {t(locale, "megaMenu.menu")}
          <svg
            className={clsx(
              "w-3 h-3 ms-0.5 transition-transform duration-200",
              open && "rotate-180"
            )}
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {desktopDropdown}
      </div>

      <div className="lg:hidden">
        <nav aria-label={t(locale, "megaMenu.navigation")}>
          {groups.map((group) => (
            <div key={group.title} className="border-b border-ds-border">
              <button
                onClick={() => toggleMobileGroup(group.title)}
                className="w-full flex items-center justify-between px-4 py-3 text-ds-foreground text-base font-medium text-start"
                aria-expanded={!!mobileOpen[group.title]}
              >
                {group.title}
                <svg
                  className={clsx(
                    "w-4 h-4 transition-transform duration-200",
                    mobileOpen[group.title] && "rotate-180"
                  )}
                  viewBox="0 0 12 12"
                  fill="none"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {mobileOpen[group.title] && (
                <ul className="pb-2">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        className="flex items-center gap-2 ps-8 pe-4 py-2 text-sm text-ds-muted-foreground hover:text-ds-foreground hover:bg-ds-muted transition-colors"
                      >
                        {item.icon && (
                          <span className="text-base" aria-hidden="true">
                            {item.icon}
                          </span>
                        )}
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {featured && (
            <div className="p-4">
              <a href={featured.href} className="block">
                <div className="aspect-[16/9] overflow-hidden bg-ds-muted rounded">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="mt-2 text-sm font-semibold text-ds-foreground">
                  {featured.title}
                </h4>
                {featured.description && (
                  <p className="mt-1 text-xs text-ds-muted-foreground">
                    {featured.description}
                  </p>
                )}
              </a>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}
