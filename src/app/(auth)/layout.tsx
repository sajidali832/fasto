import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background">
       <ClerkLoaded>
        {children}
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </ClerkLoading>
    </div>
  );
}
