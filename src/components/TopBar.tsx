import { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Building2,
  ChevronRight,
  CircleHelp,
  CornerDownLeft,
  DoorOpen,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { PLACES, searchCampus, type CampusPlace, type SearchResult } from "../data/campus";

interface TopBarProps {
  onPick: (placeId: string, floor?: number | null) => void;
  onOpenGuide: () => void;
  onOpenDirectory: () => void;
}

function SchoolCrest({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <circle cx="24" cy="24" r="23" fill="#f8f2e4" />
      <circle cx="24" cy="24" r="20.3" fill="none" stroke="#143552" strokeWidth="1.4" />
      <path
        d="M14.5 25.2c3.1-6.8 8.6-9 14.7-8.2-1.5 6-5.4 10.3-12.4 11.2"
        fill="none"
        stroke="#538c65"
        strokeWidth="4.6"
        strokeLinecap="round"
      />
      <path
        d="M28.8 15.9c4.9 1.8 7.3 5.8 7 11.4-4.7-1.3-7.7-4-8.8-8.7"
        fill="#cc6957"
      />
      <circle cx="18.6" cy="17.1" r="4.4" fill="#d3aa57" />
      <circle cx="18.9" cy="17.3" r="1.7" fill="#f8f2e4" />
      <path d="M17.1 34.5h13.8" stroke="#9c3d38" strokeWidth="2.1" strokeLinecap="round" />
    </svg>
  );
}

export function TopBar({ onPick, onOpenGuide, onOpenDirectory }: TopBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchCampus(query), [query]);
  const quickPlaces = useMemo(
    () =>
      ["track", "green-water", "garden", "rainbow"]
        .map((id) => PLACES.find((place) => place.id === id))
        .filter((place): place is CampusPlace => Boolean(place)),
    [],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (event.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const pick = (result: SearchResult) => {
    onPick(result.place.id, result.room?.floor ?? null);
    setQuery("");
    setOpen(false);
  };

  const shownResults: SearchResult[] = query.trim()
    ? results
    : quickPlaces.map((place) => ({ place }));

  return (
    <header className="relative z-40 shrink-0 bg-[#0d2b48]">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-5 lg:h-[68px] lg:flex-nowrap lg:py-0">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e6ddcb]/70 bg-[#f7f1e4] shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
            <SchoolCrest className="h-[38px] w-[38px]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5">
              <span className="truncate text-[14px] font-bold tracking-[0.06em] text-[#fbf8ef] sm:text-[15px]">
                新北市光復國民小學
              </span>
              <span className="hidden rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[8px] font-semibold tracking-[0.16em] text-white/60 xl:inline">
                中和區
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-[8px] font-medium tracking-[0.18em] text-white/45">
              <span className="truncate">GUANGFU ELEMENTARY</span>
              <span className="h-[2px] w-[2px] rounded-full bg-white/30" />
              <span className="text-[#a9c6b2]">CAMPUS 3D</span>
            </div>
          </div>
        </div>

        <div
          ref={rootRef}
          className="relative order-3 w-full sm:order-none sm:mx-auto sm:max-w-[430px] sm:flex-1"
        >
          <div
            className={`flex h-9 items-center gap-2 rounded-[10px] border px-3 transition-all duration-200 ${
              open
                ? "border-white/25 bg-white/[0.12] shadow-[0_0_0_3px_rgba(255,255,255,0.045)]"
                : "border-white/[0.12] bg-white/[0.075] hover:border-white/20 hover:bg-white/[0.1]"
            }`}
          >
            <Search size={14} strokeWidth={2} className="shrink-0 text-white/50" />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && shownResults[0]) pick(shownResults[0]);
              }}
              aria-label="搜尋教室、建築或空間"
              placeholder="搜尋教室、建築或空間…"
              className="h-full min-w-0 flex-1 border-0 bg-transparent text-[11.5px] tracking-wide text-[#fdf9ef] outline-none placeholder:text-white/38"
            />
            {query ? (
              <button
                type="button"
                aria-label="清除搜尋"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="text-white/45 transition-colors hover:text-white"
              >
                <X size={13} />
              </button>
            ) : (
              <span className="flex shrink-0 items-center gap-1 rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 text-[8.5px] font-semibold text-white/40">
                ⌘ K
              </span>
            )}
          </div>

          {open && (
            <div className="search-panel absolute left-0 right-0 top-[calc(100%+9px)] z-[70] overflow-hidden rounded-2xl border border-[#ddd6c6] bg-[#fdfaf3] shadow-[0_24px_60px_-16px_rgba(10,31,45,0.38)]">
              <div className="flex items-center justify-between border-b border-[#ece6d8] px-4 pb-2.5 pt-3">
                <span className="text-[9.5px] font-bold tracking-[0.14em] text-[#93958f]">
                  {query.trim() ? `搜尋結果 · ${results.length}` : "快速前往"}
                </span>
                <span className="text-[9px] text-[#aaa99f]">
                  {query.trim() ? "教室／建築／空間" : "熱門校園空間"}
                </span>
              </div>
              <div className="max-h-[310px] overflow-y-auto p-1.5 scroll-slim">
                {shownResults.length === 0 && (
                  <div className="flex flex-col items-center gap-1 px-4 py-8 text-center">
                    <Search size={21} strokeWidth={1.5} className="mb-1 text-[#b8b6ab]" />
                    <p className="text-[12px] font-semibold text-[#49545a]">找不到相符的空間</p>
                    <p className="text-[10px] leading-relaxed text-[#959b98]">
                      試試「藍天樓」、「操場」或教室代碼，例如 330。
                    </p>
                  </div>
                )}
                {shownResults.map((result, index) => {
                  const isRoom = Boolean(result.room);
                  const { place, room } = result;
                  return (
                    <button
                      key={`${place.id}-${room?.code ?? "place"}-${index}`}
                      type="button"
                      onClick={() => pick(result)}
                      className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-colors hover:bg-[#f1eee4]"
                    >
                      <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                        style={{
                          color: place.accent,
                          backgroundColor: `${place.accent}14`,
                          border: `1px solid ${place.accent}1c`,
                        }}
                      >
                        {isRoom ? (
                          <DoorOpen size={14} strokeWidth={1.8} />
                        ) : (
                          <Building2 size={14} strokeWidth={1.8} />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[12px] font-semibold text-[#263d4d]">
                            {isRoom ? room?.name : place.name}
                          </span>
                          {isRoom && (
                            <span className="numeric shrink-0 rounded bg-[#e9e5d9] px-1.5 py-0.5 text-[8.5px] font-bold tracking-wide text-[#79817e]">
                              {room?.code}
                            </span>
                          )}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1 text-[9.5px] text-[#939a96]">
                          {isRoom ? (
                            <>
                              <span>{place.name}</span>
                              <span className="h-[2px] w-[2px] rounded-full bg-[#c3c0b5]" />
                              <span>{room?.floor}F</span>
                            </>
                          ) : (
                            <>
                              <span>{place.category}</span>
                              <span className="h-[2px] w-[2px] rounded-full bg-[#c3c0b5]" />
                              <span>{place.floors > 1 ? `${place.floors}F 建築` : "校園空間"}</span>
                            </>
                          )}
                        </span>
                      </span>
                      <ChevronRight
                        size={13}
                        className="text-[#c0bdb1] transition-transform group-hover:translate-x-0.5 group-hover:text-[#54707d]"
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between border-t border-[#ece6d8] bg-[#f8f4e9] px-4 py-2">
                <span className="flex items-center gap-1.5 text-[9px] text-[#9b9d95]">
                  <CornerDownLeft size={10} />
                  Enter 選擇第一個結果
                </span>
                <span className="flex items-center gap-1 text-[9px] text-[#9b9d95]">
                  <MapPin size={10} />
                  3D 模型即時定位
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-1.5">
          <div className="mr-1 hidden h-8 items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.055] px-3 text-[9.5px] font-medium tracking-wide text-white/60 xl:flex">
            <span className="pulse-dot h-[5px] w-[5px] rounded-full bg-[#89be99]" />
            115 學年度
          </div>
          <button
            type="button"
            onClick={onOpenDirectory}
            className="hidden h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white md:flex"
          >
            <BookOpen size={14} strokeWidth={1.8} />
            教室索引
          </button>
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[10px] font-medium text-white/65 transition-colors hover:bg-white/[0.08] hover:text-white"
          >
            <CircleHelp size={15} strokeWidth={1.8} />
            <span className="hidden sm:inline">操作說明</span>
          </button>
          <div className="ml-1 hidden h-7 w-[1px] bg-white/10 sm:block" />
          <button
            type="button"
            onClick={() => inputRef.current?.focus()}
            aria-label="搜尋"
            className="icon-button ml-0.5 !h-8 !w-8 sm:hidden"
          >
            <Search size={15} />
          </button>
        </div>
      </div>
      <div className="campus-stripe h-[2px] w-full opacity-85" />
    </header>
  );
}
