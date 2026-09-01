import type { ReactNode } from "react";
import ImmersiveFooter from "@/components/immersive/ImmersiveFooter";
import ImmersiveBlobField from "@/components/immersive/ImmersiveBlobField";

/**
 * Shared chrome for every immersive route. Immersive pages bring their own
 * fixed background + navbar, so this wrapper only appends the global footer
 * once, after the page content.
 *
 * GLOBAL_BLOB_BACKGROUND — experimental ambient "blob" particle field rendered
 * behind every immersive page. Flip to `false` to remove it everywhere in one
 * line (this is the whole revert).
 */
const GLOBAL_BLOB_BACKGROUND = true;

export default function ImmersiveThemeLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {GLOBAL_BLOB_BACKGROUND && <ImmersiveBlobField opacity={0.3} />}
      {children}
      <ImmersiveFooter />
    </>
  );
}
