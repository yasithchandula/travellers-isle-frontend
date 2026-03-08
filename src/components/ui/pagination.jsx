import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

/* ===============================
   ROOT
================================ */
export function Pagination({ className, ...props }) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

/* ===============================
   CONTENT
================================ */
export const PaginationContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
)
PaginationContent.displayName = "PaginationContent"

/* ===============================
   ITEM
================================ */
export const PaginationItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn(className)} {...props} />
  )
)
PaginationItem.displayName = "PaginationItem"

/* ===============================
   LINK
================================ */
export function PaginationLink({
  className,
  isActive,
  size = "icon",
  disabled = false,
  ...props
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium",
        "h-9 min-w-9 px-3 rounded-xl",
        "transition-all duration-150",
        isActive
          ? "bg-muted border border-border shadow-sm"
          : "hover:bg-muted/60",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      {...props}
    />
  )
}

export function PaginationPrevious({ className, ...props }) {
  return (
    <PaginationLink
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
      Previous
    </PaginationLink>
  )
}

export function PaginationNext({ className, ...props }) {
  return (
    <PaginationLink
      size="default"
      className={cn("gap-1 px-2.5", className)}
      {...props}
    >
      Next
      <ChevronRight className="h-4 w-4" />
    </PaginationLink>
  )
}


/* ===============================
   ELLIPSIS
================================ */
export function PaginationEllipsis({ className, ...props }) {
  return (
    <span
      aria-hidden
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="h-4 w-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

/* ===============================
   PAGE NUMBER GENERATOR
================================ */
export function generatePages(current, total) {
  const pages = []

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)

  if (current > 3) pages.push("...")

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)

  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push("...")

  pages.push(total)

  return pages
}
