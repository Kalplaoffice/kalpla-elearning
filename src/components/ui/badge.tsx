import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF804B] focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#FF804B] text-white hover:bg-[#FF804B]/90 shadow-md",
        secondary:
          "border-transparent bg-[#2C4E41] text-white hover:bg-[#2C4E41]/90 shadow-md",
        destructive:
          "border-transparent bg-red-500 text-white hover:bg-red-600 shadow-md",
        outline: "border-[#2C4E41] text-[#2C4E41] hover:bg-[#2C4E41] hover:text-white",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600 shadow-md",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600 shadow-md",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
