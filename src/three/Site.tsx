import { useMemo } from "react";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { LEAF_GEOMETRY, TRUNK_GEOMETRY } from "./textures";

const CAMPUS_W = 168;
const CAMPUS_D = 118;
const TOP = 0.4;

type TreeSpec = [number, number, number, string?];

const TREES: TreeSpec[] = [
  [-79, -10, 1.05, "#5e855c"],
  [-79, 9, 0.9, "#6e9363"],
  [-78, 45, 1.15, "#557c58"],
  [-74, -38, 1.0, "#6c9164"],
  [-71, 47, 0.9, "#618a63"],
  [-31, -54, 0.95, "#5e835b"],
  [-46, -54, 0.85, "#6e9161"],
  [-4, -54, 1.1, "#5d835e"],
  [10, -54, 0.9, "#6d9468"],
  [22, -54, 1.0, "#5b7e59"],
  [45, -54, 0.85, "#5f855d"],
  [55, -54, 0.95, "#6d9063"],
  [44, 52, 1.0, "#5f865f"],
  [35, 53, 0.9, "#749869"],
  [25, 53, 0.95, "#5b815c"],
  [31, 54, 0.82, "#6d9467"],
  [-20, 54, 0.95, "#688e63"],
  [-58, 54, 1.0, "#5f825c"],
  [-69, 54, 0.85, "#6d9269"],
  [75, -18, 0.95, "#5a815d"],
  [76, -5, 1.0, "#698e61"],
  [76, 18, 0.9, "#557c5a"],
  [75, 31, 1.0, "#6c9167"],
  [76, 53, 0.9, "#5e845d"],
  [-36, -21, 0.95, "#6a8f63"],
  [-42, -27, 0.82, "#567e5d"],
  [-9, -25, 0.82, "#6b9063"],
  [14, -27, 0.9, "#5b815b"],
  [16, 17, 0.78, "#709768"],
  [-18, 26, 0.85, "#658b60"],
  [-23, 21, 1.0, "#577e5c"],
  [-9, 19, 0.78, "#6b9064"],
  [33.5, 31, 0.8, "#638c65"],
  [-68, 20, 1.0, "#5f875e"],
  [-58, 30, 0.95, "#72976c"],
  [-27, 31, 1.0, "#5e865b"],
  [-18, 40, 0.72, "#6d9465"],
  [20, 50, 0.8, "#5f885e"],
];

const SHRUBS: [number, number, number][] = [
  [-72, 26, 0.6],
  [-72, 31, 0.5],
  [9.5, -10.8, 0.6],
  [12.3, -11.2, 0.5],
  [16.2, 16.8, 0.45],
  [-24, 20.8, 0.45],
  [28, -29, 0.5],
  [-19, -28, 0.45],
  [46, 52, 0.55],
  [-60, 45, 0.5],
];

function Tree({
  x,
  z,
  scale = 1,
  tone = "#658b61",
}: {
  x: number;
  z: number;
  scale?: number;
  tone?: string;
}) {
  return (
    <group position={[x, TOP, z]} scale={scale}>
      <mesh geometry={TRUNK_GEOMETRY} position={[0, 0.95, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#846c52" roughness={1} />
      </mesh>
      <mesh geometry={LEAF_GEOMETRY} position={[0, 2.55, 0]} scale={[1.45, 1.25, 1.45]} castShadow>
        <meshStandardMaterial color={tone} roughness={0.95} />
      </mesh>
      <mesh
        geometry={LEAF_GEOMETRY}
        position={[-0.65, 2.05, 0.35]}
        scale={[0.82, 0.7, 0.82]}
        castShadow
      >
        <meshStandardMaterial color="#577c57" roughness={1} />
      </mesh>
      <mesh
        geometry={LEAF_GEOMETRY}
        position={[0.72, 2.2, -0.28]}
        scale={[0.76, 0.64, 0.76]}
        castShadow
      >
        <meshStandardMaterial color={tone} roughness={1} />
      </mesh>
    </group>
  );
}

function Shrub({ x, z, scale }: { x: number; z: number; scale: number }) {
  return (
    <mesh position={[x, TOP, z]} scale={[scale, scale * 0.72, scale]} castShadow>
      <icosahedronGeometry args={[0.8, 1]} />
      <meshStandardMaterial color="#668862" roughness={1} />
    </mesh>
  );
}

function WallSegment({
  x1,
  z1,
  x2,
  z2,
}: {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
}) {
  const horizontal = Math.abs(x2 - x1) > Math.abs(z2 - z1);
  const length = Math.hypot(x2 - x1, z2 - z1);
  const x = (x1 + x2) / 2;
  const z = (z1 + z2) / 2;
  return (
    <group position={[x, TOP, z]}>
      <mesh position={[0, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[horizontal ? length : 0.52, 1.1, horizontal ? 0.52 : length]} />
        <meshStandardMaterial color="#c7b9a4" roughness={0.96} />
      </mesh>
      <mesh position={[0, 1.13, 0]}>
        <boxGeometry args={[horizontal ? length : 0.68, 0.12, horizontal ? 0.68 : length]} />
        <meshStandardMaterial color="#a9987e" roughness={0.94} />
      </mesh>
      <mesh
        position={[horizontal ? 0 : 0.55, 0.68, horizontal ? 0.55 : 0]}
      >
        <boxGeometry args={[horizontal ? length : 0.45, 1.05, horizontal ? 0.45 : length]} />
        <meshStandardMaterial color="#778f68" roughness={1} />
      </mesh>
    </group>
  );
}

function Gate({
  x,
  z,
  label,
  axis,
}: {
  x: number;
  z: number;
  label: string;
  axis: "x" | "z";
}) {
  const offsets = axis === "x" ? [-4.1, 4.1] : [-4.1, 4.1];
  return (
    <group position={[x, TOP, z]}>
      {offsets.map((offset) => {
        const px = axis === "x" ? offset : 0;
        const pz = axis === "z" ? offset : 0;
        return (
          <group key={offset} position={[px, 0, pz]}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <boxGeometry args={[1.15, 2.4, 1.15]} />
              <meshStandardMaterial color="#d6c9b4" roughness={0.9} />
            </mesh>
            <mesh position={[0, 2.48, 0]} castShadow>
              <boxGeometry args={[1.3, 0.18, 1.3]} />
              <meshStandardMaterial color="#a66f5d" roughness={0.8} />
            </mesh>
            <mesh position={[0, 2.78, 0]} castShadow>
              <boxGeometry args={[0.95, 0.42, 0.95]} />
              <meshStandardMaterial color="#f0e8d9" roughness={0.8} />
            </mesh>
          </group>
        );
      })}
      <Html position={[axis === "z" ? 0 : -2.6, 3.4, axis === "x" ? 0 : 2.4]} center zIndexRange={[12, 0]}>
        <div className="gate-label">
          <span>{label}</span>
        </div>
      </Html>
    </group>
  );
}

function RoadLabel({
  x,
  z,
  text,
  rotate = 0,
}: {
  x: number;
  z: number;
  text: string;
  rotate?: number;
}) {
  return (
    <Html position={[x, 0.05, z]} center zIndexRange={[4, 0]}>
      <div className="road-label" style={{ transform: `rotate(${rotate}deg)` }}>
        {text}
      </div>
    </Html>
  );
}

function SimpleCar({
  x,
  z,
  color,
  rotation = 0,
}: {
  x: number;
  z: number;
  color: string;
  rotation?: number;
}) {
  return (
    <group position={[x, 0.02, z]} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.48, 0]} castShadow>
        <boxGeometry args={[3.7, 0.72, 1.7]} />
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh position={[-0.15, 0.98, 0]} castShadow>
        <boxGeometry args={[2, 0.58, 1.45]} />
        <meshStandardMaterial color="#a9c2c5" roughness={0.25} metalness={0.16} />
      </mesh>
      {[-1.2, 1.2].map((wheelX) =>
        [-0.82, 0.82].map((wheelZ) => (
          <mesh
            key={`${wheelX}-${wheelZ}`}
            position={[wheelX, 0.29, wheelZ]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.28, 0.28, 0.16, 12]} />
            <meshStandardMaterial color="#414a4d" roughness={0.8} />
          </mesh>
        )),
      )}
    </group>
  );
}

function SkyDome() {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "#c3d6d2");
    gradient.addColorStop(0.45, "#dbe3db");
    gradient.addColorStop(0.72, "#e9e8dc");
    gradient.addColorStop(1, "#eee9dd");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 256);
    const next = new THREE.CanvasTexture(canvas);
    next.colorSpace = THREE.SRGBColorSpace;
    return next;
  }, []);

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[520, 32, 20]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} fog={false} depthWrite={false} />
    </mesh>
  );
}

function SchoolSign() {
  return (
    <group position={[-83.2, TOP, 28]} rotation={[0, Math.PI / 2, 0]}>
      <mesh position={[0, 0.3, 0]} receiveShadow>
        <boxGeometry args={[7, 0.5, 1.8]} />
        <meshStandardMaterial color="#c6b8a2" roughness={0.96} />
      </mesh>
      <mesh position={[0, 1.12, 0]} castShadow>
        <boxGeometry args={[5.2, 1.35, 0.62]} />
        <meshStandardMaterial color="#ded2bd" roughness={0.82} />
      </mesh>
      <mesh position={[0, 1.12, 0.34]}>
        <boxGeometry args={[4.55, 0.88, 0.04]} />
        <meshStandardMaterial color="#173b52" roughness={0.6} />
      </mesh>
      <mesh position={[0, 1.32, 0.37]}>
        <boxGeometry args={[2.7, 0.09, 0.02]} />
        <meshStandardMaterial color="#dfbd7e" />
      </mesh>
      <mesh position={[0, 1.1, 0.37]}>
        <boxGeometry args={[3.3, 0.06, 0.02]} />
        <meshStandardMaterial color="#e9e2d1" />
      </mesh>
      <mesh position={[-3.3, 0.85, 0.1]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#658a62" roughness={1} />
      </mesh>
      <mesh position={[3.2, 0.85, 0.1]} scale={[0.8, 0.8, 0.8]} castShadow>
        <icosahedronGeometry args={[0.7, 1]} />
        <meshStandardMaterial color="#5e835d" roughness={1} />
      </mesh>
      <mesh position={[-2.1, 2.1, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.045, 2.6, 6]} />
        <meshStandardMaterial color="#b3b2a7" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-1.55, 2.75, 0]}>
        <planeGeometry args={[1.1, 0.7]} />
        <meshStandardMaterial color="#c56f59" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function CampusSite() {
  const trees = useMemo(() => TREES, []);

  return (
    <group>
      <SkyDome />
      {/* landscape base */}
      <mesh position={[0, -0.13, 0]} receiveShadow>
        <boxGeometry args={[430, 0.2, 330]} />
        <meshStandardMaterial color="#dcdccd" roughness={1} />
      </mesh>
      <mesh position={[0, 0.08, 0]} receiveShadow>
        <boxGeometry args={[CAMPUS_W, 0.64, CAMPUS_D]} />
        <meshStandardMaterial color="#e7e1d0" roughness={1} />
      </mesh>
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[CAMPUS_W - 2.1, 0.05, CAMPUS_D - 2.1]} />
        <meshStandardMaterial color="#e3ddcb" roughness={1} />
      </mesh>

      {/* roads */}
      <mesh position={[0, 0.005, 68]} receiveShadow>
        <boxGeometry args={[430, 0.08, 17]} />
        <meshStandardMaterial color="#858887" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.015, 60.2]} receiveShadow>
        <boxGeometry args={[430, 0.08, 2.3]} />
        <meshStandardMaterial color="#c4bfb1" roughness={1} />
      </mesh>
      <mesh position={[92, 0.005, 0]} receiveShadow>
        <boxGeometry args={[16, 0.08, 240]} />
        <meshStandardMaterial color="#858887" roughness={0.95} />
      </mesh>
      <mesh position={[84.4, 0.015, 0]} receiveShadow>
        <boxGeometry args={[2.2, 0.08, 240]} />
        <meshStandardMaterial color="#c4bfb1" roughness={1} />
      </mesh>
      <mesh position={[-92, 0.005, 0]} receiveShadow>
        <boxGeometry args={[13, 0.08, 240]} />
        <meshStandardMaterial color="#858887" roughness={0.95} />
      </mesh>

      {/* lane markings */}
      {Array.from({ length: 22 }, (_, index) => (
        <mesh
          key={`south-lane-${index}`}
          position={[-108 + index * 10, 0.06, 68]}
        >
          <boxGeometry args={[4.4, 0.02, 0.18]} />
          <meshBasicMaterial color="#e7e2d2" transparent opacity={0.75} />
        </mesh>
      ))}
      {Array.from({ length: 22 }, (_, index) => (
        <mesh key={`east-lane-${index}`} position={[92, 0.06, -104 + index * 10]}>
          <boxGeometry args={[0.18, 0.02, 4.4]} />
          <meshBasicMaterial color="#e7e2d2" transparent opacity={0.75} />
        </mesh>
      ))}
      <mesh position={[0, 0.06, 68]}>
        <boxGeometry args={[430, 0.02, 0.2]} />
        <meshBasicMaterial color="#d6b56e" transparent opacity={0.8} />
      </mesh>

      {/* crosswalks */}
      {[-6, 40].map((x) =>
        Array.from({ length: 7 }, (_, index) => (
          <mesh key={`${x}-${index}`} position={[x + (index - 3) * 1.15, 0.075, 66.7]}>
            <boxGeometry args={[0.6, 0.02, 10.5]} />
            <meshBasicMaterial color="#eee8d8" transparent opacity={0.9} />
          </mesh>
        )),
      )}

      <RoadLabel x={22} z={73.6} text="環 中 路" />
      <RoadLabel x={95.5} z={-28} text="光 中 路" rotate={90} />

      <SimpleCar x={23} z={71.6} color="#d9d4c8" />
      <SimpleCar x={41} z={64.7} color="#6e8c95" rotation={Math.PI} />
      <SimpleCar x={95} z={24} color="#c6b183" rotation={Math.PI / 2} />
      <SimpleCar x={89} z={-32} color="#c87863" rotation={-Math.PI / 2} />

      {/* perimeter walls with six openings */}
      <WallSegment x1={-84} z1={-59} x2={-49} z2={-59} />
      <WallSegment x1={-41} z1={-59} x2={31} z2={-59} />
      <WallSegment x1={39} z1={-59} x2={84} z2={-59} />
      <WallSegment x1={-84} z1={59} x2={-10} z2={59} />
      <WallSegment x1={0} z1={59} x2={35} z2={59} />
      <WallSegment x1={45} z1={59} x2={84} z2={59} />
      <WallSegment x1={-84} z1={-59} x2={-84} z2={23} />
      <WallSegment x1={-84} z1={33} x2={-84} z2={59} />
      <WallSegment x1={84} z1={-59} x2={84} z2={10} />
      <WallSegment x1={84} z1={20} x2={84} z2={59} />

      <Gate x={-45} z={-59} label="北一門" axis="x" />
      <Gate x={35} z={-59} label="北二門" axis="x" />
      <Gate x={-5} z={59} label="南一門" axis="x" />
      <Gate x={40} z={59} label="南二門" axis="x" />
      <Gate x={-84} z={28} label="正門" axis="z" />
      <Gate x={84} z={15} label="東門" axis="z" />
      <SchoolSign />

      {/* pathways */}
      <mesh position={[-77, TOP + 0.012, 28]} receiveShadow>
        <boxGeometry args={[10, 0.04, 7]} />
        <meshStandardMaterial color="#ded6c5" roughness={1} />
      </mesh>
      <mesh position={[-44, TOP + 0.012, 28]} receiveShadow>
        <boxGeometry args={[58, 0.04, 3.4]} />
        <meshStandardMaterial color="#ddd5c4" roughness={1} />
      </mesh>
      <mesh position={[0, TOP + 0.008, 52]} receiveShadow>
        <boxGeometry args={[158, 0.04, 2.7]} />
        <meshStandardMaterial color="#d8d1c1" roughness={1} />
      </mesh>
      <mesh position={[78, TOP + 0.008, 15]} receiveShadow>
        <boxGeometry args={[11, 0.04, 3.1]} />
        <meshStandardMaterial color="#ddd5c4" roughness={1} />
      </mesh>
      <mesh position={[18, TOP + 0.01, -24]} receiveShadow>
        <boxGeometry args={[31, 0.035, 2.6]} />
        <meshStandardMaterial color="#d9d2c0" roughness={1} />
      </mesh>
      <mesh position={[16, TOP + 0.011, 39]} receiveShadow>
        <boxGeometry args={[53, 0.035, 2.5]} />
        <meshStandardMaterial color="#dad2c1" roughness={1} />
      </mesh>
      <mesh position={[11, TOP + 0.013, 1]} receiveShadow>
        <boxGeometry args={[2.1, 0.035, 30]} />
        <meshStandardMaterial color="#ddd5c4" roughness={1} />
      </mesh>

      {/* athletics apron + landscape strips */}
      <mesh position={[52, TOP + 0.02, 2]} receiveShadow>
        <boxGeometry args={[40, 0.035, 62]} />
        <meshStandardMaterial color="#d7cfbd" roughness={1} />
      </mesh>
      <mesh position={[52, TOP + 0.005, 2]} receiveShadow>
        <boxGeometry args={[37.5, 0.02, 59]} />
        <meshStandardMaterial color="#c8ceb4" roughness={1} />
      </mesh>
      <mesh position={[52, TOP + 0.004, -33]} receiveShadow>
        <boxGeometry args={[27, 0.02, 9]} />
        <meshStandardMaterial color="#b6c6a1" roughness={1} />
      </mesh>
      <mesh position={[52, TOP + 0.004, 36]} receiveShadow>
        <boxGeometry args={[27, 0.02, 7]} />
        <meshStandardMaterial color="#bccba9" roughness={1} />
      </mesh>

      {/* green courtyard inside green-water and red-maple buildings */}
      <mesh position={[26, TOP + 0.03, -34.5]} receiveShadow>
        <boxGeometry args={[16, 0.035, 11]} />
        <meshStandardMaterial color="#96ac82" roughness={1} />
      </mesh>
      <mesh position={[26, TOP + 0.045, -34.5]} receiveShadow>
        <boxGeometry args={[1.5, 0.018, 10]} />
        <meshStandardMaterial color="#d8d1bf" roughness={1} />
      </mesh>
      <mesh position={[4, TOP + 0.03, 33]} receiveShadow>
        <boxGeometry args={[21, 0.035, 10]} />
        <meshStandardMaterial color="#9aae86" roughness={1} />
      </mesh>
      <mesh position={[4, TOP + 0.045, 33]} receiveShadow>
        <boxGeometry args={[2, 0.018, 10]} />
        <meshStandardMaterial color="#d9d2c1" roughness={1} />
      </mesh>
      <mesh position={[-13, TOP + 0.01, -20]} receiveShadow>
        <boxGeometry args={[18, 0.03, 20]} />
        <meshStandardMaterial color="#b8c7a3" roughness={1} />
      </mesh>
      <mesh position={[-57, TOP + 0.01, 33]} receiveShadow>
        <boxGeometry args={[25, 0.025, 3]} />
        <meshStandardMaterial color="#c4d0b0" roughness={1} />
      </mesh>

      {trees.map(([x, z, scale, tone], index) => (
        <Tree key={index} x={x} z={z} scale={scale} tone={tone} />
      ))}
      {SHRUBS.map(([x, z, scale], index) => (
        <Shrub key={index} x={x} z={z} scale={scale} />
      ))}

      {/* soft parking court behind the main gate */}
      <mesh position={[-74, TOP + 0.01, 45]} receiveShadow>
        <boxGeometry args={[13, 0.03, 7]} />
        <meshStandardMaterial color="#b7b4a7" roughness={1} />
      </mesh>
      {[-78, -74, -70].map((x) => (
        <mesh key={x} position={[x, TOP + 0.03, 45]}>
          <boxGeometry args={[0.08, 0.02, 6]} />
          <meshBasicMaterial color="#e2ddce" transparent opacity={0.75} />
        </mesh>
      ))}

      {/* north arrow in the paving, a subtle orientation detail */}
      <group position={[69, TOP + 0.05, -51]} rotation={[0, -0.35, 0]}>
        <mesh position={[0, 0, 0.9]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.05, 32]} />
          <meshStandardMaterial color="#e2dac8" roughness={1} />
        </mesh>
        <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.65, 2.4, 3]} />
          <meshStandardMaterial color="#73848a" roughness={0.8} />
        </mesh>
      </group>
    </group>
  );
}

export const CAMPUS_TOP = TOP;
export const CAMPUS_BOUNDS = new THREE.Box3(
  new THREE.Vector3(-CAMPUS_W / 2, 0, -CAMPUS_D / 2),
  new THREE.Vector3(CAMPUS_W / 2, 24, CAMPUS_D / 2),
);
