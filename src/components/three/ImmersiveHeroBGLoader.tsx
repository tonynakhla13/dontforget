"use client";

import dynamic from "next/dynamic";

const ImmersiveHeroBG = dynamic(() => import("./ImmersiveHeroBG"), {
  ssr: false,
  loading: () => null,
});

export default ImmersiveHeroBG;
