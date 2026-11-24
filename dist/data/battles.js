// 世界战史沙盘 · 战役注册表
// 新增战役：1) 在 data/ 下新建 <id>.js；2) 在此处登记一条记录并提供 loader。
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
    loader: () => import("./chishui-1935.js?v=3")
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
    loader: () => import("./guandu-200.js?v=4")
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
    loader: () => import("./changjin-1950.js?v=4")
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
    loader: () => import("./normandy-1944.js?v=3")
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
    loader: () => import("./market-garden-1944.js?v=3")
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
    status: "planned"
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
    status: "planned"
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
    status: "planned"
  }
];

export const DEFAULT_BATTLE_ID = "chishui-1935";

export function getBattleEntry(id) {
  return battleRegistry.find((item) => item.id === id) || null;
}

export async function loadBattle(id) {
  const entry = getBattleEntry(id);
  if (!entry || entry.status !== "available" || !entry.loader) {
    throw new Error(`未知或未开放的战役：${id}`);
  }
  const mod = await entry.loader();
  return mod.default;
}
