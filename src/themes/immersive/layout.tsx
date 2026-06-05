import type { ReactNode } from "react";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";

/**
 * Shared chrome for every immersive route. Immersive pages bring their own
 * fixed background + navbar, so this wrapper only appends the global footer
 * once, after the page content.
 */
export default function ImmersiveThemeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ImmersiveFooter />
    </>
  );
}
