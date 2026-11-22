import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { PLACES, getPlace, type CampusPlace } from "../data/campus";
import { CampusBuilding, buildingLabelHeight } from "./Buildings";
import { CampusFacility } from "./Facilities";
import { CampusSite } from "./Site";

export type CameraCommandType =
  | "overview"
  | "top"
  | "entrance"
  | "focus"
  | "zoomIn"
  | "zoomOut"
  | "reset";

export interface CameraCommand {
  id: number;
  type: CameraCommandType;
  placeId?: string | null;
}

interface SceneProps {
  selectedId: string | null;
  activeFloor: number | null;
  command: CameraCommand | null;
  autoRotate: boolean;
  labelsVisible: boolean;
  onSelect: (id: string | null) => void;
  onMissed?: () => void;
}

const IMPORTANT_FACILITIES = new Set([
  "track",
  "court",
  "garden",
  "playground",
  "eco-garden",
  "stage",
  "sandpit",
]);

function PlaceLabel({
  place,
  selected,
  visible,
  onSelect,
}: {
  place: CampusPlace;
  selected: boolean;
  visible: boolean;
  onSelect: (id: string) => void;
}) {
  if (!visible) return null;
  const isBuilding = place.category === "教學大樓";
  const height =
    isBuilding
      ? buildingLabelHeight(place)
      : (place.labelHeight ?? 3.3) + 0.4;
  const labelZ =
    place.shape === "curved" ? place.z + (place.radius ?? 17) : place.z;

  return (
    <Html
      position={[place.x, height, labelZ]}
      center
      zIndexRange={[25, 0]}
      style={{ pointerEvents: "none" }}
    >
      <div className="pointer-events-auto">
        <button
          type="button"
          className={`place-label ${isBuilding ? "is-building" : "is-facility"} ${
            selected ? "is-selected" : ""
          }`}
          style={{ "--label-accent": place.accent } as React.CSSProperties}
          onClick={(event) => {
            event.stopPropagation();
            onSelect(place.id);
          }}
        >
          <span className="label-dot" />
          <span>{place.label}</span>
        </button>
      </div>
    </Html>
  );
}

function CameraRig({
  command,
  autoRotate,
}: {
  command: CameraCommand | null;
  autoRotate: boolean;
}) {
  const controlsRef = useRef<any>(null);
  const { camera, size } = useThree();
  const initialised = useRef(false);
  const portraitFactor = size.width / Math.max(size.height, 1) < 1 ? 1.3 : 1;
  const animation = useRef<{
    fromPosition: THREE.Vector3;
    toPosition: THREE.Vector3;
    fromTarget: THREE.Vector3;
    toTarget: THREE.Vector3;
    start: number;
    duration: number;
  } | null>(null);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    if (!initialised.current) {
      initialised.current = true;
      camera.position.set(
        126 * portraitFactor,
        155 * portraitFactor,
        178 * portraitFactor,
      );
    }
    controls.target.set(0, 0, 0);
    controls.update();
  }, [camera, portraitFactor]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!command || !controls) return;

    const overviewPosition = new THREE.Vector3(
      126 * portraitFactor,
      155 * portraitFactor,
      178 * portraitFactor,
    );
    const overviewTarget = new THREE.Vector3(2, 0, 0);
    let toPosition = overviewPosition.clone();
    let toTarget = overviewTarget.clone();
    let duration = 1.05;

    const place = getPlace(command.placeId ?? null);

    if (command.type === "top") {
      toPosition.set(4, 275 * portraitFactor, 2);
      toTarget.set(0, 0, 0);
    } else if (command.type === "entrance") {
      toPosition.set(-46, 24, 105);
      toTarget.set(-20, 8, 18);
    } else if (command.type === "focus" && place) {
      const footprint = Math.max(place.width, place.depth, 16);
      const distance =
        Math.max(64, Math.min(148, footprint * 2.95)) * portraitFactor;
      toPosition = new THREE.Vector3(
        place.x + distance * 0.7,
        Math.max(38, place.floors * 8 + footprint * 0.6) *
          (portraitFactor > 1 ? 1.08 : 1),
        place.z + distance * 0.9,
      );
      toTarget = new THREE.Vector3(
        place.x,
        place.category === "教學大樓" ? place.floors * 1.8 : 1,
        place.z,
      );
      duration = 0.9;
    } else if (command.type === "zoomIn" || command.type === "zoomOut") {
      const factor = command.type === "zoomIn" ? 0.74 : 1.34;
      toTarget.copy(controls.target);
      toPosition
        .copy(camera.position)
        .sub(controls.target)
        .multiplyScalar(factor)
        .add(controls.target);
      duration = 0.42;
    } else if (command.type === "reset") {
      toPosition.set(
        126 * portraitFactor,
        155 * portraitFactor,
        178 * portraitFactor,
      );
      toTarget.set(2, 0, 0);
    }

    animation.current = {
      fromPosition: camera.position.clone(),
      toPosition,
      fromTarget: controls.target.clone(),
      toTarget,
      start: performance.now(),
      duration,
    };
    controls.enabled = false;
  }, [camera, command, portraitFactor]);

  useFrame(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    controls.autoRotate = autoRotate && !animation.current;

    if (!animation.current) return;
    const animationState = animation.current;
    const raw = Math.min(
      1,
      (performance.now() - animationState.start) / (animationState.duration * 1000),
    );
    const ease = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;
    camera.position.lerpVectors(
      animationState.fromPosition,
      animationState.toPosition,
      ease,
    );
    controls.target.lerpVectors(
      animationState.fromTarget,
      animationState.toTarget,
      ease,
    );
    controls.update();
    if (raw >= 1) {
      animation.current = null;
      controls.enabled = true;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.075}
      minDistance={19}
      maxDistance={370}
      maxPolarAngle={Math.PI / 2.06}
      minPolarAngle={0.08}
      panSpeed={0.8}
      rotateSpeed={0.64}
      zoomSpeed={0.8}
      autoRotateSpeed={0.52}
      target={[0, 0, 0]}
    />
  );
}

export function CampusScene({
  selectedId,
  activeFloor,
  command,
  autoRotate,
  labelsVisible,
  onSelect,
  onMissed,
}: SceneProps) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      camera={{ position: [126, 155, 178], fov: 32, near: 0.8, far: 900 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.02;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
      onPointerMissed={() => onMissed?.()}
    >
      <color attach="background" args={["#e3e7dd"]} />
      <fog attach="fog" args={["#e3e7dd", 300, 520]} />

      <hemisphereLight args={["#f4f7ed", "#a79a83", 1.12]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        castShadow
        position={[92, 148, 84]}
        intensity={2.25}
        color="#fff5e2"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-118}
        shadow-camera-right={118}
        shadow-camera-top={108}
        shadow-camera-bottom={-108}
        shadow-camera-near={1}
        shadow-camera-far={360}
        shadow-bias={-0.00035}
        shadow-normalBias={0.025}
      />
      <directionalLight position={[-100, 60, -90]} intensity={0.44} color="#c9dcdf" />

      <Suspense fallback={null}>
        <CampusSite />
        {PLACES.map((place) => {
          const selected = selectedId === place.id;
          return place.render === "building" ? (
            <CampusBuilding
              key={place.id}
              place={place}
              selected={selected}
              activeFloor={selected ? activeFloor : null}
              onSelect={(next) => onSelect(next.id)}
            />
          ) : (
            <CampusFacility
              key={place.id}
              place={place}
              selected={selected}
              onSelect={(next) => onSelect(next.id)}
            />
          );
        })}

        {PLACES.map((place) => {
          const selected = selectedId === place.id;
          const isFacility = place.render !== "building";
          const visible =
            labelsVisible &&
            (selected ||
              !isFacility ||
              IMPORTANT_FACILITIES.has(place.id));
          return (
            <PlaceLabel
              key={`label-${place.id}`}
              place={place}
              selected={selected}
              visible={visible}
              onSelect={onSelect}
            />
          );
        })}

        <CameraRig command={command} autoRotate={autoRotate} />
      </Suspense>
    </Canvas>
  );
}

export { PLACES };
