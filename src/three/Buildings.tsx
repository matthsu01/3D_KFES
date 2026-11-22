import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { Edges } from "@react-three/drei";
import type { CampusPlace, Wing } from "../data/campus";
import { getFacadeTexture, makeCircularTexture } from "./textures";

const FLOOR_H = 2.95;
const GROUND_TOP = 0.4;

const WALL = "#ede5d7";
const GROUND_WALL = "#c2927c";
const GLASS = "#345b61";
const SLAB = "#d6cbba";
const ROOF_GREEN = "#7e9b76";
const ROOF_TRIM = "#d9cdbb";

interface BuildingGeometryProps {
  place: CampusPlace;
  selected: boolean;
  activeFloor: number | null;
  onSelect: (place: CampusPlace) => void;
}

function windowsFor(span: number) {
  return Math.max(2, Math.min(16, Math.round(span / 2.35)));
}

function FloorVolume({
  width,
  depth,
  floor,
  accent,
  active,
  selected,
}: {
  width: number;
  depth: number;
  floor: number;
  accent: string;
  active?: boolean;
  selected?: boolean;
}) {
  const y = GROUND_TOP + (floor - 0.5) * FLOOR_H;
  const isGround = floor === 1;
  const wall = isGround ? GROUND_WALL : WALL;
  const sideXTexture = getFacadeTexture(wall, GLASS, windowsFor(depth));
  const sideZTexture = getFacadeTexture(wall, GLASS, windowsFor(width));
  const highlight = active;
  const glow = selected || highlight ? accent : "#000000";

  return (
    <mesh position={[0, y, 0]} castShadow receiveShadow>
      <boxGeometry args={[width, FLOOR_H - 0.16, depth]} />
      <meshStandardMaterial
        attach="material-0"
        map={sideXTexture}
        roughness={0.82}
        metalness={0.02}
        emissive={glow}
        emissiveIntensity={highlight ? 0.22 : selected ? 0.05 : 0}
      />
      <meshStandardMaterial
        attach="material-1"
        map={sideXTexture}
        roughness={0.82}
        metalness={0.02}
        emissive={glow}
        emissiveIntensity={highlight ? 0.22 : selected ? 0.05 : 0}
      />
      <meshStandardMaterial attach="material-2" color={SLAB} roughness={0.95} />
      <meshStandardMaterial attach="material-3" color={SLAB} roughness={0.95} />
      <meshStandardMaterial
        attach="material-4"
        map={sideZTexture}
        roughness={0.82}
        metalness={0.02}
        emissive={glow}
        emissiveIntensity={highlight ? 0.22 : selected ? 0.05 : 0}
      />
      <meshStandardMaterial
        attach="material-5"
        map={sideZTexture}
        roughness={0.82}
        metalness={0.02}
        emissive={glow}
        emissiveIntensity={highlight ? 0.22 : selected ? 0.05 : 0}
      />
      {active && <Edges color={accent} threshold={18} />}
    </mesh>
  );
}

function FloorSlab({
  width,
  depth,
  floor,
  accent,
}: {
  width: number;
  depth: number;
  floor: number;
  accent: string;
}) {
  return (
    <mesh
      position={[0, GROUND_TOP + (floor - 1) * FLOOR_H, 0]}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[width + 0.55, 0.16, depth + 0.55]} />
      <meshStandardMaterial color={SLAB} roughness={0.9} />
      {floor === 1 && (
        <mesh position={[0, 0.02, 0]} receiveShadow>
          <boxGeometry args={[width + 0.9, 0.24, depth + 0.9]} />
          <meshStandardMaterial color={accent} roughness={0.9} />
        </mesh>
      )}
    </mesh>
  );
}

function Rooftop({
  width,
  depth,
  floors,
  accent,
  seed,
}: {
  width: number;
  depth: number;
  floors: number;
  accent: string;
  seed: string;
}) {
  const height = GROUND_TOP + floors * FLOOR_H;
  const shrubs = useMemo(() => {
    const base = seed
      .split("")
      .reduce((total, char) => total + char.charCodeAt(0), 0);
    return Array.from({ length: 5 }, (_, index) => {
      const angle = base * 0.021 + index * 1.77;
      return {
        x: Math.cos(angle) * (width * 0.27) + Math.sin(index * 2.1) * width * 0.08,
        z: Math.sin(angle) * (depth * 0.22),
        scale: 0.47 + ((base + index * 13) % 7) * 0.055,
      };
    });
  }, [depth, seed, width]);

  return (
    <group>
      <mesh position={[0, height + 0.02, 0]} receiveShadow>
        <boxGeometry args={[width - 0.3, 0.3, depth - 0.3]} />
        <meshStandardMaterial color={ROOF_TRIM} roughness={0.95} />
      </mesh>
      <mesh position={[0, height + 0.19, 0]} receiveShadow>
        <boxGeometry args={[width - 1.35, 0.08, depth - 1.35]} />
        <meshStandardMaterial color={ROOF_GREEN} roughness={1} />
      </mesh>
      <mesh position={[0.5, height + 0.25, 0.1]} receiveShadow>
        <boxGeometry args={[width * 0.44, 0.035, depth - 2.9]} />
        <meshStandardMaterial color="#e4dcc7" roughness={1} />
      </mesh>

      {/* parapet */}
      {[
        { x: 0, z: -(depth / 2 - 0.2), w: width, d: 0.4 },
        { x: 0, z: depth / 2 - 0.2, w: width, d: 0.4 },
        { x: -(width / 2 - 0.2), z: 0, w: 0.4, d: depth },
        { x: width / 2 - 0.2, z: 0, w: 0.4, d: depth },
      ].map((part, index) => (
        <mesh
          key={index}
          position={[part.x, height + 0.53, part.z]}
          castShadow
        >
          <boxGeometry args={[part.w, 0.78, part.d]} />
          <meshStandardMaterial color="#e4dacb" roughness={0.9} />
        </mesh>
      ))}

      {/* stair bulkhead + rooftop plant */}
      <mesh position={[width * 0.23, height + 1.22, -depth * 0.17]} castShadow>
        <boxGeometry args={[3.1, 2.1, 2.7]} />
        <meshStandardMaterial color="#e8dfd0" roughness={0.88} />
      </mesh>
      <mesh position={[width * 0.23, height + 2.31, -depth * 0.17]} castShadow>
        <boxGeometry args={[3.45, 0.24, 3.05]} />
        <meshStandardMaterial color={accent} roughness={0.8} />
      </mesh>
      <mesh position={[-width * 0.27, height + 0.78, depth * 0.18]} castShadow>
        <boxGeometry args={[1.65, 1.1, 1.3]} />
        <meshStandardMaterial color="#c9c1b3" roughness={0.84} metalness={0.08} />
      </mesh>
      <mesh position={[-width * 0.27, height + 1.36, depth * 0.18]}>
        <boxGeometry args={[1.8, 0.08, 1.45]} />
        <meshStandardMaterial color="#9b9b90" roughness={0.65} />
      </mesh>

      {shrubs.map((shrub, index) => (
        <mesh
          key={index}
          position={[shrub.x, height + 0.3, shrub.z]}
          scale={[shrub.scale, shrub.scale * 0.8, shrub.scale]}
          castShadow
        >
          <icosahedronGeometry args={[0.8, 1]} />
          <meshStandardMaterial
            color={index % 2 === 0 ? "#698b62" : "#7f9c6b"}
            roughness={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Entrance({ width, depth, accent }: { width: number; depth: number; accent: string }) {
  return (
    <group position={[0, GROUND_TOP, 0]}>
      <mesh position={[0, 1.35, depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[3.7, 2.5, 0.18]} />
        <meshStandardMaterial color="#315358" roughness={0.25} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.35, depth / 2 + 0.18]}>
        <boxGeometry args={[0.12, 2.3, 0.08]} />
        <meshStandardMaterial color="#b8cabf" />
      </mesh>
      <mesh position={[0, 2.78, depth / 2 + 0.72]} castShadow>
        <boxGeometry args={[6.1, 0.22, 2.35]} />
        <meshStandardMaterial color="#f0e7d7" roughness={0.8} />
      </mesh>
      <mesh position={[0, 2.94, depth / 2 + 0.72]} castShadow>
        <boxGeometry args={[6.25, 0.12, 2.5]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
      {[-2.05, 2.05].map((x) => (
        <mesh key={x} position={[x, 1.35, depth / 2 + 1.2]} castShadow>
          <cylinderGeometry args={[0.11, 0.13, 2.7, 8]} />
          <meshStandardMaterial color="#e0d5c1" roughness={0.7} />
        </mesh>
      ))}
      {[0, 1, 2].map((step) => (
        <mesh
          key={step}
          position={[0, 0.22 - step * 0.07, depth / 2 + 1.45 + step * 0.42]}
          receiveShadow
        >
          <boxGeometry args={[5.8 - step * 0.38, 0.16, 0.55]} />
          <meshStandardMaterial color="#d7cbbb" roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 3.32, depth / 2 + 0.2]} castShadow>
        <boxGeometry args={[3.9, 0.6, 0.12]} />
        <meshStandardMaterial color="#f2eadc" roughness={0.75} />
      </mesh>
      <mesh position={[0, 3.32, depth / 2 + 0.13]}>
        <boxGeometry args={[3.1, 0.095, 0.04]} />
        <meshStandardMaterial color={accent} />
      </mesh>
      <mesh position={[0, 3.06, depth / 2 + 0.19]}>
        <boxGeometry args={[1.15, 0.055, 0.035]} />
        <meshStandardMaterial color="#8b9a95" />
      </mesh>
      <mesh position={[0, 2.93, depth / 2 + 0.19]}>
        <boxGeometry args={[2.35, 0.045, 0.035]} />
        <meshStandardMaterial color="#aab5ad" />
      </mesh>
      <mesh position={[-width * 0.42, 0.42, depth / 2 + 0.9]} castShadow>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial color="#64875f" roughness={1} />
      </mesh>
    </group>
  );
}

function BlockShell({
  wing,
  floors,
  accent,
  selected,
  activeFloor,
  index,
  seed,
}: {
  wing: Wing;
  floors: number;
  accent: string;
  selected: boolean;
  activeFloor: number | null;
  index: number;
  seed: string;
}) {
  const shellFloors = wing.floors ?? floors;
  const height = GROUND_TOP + shellFloors * FLOOR_H;

  return (
    <group position={[wing.x, 0, wing.z]}>
      <FloorSlab width={wing.width} depth={wing.depth} floor={1} accent={accent} />
      {Array.from({ length: shellFloors }, (_, floorIndex) => {
        const floor = floorIndex + 1;
        return (
          <group key={floor}>
            <FloorVolume
              width={wing.width}
              depth={wing.depth}
              floor={floor}
              accent={accent}
              selected={selected}
              active={selected && activeFloor === floor}
            />
            {floor > 1 && (
              <FloorSlab
                width={wing.width}
                depth={wing.depth}
                floor={floor}
                accent={accent}
              />
            )}
          </group>
        );
      })}
      <Rooftop
        width={wing.width}
        depth={wing.depth}
        floors={shellFloors}
        accent={accent}
        seed={`${seed}-${index}`}
      />
      {index === 0 && (
        <Entrance width={wing.width} depth={wing.depth} accent={accent} />
      )}
      {/* accent education band on the entry facade */}
      <mesh position={[0, height + 0.88, wing.depth / 2 - 0.05]} castShadow>
        <boxGeometry args={[Math.min(8, wing.width * 0.4), 0.28, 0.36]} />
        <meshStandardMaterial color={accent} roughness={0.7} />
      </mesh>
    </group>
  );
}

function CurvedShell({
  place,
  selected,
  activeFloor,
}: {
  place: CampusPlace;
  selected: boolean;
  activeFloor: number | null;
}) {
  const radius = place.radius ?? 17;
  const thickness = place.thickness ?? 8;
  const segments = place.segments ?? 10;
  const arcStart = ((place.arcStart ?? 55) * Math.PI) / 180;
  const arcEnd = ((place.arcEnd ?? 305) * Math.PI) / 180;
  const step = (arcEnd - arcStart) / segments;
  const segmentWidth = 2 * radius * Math.sin(step / 2) + 0.5;

  const sections = Array.from({ length: segments }, (_, index) => {
    const angle = arcStart + (index + 0.5) * step;
    return {
      x: Math.cos(angle) * radius,
      z: Math.sin(angle) * radius,
      rotation: -angle - Math.PI / 2,
      angle,
    };
  });

  return (
    <group>
      {sections.map((section, index) => (
        <group
          key={index}
          position={[section.x, 0, section.z]}
          rotation={[0, section.rotation, 0]}
        >
          <FloorSlab
            width={segmentWidth}
            depth={thickness}
            floor={1}
            accent={place.accent}
          />
          {Array.from({ length: place.floors }, (_, floorIndex) => {
            const floor = floorIndex + 1;
            return (
              <group key={floor}>
                <FloorVolume
                  width={segmentWidth}
                  depth={thickness}
                  floor={floor}
                  accent={place.accent}
                  selected={selected}
                  active={selected && activeFloor === floor}
                />
                {floor > 1 && (
                  <FloorSlab
                    width={segmentWidth}
                    depth={thickness}
                    floor={floor}
                    accent={place.accent}
                  />
                )}
              </group>
            );
          })}
          <mesh
            position={[0, GROUND_TOP + place.floors * FLOOR_H + 0.2, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[segmentWidth, 0.3, thickness - 0.2]} />
            <meshStandardMaterial color={ROOF_GREEN} roughness={1} />
          </mesh>
          <mesh
            position={[0, GROUND_TOP + place.floors * FLOOR_H + 0.25, thickness / 2 - 0.15]}
            castShadow
          >
            <boxGeometry args={[segmentWidth, 0.6, 0.35]} />
            <meshStandardMaterial color="#e5dbca" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* End pavilions make the curve read as a real building rather than a ribbon */}
      {[arcStart, arcEnd].map((angle, index) => {
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh
            key={index}
            position={[x, GROUND_TOP + (place.floors * FLOOR_H) / 2, z]}
            castShadow
          >
            <cylinderGeometry args={[4.1, 4.1, place.floors * FLOOR_H + 1.3, 22]} />
            <meshStandardMaterial color={index === 0 ? "#d9cdbb" : WALL} roughness={0.85} />
          </mesh>
        );
      })}

      {selected && (
        <FootprintLine
          width={place.width}
          depth={place.depth}
          radius={radius + thickness / 2}
          accent={place.accent}
          circular
        />
      )}
    </group>
  );
}

function CircularShell({
  place,
  selected,
  activeFloor,
}: {
  place: CampusPlace;
  selected: boolean;
  activeFloor: number | null;
}) {
  const radius = place.radius ?? 13;
  const upperTexture = useMemo(() => makeCircularTexture(WALL, GLASS), []);
  const groundTexture = useMemo(() => makeCircularTexture(GROUND_WALL, GLASS), []);
  useEffect(
    () => () => {
      upperTexture.dispose();
      groundTexture.dispose();
    },
    [groundTexture, upperTexture],
  );

  const columns = Array.from({ length: 16 }, (_, index) => {
    const angle = (index / 16) * Math.PI * 2;
    return {
      x: Math.cos(angle) * (radius + 0.15),
      z: Math.sin(angle) * (radius + 0.15),
      angle,
    };
  });

  return (
    <group>
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius + 0.9, radius + 1.1, 0.4, 56]} />
        <meshStandardMaterial color="#d7cbb8" roughness={0.95} />
      </mesh>
      {Array.from({ length: place.floors }, (_, floorIndex) => {
        const floor = floorIndex + 1;
        const y = GROUND_TOP + (floor - 0.5) * FLOOR_H;
        return (
          <group key={floor}>
            <mesh position={[0, y, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[radius, radius, FLOOR_H - 0.16, 64, 1, false]} />
              <meshStandardMaterial
                map={floor === 1 ? groundTexture : upperTexture}
                roughness={0.8}
                metalness={0.04}
                emissive={selected && activeFloor === floor ? place.accent : "#000000"}
                emissiveIntensity={selected && activeFloor === floor ? 0.18 : 0}
              />
              {selected && activeFloor === floor && (
                <Edges color={place.accent} threshold={22} />
              )}
            </mesh>
            <mesh position={[0, GROUND_TOP + (floor - 1) * FLOOR_H, 0]} receiveShadow>
              <cylinderGeometry args={[radius + 0.42, radius + 0.42, 0.18, 64]} />
              <meshStandardMaterial color={SLAB} roughness={0.9} />
            </mesh>
          </group>
        );
      })}

      {/* ground colonnade */}
      {columns.map((column, index) => (
        <mesh
          key={index}
          position={[column.x, 1.7, column.z]}
          rotation={[0, -column.angle, 0]}
          castShadow
        >
          <boxGeometry args={[0.28, 2.6, 0.28]} />
          <meshStandardMaterial color="#e1d5c2" roughness={0.82} />
        </mesh>
      ))}

      {/* lantern and dome */}
      <mesh
        position={[0, GROUND_TOP + place.floors * FLOOR_H + 0.5, 0]}
        castShadow
      >
        <cylinderGeometry args={[radius * 0.68, radius * 0.72, 1, 48]} />
        <meshStandardMaterial color="#e6dccd" roughness={0.85} />
      </mesh>
      <mesh
        position={[0, GROUND_TOP + place.floors * FLOOR_H + 0.55, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <torusGeometry args={[radius * 0.69, 0.18, 8, 48]} />
        <meshStandardMaterial color={place.accent} roughness={0.65} />
      </mesh>
      <mesh position={[0, GROUND_TOP + place.floors * FLOOR_H + 0.95, 0]} castShadow>
        <sphereGeometry
          args={[radius * 0.66, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#718f8b"
          roughness={0.3}
          metalness={0.38}
          transparent
          opacity={0.94}
        />
      </mesh>
      {Array.from({ length: 8 }, (_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[
              Math.cos(angle) * radius * 0.35,
              GROUND_TOP + place.floors * FLOOR_H + 1.72,
              Math.sin(angle) * radius * 0.35,
            ]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.09, 0.75, radius * 0.83]} />
            <meshStandardMaterial color="#d6cdbf" roughness={0.5} metalness={0.3} />
          </mesh>
        );
      })}
      <mesh position={[0, GROUND_TOP + place.floors * FLOOR_H + 2.2, 0]} castShadow>
        <cylinderGeometry args={[1.1, 1.4, 0.7, 20]} />
        <meshStandardMaterial color="#e8decf" roughness={0.8} />
      </mesh>
      <mesh position={[0, GROUND_TOP + place.floors * FLOOR_H + 2.6, 0]}>
        <sphereGeometry args={[0.75, 20, 14]} />
        <meshStandardMaterial color="#c39a6b" metalness={0.4} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.35, radius + 0.15]} castShadow>
        <boxGeometry args={[3.5, 2.5, 0.18]} />
        <meshStandardMaterial color="#315358" roughness={0.25} metalness={0.3} />
      </mesh>
      <mesh position={[0, 2.84, radius + 0.7]} castShadow>
        <boxGeometry args={[5.2, 0.2, 1.9]} />
        <meshStandardMaterial color={place.accent} roughness={0.7} />
      </mesh>
      {selected && (
        <FootprintLine
          width={place.width}
          depth={place.depth}
          radius={radius + 1.4}
          accent={place.accent}
          circular
        />
      )}
    </group>
  );
}

export function FootprintLine({
  width,
  depth,
  radius,
  accent,
  circular = false,
}: {
  width: number;
  depth: number;
  radius?: number;
  accent: string;
  circular?: boolean;
}) {
  const points = useMemo(() => {
    if (circular && radius) {
      return Array.from({ length: 65 }, (_, index) => {
        const angle = (index / 64) * Math.PI * 2;
        return new THREE.Vector3(
          Math.cos(angle) * radius,
          0.46,
          Math.sin(angle) * radius,
        );
      });
    }
    const w = width / 2 + 1.6;
    const d = depth / 2 + 1.6;
    return [
      new THREE.Vector3(-w, 0.46, -d),
      new THREE.Vector3(w, 0.46, -d),
      new THREE.Vector3(w, 0.46, d),
      new THREE.Vector3(-w, 0.46, d),
      new THREE.Vector3(-w, 0.46, -d),
    ];
  }, [circular, depth, radius, width]);

  return (
    <group>
      <mesh position={[0, 0.43, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[Math.max(width, depth) * 0.32, Math.max(width, depth) * 0.42, 48]}
        />
        <meshBasicMaterial color={accent} transparent opacity={0.17} depthWrite={false} />
      </mesh>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[
              new Float32Array(points.flatMap((point) => [point.x, point.y, point.z])),
              3,
            ]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accent} transparent opacity={0.85} />
      </line>
    </group>
  );
}

export function CampusBuilding({
  place,
  selected,
  activeFloor,
  onSelect,
}: BuildingGeometryProps) {
  const labelY = GROUND_TOP + place.floors * FLOOR_H + 1.7;

  return (
    <group
      position={[place.x, 0, place.z]}
      rotation={[0, ((place.rotation ?? 0) * Math.PI) / 180, 0]}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(place);
      }}
      onPointerOver={(event) => {
        event.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
      userData={{ labelY }}
    >
      {place.shape === "curved" && (
        <CurvedShell place={place} selected={selected} activeFloor={activeFloor} />
      )}
      {place.shape === "circular" && (
        <CircularShell place={place} selected={selected} activeFloor={activeFloor} />
      )}
      {(place.shape === "block" || place.shape === "complex" || !place.shape) && (
        <group>
          {(place.wings ?? [
            { x: 0, z: 0, width: place.width, depth: place.depth },
          ]).map((wing, index) => (
            <BlockShell
              key={index}
              wing={wing}
              floors={place.floors}
              accent={place.accent}
              selected={selected}
              activeFloor={activeFloor}
              index={index}
              seed={place.id}
            />
          ))}
          {selected && (
            <FootprintLine
              width={place.width}
              depth={place.depth}
              accent={place.accent}
            />
          )}
        </group>
      )}
    </group>
  );
}

export function buildingLabelHeight(place: CampusPlace) {
  if (place.shape === "circular") {
    return (
      GROUND_TOP +
      place.floors * FLOOR_H +
      (place.radius ?? 13) * 0.66 +
      2.8
    );
  }
  return GROUND_TOP + place.floors * FLOOR_H + 2.3;
}
