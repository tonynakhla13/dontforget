"use client";

import { useEffect } from "react";

export default function CreativeBodyOverflow() {
  useEffect(() => {
    const previousOverflowX = document.body.style.overflowX;
    document.body.style.overflowX = "hidden";

    return () => {
      document.body.style.overflowX = previousOverflowX;
    };
  }, []);

  return null;
}
