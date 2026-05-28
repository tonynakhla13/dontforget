"use client";

import { useEffect } from "react";

const OUTER_PATH =
  "M610.48,1.55c148.49-12.15,244.49,141.46,171.28,270.23-79.21,139.33-286.71,111.03-325.72-43.43C429.83,124.54,501.53,10.47,610.48,1.55Z";

const PUPIL_PATH =
  "M746.24,265.73c77.26-70.56,54.62-197.48-39.64-239.96-118.98-53.62-229.75,70.86-181.05,186.05,36.05,85.28,149.89,118.57,220.69,53.91Z";

const FRAME_MS = 120;
const LOOP_MS = 5000;

function interpolateKeyframes(time: number, keyframes: Array<[number, number]>) {
  const progress = ((time % LOOP_MS) + LOOP_MS) % LOOP_MS / LOOP_MS;

  for (let index = 0; index < keyframes.length - 1; index += 1) {
    const [fromAt, fromValue] = keyframes[index];
    const [toAt, toValue] = keyframes[index + 1];
    if (progress >= fromAt && progress <= toAt) {
      const local = (progress - fromAt) / (toAt - fromAt || 1);
      const eased = (1 - Math.cos(local * Math.PI)) / 2;
      return fromValue + (toValue - fromValue) * eased;
    }
  }

  return keyframes[0][1];
}

function makeIconHref(time: number, dark: boolean) {
  const outer = dark ? "#fff" : "#000";
  const pupil = dark ? "#000" : "#fff";
  const x = interpolateKeyframes(time, [
    [0, 0],
    [0.15, -48],
    [0.35, -48],
    [0.5, 0],
    [0.65, 48],
    [0.82, 48],
    [1, 0],
  ]);
  const y = interpolateKeyframes(time, [
    [0, 0],
    [0.5, 30],
    [0.82, -30],
    [0.92, 0],
    [1, 0],
  ]);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="420 0 390 362" fill="none"><defs><clipPath id="o"><path d="${OUTER_PATH}"/></clipPath></defs><path fill="${outer}" d="${OUTER_PATH}"/><g clip-path="url(#o)" transform="translate(${x.toFixed(2)} ${y.toFixed(2)})"><path fill="${pupil}" d="${PUPIL_PATH}"/></g></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getIconLink() {
  const existing = document.querySelector<HTMLLinkElement>('link[rel="icon"][type="image/svg+xml"]');
  if (existing) return existing;

  const link = document.createElement("link");
  link.rel = "icon";
  link.type = "image/svg+xml";
  link.sizes = "any";
  document.head.appendChild(link);
  return link;
}

export default function AnimatedFavicon() {
  useEffect(() => {
    const icon = getIconLink();
    const originalHref = icon.href || "/icon.svg";
    const darkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    let intervalId: number | undefined;
    let frame = 0;

    const render = () => {
      icon.href = makeIconHref(frame * FRAME_MS, darkScheme.matches);
      frame += 1;
    };

    const start = () => {
      if (intervalId || document.hidden) return;
      render();
      intervalId = window.setInterval(render, FRAME_MS);
    };

    const stop = () => {
      if (!intervalId) return;
      window.clearInterval(intervalId);
      intervalId = undefined;
    };

    const handleVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    darkScheme.addEventListener("change", render);
    document.addEventListener("visibilitychange", handleVisibility);
    start();

    return () => {
      stop();
      darkScheme.removeEventListener("change", render);
      document.removeEventListener("visibilitychange", handleVisibility);
      icon.href = originalHref;
    };
  }, []);

  return null;
}
