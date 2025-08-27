import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo({ className, ...props }: SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
       <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
        {...props}
      >
        <path
          d="M14 27.5C21.4558 27.5 27.5 21.4558 27.5 14C27.5 6.54416 21.4558 0.5 14 0.5C6.54416 0.5 0.5 6.54416 0.5 14C0.5 21.4558 6.54416 27.5 14 27.5Z"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
        <path
          d="M7.875 14H20.125"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
        <path
          d="M14 7.875V20.125"
          stroke="currentColor"
          strokeMiterlimit="10"
        />
      </svg>
      <span className="text-2xl font-bold tracking-tighter text-foreground" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        FASTO
      </span>
    </div>
  );
}
