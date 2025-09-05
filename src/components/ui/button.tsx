import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF804B] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform hover:scale-105 active:scale-95",
  {
    variants: {
      variant: {
        default: "bg-[#FF804B] text-white hover:bg-[#FF804B]/90 shadow-lg hover:shadow-xl",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl",
        outline:
          "border-2 border-[#2C4E41] bg-transparent text-[#2C4E41] hover:bg-[#2C4E41] hover:text-white shadow-md hover:shadow-lg",
        secondary:
          "bg-[#2C4E41] text-white hover:bg-[#2C4E41]/90 shadow-lg hover:shadow-xl",
        ghost: "hover:bg-[#FF804B]/10 hover:text-[#FF804B] text-gray-700",
        link: "text-[#2C4E41] underline-offset-4 hover:underline hover:text-[#FF804B]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base font-semibold",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
