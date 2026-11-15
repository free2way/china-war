export const battleRegistry = [
  {
    id: "chishui-1935",
    name: "四渡赤水",
    period: "1935.01—05",
    theater: "川 · 黔 · 滇",
    status: "available"
  },
  {
    id: "placeholder",
    name: "下一场战役",
    period: "待扩展",
    theater: "数据接口已预留",
    status: "planned"
  }
];

export async function loadBattle(id = "chishui-1935") {
  if (id === "chishui-1935") {
    return (await import("./chishui-1935.js")).default;
  }
  throw new Error(`Unknown battle: ${id}`);
}
