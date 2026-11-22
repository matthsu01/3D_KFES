export type PlaceCategory = "教學大樓" | "運動場地" | "公共空間";

export type PlaceShape = "block" | "curved" | "circular" | "complex";

export type PlaceRender =
  | "building"
  | "track"
  | "court"
  | "playground"
  | "garden"
  | "sandpit"
  | "stage"
  | "pond"
  | "gym";

export interface Room {
  floor: number;
  name: string;
  code: string;
  kind?: "classroom" | "office" | "special" | "outdoor";
}

export interface Wing {
  x: number;
  z: number;
  width: number;
  depth: number;
  floors?: number;
}

export interface CampusPlace {
  id: string;
  name: string;
  label: string;
  en: string;
  category: PlaceCategory;
  render: PlaceRender;
  shape?: PlaceShape;
  floors: number;
  accent: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  rotation?: number;
  description: string;
  tags: string[];
  rooms: Room[];
  wings?: Wing[];
  radius?: number;
  thickness?: number;
  arcStart?: number;
  arcEnd?: number;
  segments?: number;
  showLabel?: boolean;
  labelHeight?: number;
  stats?: { label: string; value: string }[];
}

function r(spec: Record<number, [string, string][]>): Room[] {
  return Object.entries(spec).flatMap(([floor, items]) =>
    items.map(([name, code], index) => ({
      floor: Number(floor),
      name,
      code,
      kind:
        /處|室|中心|會議|校長|會|宿舍/.test(name) && !/教室/.test(name)
          ? ("office" as const)
          : index === 2
            ? ("special" as const)
            : ("classroom" as const),
    })),
  );
}

export const SCHOOL = {
  name: "光復國民小學",
  district: "新北市中和區",
  year: "115 學年度",
  address: "235024 新北市中和區光環路二段 1 號",
  english: "Guangfu Elementary School",
  coords: "24.9848° N · 121.4847° E",
  stats: {
    buildings: "10",
    gates: "6",
    sports: "4",
    classrooms: "132",
  },
};

export const CATEGORY_COLORS: Record<PlaceCategory, string> = {
  教學大樓: "#3f7f9e",
  運動場地: "#bf7558",
  公共空間: "#6b9275",
};

export const PLACES: CampusPlace[] = [
  {
    id: "north-wing",
    name: "教學樓 H·I",
    label: "H·I 教學樓",
    en: "North Classroom Wing",
    category: "教學大樓",
    render: "building",
    shape: "block",
    floors: 5,
    accent: "#4f89ac",
    x: -57,
    z: -40,
    width: 31,
    depth: 15,
    description:
      "面向晨光廣場的北側教學區，H、I 兩座樓梯串連普通教室、行政空間與教師研究室。",
    tags: ["普通教室", "行政辦公", "教師研究室"],
    rooms: r({
      1: [
        ["教務處", "101"],
        ["學務處", "102"],
        ["健康中心", "103"],
      ],
      2: [
        ["二年八班", "228"],
        ["二年七班", "227"],
        ["資源教室", "226"],
      ],
      3: [
        ["三年六班", "328"],
        ["三年五班", "327"],
        ["自然教室", "326"],
      ],
      4: [
        ["四年十班", "428"],
        ["四年九班", "427"],
        ["美勞教室", "426"],
      ],
      5: [
        ["五年十班", "529"],
        ["五年九班", "528"],
        ["視聽教室", "530"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "blue-sky",
    name: "藍天樓",
    label: "藍天樓",
    en: "Blue Sky Building",
    category: "教學大樓",
    render: "building",
    shape: "block",
    floors: 6,
    accent: "#3f86c6",
    x: -16,
    z: -41,
    width: 23,
    depth: 17,
    description:
      "校園北側的六年級教學區，與晨光廣場相鄰，設有班級教室、資源班及行政會議空間。",
    tags: ["六年級", "資源班", "行政區"],
    rooms: r({
      1: [
        ["總務處", "130"],
        ["校長室", "131"],
        ["會議室", "132"],
      ],
      2: [
        ["圖書室", "231"],
        ["閱讀中心", "230"],
        ["資源班", "232"],
      ],
      3: [
        ["六年十班", "330"],
        ["六年十三班", "331"],
        ["資訊教室", "332"],
      ],
      4: [
        ["五年六班", "428"],
        ["五年九班", "429"],
        ["英語教室", "430"],
      ],
      5: [
        ["六年十三班", "431"],
        ["六年十班", "532"],
        ["音樂教室", "533"],
      ],
      6: [
        ["六年十班", "630"],
        ["六年十三班", "631"],
        ["多功能教室", "632"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "green-water",
    name: "綠水樓",
    label: "綠水樓",
    en: "Green Water Building",
    category: "教學大樓",
    render: "building",
    shape: "complex",
    floors: 4,
    accent: "#4b9e83",
    x: 26,
    z: -41,
    width: 32,
    depth: 21,
    wings: [
      { x: 0, z: -6, width: 31, depth: 8 },
      { x: -11.5, z: 3, width: 8, depth: 14 },
      { x: 11.5, z: 3, width: 8, depth: 14 },
    ],
    description:
      "結合圖書館、幼兒園與多功能活動室的學習聚落，南向開口圍塑出安靜的閱讀庭院。",
    tags: ["圖書館", "幼兒園", "多功能教室"],
    rooms: r({
      1: [
        ["幼兒園遊戲室", "132"],
        ["體操教室", "035"],
        ["圖書館", "112"],
      ],
      2: [
        ["圖書館閱覽區", "232"],
        ["多功能教室", "231"],
        ["閱讀角", "230"],
      ],
      3: [
        ["三年三班", "332"],
        ["三年二班", "333"],
        ["舞蹈教室", "334"],
      ],
      4: [
        ["多功能活動中心", "432"],
        ["女生宿舍", "431"],
        ["舞蹈教室", "430"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "indigo-sea",
    name: "靛海樓",
    label: "靛海樓",
    en: "Indigo Sea Building",
    category: "教學大樓",
    render: "building",
    shape: "curved",
    floors: 5,
    accent: "#4a8fa5",
    x: -55,
    z: 7,
    width: 38,
    depth: 38,
    radius: 17.5,
    thickness: 8.5,
    arcStart: 55,
    arcEnd: 305,
    segments: 10,
    description:
      "沿校園西側展開的弧形教學樓，以連續的走廊環抱內庭，是校園最具辨識度的量體之一。",
    tags: ["弧形量體", "輔導空間", "藝術教室"],
    rooms: r({
      1: [
        ["警衛室", "G01"],
        ["家長會辦公室", "G02"],
        ["會議室", "G03"],
      ],
      2: [
        ["資源班", "201"],
        ["輔導室", "202"],
        ["諮商室", "203"],
      ],
      3: [
        ["美勞教室", "301"],
        ["自然教室", "302"],
        ["英語教室", "303"],
      ],
      4: [
        ["五年七班", "401"],
        ["五年八班", "402"],
        ["社會教室", "403"],
      ],
      5: [
        ["多功能教室", "501"],
        ["視聽教室", "502"],
        ["教師研究室", "503"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "purple-cloud",
    name: "紫霞樓",
    label: "紫霞樓",
    en: "Purple Cloud Building",
    category: "教學大樓",
    render: "building",
    shape: "block",
    floors: 5,
    accent: "#9577b4",
    x: -29,
    z: 9,
    width: 18,
    depth: 19,
    description:
      "緊鄰靛海樓的教學空間，以音樂、藝術與自然教室為主，東側可眺望中央綠帶。",
    tags: ["藝術課程", "音樂教室", "多功能空間"],
    rooms: r({
      1: [
        ["舞蹈教室", "027"],
        ["桌球教室", "020"],
        ["樂活教室", "021"],
      ],
      2: [
        ["二年五班", "227"],
        ["二年六班", "226"],
        ["音樂教室", "225"],
      ],
      3: [
        ["四年九班", "328"],
        ["四年十班", "329"],
        ["自然教室", "327"],
      ],
      4: [
        ["五年八班", "426"],
        ["五年七班", "425"],
        ["美勞教室", "424"],
      ],
      5: [
        ["五年十一班", "527"],
        ["多功能教室", "526"],
        ["視聽教室", "525"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "yellow-butterfly",
    name: "黃蝶樓",
    label: "黃蝶樓",
    en: "Yellow Butterfly Building",
    category: "教學大樓",
    render: "building",
    shape: "block",
    floors: 5,
    accent: "#d4ae4d",
    x: 0,
    z: 2,
    width: 23,
    depth: 21,
    description:
      "校園正中央的教學核心，班級教室與中庭花園相鄰，是串連南北校區的重要節點。",
    tags: ["中年級", "中央教學區", "近中庭花園"],
    rooms: r({
      1: [
        ["班級教室", "112"],
        ["班級教室", "111"],
        ["閱覽室", "110"],
      ],
      2: [
        ["二年四班", "204"],
        ["二年五班", "205"],
        ["資源班", "206"],
      ],
      3: [
        ["四年七班", "314"],
        ["四年八班", "315"],
        ["自然教室", "316"],
      ],
      4: [
        ["五年三班", "414"],
        ["五年四班", "415"],
        ["英語教室", "416"],
      ],
      5: [
        ["五年三班", "514"],
        ["五年四班", "515"],
        ["多功能教室", "516"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "orange-sun",
    name: "橙陽樓",
    label: "橙陽樓",
    en: "Orange Sun Building",
    category: "教學大樓",
    render: "building",
    shape: "complex",
    floors: 4,
    accent: "#df9958",
    x: 24,
    z: 3,
    width: 16,
    depth: 25,
    wings: [
      { x: 0, z: 2, width: 15, depth: 21 },
      { x: 0, z: -11, width: 11, depth: 7 },
    ],
    description:
      "東側四層教學樓，鄰近操場與司令台，擁有校園中最開闊的運動視野。",
    tags: ["幼兒園", "閱讀空間", "近操場"],
    rooms: r({
      1: [
        ["幼兒園", "110"],
        ["遊戲室", "111"],
        ["辦公室", "112"],
      ],
      2: [
        ["二年九班", "209"],
        ["二年十班", "210"],
        ["閱讀室", "211"],
      ],
      3: [
        ["三年三班", "309"],
        ["三年四班", "310"],
        ["烹飪教室", "311"],
      ],
      4: [
        ["五年五班", "410"],
        ["五年六班", "411"],
        ["視聽教室", "412"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "red-maple",
    name: "紅楓樓",
    label: "紅楓樓",
    en: "Red Maple Building",
    category: "教學大樓",
    render: "building",
    shape: "complex",
    floors: 6,
    accent: "#c66b60",
    x: 4,
    z: 36,
    width: 38,
    depth: 18,
    wings: [
      { x: 0, z: 4, width: 37, depth: 8 },
      { x: -14.5, z: -2, width: 8, depth: 14 },
      { x: 14.5, z: -2, width: 8, depth: 14 },
    ],
    description:
      "南側六層教學區，A、B、C 三座樓梯串連各班群，中央內庭是孩子們的下課集合地。",
    tags: ["高年級", "六層量體", "南側校區"],
    rooms: r({
      1: [
        ["班級教室", "101"],
        ["資源班", "102"],
        ["第一會議室", "103"],
      ],
      2: [
        ["三年六班", "204"],
        ["四年六班", "205"],
        ["音樂教室", "206"],
      ],
      3: [
        ["四年四班", "304"],
        ["四年五班", "305"],
        ["自然教室", "306"],
      ],
      4: [
        ["四年四班", "404"],
        ["五年五班", "405"],
        ["英語教室", "406"],
      ],
      5: [
        ["四年五班", "504"],
        ["五年五班", "505"],
        ["多功能教室", "506"],
      ],
      6: [
        ["六年六班", "604"],
        ["六年七班", "605"],
        ["視聽教室", "606"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "rainbow",
    name: "彩虹樓",
    label: "彩虹樓",
    en: "Rainbow Building",
    category: "教學大樓",
    render: "building",
    shape: "circular",
    floors: 4,
    accent: "#c7939e",
    x: -39,
    z: 39,
    width: 27,
    depth: 27,
    radius: 13.5,
    description:
      "校園西南角的圓形地標，圓頂天窗引入自然光，以資源與藝術學習空間為主。",
    tags: ["圓形量體", "圓頂天窗", "特色教室"],
    rooms: r({
      1: [
        ["會議室", "123"],
        ["資源教室", "122"],
        ["舞蹈教室", "121"],
      ],
      2: [
        ["二年級教室", "222"],
        ["恐龍班", "221"],
        ["海豚班", "220"],
      ],
      3: [
        ["三年級教室", "322"],
        ["蝴蝶班", "321"],
        ["彩虹班", "320"],
      ],
      4: [
        ["美勞教室", "423"],
        ["自然教室", "422"],
        ["職能教室", "421"],
      ],
    }),
    showLabel: true,
  },
  {
    id: "track",
    name: "操場",
    label: "操場",
    en: "Athletics Field",
    category: "運動場地",
    render: "track",
    floors: 1,
    accent: "#bd6a52",
    x: 52,
    z: 2,
    width: 35,
    depth: 57,
    description:
      "環形跑道與中央球場是校園最開闊的活動場域，田徑、球賽與校慶慶典都在此發生。",
    tags: ["環形跑道", "籃球場", "校慶場地"],
    rooms: [],
    showLabel: true,
    labelHeight: 4.2,
    stats: [
      { label: "跑道", value: "200 m" },
      { label: "球場", value: "2 面" },
      { label: "容納", value: "全校" },
    ],
  },
  {
    id: "court",
    name: "光電球場",
    label: "光電球場",
    en: "Solar Basketball Court",
    category: "運動場地",
    render: "court",
    floors: 1,
    accent: "#d6a844",
    x: 58,
    z: 44,
    width: 19,
    depth: 17,
    description:
      "校園東南角的半戶外球場，鮮明的藍黃配色是從環中路望向校園時的第一眼印象。",
    tags: ["籃球場", "半戶外", "東南角"],
    rooms: [],
    showLabel: true,
    labelHeight: 3.6,
    stats: [
      { label: "球場", value: "1 面" },
      { label: "地面", value: "止滑鋪面" },
    ],
  },
  {
    id: "garden",
    name: "中庭花園",
    label: "中庭花園",
    en: "Central Courtyard",
    category: "公共空間",
    render: "garden",
    floors: 1,
    accent: "#6e9c78",
    x: 10,
    z: -17,
    width: 15,
    depth: 11,
    description:
      "黃蝶樓與綠水樓之間的中庭綠帶，以樹蔭、砌石步道與小花園串連教學空間。",
    tags: ["庭園", "休憩", "生態教學"],
    rooms: [],
    showLabel: true,
    labelHeight: 3.2,
    stats: [
      { label: "植栽", value: "32 種" },
      { label: "座席", value: "24 席" },
    ],
  },
  {
    id: "playground",
    name: "遊戲區",
    label: "遊戲區",
    en: "Play Area",
    category: "公共空間",
    render: "playground",
    floors: 1,
    accent: "#d49256",
    x: 21,
    z: 22,
    width: 12,
    depth: 10,
    description:
      "低年級孩子的下課遊憩空間，設有溜滑梯、攀爬架與安全地墊，鄰近紅楓樓與橙陽樓。",
    tags: ["溜滑梯", "攀爬架", "安全地墊"],
    rooms: [],
    showLabel: true,
    labelHeight: 3.5,
    stats: [{ label: "建議", value: "低年級" }],
  },
  {
    id: "stage",
    name: "司令台",
    label: "司令台",
    en: "Assembly Stage",
    category: "運動場地",
    render: "stage",
    floors: 1,
    accent: "#3d6c84",
    x: 32,
    z: 2,
    width: 4.5,
    depth: 14,
    description:
      "操場西側的典禮主席台，是校慶、運動會與每週朝會的重要舞台。",
    tags: ["典禮", "朝會", "操場西側"],
    rooms: [],
    showLabel: true,
    labelHeight: 3.2,
  },
  {
    id: "sandpit",
    name: "沙坑",
    label: "沙坑",
    en: "Long Jump Pit",
    category: "運動場地",
    render: "sandpit",
    floors: 1,
    accent: "#c8a467",
    x: 60,
    z: -47,
    width: 9,
    depth: 6,
    description: "校園東北角的跳遠沙坑，與跑道及體能訓練區相鄰。",
    tags: ["跳遠", "體能訓練"],
    rooms: [],
    showLabel: true,
    labelHeight: 2.4,
  },
  {
    id: "eco-garden",
    name: "生態教材園",
    label: "生態教材園",
    en: "Eco Learning Garden",
    category: "公共空間",
    render: "pond",
    floors: 1,
    accent: "#5f9b8b",
    x: -74,
    z: -21,
    width: 11,
    depth: 15,
    description:
      "校園西北側的戶外生態池與教材園，提供觀察水生植物與昆蟲的自然教室。",
    tags: ["生態池", "水生植物", "自然教室"],
    rooms: [],
    showLabel: true,
    labelHeight: 2.8,
  },
];

export const getPlace = (id: string | null) =>
  PLACES.find((place) => place.id === id) ?? null;

export const getFloorRooms = (place: CampusPlace, floor: number) =>
  place.rooms.filter((room) => room.floor === floor);

export const getFloors = (place: CampusPlace) =>
  Array.from({ length: place.floors }, (_, index) => place.floors - index);

export interface SearchResult {
  place: CampusPlace;
  room?: Room;
}

export function searchCampus(query: string): SearchResult[] {
  const keyword = query.trim().toLowerCase();
  if (!keyword) return [];

  const placeResults = PLACES.filter((place) =>
    [place.name, place.label, place.en, place.category, ...place.tags]
      .join(" ")
      .toLowerCase()
      .includes(keyword),
  ).map((place) => ({ place }));

  const roomResults = PLACES.flatMap((place) =>
    place.rooms
      .filter((room) =>
        [room.name, room.code].join(" ").toLowerCase().includes(keyword),
      )
      .map((room) => ({ place, room })),
  );

  return [...placeResults, ...roomResults].slice(0, 12);
}
