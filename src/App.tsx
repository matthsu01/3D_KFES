import { useCallback, useEffect, useRef, useState } from "react";
import {
  Boxes,
  Compass,
  Crosshair,
  Expand,
  Map as MapIcon,
  Maximize2,
  Minus,
  MousePointer2,
  Plus,
  Rotate3d,
  ScanEye,
  Tags,
} from "lucide-react";
import { TopBar } from "./components/TopBar";
import { Sidebar, type CategoryFilter } from "./components/Sidebar";
import { SelectedCard } from "./components/SelectedCard";
import { DirectoryModal, GuideModal } from "./components/Modals";
import { getPlace, type CampusPlace } from "./data/campus";
import { CampusScene, type CameraCommand, type CameraCommandType } from "./three/CampusScene";
import { cn } from "./utils/cn";

type ViewMode = "3d" | "top";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeFloor, setActiveFloor] = useState<number | null>(1);
  const [category, setCategory] = useState<CategoryFilter>("全部");
  const [viewMode, setViewMode] = useState<ViewMode>("3d");
  const [autoRotate, setAutoRotate] = useState(false);
  const [labelsVisible, setLabelsVisible] = useState(true);
  const [command, setCommand] = useState<CameraCommand | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const commandId = useRef(0);
  const sceneWrapRef = useRef<HTMLDivElement>(null);
  const pointerStart = useRef<{ x: number; y: number } | null>(null);
  const pointerTravel = useRef(0);

  const selectedPlace = getPlace(selectedId);

  const sendCommand = useCallback(
    (type: CameraCommandType, placeId: string | null = selectedId) => {
      commandId.current += 1;
      setCommand({ id: commandId.current, type, placeId: placeId ?? undefined });
    },
    [selectedId],
  );

  const choosePlace = useCallback(
    (place: CampusPlace, floor?: number | null) => {
      setSelectedId(place.id);
      const nextCategory = place.category;
      setCategory((current) =>
        current === "全部" || current === nextCategory ? current : "全部",
      );
      setActiveFloor(place.rooms.length > 0 ? (floor ?? 1) : null);
      setViewMode("3d");
      commandId.current += 1;
      setCommand({
        id: commandId.current,
        type: "focus",
        placeId: place.id,
      });
    },
    [],
  );

  const handleSceneSelect = useCallback(
    (id: string | null) => {
      if (!id) {
        setSelectedId(null);
        setActiveFloor(null);
        return;
      }
      const place = getPlace(id);
      if (place) choosePlace(place);
    },
    [choosePlace],
  );

  const handlePick = useCallback(
    (placeId: string, floor?: number | null) => {
      const place = getPlace(placeId);
      if (place) choosePlace(place, floor);
    },
    [choosePlace],
  );

  const handleSceneMissed = useCallback(() => {
    if (pointerTravel.current > 6) {
      pointerTravel.current = 0;
      return;
    }
    setSelectedId(null);
    setActiveFloor(null);
  }, []);

  const handleView = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode === "top") {
      sendCommand("top");
    } else {
      setAutoRotate(false);
      sendCommand(selectedId ? "focus" : "overview");
    }
  };

  const handleReset = () => {
    setSelectedId(null);
    setActiveFloor(null);
    setViewMode("3d");
    setAutoRotate(false);
    sendCommand("reset", null);
  };

  const handleSelectFromSidebar = (place: CampusPlace) => {
    choosePlace(place, 1);
  };

  const toggleFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else if (sceneWrapRef.current) {
        await sceneWrapRef.current.requestFullscreen();
      }
    } catch {
      // Fullscreen can be blocked by the document sandbox; the scene stays usable.
    }
  };

  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#ecebe3] lg:h-screen lg:min-h-0 lg:overflow-hidden">
      <TopBar
        onPick={handlePick}
        onOpenGuide={() => setGuideOpen(true)}
        onOpenDirectory={() => setDirectoryOpen(true)}
      />

      <main className="mx-auto grid w-full max-w-[1800px] flex-1 grid-cols-1 gap-3 px-3 py-3 sm:px-4 lg:min-h-0 lg:grid-cols-[326px_minmax(0,1fr)] lg:gap-3.5 lg:overflow-hidden lg:px-4 lg:py-3.5">
        <div className="order-2 min-h-0 lg:order-1 lg:h-full">
          <Sidebar
            category={category}
            onCategoryChange={setCategory}
            selectedId={selectedId}
            onSelect={handleSelectFromSidebar}
            onOpenGuide={() => setGuideOpen(true)}
            onOpenDirectory={() => setDirectoryOpen(true)}
          />
        </div>

        <section
          ref={sceneWrapRef}
          onPointerDown={(event) => {
            pointerTravel.current = 0;
            pointerStart.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            const start = pointerStart.current;
            if (!start || event.buttons === 0) return;
            pointerTravel.current = Math.max(
              pointerTravel.current,
              Math.hypot(event.clientX - start.x, event.clientY - start.y),
            );
          }}
          className={cn(
            "scene-grain scene-vignette group relative order-1 h-[63vh] min-h-[450px] overflow-hidden rounded-[18px] border border-[#d7d2c4] bg-[#dfe5dc] shadow-[0_12px_38px_-26px_rgba(39,52,49,0.55)] lg:order-2 lg:h-full lg:min-h-0",
            isFullscreen && "h-screen w-screen rounded-none border-0",
          )}
        >
          <CampusScene
            selectedId={selectedId}
            activeFloor={activeFloor}
            command={command}
            autoRotate={autoRotate}
            labelsVisible={labelsVisible}
            onSelect={handleSceneSelect}
            onMissed={handleSceneMissed}
          />

          {/* location / breadcrumb */}
          <div className="pointer-events-none absolute left-3 top-3 z-20 flex max-w-[calc(100%-150px)] flex-col items-start gap-1.5 sm:left-4 sm:top-4">
            <div className="scene-glass pointer-events-auto flex h-9 items-center gap-2 rounded-[10px] px-2.5 sm:h-10 sm:px-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#173b52] text-[#e6c17c]">
                <Boxes size={13} strokeWidth={1.8} />
              </span>
              <div className="min-w-0">
                <p className="text-[8px] font-semibold uppercase tracking-[0.15em] text-[#9a9e96]">
                  Now viewing
                </p>
                <p className="max-w-[150px] truncate text-[10px] font-semibold text-[#2c4b58] sm:max-w-[240px]">
                  {selectedPlace ? selectedPlace.name : "光復校園 · 全區"}
                </p>
              </div>
              <span className="ml-1 hidden h-3 w-px bg-[#ddd6c7] sm:block" />
              <span className="hidden text-[8px] tracking-wide text-[#949a92] sm:inline">
                {selectedPlace ? selectedPlace.category : "115 學年度"}
              </span>
            </div>
            <div className="hidden items-center gap-2 rounded-full bg-[#173a51]/80 px-2.5 py-1 text-[8px] font-medium tracking-wide text-white/72 backdrop-blur-sm sm:flex">
              <span className="h-1 w-1 rounded-full bg-[#a9c99f]" />
              3D 量體已載入
              <span className="h-2.5 w-px bg-white/20" />
              點選建築探索空間
            </div>
          </div>

          {/* view controls */}
          <div className="absolute right-3 top-[57px] z-20 flex items-center gap-1.5 sm:right-4 sm:top-4">
            <div className="scene-glass flex items-center gap-0.5 rounded-[10px] p-1">
              <button
                type="button"
                onClick={() => handleView("3d")}
                className={cn("scene-tool", viewMode === "3d" && "is-active")}
                title="立體視角"
              >
                <Boxes size={13} strokeWidth={1.9} />
                <span className="hidden sm:inline">3D</span>
              </button>
              <button
                type="button"
                onClick={() => handleView("top")}
                className={cn("scene-tool", viewMode === "top" && "is-active")}
                title="俯視平面"
              >
                <MapIcon size={13} strokeWidth={1.9} />
                <span className="hidden sm:inline">俯視</span>
              </button>
              <span className="mx-0.5 h-4 w-px bg-[#ddd6c7]" />
              <button
                type="button"
                onClick={() => {
                  const next = !autoRotate;
                  setAutoRotate(next);
                  if (viewMode === "top") {
                    setViewMode("3d");
                    sendCommand("overview", null);
                  }
                }}
                className={cn("scene-tool !px-2", autoRotate && "is-active")}
                title="自動環繞"
                aria-pressed={autoRotate}
              >
                <Rotate3d size={14} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={() => setLabelsVisible((current) => !current)}
                className={cn("scene-tool !px-2", labelsVisible && "is-active")}
                title="顯示空間標籤"
                aria-pressed={labelsVisible}
              >
                <Tags size={14} strokeWidth={1.8} />
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="scene-tool !px-2"
                title="回到全區"
              >
                <ScanEye size={14} strokeWidth={1.8} />
              </button>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="scene-glass flex h-[36px] w-[36px] items-center justify-center rounded-[10px] text-[#526a70] transition-colors hover:bg-[#fbf8ef] hover:text-[#173b52] sm:h-[38px] sm:w-[38px]"
              title="全螢幕"
              aria-label="全螢幕"
            >
              <Maximize2 size={14} strokeWidth={1.8} />
            </button>
          </div>

          {/* selected information */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-20 flex flex-col items-start gap-2 sm:bottom-4 sm:left-4 sm:right-auto">
            {selectedPlace ? (
              <SelectedCard
                place={selectedPlace}
                activeFloor={activeFloor}
                onFloorChange={setActiveFloor}
                onClose={() => {
                  setSelectedId(null);
                  setActiveFloor(null);
                }}
                onFocus={() => sendCommand("focus", selectedPlace.id)}
                onOpenDirectory={() => setDirectoryOpen(true)}
              />
            ) : (
              <div className="scene-glass hidden items-center gap-3 rounded-[10px] px-3 py-2 sm:flex">
                <span className="text-[8px] font-bold tracking-[0.14em] text-[#9b9f97]">
                  圖例
                </span>
                <span className="h-3 w-px bg-[#ddd6c7]" />
                {[
                  ["教學大樓", "#3f7f9e"],
                  ["運動場地", "#bf7558"],
                  ["公共空間", "#6b9275"],
                ].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1.5 text-[8.5px] text-[#7c8886]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    {label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* compass + zoom */}
          <div className="absolute bottom-4 right-4 z-20 hidden flex-col items-center gap-2 sm:flex">
            <div className="scene-glass relative flex h-11 w-11 items-center justify-center rounded-full">
              <span className="absolute top-[4px] text-[6.5px] font-bold tracking-widest text-[#9b9e96]">
                N
              </span>
              <Compass size={25} strokeWidth={1.1} className="text-[#647879]" />
              <span className="absolute h-1.5 w-1.5 -translate-y-[7px] rounded-full bg-[#be715c]" />
            </div>
            <div className="scene-glass flex flex-col items-center rounded-[10px] p-1">
              <button
                type="button"
                onClick={() => sendCommand("zoomIn", selectedId)}
                className="scene-tool !h-7 !min-w-7 !px-0"
                aria-label="放大"
                title="放大"
              >
                <Plus size={13} strokeWidth={2} />
              </button>
              <span className="h-px w-5 bg-[#e3ddd0]" />
              <button
                type="button"
                onClick={() => sendCommand("zoomOut", selectedId)}
                className="scene-tool !h-7 !min-w-7 !px-0"
                aria-label="縮小"
                title="縮小"
              >
                <Minus size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-[#15364e]/78 px-3 py-1.5 text-[8.5px] text-white/70 backdrop-blur-md xl:flex">
            <MousePointer2 size={10} />
            拖曳旋轉
            <span className="h-2.5 w-px bg-white/20" />
            滾輪縮放
            <span className="h-2.5 w-px bg-white/20" />
            點擊建築查看
          </div>

          <div className="pointer-events-none absolute right-4 top-[84px] z-10 hidden items-center gap-1.5 text-[8px] tracking-wide text-[#625f55]/60 md:flex">
            <Crosshair size={10} />
            24.9848° N · 121.4847° E
          </div>

          <div className="pointer-events-none absolute bottom-3 right-3 z-10 flex items-center gap-1.5 rounded-full bg-[#f7f3e9]/70 px-2 py-1 text-[7.5px] tracking-wide text-[#747c75] backdrop-blur-sm sm:hidden">
            <Expand size={9} />
            115 學年度 · 光復國小
          </div>
        </section>
      </main>

      <GuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
      <DirectoryModal
        open={directoryOpen}
        onClose={() => setDirectoryOpen(false)}
        initialPlaceId={selectedId}
        onPick={handlePick}
      />
    </div>
  );
}
