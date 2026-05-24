"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

const CONFIG = {
  background: "#020807",
  green: "#3CBE8B",
  greenSoft: "#2F9A71",
  cream: "#F4EFE4",
  gridSize: 17,
  cellSize: 0.22,
  maxSnakeLength: 64,
  initialSnakeLength: 13,
  stepInterval: 0.15,
  snakeHeight: 0.06,
  particleCount: 1400,
  starCount: 700,
  autoRestartDelay: 2.4,
};

type Cell = { x: number; y: number };
type Direction = { x: number; y: number };
type SnakeState = {
  body: Cell[];
  direction: Direction;
  food: Cell;
  score: number;
  accumulator: number;
  lastEatTime: number;
  turnPreference: number;
  gameOver: boolean;
  gameOverTime: number;
  forcedCrashAtScore: number;
};

const DIRECTIONS: Direction[] = [
  { x: 1, y: 0 }, { x: -1, y: 0 },
  { x: 0, y: 1 }, { x: 0, y: -1 },
];

function randomBetween(min: number, max: number) { return min + Math.random() * (max - min); }
function boardHalf() { return Math.floor(CONFIG.gridSize / 2); }
function isInsideBoard(c: Cell) { const h = boardHalf(); return c.x >= -h && c.x <= h && c.y >= -h && c.y <= h; }
function cellKey(c: Cell) { return `${c.x}:${c.y}`; }
function cellToWorld(c: Cell): [number, number, number] { return [c.x * CONFIG.cellSize, CONFIG.snakeHeight, c.y * CONFIG.cellSize]; }
function cellsEqual(a: Cell, b: Cell) { return a.x === b.x && a.y === b.y; }
function isOpposite(a: Direction, b: Direction) { return a.x + b.x === 0 && a.y + b.y === 0; }
function manhattan(a: Cell, b: Cell) { return Math.abs(a.x - b.x) + Math.abs(a.y - b.y); }
function nextCell(h: Cell, d: Direction): Cell { return { x: h.x + d.x, y: h.y + d.y }; }

function randomFood(body: Cell[]): Cell {
  const half = boardHalf();
  const occ = new Set(body.map(cellKey));
  for (let i = 0; i < 160; i++) {
    const f = { x: Math.floor(randomBetween(-half, half + 1)), y: Math.floor(randomBetween(-half, half + 1)) };
    if (!occ.has(cellKey(f))) return f;
  }
  return { x: half, y: -half };
}

function createInitialSnake(): SnakeState {
  const body: Cell[] = Array.from({ length: CONFIG.initialSnakeLength }, (_, i) => ({ x: -i + 2, y: 0 }));
  return { body, direction: { x: 1, y: 0 }, food: randomFood(body), score: 0, accumulator: 0, lastEatTime: 0, turnPreference: 1, gameOver: false, gameOverTime: 0, forcedCrashAtScore: 6 };
}

function collidesWithSelf(cell: Cell, body: Cell[], includeTail: boolean) {
  return (includeTail ? body : body.slice(0, -1)).some(s => cellsEqual(s, cell));
}

function chooseDirection(state: SnakeState) {
  const head = state.body[0];
  const occ = new Set(state.body.slice(0, -1).map(cellKey));
  const valid = DIRECTIONS.filter(d => !isOpposite(d, state.direction) && isInsideBoard(nextCell(head, d)) && !occ.has(cellKey(nextCell(head, d))));
  if (!valid.length) return null;

  const shouldRisk = state.score >= state.forcedCrashAtScore && Math.sin(state.score * 1.7 + state.body.length) > 0.15;
  if (shouldRisk) {
    const risky = DIRECTIONS.filter(d => !isOpposite(d, state.direction) && (!isInsideBoard(nextCell(head, d)) || occ.has(cellKey(nextCell(head, d)))));
    if (risky.length) return risky[0];
  }

  return valid.map(d => {
    const n = nextCell(head, d);
    return {
      d,
      score: manhattan(n, state.food)
        + (d.x === state.direction.x && d.y === state.direction.y ? -0.2 : 0)
        + (Math.abs(n.x) + Math.abs(n.y)) * 0.012
        + Math.sin((state.score + n.x * 3.1 + n.y * 4.7) * 0.41) * 0.1 * state.turnPreference,
    };
  }).sort((a, b) => a.score - b.score)[0].d;
}

function markGameOver(state: SnakeState, t: number) { state.gameOver = true; state.gameOverTime = t; state.accumulator = 0; }

function stepSnake(state: SnakeState, t: number) {
  if (state.gameOver) return;
  const dir = chooseDirection(state);
  if (!dir) { markGameOver(state, t); return; }
  const head = nextCell(state.body[0], dir);
  const ate = cellsEqual(head, state.food);
  if (!isInsideBoard(head)) { state.direction = dir; markGameOver(state, t); return; }
  if (collidesWithSelf(head, state.body, ate)) { state.direction = dir; markGameOver(state, t); return; }
  const body = [head, ...state.body];
  if (!ate) body.pop();
  if (body.length > CONFIG.maxSnakeLength) body.length = CONFIG.maxSnakeLength;
  state.body = body; state.direction = dir;
  if (ate) { state.score++; state.food = randomFood(body); state.lastEatTime = t; state.turnPreference *= -1; }
}

function makeBoxLinePositions() {
  const half = boardHalf();
  const e = (half + 0.5) * CONFIG.cellSize, h = 0.01;
  return new Float32Array([-e,h,-e, e,h,-e, e,h,-e, e,h,e, e,h,e, -e,h,e, -e,h,e, -e,h,-e]);
}

function makeGridLinePositions() {
  const half = boardHalf(), ext = half * CONFIG.cellSize, vals: number[] = [];
  for (let i = -half; i <= half; i++) {
    const p = i * CONFIG.cellSize;
    vals.push(-ext,0,p, ext,0,p, p,0,-ext, p,0,ext);
  }
  return new Float32Array(vals);
}

function makeGridNodePositions() {
  const half = boardHalf(), vals: number[] = [];
  for (let x = -half; x <= half; x++)
    for (let y = -half; y <= half; y++)
      vals.push(x*CONFIG.cellSize, 0.012, y*CONFIG.cellSize);
  return new Float32Array(vals);
}

function makeStarPositions(count: number) {
  const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) { p[i*3]=randomBetween(-4.5,4.5); p[i*3+1]=randomBetween(-2.2,2.2); p[i*3+2]=randomBetween(-3.8,-1.2); }
  return p;
}

function makeAmbientParticlePositions(count: number) {
  const p = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.sqrt(Math.random()) * 2.3, a = Math.random() * Math.PI * 2;
    p[i*3]=Math.cos(a)*r+randomBetween(-0.2,0.8); p[i*3+1]=randomBetween(-0.12,0.9); p[i*3+2]=Math.sin(a)*r*0.75;
  }
  return p;
}

function makeFoodParticlePositions() {
  const p = new Float32Array(180 * 3);
  for (let i = 0; i < 180; i++) {
    const r = randomBetween(0.03, 0.27), theta = Math.random()*Math.PI*2, phi = Math.random()*Math.PI;
    p[i*3]=r*Math.sin(phi)*Math.cos(theta); p[i*3+1]=r*Math.sin(phi)*Math.sin(theta); p[i*3+2]=r*Math.cos(phi);
  }
  return p;
}

function BoxedMeshGrid() {
  const groupRef = useRef<THREE.Group>(null);
  const linePos  = useMemo(() => makeGridLinePositions(), []);
  const nodePos  = useMemo(() => makeGridNodePositions(), []);
  const boxPos   = useMemo(() => makeBoxLinePositions(), []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    groupRef.current.rotation.y = Math.sin(t * 0.13) * 0.08;
    groupRef.current.position.y = Math.sin(t * 0.35) * 0.018;
  });

  return (
    <group ref={groupRef} position={[2.6, 0, 0]} rotation={[-1.45, 0, 0]} scale={1.5}>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[linePos, 3]} /></bufferGeometry>
        <lineBasicMaterial color={CONFIG.greenSoft} transparent opacity={0.21} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[boxPos, 3]} /></bufferGeometry>
        <lineBasicMaterial color={CONFIG.green} transparent opacity={0.85} depthWrite={false} blending={THREE.AdditiveBlending} />
      </lineSegments>
      {([ [-1,-1],[1,-1],[1,1],[-1,1] ] as [number,number][]).map(([x,y], i) => {
        const e = (boardHalf() + 0.5) * CONFIG.cellSize;
        return (
          <mesh key={i} position={[x*e, 0.02, y*e]}>
            <sphereGeometry args={[0.045, 12, 12]} />
            <meshBasicMaterial color={CONFIG.green} transparent opacity={0.66} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
      <points>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[nodePos, 3]} /></bufferGeometry>
        <pointsMaterial color={CONFIG.green} size={0.016} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

function SnakeGameMesh({ onGameOver, resetKey }: { onGameOver: () => void; resetKey: number }) {
  const groupRef         = useRef<THREE.Group>(null);
  const snakeMeshRef     = useRef<THREE.InstancedMesh>(null);
  const glowMeshRef      = useRef<THREE.InstancedMesh>(null);
  const foodRef          = useRef<THREE.Group>(null);
  const foodParticlesRef = useRef<THREE.Points>(null);
  const trailRef         = useRef<THREE.Points>(null);
  const stateRef         = useRef<SnakeState>(createInitialSnake());
  const notifiedRef      = useRef(false);

  const tempMatrix     = useMemo(() => new THREE.Matrix4(), []);
  const tempPosition   = useMemo(() => new THREE.Vector3(), []);
  const tempQuaternion = useMemo(() => new THREE.Quaternion(), []);
  const tempScale      = useMemo(() => new THREE.Vector3(), []);
  const foodParticlePos = useMemo(() => makeFoodParticlePositions(), []);
  const trailPos        = useMemo(() => new Float32Array(CONFIG.maxSnakeLength * 3), []);

  useMemo(() => { stateRef.current = createInitialSnake(); notifiedRef.current = false; return null; }, [resetKey]);

  useFrame(({ clock }, delta) => {
    const state = stateRef.current;
    const time  = clock.elapsedTime;

    if (!state.gameOver) {
      state.accumulator += delta;
      while (state.accumulator >= CONFIG.stepInterval) { stepSnake(state, time); state.accumulator -= CONFIG.stepInterval; }
    }

    if (state.gameOver && !notifiedRef.current) { notifiedRef.current = true; onGameOver(); }

    if (groupRef.current) {
      const shake = state.gameOver ? Math.sin(time * 34) * 0.018 : 0;
      groupRef.current.rotation.y = Math.sin(time * 0.16) * 0.08 + shake;
      groupRef.current.position.y = Math.sin(time * 0.38) * 0.025;
    }

    const snake = snakeMeshRef.current, glow = glowMeshRef.current, body = state.body;
    const interp = state.gameOver ? 1 : THREE.MathUtils.clamp(state.accumulator / CONFIG.stepInterval, 0, 1);

    if (snake && glow) {
      for (let i = 0; i < CONFIG.maxSnakeLength; i++) {
        if (i < body.length) {
          const cur = body[i], prev = body[i+1] ?? cur;
          const cw = cellToWorld(cur), pw = cellToWorld(prev);
          const sx = THREE.MathUtils.lerp(pw[0], cw[0], interp);
          const sy = CONFIG.snakeHeight + Math.sin(time*3.2+i*0.55)*0.011;
          const sz = THREE.MathUtils.lerp(pw[2], cw[2], interp);
          const size = THREE.MathUtils.lerp(0.18, 0.095, i/CONFIG.maxSnakeLength);
          const hb = i===0 ? 1.4+Math.sin(time*5.2)*0.08 : 1;
          const gop = state.gameOver ? 1+Math.sin(time*18+i)*0.08 : 1;
          tempPosition.set(sx,sy,sz); tempQuaternion.identity();
          tempScale.setScalar(size*hb*gop); tempMatrix.compose(tempPosition,tempQuaternion,tempScale); snake.setMatrixAt(i,tempMatrix);
          tempScale.setScalar(size*hb*1.65*gop); tempMatrix.compose(tempPosition,tempQuaternion,tempScale); glow.setMatrixAt(i,tempMatrix);
          trailPos[i*3]=sx; trailPos[i*3+1]=sy+0.02; trailPos[i*3+2]=sz;
        } else {
          tempPosition.set(999,999,999); tempQuaternion.identity(); tempScale.setScalar(0.0001);
          tempMatrix.compose(tempPosition,tempQuaternion,tempScale);
          snake.setMatrixAt(i,tempMatrix); glow.setMatrixAt(i,tempMatrix);
          trailPos[i*3]=trailPos[i*3+1]=trailPos[i*3+2]=999;
        }
      }
      snake.instanceMatrix.needsUpdate = true; glow.instanceMatrix.needsUpdate = true;
    }

    if (trailRef.current) {
      (trailRef.current.geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;
      trailRef.current.rotation.y = Math.sin(time*0.13)*0.02;
    }
    if (foodRef.current) {
      const fw = cellToWorld(state.food);
      const eatPulse = Math.max(0,1-(time-state.lastEatTime)*2.7);
      const pulse    = 0.5+0.5*Math.sin(time*4.2);
      foodRef.current.position.set(fw[0],CONFIG.snakeHeight+0.03,fw[2]);
      foodRef.current.rotation.y += delta*1.4;
      foodRef.current.rotation.x  = Math.sin(time*0.8)*0.35;
      foodRef.current.scale.setScalar(1+pulse*0.18+eatPulse*0.9);
    }
    if (foodParticlesRef.current) { foodParticlesRef.current.rotation.y+=delta*1.8; foodParticlesRef.current.rotation.x=Math.sin(time*0.7)*0.35; }
  });

  return (
    <group ref={groupRef} position={[2.6, 0, 0]} rotation={[-1.45, 0, 0]} scale={[1.5,1.5,1.5]}>
      <instancedMesh ref={glowMeshRef} args={[undefined,undefined,CONFIG.maxSnakeLength]}>
        <sphereGeometry args={[0.5,12,12]} />
        <meshBasicMaterial color={CONFIG.green} transparent opacity={0.07} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <instancedMesh ref={snakeMeshRef} args={[undefined,undefined,CONFIG.maxSnakeLength]}>
        <sphereGeometry args={[0.5,14,14]} />
        <meshBasicMaterial color={CONFIG.green} wireframe transparent opacity={0.78} depthWrite={false} blending={THREE.AdditiveBlending} />
      </instancedMesh>
      <points ref={trailRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[trailPos, 3]} /></bufferGeometry>
        <pointsMaterial color={CONFIG.green} size={0.022} transparent opacity={0.56} depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <group ref={foodRef}>
        <pointLight color={CONFIG.green} intensity={3.2} distance={2.2} decay={2} />
        <mesh><sphereGeometry args={[0.09,16,16]} /><meshBasicMaterial color={CONFIG.cream} transparent opacity={0.95} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
        <mesh scale={1.9}><sphereGeometry args={[0.09,14,14]} /><meshBasicMaterial color={CONFIG.green} transparent opacity={0.16} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
        <mesh scale={2.3}><sphereGeometry args={[0.09,12,12]} /><meshBasicMaterial color={CONFIG.green} wireframe transparent opacity={0.42} depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
        <points ref={foodParticlesRef}>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[foodParticlePos, 3]} /></bufferGeometry>
          <pointsMaterial color={CONFIG.green} size={0.014} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
      </group>
    </group>
  );
}

function AmbientParticles() {
  const ref = useRef<THREE.Points>(null);
  const pos = useMemo(() => makeAmbientParticlePositions(CONFIG.particleCount), []);
  useFrame(({ clock }) => { if (!ref.current) return; const t=clock.elapsedTime; ref.current.rotation.y=Math.sin(t*0.11)*0.16; ref.current.rotation.x=Math.cos(t*0.08)*0.08; });
  return (
    <points ref={ref} position={[2.6, 0.2, -0.5]}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial color={CONFIG.green} size={0.009} transparent opacity={0.46} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function BackgroundStars() {
  const pos = useMemo(() => makeStarPositions(CONFIG.starCount), []);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial color={CONFIG.greenSoft} size={0.006} transparent opacity={0.25} depthWrite={false} />
    </points>
  );
}

function FloatingHudMarks() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => { if (!ref.current) return; const t=clock.elapsedTime; ref.current.position.y=Math.sin(t*0.7)*0.025; ref.current.rotation.z=Math.sin(t*0.35)*0.025; });
  return (
    <group ref={ref} position={[4.5, 0.8, 0.4]} rotation={[0,-0.28,0]}>
      {Array.from({length:6},(_,i)=>(
        <mesh key={i} position={[0,-i*0.07,0]}>
          <boxGeometry args={[0.38-i*0.035,0.008,0.008]} />
          <meshBasicMaterial color={CONFIG.green} transparent opacity={0.18} depthWrite={false} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function Scene({
  onGameOver,
  resetKey,
  mouseRef,
}: {
  onGameOver: () => void;
  resetKey: number;
  mouseRef: React.RefObject<{ x: number; y: number }>;
}) {
  const wrapRef  = useRef<THREE.Group>(null);
  const smoothed = useRef({ rx: 0, ry: 0 });

  useFrame(() => {
    const m = mouseRef.current ?? { x: 0, y: 0 };
    // "move away": rotate OPPOSITE to where cursor is
    const tRY = -m.x * 0.28;
    const tRX =  m.y * 0.18;
    smoothed.current.rx = THREE.MathUtils.lerp(smoothed.current.rx, tRX, 0.055);
    smoothed.current.ry = THREE.MathUtils.lerp(smoothed.current.ry, tRY, 0.055);
    if (wrapRef.current) {
      wrapRef.current.rotation.x = smoothed.current.rx;
      wrapRef.current.rotation.y = smoothed.current.ry;
    }
  });

  return (
    <>
      <color attach="background" args={[CONFIG.background]} />
      <fog attach="fog" args={[CONFIG.background, 4.0, 12.0]} />
      <BackgroundStars />
      <AmbientParticles />
      {/* This group reacts to the mouse — everything inside tilts away from the cursor */}
      <group ref={wrapRef}>
        <BoxedMeshGrid />
        <SnakeGameMesh onGameOver={onGameOver} resetKey={resetKey} />
        <FloatingHudMarks />
      </group>
    </>
  );
}

export default function MeshWebDevBackground() {
  const [gameOverVisible, setGameOverVisible] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = {
      x:  (e.clientX / window.innerWidth)  * 2 - 1,
      y: -((e.clientY / window.innerHeight) * 2 - 1),
    };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, [onMouseMove]);

  function handleGameOver() {
    setGameOverVisible(true);
    window.setTimeout(() => { setGameOverVisible(false); setResetKey(k => k + 1); }, CONFIG.autoRestartDelay * 1000);
  }

  return (
    // absolute so the fixed parent wrapper in MeshWebDevBackgroundClient controls position
    <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundColor: CONFIG.background }}>
      <Canvas camera={{ position: [0, 0.5, 7.5], fov: 52 }} dpr={[1,1.65]} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}>
        <Suspense fallback={null}>
          <AdaptiveDpr pixelated />
          <Scene onGameOver={handleGameOver} resetKey={resetKey} mouseRef={mouseRef} />
        </Suspense>
      </Canvas>

      {gameOverVisible && (
        <div className="absolute right-[14%] top-[43%] -translate-y-1/2 rounded-2xl border px-6 py-4 text-center backdrop-blur-sm"
          style={{ borderColor:"rgba(60,190,139,0.55)", background:"rgba(2,8,7,0.54)", boxShadow:"0 0 44px rgba(60,190,139,0.25)" }}>
          <div className="text-xs uppercase tracking-[0.45em]" style={{ color:"rgba(244,239,228,0.62)" }}>Snake crashed</div>
          <div className="mt-2 text-4xl font-black uppercase tracking-[0.1em]" style={{ color:CONFIG.green, textShadow:"0 0 24px rgba(60,190,139,0.55)" }}>Game Over</div>
        </div>
      )}

      <div className="absolute inset-0" style={{ background:"radial-gradient(circle at 70% 42%, rgba(60,190,139,0.22), transparent 36%)" }} />
      <div className="absolute inset-0" style={{ background:"radial-gradient(circle at 5% 8%, rgba(60,190,139,0.06), transparent 18%)" }} />
      {/* Strong left-to-right gradient keeps the text area clean */}
      <div className="absolute inset-0" style={{ background:"linear-gradient(90deg, rgba(0,0,0,0.97) 0%, rgba(0,0,0,0.88) 32%, rgba(0,0,0,0.42) 50%, rgba(0,0,0,0) 60%)" }} />
      <div className="absolute inset-0" style={{ background:"linear-gradient(180deg, transparent, rgba(0,0,0,0.05), rgba(0,0,0,0.58))" }} />
    </div>
  );
}
