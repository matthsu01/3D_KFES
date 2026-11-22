import {
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronRight,
  Compass,
  DoorOpen,
  Map,
  MousePointer2,
  Route,
  Trees,
  Trophy,
} from "lucide-react";
import {
  PLACES,
  SCHOOL,
  type CampusPlace,
  type PlaceCategory,
} from "../data/campus";

export type CategoryFilter = "全部" | "教學大樓" | "運動場地" | "公共空間";

interface SidebarProps {
  category: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
  selectedId: string | null;
  onSelect: (place: CampusPlace) => void;
  onOpenGuide: () => void;
  onOpenDirectory: () => void;
}

const FILTERS: { label: string; value: CategoryFilter }[] = [
  { label: "全部", value: "全部" },
  { label: "教學", value: "教學大樓" },
  { label: "運動", value: "運動場地" },
  { label: "公共", value: "公共空間" },
];

function CategoryIcon({
  category,
  size = 16,
}: {
  category: PlaceCategory;
  size?: number;
}) {
  if (category === "運動場地") return <Trophy size={size} strokeWidth={1.8} />;
  if (category === "公共空間") return <Trees size={size} strokeWidth={1.8} />;
  return <BookOpen size={size} strokeWidth={1.8} />;
}

function PlaceRow({
  place,
  selected,
  onSelect,
}: {
  place: CampusPlace;
  selected: boolean;
  onSelect: (place: CampusPlace) => void;
}) {
  const meta =
    place.rooms.length > 0
      ? `${place.floors}F · ${place.rooms.length} 間空間`
      : place.stats?.[0]
        ? `${place.category} · ${place.stats[0].value}`
        : place.category;

  return (
    <button
      type="button"
      onClick={() => onSelect(place)}
      className={`group relative flex w-full items-center gap-3 rounded-xl border px-2.5 py-[9px] text-left transition-all duration-150 ${
        selected
          ? "border-[#d8d0bf] bg-[#f2ede1] shadow-[0_2px_8px_rgba(49,58,55,0.04)]"
          : "border-transparent bg-transparent hover:border-[#e4ded1] hover:bg-[#f7f3e9]"
      }`}
    >
      {selected && (
        <span
          className="absolute bottom-2 left-0 top-2 w-[2.5px] rounded-full"
          style={{ backgroundColor: place.accent }}
        />
      )}
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border transition-transform group-hover:scale-[1.03]"
        style={{
          color: place.accent,
          backgroundColor: `${place.accent}12`,
          borderColor: `${place.accent}1f`,
        }}
      >
        <CategoryIcon category={place.category} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-[12px] font-semibold tracking-[0.01em] text-[#263f4f]">
            {place.name}
          </span>
          {place.category === "教學大樓" && (
            <span className="numeric shrink-0 rounded bg-[#eeeadf] px-1.5 py-[1px] text-[8px] font-bold text-[#8e938d]">
              {place.floors}F
            </span>
          )}
        </span>
        <span className="mt-[3px] block truncate text-[9.5px] text-[#9a9e97]">
          {meta}
        </span>
      </span>
      <ChevronRight
        size={13}
        className={`shrink-0 transition-all ${
          selected
            ? "text-[#637a80]"
            : "text-[#c5c1b6] group-hover:translate-x-0.5 group-hover:text-[#71858b]"
        }`}
      />
    </button>
  );
}

export function Sidebar({
  category,
  onCategoryChange,
  selectedId,
  onSelect,
  onOpenGuide,
  onOpenDirectory,
}: SidebarProps) {
  const filtered =
    category === "全部"
      ? PLACES
      : PLACES.filter((place) => place.category === category);
  const buildingCount = PLACES.filter((place) => place.category === "教學大樓").length;
  const counts: Record<CategoryFilter, number> = {
    全部: PLACES.length,
    教學大樓: buildingCount,
    運動場地: PLACES.filter((place) => place.category === "運動場地").length,
    公共空間: PLACES.filter((place) => place.category === "公共空間").length,
  };

  return (
    <aside className="app-card flex min-h-0 flex-col rounded-[18px] lg:h-full">
      <div className="border-b border-[#eae4d8] px-4 pb-3.5 pt-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="eyebrow flex items-center gap-1.5">
              <Map size={10} strokeWidth={2.2} />
              Campus Explorer
            </p>
            <h1 className="mt-1 text-[21px] font-bold leading-tight tracking-[0.02em] text-[#153348]">
              探索光復
            </h1>
          </div>
          <button
            type="button"
            onClick={onOpenDirectory}
            aria-label="開啟教室索引"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#e5dfd2] bg-[#f7f3e9] text-[#7e8b8c] transition-colors hover:border-[#d6cebd] hover:text-[#28495d]"
          >
            <DoorOpen size={14} strokeWidth={1.8} />
          </button>
        </div>
        <p className="mt-1.5 text-[10px] leading-[1.65] text-[#8c938f]">
          以 3D 量體走進 115 學年度的光復校園，點選建築查看樓層與空間配置。
        </p>

        <div className="mt-3.5 grid grid-cols-3 divide-x divide-[#e7e1d5] rounded-[10px] border border-[#e7e1d5] bg-[#f8f4eb] py-2">
          <div className="px-2">
            <div className="flex items-baseline gap-1">
              <span className="numeric text-[17px] font-semibold leading-none tracking-tight text-[#1d4053]">
                {buildingCount}
              </span>
              <span className="text-[8px] text-[#9b9e97]">棟</span>
            </div>
            <p className="mt-[3px] text-[8.5px] tracking-wide text-[#9b9e97]">教學建築</p>
          </div>
          <div className="px-2.5">
            <div className="flex items-baseline gap-1">
              <span className="numeric text-[17px] font-semibold leading-none tracking-tight text-[#1d4053]">
                {PLACES.length}
              </span>
              <span className="text-[8px] text-[#9b9e97]">處</span>
            </div>
            <p className="mt-[3px] text-[8.5px] tracking-wide text-[#9b9e97]">校園空間</p>
          </div>
          <div className="px-2.5">
            <div className="flex items-baseline gap-1">
              <span className="numeric text-[17px] font-semibold leading-none tracking-tight text-[#1d4053]">
                {SCHOOL.stats.gates}
              </span>
              <span className="text-[8px] text-[#9b9e97]">個</span>
            </div>
            <p className="mt-[3px] text-[8.5px] tracking-wide text-[#9b9e97]">進出動線</p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-1">
          {FILTERS.map((filter) => {
            const active = category === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onCategoryChange(filter.value)}
                className={`flex flex-1 items-center justify-center gap-1 rounded-md px-1 py-[5px] text-[9.5px] font-medium transition-all ${
                  active
                    ? "bg-[#15364e] text-[#fbf7ec] shadow-[0_2px_7px_rgba(21,54,78,0.17)]"
                    : "text-[#8f948e] hover:bg-[#f2eee4] hover:text-[#365264]"
                }`}
              >
                {filter.label}
                <span
                  className={`numeric text-[8px] ${
                    active ? "text-white/45" : "text-[#b4b3aa]"
                  }`}
                >
                  {counts[filter.value]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between px-4 pb-1.5 pt-3">
        <span className="text-[9px] font-semibold tracking-[0.14em] text-[#969a92]">
          {category === "全部" ? "全部校園空間" : category}
        </span>
        <span className="numeric text-[8.5px] text-[#b1b2a9]">{filtered.length} ITEMS</span>
      </div>

      <div className="scroll-slim min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {filtered.map((place) => (
          <PlaceRow
            key={place.id}
            place={place}
            selected={selectedId === place.id}
            onSelect={onSelect}
          />
        ))}
      </div>

      <div className="shrink-0 border-t border-[#eae4d8] p-3">
        <div className="rounded-xl border border-[#e5ded0] bg-[#f4f0e5] p-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e7e0d1] text-[#6d7f7d]">
              <Compass size={13} strokeWidth={1.9} />
            </span>
            <p className="text-[10.5px] font-semibold text-[#3f575f]">第一次使用 3D 導覽？</p>
            <ArrowUpRight size={12} className="ml-auto text-[#a8a79c]" />
          </div>
          <p className="mt-1.5 text-[9px] leading-[1.65] text-[#969990]">
            拖曳旋轉視角、滾輪縮放，點擊建築查看班級與空間。
          </p>
          <div className="mt-2.5 flex items-center gap-3 border-t border-[#e4ddce] pt-2 text-[8.5px] text-[#969a91]">
            <span className="flex items-center gap-1">
              <MousePointer2 size={10} />
              點擊探索
            </span>
            <span className="flex items-center gap-1">
              <Route size={10} />
              三個視角
            </span>
            <button
              type="button"
              onClick={onOpenGuide}
              className="ml-auto font-semibold text-[#4b7379] transition-colors hover:text-[#214b57]"
            >
              查看說明
            </button>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between px-0.5">
          <span className="flex items-center gap-1 text-[8px] tracking-wide text-[#a8a99f]">
            <Building2 size={9} />
            {SCHOOL.district} · {SCHOOL.year}
          </span>
          <span className="numeric text-[8px] text-[#b5b5ab]">GF / 3D</span>
        </div>
      </div>
    </aside>
  );
}
