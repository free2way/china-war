// 世界战史沙盘 · 战役注册表（支持中文 / English 双语）
// 新增战役：1) 在 data/ 下新建 <id>.js（及可选 data/en/<id>.js）；2) 在此处登记一条记录并提供 loader。
// region: "china"（中国战史） | "world"（世界战史）
// category: "china-ancient" | "china-modern" | "ww2" | 其他自定义时代分类
// status: "available" 可进入沙盘；"planned" 在档案馆中以“筹备中”展示。

export const battleRegistry = [
  {
    id: "chishui-1935",
    name: "四渡赤水",
    codename: "CHISHUI · 1935",
    period: "1935",
    periodLabel: "1935.01—03",
    era: "中国近现代 · 长征",
    region: "china",
    regionLabel: "中国战史",
    category: "china-modern",
    theater: "川 · 黔 · 滇",
    opponents: "中央红军 VS 国民党军",
    summary: "在数十万大军围堵中四次往返赤水河，以高度机动夺回战略主动。",
    seal: "渡",
    accent: "#c93b2b",
    status: "available",
    en: {
      name: "Four Crossings of the Chishui",
      periodLabel: "Jan–Mar 1935",
      era: "Modern China · The Long March",
      regionLabel: "Chinese History",
      theater: "Sichuan · Guizhou · Yunnan",
      opponents: "Central Red Army vs. KMT Forces",
      summary: "Four rapid crossings of the Chishui River broke a 400,000-troop encirclement through mobile warfare.",
      seal: "CS"
    },
    loader: () => import("./chishui-1935.js?v=3"),
    enLoader: () => import("./en/chishui-1935.js?v=1")
  },
  {
    id: "guandu-200",
    name: "官渡之战",
    codename: "GUANDU · 200 AD",
    period: "200",
    periodLabel: "公元200年",
    era: "中国古代 · 东汉末年",
    region: "china",
    regionLabel: "中国战史",
    category: "china-ancient",
    theater: "兖 · 豫 · 黄河南岸",
    opponents: "曹操军 VS 袁绍军",
    summary: "扼喉相持百日，夜袭乌巢焚粮，曹操以弱胜强奠定统一北方之基。",
    seal: "官",
    accent: "#c4923a",
    status: "available",
    en: {
      name: "Battle of Guandu",
      periodLabel: "200 AD",
      era: "Ancient China · Late Eastern Han",
      regionLabel: "Chinese History",
      theater: "Yellow River South Bank · Henan",
      opponents: "Cao Cao vs. Yuan Shao",
      summary: "After a 100-day standoff, Cao Cao's night cavalry raid burned Wuchao's grain depot, shattering Yuan Shao's northern army.",
      seal: "GD"
    },
    loader: () => import("./guandu-200.js?v=4"),
    enLoader: () => import("./en/guandu-200.js?v=1")
  },
  {
    id: "changjin-1950",
    name: "长津湖战役",
    codename: "CHOSIN · 1950",
    period: "1950",
    periodLabel: "1950.11—12",
    era: "抗美援朝 · 第二次战役东线",
    region: "china",
    regionLabel: "中国战史",
    category: "china-modern",
    theater: "朝鲜东北部 · 盖马高原",
    opponents: "志愿军第9兵团 VS 美军第10军",
    summary: "零下四十度极寒雪夜分割包围，全歼美军“北极熊团”，迫使美第10军从兴南港海上撤离。",
    seal: "津",
    accent: "#d1382c",
    status: "available",
    en: {
      name: "Battle of Lake Changjin",
      periodLabel: "Nov–Dec 1950",
      era: "Korean War · Eastern Front",
      regionLabel: "Chinese History",
      theater: "Kaema Plateau · Chosin Reservoir",
      opponents: "PVA 9th Army Group vs. US X Corps",
      summary: "In -40°C blizzards, PVA divisions encircled US X Corps around the frozen reservoir, destroying Task Force Faith and forcing evacuation from Hungnam.",
      seal: "CJ"
    },
    loader: () => import("./changjin-1950.js?v=4"),
    enLoader: () => import("./en/changjin-1950.js?v=1")
  },
  {
    id: "normandy-1944",
    name: "诺曼底登陆",
    codename: "OPERATION OVERLORD",
    period: "1944",
    periodLabel: "1944.06—07",
    era: "第二次世界大战 · 西欧战场",
    region: "world",
    regionLabel: "世界战史",
    category: "ww2",
    theater: "英吉利海峡 · 诺曼底",
    opponents: "同盟国远征军 VS 纳粹德军",
    summary: "人类史上最大规模两栖登陆，五滩强攻撕开大西洋壁垒，开辟欧洲第二战场。",
    seal: "诺",
    accent: "#3b8ea5",
    status: "available",
    en: {
      name: "Normandy Landings (D-Day)",
      periodLabel: "Jun–Jul 1944",
      era: "World War II · Western Front",
      regionLabel: "World History",
      theater: "English Channel · Normandy",
      opponents: "Allied Expeditionary Force vs. Wehrmacht",
      summary: "History's largest amphibious invasion breached the Atlantic Wall across five beaches to open the Western Front.",
      seal: "DD"
    },
    loader: () => import("./normandy-1944.js?v=3"),
    enLoader: () => import("./en/normandy-1944.js?v=1")
  },
  {
    id: "market-garden-1944",
    name: "市场花园行动",
    codename: "MARKET GARDEN",
    period: "1944",
    periodLabel: "1944.09.17—26",
    era: "第二次世界大战 · 西欧战场",
    region: "world",
    regionLabel: "世界战史",
    category: "ww2",
    theater: "荷兰走廊 · 莱茵河",
    opponents: "盟军空降与第30军 VS 德军B集团军群",
    summary: "史上最大白昼空降奇袭荷兰河网大桥，沿“地狱公路”北进，终因阿纳姆“遥远的桥”折戟。",
    seal: "桥",
    accent: "#b5493a",
    status: "available",
    en: {
      name: "Operation Market Garden",
      periodLabel: "Sep 17–26, 1944",
      era: "World War II · Western Front",
      regionLabel: "World History",
      theater: "Dutch Corridor · Lower Rhine",
      opponents: "Allied Airborne & XXX Corps vs. Army Group B",
      summary: "The largest daylight airborne drop aimed to seize Dutch river bridges along 'Hell's Highway', stalling at Arnhem—a bridge too far.",
      seal: "MG"
    },
    loader: () => import("./market-garden-1944.js?v=3"),
    enLoader: () => import("./en/market-garden-1944.js?v=1")
  },
  {
    id: "stalingrad-1942",
    name: "斯大林格勒战役",
    codename: "STALINGRAD · 1942",
    period: "1942",
    periodLabel: "1942.08—1943.02",
    era: "第二次世界大战 · 东线战场",
    region: "world",
    regionLabel: "世界战史",
    category: "ww2",
    theater: "伏尔加河 · 斯大林格勒",
    opponents: "苏联红军 VS 德军第6集团军",
    summary: "残酷巷战消耗德军锋芒，天王星行动两翼合围逆转二战东线战局。",
    seal: "斯",
    accent: "#7b8f9e",
    status: "planned",
    en: {
      name: "Battle of Stalingrad",
      periodLabel: "Aug 1942–Feb 1943",
      era: "World War II · Eastern Front",
      regionLabel: "World History",
      theater: "Volga River · Stalingrad",
      opponents: "Soviet Red Army vs. German 6th Army",
      summary: "Brutal urban attrition set up Operation Uranus, a double envelopment that turned the tide of the Eastern Front.",
      seal: "SG"
    }
  },
  {
    id: "feishui-383",
    name: "淝水之战",
    codename: "FEISHUI · 383 AD",
    period: "383",
    periodLabel: "公元383年",
    era: "中国古代 · 东晋十六国",
    region: "china",
    regionLabel: "中国战史",
    category: "china-ancient",
    theater: "江淮 · 寿阳 · 八公山",
    opponents: "东晋北府兵 VS 前秦",
    summary: "前秦号称百万南下，东晋北府兵趁其后撤阵乱一击而溃之。",
    seal: "淝",
    accent: "#4c84a3",
    status: "planned",
    en: {
      name: "Battle of Fei River",
      periodLabel: "383 AD",
      era: "Ancient China · Eastern Jin",
      regionLabel: "Chinese History",
      theater: "Huai Valley · Shouyang",
      opponents: "Eastern Jin Beifu Army vs. Former Qin",
      summary: "Heavily outnumbered Jin troops struck Former Qin mid-withdrawal across the Fei River, triggering a total rout.",
      seal: "FR"
    }
  },
  {
    id: "chibi-208",
    name: "赤壁之战",
    codename: "CHIBI · 208 AD",
    period: "208",
    periodLabel: "公元208年",
    era: "中国古代 · 三国前夜",
    region: "china",
    regionLabel: "中国战史",
    category: "china-ancient",
    theater: "荆州 · 长江中游",
    opponents: "孙刘联军 VS 曹操军",
    summary: "孙刘联军以火攻大破曹军，奠定三分天下格局。",
    seal: "赤",
    accent: "#b8452e",
    status: "planned",
    en: {
      name: "Battle of Red Cliffs",
      periodLabel: "208 AD",
      era: "Ancient China · Eve of Three Kingdoms",
      regionLabel: "Chinese History",
      theater: "Middle Yangtze · Jing Province",
      opponents: "Sun–Liu Coalition vs. Cao Cao",
      summary: "Fire ships unleashed by the Sun–Liu alliance shattered Cao Cao's chained fleet, forging the Three Kingdoms balance.",
      seal: "RC"
    }
  }
];

export const DEFAULT_BATTLE_ID = "chishui-1935";

export function getBattleEntry(id) {
  return battleRegistry.find((item) => item.id === id) || null;
}

export async function loadBattle(id) {
  const entry = getBattleEntry(id);
  if (!entry || entry.status !== "available" || !entry.loader) {
    throw new Error(`Unknown or unavailable battle: ${id}`);
  }
  const mod = await entry.loader();
  return mod.default;
}

export async function loadBattleEnOverlay(id) {
  const entry = getBattleEntry(id);
  if (!entry || !entry.enLoader) return null;
  const mod = await entry.enLoader();
  return mod.default;
}
