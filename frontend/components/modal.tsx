"use client"

import type { ReactNode } from "react"

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" aria-hidden="true" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-[90%] max-w-lg rounded-lg border bg-background p-4"
      >
        {title && <div className="text-lg font-medium mb-2">{title}</div>}
        {children}
      </div>
    </div>
  )
}
