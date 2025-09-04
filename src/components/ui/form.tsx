import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
}

const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <form
        className={cn(className)}
        ref={ref}
        suppressHydrationWarning={true}
        {...props}
      >
        {children}
      </form>
    )
  }
)
Form.displayName = "Form"

export { Form }
