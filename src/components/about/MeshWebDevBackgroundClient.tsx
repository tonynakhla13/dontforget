"use client";

import dynamic from "next/dynamic";

const MeshWebDevBackground = dynamic(
  () => import("./MeshWebDevBackground"),
  { ssr: false }
);

export default function MeshWebDevBackgroundClient() {
  return <MeshWebDevBackground />;
}
