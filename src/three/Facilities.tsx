import { useMemo } from "react";
import * as THREE from "three";
import type { CampusPlace } from "../data/campus";

const Y = 0.45;
const LINE = "#f3eee1";

interface FacilityProps {
  place: CampusPlace;
  selected: boolean;
  onSelect: (place: CampusPlace) => void;
}

function CourtMarkings({
  width,
  depth,
  color = LINE,
}: {
  width: number;
  depth: number;
  color?: string;
}) {
  const thickness = 0.08;
  return (
    <group position={[0, 0.03, 0]}>
      {[
        { p: [0, 0, -depth / 2] as const, s: [width, 0.015, thickness] as const },
        { p: [0, 0, depth / 2] as const, s: [width, 0.015, thickness] as const },
        { p: [-width / 2, 0, 0] as const, s: [thickness, 0.015, depth] as const },
        { p: [width / 2, 0, 0] as const, s: [thickness, 0.015, depth] as const },
      ].map((line, index) => (
        <mesh key={index} position={line.p}>
          <boxGeometry args={line.s} />
          <meshBasicMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
}

function BasketCourt({
  position,
  color,
  accent,
  rotation = 0,
}: {
  position: [number, number, number];
  color: string;
  accent: string;
  rotation?: number;
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[12.4, 9]} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
      <CourtMarkings width={12} depth={8.6} />
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.1, 1.18, 36]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[12, 0.014, 0.07]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      {[-4.15, 4.15].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.025, z]}>
            <boxGeometry args={[3.7, 0.02, 3.5]} />
            <meshBasicMaterial color={accent} transparent opacity={0.55} />
          </mesh>
          <mesh position={[0, 0.7, z > 0 ? z + 0.25 : z - 0.25]} castShadow>
            <boxGeometry args={[1.7, 1.05, 0.08]} />
            <meshStandardMaterial color="#f5efe2" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.5, z > 0 ? z + 0.22 : z - 0.22]}>
            <torusGeometry args={[0.3, 0.045, 8, 20]} />
            <meshStandardMaterial color="#d67c48" />
          </mesh>
          <mesh position={[0, 0.4, z > 0 ? z + 0.65 : z - 0.65]}>
            <boxGeometry args={[0.13, 2.2, 0.13]} />
            <meshStandardMaterial color="#ddd4c4" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function AthleticsTrack({ place, selected, onSelect }: FacilityProps) {
  const rx = place.width / 2;
  const rz = place.depth / 2;
  const laneRatios = [0.805, 0.835, 0.865, 0.895, 0.925, 0.955, 0.985];

  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[rx, rz, 1]}
        receiveShadow
      >
        <ringGeometry args={[0.77, 1, 72]} />
        <meshStandardMaterial color={selected ? "#c9775d" : "#b96851"} roughness={0.94} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[rx, rz, 1]} receiveShadow>
        <ringGeometry args={[0.765, 0.775, 72]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      {laneRatios.map((ratio) => (
        <mesh
          key={ratio}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[rx, rz, 1]}
          position={[0, 0.01, 0]}
        >
          <ringGeometry args={[ratio - 0.003, ratio + 0.003, 80]} />
          <meshBasicMaterial color="rgba(248,237,215,0.86)" transparent opacity={0.7} />
        </mesh>
      ))}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[rx * 0.77, rz * 0.77, 1]}
        receiveShadow
        position={[0, 0.02, 0]}
      >
        <circleGeometry args={[1, 64]} />
        <meshStandardMaterial color="#81a17c" roughness={0.98} />
      </mesh>
      <BasketCourt position={[0, 0.05, 7.6]} color="#6f9f79" accent="#e0a154" />
      <BasketCourt position={[0, 0.05, -8.8]} color="#72a3a0" accent="#d9a457" />
      <group position={[0, 0.06, 0]}>
        <mesh position={[-2.3, 0, 0]}>
          <boxGeometry args={[0.08, 0.02, 5.6]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        <mesh position={[2.3, 0, 0]}>
          <boxGeometry args={[0.08, 0.02, 5.6]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.7, 1.77, 32]} />
          <meshBasicMaterial color={LINE} />
        </mesh>
      </group>
      {/* start / finish markers */}
      <mesh position={[rx - 0.6, 0.07, 15]}>
        <boxGeometry args={[0.8, 0.02, 2.8]} />
        <meshBasicMaterial color="#f3e9d6" />
      </mesh>
    </group>
  );
}

function SolarCourt({ place, selected, onSelect }: FacilityProps) {
  const panels = useMemo(() => Array.from({ length: 4 }, (_, i) => i), []);
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[18.5, 16]} />
        <meshStandardMaterial color="#4f87b6" roughness={0.88} />
      </mesh>
      <CourtMarkings width={17.2} depth={14.6} />
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[17.2, 0.014, 0.08]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.5, 1.57, 32]} />
        <meshBasicMaterial color={LINE} />
      </mesh>
      {[-6.2, 6.2].map((z) => (
        <group key={z}>
          <mesh position={[0, 0.03, z * 0.78]}>
            <boxGeometry args={[5.8, 0.02, 4.6]} />
            <meshBasicMaterial color="#e2b859" />
          </mesh>
          <mesh position={[0, 1.1, z * 0.82]} castShadow>
            <boxGeometry args={[2.4, 1.35, 0.09]} />
            <meshStandardMaterial color="#f3eddf" />
          </mesh>
          <mesh position={[0, 0.72, z * 0.82]}>
            <torusGeometry args={[0.36, 0.05, 8, 20]} />
            <meshStandardMaterial color="#d87944" />
          </mesh>
          <mesh position={[0, 0.85, z * 1.14]}>
            <boxGeometry args={[0.12, 2.2, 0.12]} />
            <meshStandardMaterial color="#ddd4c4" />
          </mesh>
        </group>
      ))}
      {/* solar canopy on the southern touchline */}
      <group position={[0, 0, 8.9]}>
        {[-7.2, -2.4, 2.4, 7.2].map((x) => (
          <mesh key={x} position={[x, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.12, 3.6, 8]} />
            <meshStandardMaterial color="#d7d1c3" metalness={0.3} roughness={0.5} />
          </mesh>
        ))}
        <mesh position={[0, 3.5, 0]} castShadow>
          <boxGeometry args={[16.3, 0.14, 2.8]} />
          <meshStandardMaterial color="#d6d1c4" metalness={0.24} roughness={0.55} />
        </mesh>
        {panels.map((index) => (
          <mesh
            key={index}
            position={[-6 + index * 4, 3.68, 0]}
            rotation={[0, 0, -0.06]}
            castShadow
          >
            <boxGeometry args={[3.6, 0.1, 2.25]} />
            <meshStandardMaterial color="#1e3c57" metalness={0.5} roughness={0.3} />
          </mesh>
        ))}
      </group>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[9.4, 9.7, 52]} />
          <meshBasicMaterial color={place.accent} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Playground({ place, selected, onSelect }: FacilityProps) {
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[place.width, place.depth]} />
        <meshStandardMaterial color="#dba578" roughness={0.95} />
      </mesh>
      <mesh position={[-3.2, 0.03, 2.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 32]} />
        <meshStandardMaterial color="#7ba98d" roughness={1} />
      </mesh>
      <mesh position={[3.3, 0.03, -2.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.8, 32]} />
        <meshStandardMaterial color="#7f9bbb" roughness={1} />
      </mesh>
      {/* play tower and slide */}
      <group position={[-2.6, 0, 0.1]}>
        {[-1.05, 1.05].map((x) =>
          [-1.05, 1.05].map((z) => (
            <mesh key={`${x}-${z}`} position={[x, 1.55, z]} castShadow>
              <cylinderGeometry args={[0.1, 0.12, 3.1, 8]} />
              <meshStandardMaterial color="#d7d0c1" roughness={0.6} />
            </mesh>
          )),
        )}
        <mesh position={[0, 2.5, 0]} castShadow>
          <boxGeometry args={[2.5, 0.18, 2.5]} />
          <meshStandardMaterial color="#487d8c" roughness={0.8} />
        </mesh>
        <mesh position={[0, 3.5, 0]} castShadow>
          <coneGeometry args={[2.0, 1.2, 4]} />
          <meshStandardMaterial color="#c66b52" roughness={0.75} />
        </mesh>
        <mesh
          position={[2.25, 1.35, 0]}
          rotation={[0, 0, -0.62]}
          castShadow
        >
          <boxGeometry args={[4.1, 0.18, 1.2]} />
          <meshStandardMaterial color="#e4ba54" roughness={0.72} />
        </mesh>
        <mesh position={[0.8, 2.9, 1.0]} castShadow>
          <boxGeometry args={[0.8, 1.8, 0.08]} />
          <meshStandardMaterial color="#e7b459" roughness={0.8} />
        </mesh>
        <mesh position={[1.35, 2.05, 0.4]} castShadow>
          <cylinderGeometry args={[0.32, 0.32, 1.8, 8]} />
          <meshStandardMaterial color="#d88358" roughness={0.75} />
        </mesh>
      </group>
      {/* swing */}
      <group position={[2.9, 0, -1.7]}>
        {[-1.2, 1.2].map((x) => (
          <mesh key={x} position={[x, 1.3, 0]} rotation={[0, 0, x * 0.16]} castShadow>
            <boxGeometry args={[0.12, 2.7, 0.12]} />
            <meshStandardMaterial color="#4f7684" />
          </mesh>
        ))}
        <mesh position={[0, 2.62, 0]}>
          <boxGeometry args={[2.6, 0.12, 0.12]} />
          <meshStandardMaterial color="#4f7684" />
        </mesh>
        {[-0.5, 0.45].map((x) => (
          <group key={x} position={[x, 1.65, 0]}>
            {[-0.22, 0.22].map((offset) => (
              <mesh key={offset} position={[offset, 0, 0]}>
                <boxGeometry args={[0.035, 1.8, 0.035]} />
                <meshStandardMaterial color="#7b847d" />
              </mesh>
            ))}
            <mesh position={[0, -0.9, 0]} castShadow>
              <boxGeometry args={[0.55, 0.08, 0.28]} />
              <meshStandardMaterial color="#d0a34d" />
            </mesh>
          </group>
        ))}
      </group>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.2, 7.5, 48]} />
          <meshBasicMaterial color={place.accent} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Garden({ place, selected, onSelect }: FacilityProps) {
  const bushes = useMemo(
    () => [
      [-5.3, -3.2, 0.7],
      [4.6, 3.4, 0.6],
      [-3.8, 3.7, 0.5],
      [5.1, -2.9, 0.55],
      [1.2, 3.9, 0.4],
    ],
    [],
  );
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[place.width, place.depth]} />
        <meshStandardMaterial color="#85a57b" roughness={1} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.1, 10]} />
        <meshStandardMaterial color="#ddd6c4" roughness={1} />
      </mesh>
      <mesh position={[0, 0.028, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[13.8, 1.5]} />
        <meshStandardMaterial color="#ddd6c4" roughness={1} />
      </mesh>
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[2.35, 40]} />
        <meshStandardMaterial color="#c4bcaa" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.65, 32]} />
        <meshStandardMaterial color="#6da3ad" roughness={0.28} metalness={0.12} />
      </mesh>
      <mesh position={[0, 0.28, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.42, 24]} />
        <meshStandardMaterial color="#d9d0be" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.13, 0.22, 1.1, 10]} />
        <meshStandardMaterial color="#ccc4b4" roughness={0.7} />
      </mesh>
      {bushes.map(([x, z, scale], index) => (
        <mesh
          key={index}
          position={[x, scale * 0.6, z]}
          scale={[scale, scale * 0.8, scale]}
          castShadow
        >
          <icosahedronGeometry args={[0.9, 1]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#5e805b" : "#78996b"}
            roughness={1}
          />
        </mesh>
      ))}
      {[-4.8, 4.8].map((x) => (
        <group key={x} position={[x, 0, 1.7]}>
          <mesh position={[0, 0.18, 0]} castShadow>
            <boxGeometry args={[1.6, 0.12, 0.48]} />
            <meshStandardMaterial color="#a9845b" roughness={0.85} />
          </mesh>
          <mesh position={[-0.6, 0.04, 0]}>
            <boxGeometry args={[0.1, 0.38, 0.42]} />
            <meshStandardMaterial color="#596d68" />
          </mesh>
          <mesh position={[0.6, 0.04, 0]}>
            <boxGeometry args={[0.1, 0.38, 0.42]} />
            <meshStandardMaterial color="#596d68" />
          </mesh>
        </group>
      ))}
      {selected && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.2, 7.5, 48]} />
          <meshBasicMaterial color={place.accent} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function Sandpit({ place, selected, onSelect }: FacilityProps) {
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[4.2, 2.5, 1]}
        receiveShadow
      >
        <circleGeometry args={[1, 40]} />
        <meshStandardMaterial color="#cbb68b" roughness={1} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[4.2, 2.5, 1]}>
        <ringGeometry args={[0.93, 1.04, 48]} />
        <meshStandardMaterial color="#9f815e" roughness={0.9} />
      </mesh>
      <mesh position={[-8.5, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial color="#bd745d" roughness={0.95} />
      </mesh>
      <mesh position={[-1.5, 0.02, 2.7]}>
        <boxGeometry args={[0.08, 0.02, 1.2]} />
        <meshBasicMaterial color={selected ? place.accent : "#e8e0cf"} />
      </mesh>
    </group>
  );
}

function AssemblyStage({ place, selected, onSelect }: FacilityProps) {
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.36, 13.5]} />
        <meshStandardMaterial color="#d9cdbb" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[3.9, 0.15, 12.8]} />
        <meshStandardMaterial color="#b96b57" roughness={0.88} />
      </mesh>
      <mesh position={[-1.55, 2.5, 0]} castShadow>
        <boxGeometry args={[0.4, 4.3, 13.4]} />
        <meshStandardMaterial color="#eee5d6" roughness={0.9} />
      </mesh>
      <mesh position={[-1.33, 2.5, 0]}>
        <boxGeometry args={[0.05, 3.2, 9.4]} />
        <meshStandardMaterial color={place.accent} roughness={0.7} />
      </mesh>
      <mesh position={[0.1, 4.75, 0]} castShadow>
        <boxGeometry args={[4.4, 0.24, 14.2]} />
        <meshStandardMaterial color="#ede4d4" roughness={0.8} />
      </mesh>
      <mesh position={[0.1, 4.9, 0]}>
        <boxGeometry args={[4.55, 0.12, 14.35]} />
        <meshStandardMaterial color={place.accent} roughness={0.7} />
      </mesh>
      {[-4.9, 0, 4.9].map((z) => (
        <mesh key={z} position={[1.25, 1.75, z]} castShadow>
          <cylinderGeometry args={[0.09, 0.1, 2.7, 8]} />
          <meshStandardMaterial color="#ded4c4" roughness={0.7} />
        </mesh>
      ))}
      {[0, 1, 2].map((step) => (
        <mesh
          key={step}
          position={[2.6 + step * 0.35, 0.26 - step * 0.09, 0]}
          receiveShadow
        >
          <boxGeometry args={[0.65, 0.16, 11.6 - step * 0.4]} />
          <meshStandardMaterial color="#d4c8b6" roughness={1} />
        </mesh>
      ))}
      {[-6.2, 6.2].map((z) => (
        <group key={z} position={[-1.8, 0, z]}>
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 6, 8]} />
            <meshStandardMaterial color="#b6b3a8" metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0.55, 5.4, 0]}>
            <planeGeometry args={[1.05, 0.65]} />
            <meshStandardMaterial color={z > 0 ? "#d79b4b" : "#4f8d86"} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
      {selected && (
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[7.2, 7.5, 48]} />
          <meshBasicMaterial color={place.accent} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

function EcoPond({ place, selected, onSelect }: FacilityProps) {
  const reeds = useMemo(
    () => [
      [-3.8, -2.6],
      [-2.7, -3.6],
      [2.4, -3.2],
      [4.1, 1.8],
      [-4.4, 2.6],
    ],
    [],
  );
  return (
    <group
      position={[place.x, Y, place.z]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
    >
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[place.width, place.depth]} />
        <meshStandardMaterial color="#8ea77c" roughness={1} />
      </mesh>
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.75, 1]}>
        <circleGeometry args={[3.7, 40]} />
        <meshStandardMaterial color="#7c9a75" roughness={1} />
      </mesh>
      <mesh position={[-0.5, 0.05, 0.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.1, 0.8, 1]}>
        <circleGeometry args={[2.8, 40]} />
        <meshStandardMaterial color="#6b9da0" roughness={0.25} metalness={0.1} />
      </mesh>
      <mesh position={[1.7, 0.055, 1.4]} rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.65, 1]}>
        <circleGeometry args={[1.4, 32]} />
        <meshStandardMaterial color="#7092a0" roughness={0.3} />
      </mesh>
      {[[-0.3, 0.5, 0.55], [0.9, -0.6, 0.42], [-1.7, 1.2, 0.35], [1.9, 1.8, 0.4]].map(
        ([x, z, s], index) => (
          <mesh
            key={index}
            position={[x, 0.08, z]}
            rotation={[-Math.PI / 2, 0, index]}
            scale={[s, s * 0.7, 1]}
          >
            <circleGeometry args={[1, 16]} />
            <meshStandardMaterial color="#7ea164" roughness={0.9} />
          </mesh>
        ),
      )}
      {reeds.map(([x, z], index) => (
        <group key={index} position={[x, 0, z]}>
          {[-0.18, 0, 0.18].map((offset) => (
            <mesh key={offset} position={[offset, 0.65, 0]} rotation={[0, 0, offset]}>
              <cylinderGeometry args={[0.025, 0.035, 1.4, 5]} />
              <meshStandardMaterial color="#65815a" />
            </mesh>
          ))}
          <mesh position={[0, 1.35, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.32, 6]} />
            <meshStandardMaterial color="#8d6844" />
          </mesh>
        </group>
      ))}
      <mesh position={[1.5, 0.16, 2.1]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[2.2, 0.14, 0.9]} />
        <meshStandardMaterial color="#a48661" roughness={0.9} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6, 6.3, 48]} />
          <meshBasicMaterial color={place.accent} transparent opacity={0.55} />
        </mesh>
      )}
    </group>
  );
}

export function CampusFacility({ place, selected, onSelect }: FacilityProps) {
  switch (place.render) {
    case "track":
      return <AthleticsTrack place={place} selected={selected} onSelect={onSelect} />;
    case "court":
      return <SolarCourt place={place} selected={selected} onSelect={onSelect} />;
    case "playground":
      return <Playground place={place} selected={selected} onSelect={onSelect} />;
    case "garden":
      return <Garden place={place} selected={selected} onSelect={onSelect} />;
    case "sandpit":
      return <Sandpit place={place} selected={selected} onSelect={onSelect} />;
    case "stage":
      return <AssemblyStage place={place} selected={selected} onSelect={onSelect} />;
    case "pond":
      return <EcoPond place={place} selected={selected} onSelect={onSelect} />;
    default:
      return null;
  }
}
