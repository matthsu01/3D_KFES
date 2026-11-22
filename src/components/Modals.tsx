import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  ChevronRight,
  Compass,
  DoorOpen,
  Layers3,
  MapPin,
  MousePointer2,
  Move3d,
  Search,
  Trees,
  Trophy,
  X,
} from "lucide-react";
import {
  PLACES,
  SCHOOL,
  getPlace,
  type PlaceCategory,
} from "../data/campus";

interface ModalShellProps {
  open: boolean;
  title: string;
  kicker: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  widthClass?: string;
}

function useModalBehavior(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose, open]);
}

function ModalShell({
  open,
  title,
  kicker,
  onClose,
  children,
  footer,
  widthClass = "max-w-[760px]",
}: ModalShellProps) {
  useModalBehavior(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="關閉視窗"
        onClick={onClose}
        className="modal-veil absolute inset-0 bg-[#0b2438]/50 backdrop-blur-[5px]"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`modal-card relative flex max-h-[88vh] w-full ${widthClass} flex-col overflow-hidden rounded-[20px] border border-white/60 bg-[#fbf8ef] shadow-[0_40px_100px_-25px_rgba(5,24,37,0.5)]`}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-[#e8e1d3] px-5 py-4 sm:px-6">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#15364e] text-[#e9c483] shadow-[0_4px_12px_rgba(21,54,78,0.24)]">
            <Boxes size={17} strokeWidth={1.7} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow !text-[8px]">{kicker}</p>
            <h2 className="mt-0.5 text-[18px] font-bold tracking-[0.02em] text-[#173448]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e2dbcd] bg-[#f5f0e5] text-[#858b85] transition-colors hover:border-[#d0c7b7] hover:text-[#294958]"
          >
            <X size={15} strokeWidth={1.9} />
          </button>
        </div>
        {children}
        {footer}
      </div>
    </div>
  );
}

export function GuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="使用 3D 校園導覽"
      kicker="Campus guide · 光復國小"
      footer={
        <div className="flex shrink-0 flex-col items-start justify-between gap-2 border-t border-[#e8e1d3] bg-[#f6f2e8] px-5 py-3 sm:flex-row sm:items-center sm:px-6">
          <div className="flex items-center gap-1.5 text-[9px] text-[#92978f]">
            <MapPin size={10} />
            {SCHOOL.address}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-[#173a51] px-3 text-[9.5px] font-semibold text-[#fbf7ec] transition-colors hover:bg-[#224e64]"
          >
            開始探索校園
            <ArrowUpRight size={12} />
          </button>
        </div>
      }
    >
      <div className="scroll-slim overflow-y-auto p-5 sm:p-6">
        <div className="overflow-hidden rounded-xl border border-[#e5ddce] bg-[#f5f0e4]">
          <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#dcd2c0] bg-[#fbf8ef] text-[#3f7581]">
              <Compass size={23} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#294958]">光復校園 · 115 學年度立體配置</p>
              <p className="mt-1 text-[9.5px] leading-[1.7] text-[#8a918b]">
                從空拍量體到教室索引，在同一個畫面裡認識校園。{SCHOOL.coords}。
              </p>
            </div>
            <div className="ml-auto hidden shrink-0 flex-col items-end text-right sm:flex">
              <span className="numeric text-[19px] font-semibold text-[#294958]">3D</span>
              <span className="text-[8px] tracking-[0.16em] text-[#a2a69e]">DIGITAL TWIN</span>
            </div>
          </div>
          <div className="campus-stripe h-[3px] w-full opacity-80" />
        </div>

        <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
          {[
            {
              icon: <Move3d size={16} strokeWidth={1.7} />,
              title: "旋轉與縮放",
              body: "在模型中拖曳即可環繞校園，滾輪或雙指縮放。也可用上方「3D／俯視」切換視角。",
              note: "01",
            },
            {
              icon: <MousePointer2 size={16} strokeWidth={1.7} />,
              title: "點選建築",
              body: "點擊模型或空間標籤，鏡頭會自動聚焦，右下方會顯示樓層、教室與空間資訊。",
              note: "02",
            },
            {
              icon: <Search size={16} strokeWidth={1.7} />,
              title: "搜尋與樓層",
              body: "按 ⌘K 搜尋教室代碼或空間名稱；在資訊卡切換樓層，即可查看該層的收錄空間。",
              note: "03",
            },
          ].map((item) => (
            <div
              key={item.note}
              className="relative rounded-xl border border-[#e7e0d2] bg-[#fbf8f1] p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#edf0e9] text-[#54766e]">
                  {item.icon}
                </span>
                <span className="numeric text-[9px] font-semibold tracking-[0.1em] text-[#c3bdaF]">
                  {item.note}
                </span>
              </div>
              <p className="mt-2.5 text-[10.5px] font-semibold text-[#38525a]">{item.title}</p>
              <p className="mt-1 text-[9px] leading-[1.7] text-[#91968f]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-xl border border-[#e7e0d2] bg-[#fbf8f1] p-4">
            <p className="text-[9px] font-bold tracking-[0.13em] text-[#858d88]">校園圖例</p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2.5">
              {(
                [
                  ["教學大樓", "#3f7f9e", <BookOpen size={13} />],
                  ["運動場地", "#bf7558", <Trophy size={13} />],
                  ["公共空間", "#6b9275", <Trees size={13} />],
                ] as [PlaceCategory, string, React.ReactNode][]
              ).map(([label, color, icon]) => (
                <span key={label} className="flex items-center gap-2 text-[9.5px] text-[#6c7a7b]">
                  <span
                    className="flex h-6 w-6 items-center justify-center rounded-md"
                    style={{ color, backgroundColor: `${color}14` }}
                  >
                    {icon}
                  </span>
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-[#e8e1d3] bg-[#f7f2e7] px-2.5 py-2">
              <Layers3 size={12} className="text-[#7c8f88]" />
              <p className="text-[8.5px] leading-relaxed text-[#969c94]">
                建築以 H、I、J、K、L 及 A、B、C 樓梯分區建置；可在「教室索引」查看完整空間清單。
              </p>
            </div>
          </div>
          <div className="rounded-xl border border-[#e7e0d2] bg-[#173b52] p-4 text-[#f5f1e5]">
            <p className="text-[8.5px] font-semibold tracking-[0.16em] text-[#a9c0c1]">
              校園位址
            </p>
            <p className="mt-2 text-[11px] font-semibold leading-relaxed">{SCHOOL.address}</p>
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              <MapPin size={12} className="text-[#d8b778]" />
              <span className="numeric text-[9px] tracking-wide text-white/60">{SCHOOL.coords}</span>
            </div>
          </div>
        </div>

        <p className="mt-3 flex items-start gap-1.5 text-[8px] leading-relaxed text-[#aaa9a0]">
          <BookOpen size={10} className="mt-[1px] shrink-0" />
          模型依 115 學年度教室配置平面圖與校園空拍畫面重建，建築量體與位置作為導覽示意，非精確測量成果。
        </p>
      </div>
    </ModalShell>
  );
}

export function DirectoryModal({
  open,
  onClose,
  initialPlaceId,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  initialPlaceId: string | null;
  onPick: (placeId: string, floor?: number | null) => void;
}) {
  const [selectedId, setSelectedId] = useState<string>("blue-sky");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const initial = getPlace(initialPlaceId);
    if (open) {
      setSelectedId(initial?.render === "building" ? initial.id : "blue-sky");
      setQuery("");
    }
  }, [initialPlaceId, open]);

  const buildings = PLACES.filter((place) => place.render === "building");
  const place = getPlace(selectedId) ?? buildings[0];

  const matches = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    if (!keyword) return [];
    return buildings.flatMap((building) =>
      building.rooms
        .filter((room) =>
          [room.name, room.code, building.name].join(" ").toLowerCase().includes(keyword),
        )
        .map((room) => ({ building, room })),
    );
  }, [buildings, query]);

  const groupedRooms = useMemo(() => {
    if (!place) return [];
    return Array.from(new Set(place.rooms.map((room) => room.floor)))
      .sort((a, b) => b - a)
      .map((floor) => ({
        floor,
        rooms: place.rooms.filter((room) => room.floor === floor),
      }));
  }, [place]);

  const choose = (buildingId: string, floor?: number | null) => {
    onPick(buildingId, floor);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="教室快速索引"
      kicker="Space directory · 115 學年度"
      widthClass="max-w-[870px]"
      footer={
        <div className="flex shrink-0 flex-col items-start justify-between gap-2 border-t border-[#e8e1d3] bg-[#f6f2e8] px-5 py-3 sm:flex-row sm:items-center sm:px-6">
          <span className="text-[9px] text-[#93988f]">
            收錄 {buildings.length} 棟教學建築 ·{" "}
            {buildings.reduce((total, item) => total + item.rooms.length, 0)} 間教室與空間
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-[#dcd4c5] bg-[#fbf8ef] px-3 text-[9.5px] font-semibold text-[#50686e] transition-colors hover:border-[#c6bcaa] hover:text-[#294958]"
          >
            關閉索引
          </button>
        </div>
      }
    >
      <div className="border-b border-[#e9e2d5] bg-[#f8f4ea] px-4 py-3 sm:px-5">
        <div className="flex h-9 items-center gap-2 rounded-lg border border-[#e2dbcd] bg-[#fdfaf3] px-3 focus-within:border-[#a8b9b6] focus-within:ring-2 focus-within:ring-[#a8b9b6]/15">
          <Search size={14} className="text-[#9ea39b]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="輸入教室名稱或代碼，例如「圖書館」、「330」…"
            className="h-full min-w-0 flex-1 bg-transparent text-[11px] text-[#294958] outline-none placeholder:text-[#b1b2a9]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="清除搜尋"
              className="text-[#a1a49c] hover:text-[#4f686f]"
            >
              <X size={12} />
            </button>
          )}
          <span className="rounded border border-[#e7e0d2] bg-[#f3eee3] px-1.5 py-0.5 text-[8px] text-[#9da097]">
            教室代碼
          </span>
        </div>
        <div className="hide-scrollbar mt-2 flex gap-1 overflow-x-auto md:hidden">
          {buildings.map((building) => (
            <button
              key={building.id}
              type="button"
              onClick={() => setSelectedId(building.id)}
              className={`shrink-0 rounded-md border px-2 py-1 text-[8.5px] font-medium transition-colors ${
                building.id === selectedId
                  ? "border-[#173a51] bg-[#173a51] text-[#fbf7ec]"
                  : "border-[#e1d9ca] bg-[#fbf8f0] text-[#7b8784]"
              }`}
            >
              {building.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid min-h-0 flex-1 md:grid-cols-[228px_1fr]">
        <aside className="hidden min-h-0 flex-col border-r border-[#e8e1d3] bg-[#faf6ed] md:flex">
          <p className="px-4 pb-1.5 pt-3 text-[8.5px] font-bold tracking-[0.15em] text-[#9a9f97]">
            教學建築
          </p>
          <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-2 pb-3">
            {buildings.map((building) => {
              const active = building.id === selectedId;
              return (
                <button
                  key={building.id}
                  type="button"
                  onClick={() => setSelectedId(building.id)}
                  className={`group flex w-full items-center gap-2.5 rounded-lg border px-2 py-[7px] text-left transition-colors ${
                    active
                      ? "border-[#ded6c7] bg-[#f0ebdf]"
                      : "border-transparent hover:border-[#e8e1d3] hover:bg-[#f5f0e5]"
                  }`}
                >
                  <span
                    className="numeric flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[9px] font-bold"
                    style={{
                      color: building.accent,
                      backgroundColor: `${building.accent}13`,
                      border: `1px solid ${building.accent}1c`,
                    }}
                  >
                    {building.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[10.5px] font-semibold text-[#35525b]">
                      {building.name}
                    </span>
                    <span className="numeric block text-[8px] text-[#a0a39c]">
                      {building.floors}F · {building.rooms.length} 間
                    </span>
                  </span>
                  <ChevronRight
                    size={11}
                    className={active ? "text-[#7f8c86]" : "text-[#c7c3b8]"}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <section className="scroll-slim min-h-0 flex-1 overflow-y-auto bg-[#fdfaf3]">
          {query.trim() ? (
            <div className="p-4 sm:p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="text-[12px] font-bold text-[#35525b]">搜尋結果</h3>
                <span className="numeric text-[8.5px] text-[#9fa29b]">{matches.length} 筆</span>
              </div>
              {matches.length === 0 ? (
                <div className="flex flex-col items-center px-4 py-12 text-center">
                  <Search size={22} strokeWidth={1.4} className="mb-2 text-[#c2bdb1]" />
                  <p className="text-[11px] font-semibold text-[#6f7c7c]">沒有找到相符的教室</p>
                  <p className="mt-1 text-[9px] text-[#a5a69e]">請嘗試建築名稱或三碼教室代碼。</p>
                </div>
              ) : (
                <div className="mt-2 divide-y divide-[#ece5d8] overflow-hidden rounded-lg border border-[#e8e1d3] bg-[#fbf8f1]">
                  {matches.map(({ building, room }, index) => (
                    <button
                      key={`${building.id}-${room.code}-${index}`}
                      type="button"
                      onClick={() => choose(building.id, room.floor)}
                      className="group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[#f3eee3]"
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md"
                        style={{ color: building.accent, backgroundColor: `${building.accent}12` }}
                      >
                        <DoorOpen size={12} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[10.5px] font-semibold text-[#39525a]">
                          {room.name}
                        </span>
                        <span className="text-[8.5px] text-[#a0a39c]">
                          {building.name} · {room.floor}F
                        </span>
                      </span>
                      <span className="numeric rounded border border-[#e9e2d4] bg-[#f2ede2] px-1.5 py-0.5 text-[8px] font-semibold text-[#8d928b]">
                        {room.code}
                      </span>
                      <ArrowUpRight size={11} className="text-[#b0b0a5] group-hover:text-[#567078]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : place ? (
            <div className="p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#ece5d8] pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="flex h-9 w-9 items-center justify-center rounded-[10px]"
                    style={{
                      color: place.accent,
                      backgroundColor: `${place.accent}13`,
                      border: `1px solid ${place.accent}22`,
                    }}
                  >
                    <BookOpen size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#294958]">{place.name}</h3>
                    <p className="mt-0.5 text-[8.5px] text-[#9da098]">
                      {place.en} · {place.floors}F
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => choose(place.id, 1)}
                  className="flex h-7 items-center gap-1.5 rounded-md bg-[#173a51] px-2.5 text-[8.5px] font-semibold text-[#fbf7ec] transition-colors hover:bg-[#214d63]"
                >
                  <MapPin size={10} />
                  在 3D 中開啟
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-3">
                {groupedRooms.map((group) => (
                  <div key={group.floor} className="rounded-lg border border-[#e9e2d4] bg-[#fbf8f1]">
                    <div className="flex items-center gap-2 border-b border-[#eee8dc] px-3 py-1.5">
                      <span className="numeric text-[9px] font-bold text-[#6c807f]">
                        {group.floor}F
                      </span>
                      <span className="h-[2px] w-[2px] rounded-full bg-[#c7c2b6]" />
                      <span className="numeric text-[8px] text-[#a5a69e]">
                        {group.rooms.length} 間收錄空間
                      </span>
                    </div>
                    <div className="grid gap-1 p-2 sm:grid-cols-3">
                      {group.rooms.map((room) => (
                        <button
                          key={room.code}
                          type="button"
                          onClick={() => choose(place.id, room.floor)}
                          className="group flex items-center gap-1.5 rounded-md border border-transparent bg-[#f5f1e7] px-2 py-1.5 text-left transition-colors hover:border-[#ddd5c6] hover:bg-[#efe9dc]"
                        >
                          <DoorOpen size={10} className="shrink-0 text-[#8b9d97]" />
                          <span className="min-w-0 flex-1 truncate text-[9px] font-medium text-[#51666c]">
                            {room.name}
                          </span>
                          <span className="numeric shrink-0 text-[7.5px] text-[#aaa89e]">
                            {room.code}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#e7e0d2] bg-[#f8f4ea] px-2 py-1 text-[8.5px] text-[#87918c]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </ModalShell>
  );
}
