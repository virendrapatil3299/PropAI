"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

<<<<<<< HEAD
import { cn } from "../../lib/utils"
=======
import { cn } from "@/lib/utils"
>>>>>>> 2914fb91c67f6175371b759a2bfabc474be8ba3b

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
