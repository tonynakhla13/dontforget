"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type ServicePipeShape =
  | "web-development"
  | "ui-ux"
  | "e-commerce"
  | "mobile-apps"
  | "seo"
  | "crm-systems";

type StrokeSpec = {
  points: THREE.Vector3[];
  radius?: number;
  bright?: boolean;
  closed?: boolean;
};

type ServicePipeCardHologramProps = {
  shape: ServicePipeShape;
};

const PIPE_GREEN = 0x46d12a;
const PIPE_GREEN_DEEP = 0x46ae22;
const PIPE_GREEN_BRIGHT = 0x7cff5f;

function v(x: number, y: number, z = 0) {
  return new THREE.Vector3(x, y, z);
}

function makeStroke(points: THREE.Vector3[], radius: number, material: THREE.Material, closed = false) {
  const curve = new THREE.CatmullRomCurve3(points, closed, "catmullrom", 0.12);
  const tube = new THREE.TubeGeometry(curve, 96, radius, 12, closed);
  const wireGeometry = new THREE.WireframeGeometry(tube);
  const wire = new THREE.LineSegments(wireGeometry, material);

  tube.dispose();

  return wire;
}

function makeMaterial(color: number, opacity: number) {
  return new THREE.LineBasicMaterial({
    color,
    transparent: true,
    opacity,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
}

function roundedRectPoints(width: number, height: number, radius: number, z = 0, steps = 5) {
  const hw = width / 2;
  const hh = height / 2;
  const pts: THREE.Vector3[] = [];
  const corners = [
    { cx: hw - radius, cy: hh - radius, a0: 0, a1: Math.PI / 2 },
    { cx: -hw + radius, cy: hh - radius, a0: Math.PI / 2, a1: Math.PI },
    { cx: -hw + radius, cy: -hh + radius, a0: Math.PI, a1: Math.PI * 1.5 },
    { cx: hw - radius, cy: -hh + radius, a0: Math.PI * 1.5, a1: Math.PI * 2 },
  ];

  for (const corner of corners) {
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const a = corner.a0 + (corner.a1 - corner.a0) * t;
      pts.push(v(corner.cx + Math.cos(a) * radius, corner.cy + Math.sin(a) * radius, z));
    }
  }

  return pts;
}

function circlePoints(cx: number, cy: number, radius: number, z = 0, count = 28) {
  return Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return v(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, z);
  });
}

function serviceStrokes(shape: ServicePipeShape): StrokeSpec[] {
  switch (shape) {
    case "web-development":
      return [
        { points: roundedRectPoints(4.25, 2.62, 0.32, -0.1), radius: 0.095, closed: true },
        { points: [v(-0.95, 0.72, 0.06), v(-1.55, 0.02, 0.16), v(-0.95, -0.72, 0.06)], radius: 0.18, bright: true },
        { points: [v(0.95, 0.72, 0.06), v(1.55, 0.02, 0.16), v(0.95, -0.72, 0.06)], radius: 0.18, bright: true },
        { points: [v(0.28, 0.82, 0.12), v(0.02, 0.05, 0.2), v(-0.32, -0.82, 0.12)], radius: 0.14 },
      ];
    case "ui-ux":
      return [
        { points: roundedRectPoints(2.28, 1.48, 0.16, 0.02).map(p => p.add(v(-0.88, 0.12, 0))), radius: 0.1, closed: true, bright: true },
        { points: roundedRectPoints(0.48, 0.24, 0.045, 0.1).map(p => p.add(v(-1.5, 0.56, 0))), radius: 0.034, closed: true },
        { points: roundedRectPoints(0.58, 0.24, 0.045, 0.12).map(p => p.add(v(-0.82, 0.56, 0))), radius: 0.034, closed: true },
        { points: roundedRectPoints(0.46, 0.24, 0.045, 0.1).map(p => p.add(v(-0.14, 0.56, 0))), radius: 0.034, closed: true },
        { points: roundedRectPoints(0.56, 0.26, 0.045, 0.12).map(p => p.add(v(-1.36, 0.08, 0))), radius: 0.036, closed: true },
        { points: roundedRectPoints(0.68, 0.26, 0.045, 0.14).map(p => p.add(v(-0.6, 0.08, 0))), radius: 0.036, closed: true },
        { points: roundedRectPoints(0.52, 0.26, 0.045, 0.12).map(p => p.add(v(-1.08, -0.36, 0))), radius: 0.036, closed: true },
        { points: roundedRectPoints(0.54, 0.26, 0.045, 0.12).map(p => p.add(v(-0.34, -0.36, 0))), radius: 0.036, closed: true },
        { points: roundedRectPoints(0.88, 1.78, 0.18, 0.04).map(p => p.add(v(1.18, 0.08, 0))), radius: 0.092, closed: true, bright: true },
        { points: roundedRectPoints(0.42, 0.22, 0.045, 0.1).map(p => p.add(v(1.18, 0.66, 0))), radius: 0.032, closed: true },
        { points: roundedRectPoints(0.42, 0.22, 0.045, 0.12).map(p => p.add(v(1.18, 0.24, 0))), radius: 0.032, closed: true },
        { points: roundedRectPoints(0.42, 0.22, 0.045, 0.1).map(p => p.add(v(1.18, -0.18, 0))), radius: 0.032, closed: true },
      ];
    case "e-commerce":
      return [
        { points: [v(-1.42, 0.86, 0.1), v(-1.1, 0.86, 0.14), v(-0.86, -0.72, 0.14), v(1.16, -0.72, 0.14)], radius: 0.08, bright: true },
        { points: [v(-0.86, 0.48, 0.12), v(1.3, 0.48, 0.18), v(1.08, -0.38, 0.2), v(-0.72, -0.38, 0.14)], radius: 0.09, bright: true },
        { points: [v(-0.68, 0.12, 0.18), v(1.18, 0.12, 0.2)], radius: 0.04 },
        { points: [v(-0.5, 0.44, 0.18), v(-0.4, -0.34, 0.18)], radius: 0.034 },
        { points: [v(0.12, 0.46, 0.2), v(0.08, -0.36, 0.2)], radius: 0.034 },
        { points: [v(0.72, 0.47, 0.2), v(0.58, -0.36, 0.2)], radius: 0.034 },
        { points: [v(-0.68, -0.98, 0.1), v(0.92, -0.98, 0.12)], radius: 0.045 },
        { points: circlePoints(-0.48, -1.2, 0.13, 0.16, 20), radius: 0.045, closed: true, bright: true },
        { points: circlePoints(0.82, -1.2, 0.13, 0.16, 20), radius: 0.045, closed: true, bright: true },
      ];
    case "mobile-apps":
      return [
        { points: roundedRectPoints(1.78, 3.14, 0.34, -0.08), radius: 0.115, closed: true, bright: true },
        { points: roundedRectPoints(1.28, 2.22, 0.18, 0.04), radius: 0.04, closed: true },
        { points: [v(-0.4, 0.7, 0.16), v(0.42, 0.7, 0.18)], radius: 0.04, bright: true },
        { points: [v(-0.4, 0.18, 0.16), v(0.42, 0.18, 0.18)], radius: 0.04 },
        { points: [v(-0.4, -0.34, 0.16), v(0.42, -0.34, 0.18)], radius: 0.04 },
        { points: [v(-0.24, -0.86, 0.16), v(0.24, -0.86, 0.18)], radius: 0.04, bright: true },
        { points: circlePoints(0, -1.25, 0.09, 0.14, 18), radius: 0.038, closed: true },
      ];
    case "seo":
      return [
        { points: circlePoints(-0.52, 0.34, 0.82, 0.06, 36), radius: 0.13, closed: true, bright: true },
        { points: [v(0.08, -0.24, 0.12), v(0.62, -0.78, 0.2), v(1.18, -1.28, 0.12)], radius: 0.14, bright: true },
        { points: [v(-1.68, -0.68, 0.04), v(-0.82, -0.42, 0.14), v(-0.08, -0.06, 0.18), v(0.62, 0.46, 0.16), v(1.52, 1.02, 0.08)], radius: 0.095 },
        { points: [v(1.14, 1.02, 0.14), v(1.55, 1.04, 0.16), v(1.34, 0.66, 0.12)], radius: 0.07 },
      ];
    case "crm-systems":
      return [
        { points: roundedRectPoints(3.18, 2.12, 0.18, 0.02), radius: 0.09, closed: true, bright: true },
        { points: [v(-0.92, 1, 0.1), v(-0.92, -1, 0.1)], radius: 0.035 },
        { points: [v(-0.62, 0.52, 0.14), v(1.22, 0.52, 0.16)], radius: 0.042, bright: true },
        { points: [v(-0.62, 0.02, 0.14), v(0.82, 0.02, 0.16)], radius: 0.04 },
        { points: [v(-0.62, -0.48, 0.14), v(1.08, -0.48, 0.16)], radius: 0.04 },
        { points: circlePoints(-1.32, 0.54, 0.08, 0.14, 16), radius: 0.03, closed: true },
        { points: circlePoints(-1.32, 0.02, 0.08, 0.14, 16), radius: 0.03, closed: true },
        { points: circlePoints(-1.32, -0.5, 0.08, 0.14, 16), radius: 0.03, closed: true },
        { points: [v(1.02, -0.48, 0.16), v(1.32, -0.12, 0.24), v(1.22, 0.52, 0.16)], radius: 0.04, bright: true },
      ];
  }
}

export function createServicePipeHologram(shape: ServicePipeShape) {
  const group = new THREE.Group();
  const material = makeMaterial(PIPE_GREEN, 0.064);
  const brightMaterial = makeMaterial(PIPE_GREEN_BRIGHT, 0.115);
  const echoMaterial = makeMaterial(PIPE_GREEN_DEEP, 0.03);
  const echoBrightMaterial = makeMaterial(PIPE_GREEN, 0.048);
  const echo = new THREE.Group();
  const main = new THREE.Group();

  echo.position.set(0.12, -0.1, -0.32);
  echo.scale.setScalar(1.035);

  for (const stroke of serviceStrokes(shape)) {
    const radius = stroke.radius ?? 0.12;
    main.add(makeStroke(stroke.points, radius, stroke.bright ? brightMaterial : material, stroke.closed ?? false));
    echo.add(makeStroke(stroke.points, radius * 1.05, stroke.bright ? echoBrightMaterial : echoMaterial, stroke.closed ?? false));
  }

  group.add(echo);
  group.add(main);
  group.rotation.set(-0.08, 0.16, -0.015);

  return group;
}

export function disposeServicePipeObject(object: THREE.Object3D) {
  object.traverse(child => {
    const mesh = child as THREE.LineSegments;
    mesh.geometry?.dispose();
    const material = mesh.material;
    if (Array.isArray(material)) {
      material.forEach(item => item.dispose());
    } else {
      material?.dispose();
    }
  });
}

export const servicePipeShapes: Record<string, ServicePipeShape> = {
  webdev: "web-development",
  uiux: "ui-ux",
  ecomm: "e-commerce",
  mobile: "mobile-apps",
  seo: "seo",
  crm: "crm-systems",
};

export default function ServicePipeCardHologram({ shape }: ServicePipeCardHologramProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, mount.clientWidth / mount.clientHeight, 0.1, 100);
    const group = createServicePipeHologram(shape);
    const pointer = new THREE.Vector2(0, 0);
    const target = new THREE.Vector2(0, 0);

    camera.position.set(0, 0, 8.7);
    group.scale.setScalar(1.22);
    scene.add(group);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      target.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      target.y = -((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onPointerLeave = () => target.set(0, 0);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);

    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const time = performance.now() * 0.001;
      pointer.lerp(target, 0.055);
      group.rotation.y = 0.16 + Math.sin(time * 0.16) * 0.05 + pointer.x * 0.12;
      group.rotation.x = -0.08 + Math.cos(time * 0.13) * 0.035 - pointer.y * 0.08;
      group.rotation.z = -0.015 + Math.sin(time * 0.11) * 0.02 + pointer.x * 0.02;
      group.position.x = pointer.x * 0.1;
      group.position.y = pointer.y * 0.08;
      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      scene.remove(group);
      disposeServicePipeObject(group);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [shape]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        ref={mountRef}
        className="absolute inset-0 opacity-90"
        style={{
          WebkitMaskImage: "radial-gradient(ellipse 88% 78% at 52% 48%, black 0%, black 64%, transparent 92%)",
          maskImage: "radial-gradient(ellipse 88% 78% at 52% 48%, black 0%, black 64%, transparent 92%)",
        }}
      />
    </div>
  );
}
