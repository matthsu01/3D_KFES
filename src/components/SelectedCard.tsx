import {
  ArrowRight,
  BookOpen,
  Building2,
  DoorOpen,
  FlaskConical,
  Layers3,
  LocateFixed,
  Sparkles,
  Trees,
  Trophy,
  Users,
  X,
} from "lucide-react";
import {
  getFloorRooms,
  getFloors,
  type CampusPlace,
  type Room,
} from "../data/campus";

interface SelectedCardProps {
  place: CampusPlace;
  activeFloor: number | null;
  onFloorChange: (floor: number) => void;
  onClose: () => void;
  onFocus: () => void;
  onOpenDirectory: () => void;
}

function CampusIcon({ place }: { place: CampusPlace }) {
  if (place.category === "運動場地") return <Trophy size={17} strokeWidth={1.8} />;
  if (place.category === "公共空間") return <Trees size={17} strokeWidth={1.8} />;
  return <Building2 size={17} strokeWidth={1.8} />;
}

function RoomIcon({ room }: { room: Room }) {
  if (room.kind === "office") return <Users size={12} strokeWidth={1.8} />;
  if (room.kind === "special") return <FlaskConical size={12} strokeWidth={1.8} />;
  return <DoorOpen size={12} strokeWidth={1.8} />;
}

function zoneOf(place: CampusPlace) {
  if (place.z < -24) return "北側校區";
  if (place.z > 24) return "南側校區";
  if (place.x < -37) return "西側校區";
  if (place.x > 32) return "東側校區";
  return "中央校區";
}

export function SelectedCard({
  place,
  activeFloor,
  onFloorChange,
  onClose,
  onFocus,
  onOpenDirectory,
}: SelectedCardProps) {
  const floors = getFloors(place);
  const currentFloor = activeFloor ?? 1;
  const rooms = place.rooms.length > 0 ? getFloorRooms(place, currentFloor) : [];
  const facilityStats = place.stats ?? [];

  return (
    <div className="detail-card scene-glass pointer-events-auto relative z-20 w-full overflow-hidden rounded-[16px] sm:w-[338px]">
      <div
        className="absolute inset-x-0 top-0 h-[3px]"
        style={{ background: `linear-gradient(90deg, ${place.accent}, ${place.accent}44)` }}
      />
      <div className="scroll-slim max-h-[min(300px,42vh)] overflow-y-auto p-3.5 sm:max-h-[min(410px,52vh)]">
        <div className="flex items-start gap-2.5">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border"
            style={{
              color: place.accent,
              backgroundColor: `${place.accent}14`,
              borderColor: `${place.accent}25`,
            }}
          >
            <CampusIcon place={place} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="eyebrow !text-[8px] !tracking-[0.16em]">
              {place.category} <span className="mx-1 text-[#c4c0b5]">/</span> {zoneOf(place)}
            </p>
            <div className="mt-0.5 flex items-baseline gap-2">
              <h2 className="truncate text-[18px] font-bold leading-tight tracking-[0.02em] text-[#153348]">
                {place.name}
              </h2>
              <span className="numeric shrink-0 text-[8px] font-semibold tracking-[0.07em] text-[#a4a69d]">
                {place.rooms.length > 0 ? `${place.floors}F` : "OPEN"}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[8.5px] tracking-[0.08em] text-[#a3a59c]">
              {place.en}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="關閉空間資訊"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#969b93] transition-colors hover:bg-[#ebe6da] hover:text-[#3d5964]"
          >
            <X size={13} strokeWidth={1.9} />
          </button>
        </div>

        <p className="mt-2.5 line-clamp-2 text-[9.5px] leading-[1.7] text-[#858d89]">
          {place.description}
        </p>

        {place.rooms.length > 0 ? (
          <>
            <div className="mt-3 grid grid-cols-3 divide-x divide-[#e9e3d6] rounded-lg border border-[#e8e2d4] bg-[#f7f3e9] py-1.5">
              <div className="px-2.5">
                <p className="text-[7.5px] tracking-wide text-[#a0a39b]">樓層高度</p>
                <p className="numeric mt-0.5 text-[12px] font-semibold text-[#294958]">
                  1F – {place.floors}F
                </p>
              </div>
              <div className="px-2.5">
                <p className="text-[7.5px] tracking-wide text-[#a0a39b]">收錄空間</p>
                <p className="numeric mt-0.5 text-[12px] font-semibold text-[#294958]">
                  {place.rooms.length}
                  <span className="ml-0.5 text-[8px] font-normal text-[#9c9f97]">間</span>
                </p>
              </div>
              <div className="px-2.5">
                <p className="text-[7.5px] tracking-wide text-[#a0a39b]">位置</p>
                <p className="mt-0.5 truncate text-[10px] font-semibold text-[#294958]">
                  {zoneOf(place)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="flex items-center gap-1 text-[9px] font-semibold text-[#52686e]">
                <Layers3 size={11} strokeWidth={1.9} />
                選擇樓層
              </span>
              <span className="text-[8px] text-[#aaa99f]">點擊切換樓層空間</span>
            </div>
            <div
              className="mt-1.5 grid gap-1"
              style={{
                gridTemplateColumns: `repeat(${Math.min(floors.length, 6)}, minmax(0, 1fr))`,
              }}
            >
              {floors.map((floor) => {
                const active = currentFloor === floor;
                return (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => onFloorChange(floor)}
                    className={`numeric rounded-md border py-[5px] text-[9px] font-semibold transition-all ${
                      active
                        ? "border-[#183a51] bg-[#183a51] text-[#fbf7ec] shadow-sm"
                        : "border-[#e6dfd1] bg-[#faf7ef] text-[#8c938e] hover:border-[#cfc5b2] hover:text-[#385766]"
                    }`}
                  >
                    {floor}F
                  </button>
                );
              })}
            </div>

            <div className="mt-1.5 overflow-hidden rounded-lg border border-[#e8e1d3] bg-[#faf7f0]">
              {rooms.length === 0 ? (
                <p className="px-2.5 py-3 text-center text-[9px] text-[#a4a49a]">
                  此樓層尚未收錄空間資料
                </p>
              ) : (
                rooms.map((room, index) => (
                  <div
                    key={`${room.code}-${room.name}`}
                    className={`flex items-center gap-2 px-2.5 py-[6px] ${
                      index > 0 ? "border-t border-[#eee8dc]" : ""
                    }`}
                  >
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded"
                      style={{ color: place.accent, backgroundColor: `${place.accent}10` }}
                    >
                      <RoomIcon room={room} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[10px] font-medium text-[#42575f]">
                      {room.name}
                    </span>
                    <span className="numeric shrink-0 rounded bg-[#efebe1] px-1.5 py-[1px] text-[8px] font-bold tracking-wide text-[#8f948c]">
                      {room.code}
                    </span>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            {facilityStats.length > 0 && (
              <div
                className="mt-3 grid gap-1.5"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(facilityStats.length, 3)}, minmax(0, 1fr))`,
                }}
              >
                {facilityStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-[#e8e2d4] bg-[#f7f3e9] px-2 py-1.5"
                  >
                    <p className="text-[7.5px] tracking-wide text-[#a0a39b]">{stat.label}</p>
                    <p className="mt-0.5 truncate text-[10px] font-semibold text-[#294958]">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2.5 flex flex-wrap gap-1">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#e4ded0] bg-[#faf7ef] px-2 py-[3px] text-[8.5px] text-[#7d8885]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="mt-2.5 flex items-center gap-1.5">
          <button
            type="button"
            onClick={onFocus}
            className="flex h-[30px] flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#173a51] text-[9.5px] font-semibold text-[#fbf7ec] transition-colors hover:bg-[#214b63]"
          >
            <LocateFixed size={12} strokeWidth={1.9} />
            在模型中定位
            <ArrowRight size={11} />
          </button>
          <button
            type="button"
            onClick={onOpenDirectory}
            className="flex h-[30px] w-[30px] items-center justify-center rounded-lg border border-[#ded7c8] bg-[#faf7ef] text-[#778784] transition-colors hover:border-[#c9c0ae] hover:text-[#294958]"
            aria-label="查看完整教室索引"
          >
            <BookOpen size={13} strokeWidth={1.8} />
          </button>
        </div>
        {place.rooms.length > 0 && (
          <p className="mt-1.5 flex items-center justify-center gap-1 text-[7.5px] text-[#b0afa5]">
            <Sparkles size={8} />
            空間資料依 115 學年度教室配置圖建置
          </p>
        )}
      </div>
    </div>
  );
}
