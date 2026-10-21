import Image from "next/image";
import { cn } from "@/lib/cn";

export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/patches-mark.png"
      width={180}
      height={198}
      alt=""
      className={cn("patches-logo-mark shrink-0 object-contain", className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark className="h-7 w-7" />
      <span className="patches-wordmark">PATCHES</span>
    </span>
  );
}
