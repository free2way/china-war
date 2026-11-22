// 战役注册表
// 新增战役：1) 在 data/ 下新建 <id>.js；2) 在此处登记一条记录并提供 loader。
// status: "available" 可进入沙盘；"planned" 在档案馆中以“筹备中”展示。

export const battleRegistry = [
  {
    id: "chishui-1935",
    name: "四渡赤水",
    period: "1935",
    periodLabel: "1935.01—03",
    era: "近现代 · 长征",
    category: "modern",
    theater: "川 · 黔 · 滇",
    opponents: "中央红军 VS 国民党军",
    summary: "在数十万大军围堵中四次往返赤水河，以高度机动夺回战略主动。",
    seal: "渡",
    accent: "#c93b2b",
    status: "available",
    loader: () => import("./chishui-1935.js?v=2")
  },
  {
    id: "guandu-200",
    name: "官渡之战",
    period: "200",
    periodLabel: "公元200年",
    era: "东汉末年 · 三国前夜",
    category: "ancient",
    theater: "兖 · 豫 · 黄河南岸",
    opponents: "曹操军 VS 袁绍军",
    summary: "扼喉相持百日，夜袭乌巢焚粮，曹操以弱胜强奠定统一北方之基。",
    seal: "官",
    accent: "#c4923a",
    status: "available",
    loader: () => import("./guandu-200.js?v=2")
  },
  {
    id: "feishui-383",
    name: "淝水之战",
    period: "383",
    periodLabel: "公元383年",
    era: "东晋十六国",
    category: "ancient",
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
    period: "208",
    periodLabel: "公元208年",
    era: "东汉末年 · 三国鼎立",
    category: "ancient",
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
