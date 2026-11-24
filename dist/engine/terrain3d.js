// 零依赖 WebGL 纪录片级三维地形沙盘引擎（参考《沙盘上的战争》视觉风格）
// 特性：高精树枝状山脉侵蚀地貌（176×144 网格）、卫星浮雕光照与陡壁岩层、
// 盘山公路/河谷/冰湖/海岸真实雕刻、渐进生长的三维带箭头态势大箭头、
// 贴地包围圈光环、以及三维战火火星与极寒飘雪粒子系统。

const MAP_W = 880;
const MAP_H = 720;
const WORLD_W = 2.58;
const WORLD_H = 2.10;
const GRID_X = 176;
const GRID_Y = 144;
const BASE_Z = -0.22;

/* ---------------- 确定性域扭曲侵蚀噪声（真实树枝状山脊与沟壑） ---------------- */

function hash2(ix, iy, seed) {
  let n = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 1442695041);
  n = (n ^ (n >>> 13)) * 1274126177;
  return ((n ^ (n >>> 16)) >>> 0) / 4294967295;
}

function valueNoise(x, y, seed) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2(ix, iy, seed);
  const b = hash2(ix + 1, iy, seed);
  const c = hash2(ix, iy + 1, seed);
  const d = hash2(ix + 1, iy + 1, seed);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}

function fbm(x, y, seed, octaves = 4) {
  let sum = 0;
  let amp = 0.5;
  let freq = 1;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise(x * freq, y * freq, seed + i * 31);
    norm += amp;
    amp *= 0.5;
    freq *= 2.04;
  }
  return sum / norm;
}

// 域扭曲脊状侵蚀噪声：模拟真实山脉主脊与树枝状支脉沟壑
function erodedMountain(x, y, seed, octaves = 4) {
  const wx = (fbm(x * 0.85, y * 0.85, seed + 17, 2) - 0.5) * 0.9;
  const wy = (fbm(x * 0.85 + 5.2, y * 0.85 + 1.3, seed + 43, 2) - 0.5) * 0.9;
  let sum = 0;
  let amp = 0.55;
  let freq = 1.0;
  let weight = 1.0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    let n = 1.0 - Math.abs(valueNoise((x + wx) * freq, (y + wy) * freq, seed + i * 59) * 2.0 - 1.0);
    n = n * n * weight;
    weight = Math.max(0.25, Math.min(1.0, n * 1.8));
    sum += n * amp;
    norm += amp;
    amp *= 0.48;
    freq *= 2.12;
  }
  return sum / norm;
}

/* ---------------- 几何工具 ---------------- */

function distToSegment(px, py, ax, ay, bx, by) {
  const dx = bx - ax;
  const dy = by - ay;
  const len2 = dx * dx + dy * dy;
  if (len2 < 1e-6) return Math.hypot(px - ax, py - ay);
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function distToPolyline(px, py, pts) {
  let minD = Infinity;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = distToSegment(px, py, pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1]);
    if (d < minD) minD = d;
  }
  return minD;
}

function gauss(d, radius) {
  const r = d / radius;
  return Math.exp(-r * r);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

function hexToRgb(hex, fallback = [0.85, 0.3, 0.22]) {
  if (!hex || typeof hex !== "string") return fallback;
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return fallback;
  const n = parseInt(m[1], 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* ---------------- 各战役真实地理地貌高程与卫星浮雕色彩配置 ---------------- */

export function getBattleEnvLabel(battleId) {
  switch (battleId) {
    case "changjin-1950":
      return "盖马高原 · 海拔 ~1,300m · -35℃ 暴雪";
    case "chishui-1935":
      return "云贵高原 · 大娄山脉 · 峡谷海拔 ~1,100m";
    case "guandu-200":
      return "黄河南岸 · 华北平原与太行余脉 · 官渡古道";
    case "normandy-1944":
      return "英吉利海峡 · 诺曼底悬崖与灌木丘陵";
    case "market-garden-1944":
      return "荷兰低地河网 · 莱茵河与瓦尔河走廊";
    default:
      return "三维高程地形沙盘 · 实时态势推演";
  }
}

function getTerrainProfile(battleId) {
  switch (battleId) {
    case "chishui-1935":
      return {
        seed: 1935,
        heightScale: 0.42,
        contourStep: 14.0,
        snowLevel: 9.0,
        weather: "none",
        fogColor: [0.07, 0.09, 0.08],
        palette: {
          // 真实卫星浮雕色阶：深林河谷 -> 苍翠喀斯特山坡 -> 暖赭岩脊 -> 灰白高岭
          low: [0.11, 0.20, 0.14],
          mid: [0.22, 0.32, 0.20],
          high: [0.43, 0.41, 0.29],
          peak: [0.64, 0.58, 0.45],
          rock: [0.34, 0.33, 0.28],
          road: [0.68, 0.60, 0.44],
          water: [0.46, 0.28, 0.21], // 赤水河暖赭峡水
          waterDeep: [0.15, 0.30, 0.36],
          skirtTop: [0.26, 0.24, 0.19],
          skirtBottom: [0.06, 0.07, 0.06]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;
          let h = 0.22 + (1 - nx) * 0.12 + ny * 0.12;
          h += erodedMountain(nx * 5.0, ny * 4.2, 1935, 4) * 0.44;
          h += (fbm(nx * 11.0, ny * 9.0, 1937, 3) - 0.5) * 0.08;

          // 大娄山脉（桐梓—娄山关—遵义东侧险峻山脊）
          const dalou = distToPolyline(x, y, [
            [470, 250],
            [535, 335],
            [565, 375],
            [635, 445],
            [730, 520]
          ]);
          h += gauss(dalou, 78) * 0.36;
          h += gauss(Math.hypot(x - 562, y - 370), 42) * 0.18;

          // 乌蒙山脉
          const wumeng = distToPolyline(x, y, [
            [90, 360],
            [140, 480],
            [215, 625]
          ]);
          h += gauss(wumeng, 96) * 0.34;

          // 赤水河深切 V 形峡谷
          const dChishui = distToPolyline(x, y, [
            [352, 110],
            [335, 185],
            [310, 268],
            [295, 338],
            [287, 411],
            [272, 490],
            [250, 570]
          ]);
          h *= 1 - gauss(dChishui, 26) * 0.78;

          // 乌江峡谷
          const dWujiang = distToPolyline(x, y, [
            [351, 581],
            [440, 566],
            [530, 595],
            [635, 652],
            [780, 630]
          ]);
          h *= 1 - gauss(dWujiang, 28) * 0.72;

          // 长江北缘
          const dYangtze = distToPolyline(x, y, [
            [120, 70],
            [340, 68],
            [560, 50],
            [820, 30]
          ]);
          h *= 1 - gauss(dYangtze, 26) * 0.68;

          // 川黔古道（遵义—娄山关—桐梓 & 遵义—茅台—土城）
          const dRoad1 = distToPolyline(x, y, [[570, 535], [552, 410], [555, 372], [533, 344]]);
          const dRoad2 = distToPolyline(x, y, [[552, 410], [420, 416], [348, 386], [295, 338], [300, 292]]);
          const road = Math.max(smoothstep(7, 2.5, dRoad1), smoothstep(7, 2.5, dRoad2));

          const water = Math.max(
            smoothstep(13, 5, dChishui),
            smoothstep(14, 5, dWujiang),
            smoothstep(13, 5, dYangtze)
          );
          if (water > 0.15) h = Math.min(h, 0.04 + (1 - water) * 0.05);
          return { h: Math.max(0.02, Math.min(1.0, h)), water, road: road * (1 - water) };
        }
      };

    case "guandu-200":
      return {
        seed: 200,
        heightScale: 0.34,
        contourStep: 12.0,
        snowLevel: 9.0,
        weather: "none",
        fogColor: [0.09, 0.07, 0.05],
        palette: {
          // 汉末黄土与中原冲积平原卫星浮雕色阶
          low: [0.18, 0.16, 0.11],
          mid: [0.31, 0.27, 0.18],
          high: [0.49, 0.41, 0.27],
          peak: [0.71, 0.60, 0.42],
          rock: [0.42, 0.36, 0.28],
          road: [0.78, 0.67, 0.45],
          water: [0.64, 0.50, 0.25], // 黄河浊金水色
          waterDeep: [0.22, 0.38, 0.42], // 鸿沟青碧运河
          skirtTop: [0.36, 0.28, 0.17],
          skirtBottom: [0.08, 0.06, 0.04]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;
          let h = 0.17 + (fbm(nx * 6.5, ny * 5.5, 200, 3) - 0.5) * 0.09;

          // 太行山巍峨余脉（邺城西侧断层抬升）
          const taihang = distToPolyline(x, y, [
            [45, 35],
            [115, 115],
            [158, 185],
            [125, 240]
          ]);
          h += gauss(taihang, 120) * 0.76 * (0.55 + 0.55 * erodedMountain(nx * 6.2, ny * 5.8, 202, 4));

          // 西南嵩山/伏牛余脉
          const songshan = distToPolyline(x, y, [
            [45, 515],
            [125, 610],
            [205, 685]
          ]);
          h += gauss(songshan, 108) * 0.52 * (0.6 + 0.45 * erodedMountain(nx * 5.2, ny * 5.2, 205, 3));

          // 官渡沙丘高岗（袁绍依沙堆连营数十里）
          h += gauss(Math.hypot(x - 408, y - 412), 46) * 0.12;

          // 乌巢低洼湖泽
          const dWuchaoMarsh = Math.hypot((x - 505) * 0.85, (y - 420) * 1.4);
          h -= gauss(dWuchaoMarsh, 40) * 0.09;

          // 黄河宽阔古河道
          const dYellow = distToPolyline(x, y, [
            [50, 262],
            [200, 258],
            [360, 246],
            [510, 228],
            [650, 226],
            [845, 178]
          ]);
          h *= 1 - gauss(dYellow, 34) * 0.72;

          // 鸿沟/官渡水
          const dCanal = distToPolyline(x, y, [
            [360, 246],
            [355, 345],
            [372, 462],
            [440, 560],
            [620, 628],
            [830, 660]
          ]);
          h *= 1 - gauss(dCanal, 20) * 0.54;

          // 中原驿道（邺城—黎阳—延津—阳武—官渡—许都）
          const dRoad = distToPolyline(x, y, [
            [250, 110],
            [440, 175],
            [352, 262],
            [400, 330],
            [372, 466],
            [350, 630]
          ]);
          const road = smoothstep(7.5, 2.5, dRoad);

          const water = Math.max(
            smoothstep(18, 7, dYellow),
            smoothstep(10, 4, dCanal) * 0.85,
            smoothstep(24, 10, dWuchaoMarsh) * 0.55
          );
          if (water > 0.2) h = Math.min(h, 0.04 + (1 - water) * 0.05);
          return { h: Math.max(0.02, Math.min(1.0, h)), water, road: road * (1 - water) };
        }
      };

    case "changjin-1950":
      return {
        seed: 1950,
        heightScale: 0.46,
        contourStep: 15.0,
        snowLevel: 0.44, // 盖马高原广袤极寒积雪
        weather: "snow",
        fogColor: [0.05, 0.09, 0.13],
        palette: {
          // 真实冬日雪山卫星地貌：暗松林山谷 -> 冰灰山坡 -> 冻土雪原 -> 刺目雪峰
          low: [0.10, 0.16, 0.20],
          mid: [0.22, 0.29, 0.34],
          high: [0.58, 0.68, 0.78],
          peak: [0.92, 0.96, 1.0],
          rock: [0.26, 0.30, 0.35], // 陡崖深灰岩石，和白雪形成电影级对比
          road: [0.85, 0.74, 0.48], // 唯一盘山生命线公路
          water: [0.48, 0.76, 0.90], // 冰封长津湖
          waterDeep: [0.08, 0.22, 0.36], // 东海深海
          skirtTop: [0.24, 0.33, 0.42],
          skirtBottom: [0.05, 0.08, 0.12]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;

          // 东南角东海（日本海）
          const coastLineY = 548 + (844 - x) * 0.52;
          const coastDist = coastLineY - y;
          const landMask = smoothstep(-26, 40, coastDist);
          if (landMask < 0.02) {
            return { h: 0.01, water: 1.0, road: 0 };
          }

          // 盖马高原北高南低 + 真实树枝状高山侵蚀脊线
          const plateau = smoothstep(615, 435, y) * 0.36 + 0.11;
          let h = plateau + erodedMountain(nx * 4.8, ny * 4.4, 1950, 4) * 0.40;
          h += (fbm(nx * 10.5, ny * 9.5, 1951, 3) - 0.5) * 0.08;

          // 狼林山脉（西侧险峰）
          const langlin = distToPolyline(x, y, [
            [105, 105],
            [138, 270],
            [185, 425],
            [248, 535]
          ]);
          h += gauss(langlin, 108) * 0.44;

          // 赴战岭山脉（东侧雪脊）
          const fuzhan = distToPolyline(x, y, [
            [635, 110],
            [662, 260],
            [630, 415],
            [540, 515]
          ]);
          h += gauss(fuzhan, 102) * 0.42;

          // 死鹰岭山口险要高地
          h += gauss(Math.hypot(x - 340, y - 325), 34) * 0.17;

          // 冰封长津湖高山冰盆
          const dLakeMain = distToPolyline(x, y, [
            [442, 132],
            [446, 210],
            [434, 285],
            [416, 355]
          ]);
          const dLakeEast = distToSegment(x, y, 445, 225, 505, 248);
          const dLakeWest = distToSegment(x, y, 426, 270, 356, 272);
          const dLake = Math.min(dLakeMain, dLakeEast * 1.15, dLakeWest * 1.15);

          const basin = gauss(dLake, 46);
          h = h * (1 - basin * 0.62) + 0.18 * basin;

          // 唯一盘山补给公路（柳潭里—死鹰岭—下碣隅里—古土里—水门桥—黄草岭—真兴里—咸兴—兴南港）
          const dHighway = distToPolyline(x, y, [
            [270, 275],
            [340, 325],
            [415, 365],
            [430, 460],
            [445, 520],
            [436, 566],
            [458, 605],
            [565, 645],
            [625, 668]
          ]);
          // 水门桥—黄草岭峡谷深切
          const dGorge = distToPolyline(x, y, [
            [415, 365],
            [430, 460],
            [445, 520],
            [436, 566],
            [458, 605]
          ]);
          h *= 1 - gauss(dGorge, 24) * 0.40;
          h *= landMask;

          const lakeWater = smoothstep(26, 11, dLake);
          const seaWater = 1 - smoothstep(-10, 20, coastDist);
          const water = Math.max(lakeWater * 0.92, seaWater);
          // 平滑过渡冰封长津湖岸坡与东海海面，避免陡峭台阶拉伸
          h = h * (1 - lakeWater) + 0.18 * lakeWater;
          h = h * (1 - seaWater) + 0.015 * seaWater;
          const road = smoothstep(8.5, 3.0, dHighway) * (1 - water);
          return { h: Math.max(0.01, Math.min(1.0, h)), water, road };
        }
      };

    case "normandy-1944":
      return {
        seed: 1944,
        heightScale: 0.30,
        contourStep: 12.0,
        snowLevel: 9.0,
        weather: "none",
        fogColor: [0.06, 0.10, 0.13],
        palette: {
          low: [0.14, 0.24, 0.17],
          mid: [0.24, 0.35, 0.23],
          high: [0.40, 0.46, 0.32],
          peak: [0.58, 0.60, 0.46],
          rock: [0.44, 0.43, 0.38],
          road: [0.74, 0.68, 0.54],
          water: [0.13, 0.33, 0.46],
          waterDeep: [0.07, 0.20, 0.32],
          skirtTop: [0.22, 0.30, 0.34],
          skirtBottom: [0.05, 0.09, 0.13]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;
          const coastY = 230 + Math.sin(nx * 5.2) * 38 + (nx < 0.28 ? -60 * (0.28 - nx) : 0);
          const landMask = smoothstep(coastY - 22, coastY + 26, y);
          if (landMask < 0.02) return { h: 0.015, water: 1.0, road: 0 };
          let h = 0.16 + smoothstep(coastY, coastY + 120, y) * 0.22;
          h += erodedMountain(nx * 4.6, ny * 4.2, 1944, 3) * 0.30;
          h += gauss(Math.abs(y - (coastY + 26)), 20) * 0.16;
          h *= landMask;
          const water = 1 - smoothstep(coastY - 8, coastY + 14, y);
          return { h: Math.max(0.015, Math.min(0.95, h)), water, road: 0 };
        }
      };

    case "market-garden-1944":
      return {
        seed: 1945,
        heightScale: 0.26,
        contourStep: 11.0,
        snowLevel: 9.0,
        weather: "none",
        fogColor: [0.07, 0.09, 0.08],
        palette: {
          low: [0.14, 0.22, 0.15],
          mid: [0.25, 0.34, 0.22],
          high: [0.40, 0.43, 0.30],
          peak: [0.56, 0.54, 0.40],
          rock: [0.36, 0.35, 0.30],
          road: [0.84, 0.72, 0.42],
          water: [0.20, 0.39, 0.48],
          waterDeep: [0.11, 0.26, 0.35],
          skirtTop: [0.24, 0.26, 0.21],
          skirtBottom: [0.07, 0.09, 0.08]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;
          let h = 0.16 + fbm(nx * 5.5, ny * 5.0, 1945, 3) * 0.16;
          h += gauss(Math.hypot(x - 470, y - 120), 120) * 0.36;
          h += gauss(Math.hypot(x - 535, y - 275), 72) * 0.24;
          const dRhine = distToPolyline(x, y, [[80, 165], [350, 180], [500, 168], [800, 190]]);
          const dWaal = distToPolyline(x, y, [[80, 270], [340, 280], [490, 265], [800, 290]]);
          const dMaas = distToPolyline(x, y, [[80, 385], [370, 380], [470, 355], [760, 415]]);
          const dRiver = Math.min(dRhine, dWaal, dMaas);
          h *= 1 - gauss(dRiver, 22) * 0.68;
          const dHwy = distToPolyline(x, y, [[415, 650], [435, 520], [460, 380], [485, 268], [492, 168]]);
          const water = smoothstep(13, 5, dRiver);
          if (water > 0.25) h = Math.min(h, 0.04);
          return { h: Math.max(0.02, Math.min(0.85, h)), water, road: smoothstep(8, 3, dHwy) * (1 - water) };
        }
      };

    default:
      return {
        seed: 777,
        heightScale: 0.34,
        contourStep: 13.0,
        snowLevel: 9.0,
        weather: "none",
        fogColor: [0.07, 0.08, 0.07],
        palette: {
          low: [0.13, 0.19, 0.14],
          mid: [0.25, 0.31, 0.22],
          high: [0.43, 0.41, 0.31],
          peak: [0.62, 0.58, 0.46],
          rock: [0.36, 0.35, 0.31],
          road: [0.72, 0.64, 0.46],
          water: [0.24, 0.40, 0.48],
          waterDeep: [0.13, 0.26, 0.34],
          skirtTop: [0.24, 0.23, 0.20],
          skirtBottom: [0.08, 0.08, 0.08]
        },
        sample(x, y) {
          const nx = x / MAP_W;
          const ny = y / MAP_H;
          const h = 0.18 + erodedMountain(nx * 4.5, ny * 4.0, 777, 4) * 0.48;
          return { h: Math.max(0.03, Math.min(0.95, h)), water: 0, road: 0 };
        }
      };
  }
}

/* ---------------- 轻量 4x4 矩阵数学库 ---------------- */

function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      out[col * 4 + row] =
        a[0 * 4 + row] * b[col * 4 + 0] +
        a[1 * 4 + row] * b[col * 4 + 1] +
        a[2 * 4 + row] * b[col * 4 + 2] +
        a[3 * 4 + row] * b[col * 4 + 3];
    }
  }
  return out;
}

function mat4Perspective(fovRad, aspect, near, far) {
  const f = 1 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect;
  out[5] = f;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

function mat4LookAt(eye, target, up) {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  const zLen = Math.hypot(zx, zy, zz) || 1;
  zx /= zLen;
  zy /= zLen;
  zz /= zLen;

  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  const xLen = Math.hypot(xx, xy, xz) || 1;
  xx /= xLen;
  xy /= xLen;
  xz /= xLen;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  const out = new Float32Array(16);
  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
  return out;
}

/* ---------------- WebGL 着色器源码 ---------------- */

const TERRAIN_VS = `
  attribute vec3 aPos;
  attribute vec3 aNormal;
  attribute vec3 aMeta; // x: height, y: water, z: road
  attribute vec2 aUv;
  uniform mat4 uMvp;
  varying vec3 vNormal;
  varying vec3 vMeta;
  varying vec2 vUv;
  varying vec3 vWorldPos;
  void main() {
    vNormal = aNormal;
    vMeta = aMeta;
    vUv = aUv;
    vWorldPos = aPos;
    gl_Position = uMvp * vec4(aPos, 1.0);
  }
`;

const TERRAIN_FS = `
  precision mediump float;
  varying vec3 vNormal;
  varying vec3 vMeta;
  varying vec2 vUv;
  varying vec3 vWorldPos;

  uniform vec3 uColorLow;
  uniform vec3 uColorMid;
  uniform vec3 uColorHigh;
  uniform vec3 uColorPeak;
  uniform vec3 uColorRock;
  uniform vec3 uColorRoad;
  uniform vec3 uColorWater;
  uniform vec3 uColorWaterDeep;
  uniform vec3 uFogColor;
  uniform vec3 uLightDir;
  uniform vec3 uEyePos;
  uniform float uContourStep;
  uniform float uSnowLevel;
  uniform float uTime;

  void main() {
    float h = clamp(vMeta.x, 0.0, 1.0);
    float water = clamp(vMeta.y, 0.0, 1.0);
    float road = clamp(vMeta.z, 0.0, 1.0);
    vec3 N = normalize(vNormal);
    vec3 L = normalize(uLightDir);
    vec3 V = normalize(uEyePos - vWorldPos);
    float slope = 1.0 - clamp(N.z, 0.0, 1.0);

    // 1. 卫星浮雕自然色阶 + 陡峭岩壁雕刻
    vec3 land = mix(uColorLow, uColorMid, smoothstep(0.05, 0.34, h));
    land = mix(land, uColorHigh, smoothstep(0.34, 0.66, h));
    land = mix(land, uColorPeak, smoothstep(0.66, 0.94, h));
    land = mix(land, uColorRock, smoothstep(0.14, 0.44, slope) * 0.68);

    // 高频地表微纹理（植被/冻土/碎石颗粒感）
    float micro = sin(vWorldPos.x * 110.0 + vWorldPos.y * 84.0) * cos(vWorldPos.y * 116.0 - vWorldPos.x * 74.0);
    land += vec3(micro * 0.015);

    // 高海拔真实积雪（雪积在较缓山脊与高原，陡峭绝壁露出岩石）
    if (uSnowLevel < 2.0) {
      float snow = smoothstep(uSnowLevel - 0.10, uSnowLevel + 0.14, h - slope * 0.36);
      land = mix(land, vec3(0.93, 0.96, 1.0), snow * 0.94);
    }

    // 2. 刻蚀在三维地形上的盘山公路/古驿道
    if (road > 0.02) {
      float dash = 0.78 + 0.22 * sin((vWorldPos.x + vWorldPos.y) * 90.0);
      land = mix(land, uColorRoad * dash, smoothstep(0.12, 0.75, road) * 0.78);
    }

    // 3. 精致双层等高线（主等高线 + 细辅线）
    float cPhase = fract(h * uContourStep);
    float minorC = 1.0 - smoothstep(0.0, 0.06, min(cPhase, 1.0 - cPhase));
    float majorPhase = fract(h * (uContourStep * 0.25));
    float majorC = 1.0 - smoothstep(0.0, 0.028, min(majorPhase, 1.0 - majorPhase));
    land = mix(land, land * 1.24 + vec3(0.045), (minorC * 0.16 + majorC * 0.30) * (1.0 - water));

    // 4. 水域 / 冰湖 / 海岸浅滩高光
    vec3 waterCol = mix(uColorWater, uColorWaterDeep, smoothstep(0.36, 0.96, water));
    float ripple = sin(vWorldPos.x * 32.0 + uTime * 1.4) * cos(vWorldPos.y * 28.0 - uTime * 1.0) * 0.028;
    float shoreline = smoothstep(0.14, 0.34, water) * (1.0 - smoothstep(0.34, 0.64, water));
    vec3 baseCol = mix(land, waterCol + ripple, smoothstep(0.16, 0.58, water));
    baseCol += vec3(0.20, 0.26, 0.30) * shoreline * 0.65;

    // 5. 纪录片高反差斜阳山体光照（阳坡温暖、阴坡冷峻、山脊逆光边）
    float diff = max(dot(N, L), 0.0);
    float backShadow = smoothstep(-0.35, 0.25, dot(N, L));
    float fill = max(dot(N, normalize(vec3(-0.65, -0.45, 0.55))), 0.0) * 0.30;
    float rim = pow(1.0 - max(dot(N, V), 0.0), 3.2) * (0.26 + 0.38 * h);
    float ao = 0.50 + 0.50 * smoothstep(0.0, 0.52, h);

    vec3 sunTint = vec3(1.12, 1.03, 0.92);
    vec3 shadowTint = vec3(0.58, 0.72, 0.90);
    vec3 lit = baseCol * (shadowTint * 0.34 + sunTint * diff * 0.98 * (0.55 + 0.45 * backShadow) + shadowTint * fill) * ao;
    lit += vec3(0.32, 0.34, 0.36) * rim * (1.0 - water * 0.45);

    // 水面与冰面太阳镜面反射
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 42.0);
    lit += vec3(0.75, 0.86, 0.96) * spec * (water * 0.62 + 0.04);

    // 远景大气空气透视（增强纵深感）
    float dist = length(uEyePos - vWorldPos);
    float fog = smoothstep(2.9, 5.8, dist) * 0.35;
    lit = mix(lit, uFogColor, fog);

    gl_FragColor = vec4(lit, 1.0);
  }
`;

const SKIRT_VS = `
  attribute vec3 aPos;
  attribute float aShade;
  uniform mat4 uMvp;
  varying float vShade;
  varying float vZ;
  void main() {
    vShade = aShade;
    vZ = aPos.z;
    gl_Position = uMvp * vec4(aPos, 1.0);
  }
`;

const SKIRT_FS = `
  precision mediump float;
  varying float vShade;
  varying float vZ;
  uniform vec3 uSkirtTop;
  uniform vec3 uSkirtBottom;
  void main() {
    float t = smoothstep(-0.22, 0.28, vZ);
    vec3 col = mix(uSkirtBottom, uSkirtTop, t) * vShade;
    float strata = smoothstep(0.90, 1.0, abs(sin(vZ * 58.0)));
    col += vec3(0.045) * strata;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// 带渐进生长与 V 形脉冲波的三维态势大箭头着色器
const RIBBON_VS = `
  attribute vec3 aPos;
  attribute vec3 aUv; // x: along (0..len), y: across (-1..1), z: normT (0..1)
  uniform mat4 uMvp;
  varying vec3 vUv;
  void main() {
    vUv = aUv;
    gl_Position = uMvp * vec4(aPos, 1.0);
  }
`;

const RIBBON_FS = `
  precision mediump float;
  varying vec3 vUv;
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uTime;
  uniform float uDashScale;
  uniform float uSpeed;
  uniform float uProgress;
  void main() {
    // 随阶段切换渐进推进生长动画
    float reveal = 1.0 - smoothstep(uProgress - 0.03, uProgress + 0.01, vUv.z);
    if (reveal <= 0.01) discard;

    float across = 1.0 - abs(vUv.y);
    float edgeGlow = smoothstep(0.0, 0.42, across);
    float chevronCoord = vUv.x * uDashScale - abs(vUv.y) * 0.48 - uTime * uSpeed;
    float wave = smoothstep(0.18, 0.85, fract(chevronCoord));
    // 箭头尖端加亮
    float headBoost = smoothstep(0.84, 0.98, vUv.z) * 0.35;
    float pulse = 0.56 + 0.44 * wave;
    vec3 col = mix(uColor, vec3(1.0, 0.97, 0.88), smoothstep(0.55, 1.0, across) * 0.48 + wave * 0.16 + headBoost);
    gl_FragColor = vec4(col, edgeGlow * pulse * uAlpha * reveal);
  }
`;

// 三维粒子（战火火星 + 极寒暴雪）
const PARTICLE_VS = `
  attribute vec3 aSeed; // x, y, phase
  attribute float aKind; // 0 = snow, 1 = ember
  uniform mat4 uMvp;
  uniform float uTime;
  uniform float uPointScale;
  varying float vAlpha;
  varying float vKind;
  void main() {
    vKind = aKind;
    vec3 pos = aSeed;
    if (aKind < 0.5) {
      // 盖马高原极寒飘雪
      float fall = fract(aSeed.z - uTime * 0.12);
      pos.x = aSeed.x + sin(uTime * 0.9 + aSeed.z * 18.0) * 0.08;
      pos.y = aSeed.y + cos(uTime * 0.7 + aSeed.x * 9.0) * 0.06;
      pos.z = 0.04 + fall * 0.78;
      vAlpha = sin(fall * 3.14159) * 0.72;
      gl_PointSize = 3.2 * uPointScale;
    } else {
      // 战火上升火星与硝烟微粒（从精确地形海拔 aSeed.z 升起）
      float stagger = fract(sin(aSeed.x * 127.1 + aSeed.y * 311.7) * 43758.5453);
      float rise = fract(stagger + uTime * 0.42);
      pos = vec3(
        aSeed.x + sin(uTime * 3.1 + stagger * 28.0) * 0.036 * rise,
        aSeed.y + cos(uTime * 2.5 + stagger * 21.0) * 0.036 * rise,
        aSeed.z + rise * 0.28
      );
      vAlpha = (1.0 - rise) * 0.94;
      gl_PointSize = (5.2 - rise * 2.4) * uPointScale;
    }
    gl_Position = uMvp * vec4(pos, 1.0);
  }
`;

const PARTICLE_FS = `
  precision mediump float;
  varying float vAlpha;
  varying float vKind;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float soft = 1.0 - smoothstep(0.15, 0.5, r);
    vec3 col = vKind < 0.5 ? vec3(0.90, 0.96, 1.0) : mix(vec3(1.0, 0.42, 0.12), vec3(1.0, 0.90, 0.55), soft);
    gl_FragColor = vec4(col, soft * vAlpha);
  }
`;

function compileShader(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error("WebGL shader error: " + info);
  }
  return sh;
}

function createProgram(gl, vsSrc, fsSrc) {
  const prog = gl.createProgram();
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    throw new Error("WebGL link error: " + gl.getProgramInfoLog(prog));
  }
  return prog;
}

/* ---------------- 主引擎类：Terrain3DEngine ---------------- */

export class Terrain3DEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.gl = null;
    this.ready = false;
    this.profile = null;
    this.heightGrid = null;
    this.waterGrid = null;
    this.roadGrid = null;
    this.mvp = new Float32Array(16);
    this.eyePos = [0, -2.2, 1.6];
    this.width = 880;
    this.height = 720;
    this.dpr = 1;
    this.ribbons = [];
    this.rings = [];
    this.terrainBuf = null;
    this.skirtBuf = null;
    this.particleBuf = null;
    this.particleCount = 0;

    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
    if (!gl) return;
    this.gl = gl;

    try {
      this.terrainProg = createProgram(gl, TERRAIN_VS, TERRAIN_FS);
      this.skirtProg = createProgram(gl, SKIRT_VS, SKIRT_FS);
      this.ribbonProg = createProgram(gl, RIBBON_VS, RIBBON_FS);
      this.particleProg = createProgram(gl, PARTICLE_VS, PARTICLE_FS);
      this.ready = true;
    } catch (err) {
      console.warn("[Terrain3D] WebGL init failed, falling back to CSS 3D:", err);
      this.ready = false;
    }
  }

  mapToWorldXY(x, y) {
    return [(x / MAP_W - 0.5) * WORLD_W, -(y / MAP_H - 0.5) * WORLD_H];
  }

  sampleElevation(x, y) {
    if (!this.heightGrid || !this.profile) return 0;
    const gx = Math.max(0, Math.min(GRID_X - 1, (x / MAP_W) * (GRID_X - 1)));
    const gy = Math.max(0, Math.min(GRID_Y - 1, (y / MAP_H) * (GRID_Y - 1)));
    const ix = Math.min(GRID_X - 2, Math.floor(gx));
    const iy = Math.min(GRID_Y - 2, Math.floor(gy));
    const fx = gx - ix;
    const fy = gy - iy;
    const idx = (c, r) => r * GRID_X + c;
    const h00 = this.heightGrid[idx(ix, iy)];
    const h10 = this.heightGrid[idx(ix + 1, iy)];
    const h01 = this.heightGrid[idx(ix, iy + 1)];
    const h11 = this.heightGrid[idx(ix + 1, iy + 1)];
    const h = h00 * (1 - fx) * (1 - fy) + h10 * fx * (1 - fy) + h01 * (1 - fx) * fy + h11 * fx * fy;
    return h * this.profile.heightScale;
  }

  loadBattle(battle) {
    if (!this.ready) return;
    this.profile = getTerrainProfile(battle.id);
    const gl = this.gl;

    const count = GRID_X * GRID_Y;
    this.heightGrid = new Float32Array(count);
    this.waterGrid = new Float32Array(count);
    this.roadGrid = new Float32Array(count);

    for (let r = 0; r < GRID_Y; r++) {
      const y = (r / (GRID_Y - 1)) * MAP_H;
      for (let c = 0; c < GRID_X; c++) {
        const x = (c / (GRID_X - 1)) * MAP_W;
        const s = this.profile.sample(x, y);
        const i = r * GRID_X + c;
        this.heightGrid[i] = s.h;
        this.waterGrid[i] = s.water || 0;
        this.roadGrid[i] = s.road || 0;
      }
    }

    // 顶点布局：pos(3) + normal(3) + meta(3: h, water, road) + uv(2) = 11 floats
    const verts = new Float32Array(count * 11);
    const dxW = WORLD_W / (GRID_X - 1);
    const dyW = WORLD_H / (GRID_Y - 1);
    const hs = this.profile.heightScale;

    for (let r = 0; r < GRID_Y; r++) {
      const v = r / (GRID_Y - 1);
      const wy = -(v - 0.5) * WORLD_H;
      for (let c = 0; c < GRID_X; c++) {
        const u = c / (GRID_X - 1);
        const wx = (u - 0.5) * WORLD_W;
        const i = r * GRID_X + c;
        const h = this.heightGrid[i];
        const z = h * hs;

        const hL = this.heightGrid[r * GRID_X + Math.max(0, c - 1)] * hs;
        const hR = this.heightGrid[r * GRID_X + Math.min(GRID_X - 1, c + 1)] * hs;
        const hU = this.heightGrid[Math.max(0, r - 1) * GRID_X + c] * hs;
        const hD = this.heightGrid[Math.min(GRID_Y - 1, r + 1) * GRID_X + c] * hs;

        const dzdx = (hR - hL) / (2 * dxW);
        const dzdy = (hU - hD) / (2 * dyW);
        let nx = -dzdx;
        let ny = -dzdy;
        let nz = 1.0;
        const nLen = Math.hypot(nx, ny, nz) || 1;
        nx /= nLen;
        ny /= nLen;
        nz /= nLen;

        const o = i * 11;
        verts[o] = wx;
        verts[o + 1] = wy;
        verts[o + 2] = z;
        verts[o + 3] = nx;
        verts[o + 4] = ny;
        verts[o + 5] = nz;
        verts[o + 6] = h;
        verts[o + 7] = this.waterGrid[i];
        verts[o + 8] = this.roadGrid[i];
        verts[o + 9] = u;
        verts[o + 10] = v;
      }
    }

    const indices = new Uint16Array((GRID_X - 1) * (GRID_Y - 1) * 6);
    let ptr = 0;
    for (let r = 0; r < GRID_Y - 1; r++) {
      for (let c = 0; c < GRID_X - 1; c++) {
        const a = r * GRID_X + c;
        const b = a + 1;
        const d = a + GRID_X;
        const e = d + 1;
        indices[ptr++] = a;
        indices[ptr++] = d;
        indices[ptr++] = b;
        indices[ptr++] = b;
        indices[ptr++] = d;
        indices[ptr++] = e;
      }
    }

    if (this.terrainBuf) {
      gl.deleteBuffer(this.terrainBuf.vbo);
      gl.deleteBuffer(this.terrainBuf.ibo);
    }
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const ibo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    this.terrainBuf = { vbo, ibo, count: indices.length };
    this.buildSkirt(hs);
  }

  buildSkirt(hs) {
    const gl = this.gl;
    const data = [];
    const pushQuad = (x1, y1, z1, x2, y2, z2, shade) => {
      data.push(
        x1, y1, z1, shade,
        x1, y1, BASE_Z, shade,
        x2, y2, z2, shade,
        x2, y2, z2, shade,
        x1, y1, BASE_Z, shade,
        x2, y2, BASE_Z, shade
      );
    };
    const wx = (c) => (c / (GRID_X - 1) - 0.5) * WORLD_W;
    const wy = (r) => -(r / (GRID_Y - 1) - 0.5) * WORLD_H;

    for (let c = 0; c < GRID_X - 1; c++) {
      const r = GRID_Y - 1;
      pushQuad(wx(c), wy(r), this.heightGrid[r * GRID_X + c] * hs, wx(c + 1), wy(r), this.heightGrid[r * GRID_X + c + 1] * hs, 1.0);
    }
    for (let c = 0; c < GRID_X - 1; c++) {
      pushQuad(wx(c + 1), wy(0), this.heightGrid[c + 1] * hs, wx(c), wy(0), this.heightGrid[c] * hs, 0.55);
    }
    for (let r = 0; r < GRID_Y - 1; r++) {
      pushQuad(wx(0), wy(r), this.heightGrid[r * GRID_X] * hs, wx(0), wy(r + 1), this.heightGrid[(r + 1) * GRID_X] * hs, 0.78);
    }
    for (let r = 0; r < GRID_Y - 1; r++) {
      const c = GRID_X - 1;
      pushQuad(wx(c), wy(r + 1), this.heightGrid[(r + 1) * GRID_X + c] * hs, wx(c), wy(r), this.heightGrid[r * GRID_X + c] * hs, 0.65);
    }

    if (this.skirtBuf) gl.deleteBuffer(this.skirtBuf.vbo);
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.skirtBuf = { vbo, count: data.length / 4 };
  }

  // 构建带三维三角形箭头的贴地态势大箭头（纪录片风格）
  setRoutes(routeSpecs) {
    if (!this.ready) return;
    const gl = this.gl;
    this.ribbons.forEach((r) => gl.deleteBuffer(r.vbo));
    this.ribbons = [];

    for (const spec of routeSpecs) {
      const pts = spec.points;
      if (!pts || pts.length < 2) continue;
      const baseHalfW = spec.width || 0.022;
      const hover = spec.hover || 0.022;
      const hasArrow = spec.arrow !== false;
      const verts = [];
      let accum = 0;
      const totalIdx = pts.length - 1;

      for (let i = 0; i < pts.length; i++) {
        const [x, y] = pts[i];
        const [wx, wy] = this.mapToWorldXY(x, y);
        const wz = this.sampleElevation(x, y) + hover;
        const normT = i / totalIdx;
        if (i > 0) {
          const [px, py] = this.mapToWorldXY(pts[i - 1][0], pts[i - 1][1]);
          accum += Math.hypot(wx - px, wy - py);
        }

        const prev = pts[Math.max(0, i - 1)];
        const next = pts[Math.min(totalIdx, i + 1)];
        const [pwx, pwy] = this.mapToWorldXY(prev[0], prev[1]);
        const [nwx, nwy] = this.mapToWorldXY(next[0], next[1]);
        let tx = nwx - pwx;
        let ty = nwy - pwy;
        const tLen = Math.hypot(tx, ty) || 1;
        tx /= tLen;
        ty /= tLen;

        // 尾部渐宽 -> 中段饱满 -> 末端三角大箭头造型
        let widthFactor = 0.62 + 0.45 * smoothstep(0.0, 0.35, normT);
        if (hasArrow && normT > 0.86) {
          const headT = (normT - 0.86) / 0.14; // 0 -> 1
          widthFactor = headT < 0.16 ? 2.15 : 2.15 * (1 - (headT - 0.16) / 0.84);
        }
        const hw = Math.max(0.001, baseHalfW * widthFactor);
        const perpX = -ty * hw;
        const perpY = tx * hw;

        verts.push(wx + perpX, wy + perpY, wz, accum, 1, normT);
        verts.push(wx - perpX, wy - perpY, wz, accum, -1, normT);
      }

      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
      this.ribbons.push({
        vbo,
        count: verts.length / 6,
        color: hexToRgb(spec.color, [0.9, 0.3, 0.2]),
        alpha: spec.alpha ?? 0.94,
        dashScale: spec.dashScale ?? 6.5,
        speed: spec.speed ?? 1.5,
        animateDraw: spec.animateDraw ?? false,
        side: spec.side || "red"
      });
    }
  }

  // 构建贴地三维包围圈/防御圈光环
  setRings(ringSpecs) {
    if (!this.ready) return;
    const gl = this.gl;
    this.rings.forEach((r) => gl.deleteBuffer(r.vbo));
    this.rings = [];

    const segs = 40;
    for (const spec of ringSpecs) {
      const verts = [];
      const rx = spec.radius || 34;
      const hw = spec.width || 0.011;
      const hover = 0.018;
      for (let i = 0; i <= segs; i++) {
        const ang = (i / segs) * Math.PI * 2;
        const x = spec.x + Math.cos(ang) * rx;
        const y = spec.y + Math.sin(ang) * rx;
        const [wx, wy] = this.mapToWorldXY(x, y);
        const wz = this.sampleElevation(x, y) + hover;
        const outX = Math.cos(ang) * hw;
        const outY = -Math.sin(ang) * hw;
        verts.push(wx + outX, wy + outY, wz, (i / segs) * 2.4, 1, 0.5);
        verts.push(wx - outX, wy - outY, wz, (i / segs) * 2.4, -1, 0.5);
      }
      const vbo = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
      this.rings.push({
        vbo,
        count: verts.length / 6,
        color: hexToRgb(spec.color, [0.92, 0.35, 0.22]),
        alpha: spec.alpha ?? 0.72
      });
    }
  }

  // 构建三维环境与战火粒子（长津湖飘雪 + 激战/火攻上升火星）
  setParticles(markers = []) {
    if (!this.ready || !this.profile) return;
    const gl = this.gl;
    const data = [];

    // 极寒雪景飘雪粒子
    if (this.profile.weather === "snow") {
      for (let i = 0; i < 180; i++) {
        const sx = (hash2(i, 1, 901) - 0.5) * WORLD_W * 1.15;
        const sy = (hash2(i, 2, 901) - 0.5) * WORLD_H * 1.15;
        const sp = hash2(i, 3, 901);
        data.push(sx, sy, sp, 0);
      }
    }

    // 战火/火攻节点上升火星
    markers.forEach((m, mIdx) => {
      if (m.type !== "fire" && m.type !== "clash") return;
      const [wx, wy] = this.mapToWorldXY(m.x, m.y);
      const wz = this.sampleElevation(m.x, m.y) + 0.02;
      const count = m.type === "fire" ? 28 : 16;
      for (let i = 0; i < count; i++) {
        const jx = (hash2(i + mIdx * 50, 4, 777) - 0.5) * 0.05;
        const jy = (hash2(i + mIdx * 50, 5, 777) - 0.5) * 0.05;
        const jz = wz + hash2(i + mIdx * 50, 6, 777) * 0.04;
        data.push(wx + jx, wy + jy, jz, 1);
      }
    });

    if (this.particleBuf) gl.deleteBuffer(this.particleBuf);
    this.particleCount = data.length / 4;
    if (this.particleCount === 0) {
      this.particleBuf = null;
      return;
    }
    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    this.particleBuf = vbo;
  }

  resize() {
    if (!this.ready || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = w;
    this.height = h;
    this.dpr = dpr;
    if (this.canvas.width !== Math.round(w * dpr) || this.canvas.height !== Math.round(h * dpr)) {
      this.canvas.width = Math.round(w * dpr);
      this.canvas.height = Math.round(h * dpr);
    }
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
  }

  updateCamera(cam) {
    if (!this.ready) return;
    const pitchRad = (Math.max(14, Math.min(82, cam.pitch)) * Math.PI) / 180;
    const yawRad = (cam.yaw * Math.PI) / 180;
    const dist = 2.40 / Math.max(0.65, Math.min(2.3, cam.zoom || 1));

    const targetX = -(cam.panX || 0) * 0.0025;
    const targetY = (cam.panY || 0) * 0.0025;
    const targetZ = 0.08;

    const horiz = Math.cos(pitchRad) * dist;
    const eyeX = targetX + Math.sin(yawRad) * horiz;
    const eyeY = targetY - Math.cos(yawRad) * horiz;
    const eyeZ = targetZ + Math.sin(pitchRad) * dist;

    this.eyePos = [eyeX, eyeY, eyeZ];
    const aspect = Math.max(0.5, this.width / Math.max(1, this.height));
    const proj = mat4Perspective((40 * Math.PI) / 180, aspect, 0.1, 25.0);
    const view = mat4LookAt(this.eyePos, [targetX, targetY, targetZ], [0, 0, 1]);
    this.mvp = mat4Multiply(proj, view);
  }

  project(x, y, zOffset = 0) {
    const [wx, wy] = this.mapToWorldXY(x, y);
    const wz = this.sampleElevation(x, y) + zOffset;
    const m = this.mvp;
    const cx = m[0] * wx + m[4] * wy + m[8] * wz + m[12];
    const cy = m[1] * wx + m[5] * wy + m[9] * wz + m[13];
    const cz = m[2] * wx + m[6] * wy + m[10] * wz + m[14];
    const cw = m[3] * wx + m[7] * wy + m[11] * wz + m[15];
    if (cw <= 0.001) return { sx: -999, sy: -999, depth: 1, visible: false };
    const ndcX = cx / cw;
    const ndcY = cy / cw;
    const ndcZ = cz / cw;
    return {
      sx: (ndcX * 0.5 + 0.5) * this.width,
      sy: (0.5 - ndcY * 0.5) * this.height,
      depth: ndcZ,
      visible: ndcX > -1.15 && ndcX < 1.15 && ndcY > -1.15 && ndcY < 1.15 && ndcZ > -1 && ndcZ < 1
    };
  }

  render(timeSec, { showEnemy = true, phaseElapsed = 10 } = {}) {
    if (!this.ready || !this.terrainBuf || !this.profile) return;
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.BLEND);

    const pal = this.profile.palette;

    // 1. 起伏地形表面
    gl.useProgram(this.terrainProg);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.terrainBuf.vbo);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.terrainBuf.ibo);

    const stride = 11 * 4;
    const bindAttr = (prog, name, size, offset) => {
      const loc = gl.getAttribLocation(prog, name);
      if (loc >= 0) {
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, stride, offset);
      }
    };
    bindAttr(this.terrainProg, "aPos", 3, 0);
    bindAttr(this.terrainProg, "aNormal", 3, 12);
    bindAttr(this.terrainProg, "aMeta", 3, 24);
    bindAttr(this.terrainProg, "aUv", 2, 36);

    gl.uniformMatrix4fv(gl.getUniformLocation(this.terrainProg, "uMvp"), false, this.mvp);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorLow"), pal.low);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorMid"), pal.mid);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorHigh"), pal.high);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorPeak"), pal.peak);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorRock"), pal.rock);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorRoad"), pal.road);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorWater"), pal.water);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uColorWaterDeep"), pal.waterDeep);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uFogColor"), this.profile.fogColor);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uLightDir"), [0.62, 0.36, 0.68]);
    gl.uniform3fv(gl.getUniformLocation(this.terrainProg, "uEyePos"), this.eyePos);
    gl.uniform1f(gl.getUniformLocation(this.terrainProg, "uContourStep"), this.profile.contourStep);
    gl.uniform1f(gl.getUniformLocation(this.terrainProg, "uSnowLevel"), this.profile.snowLevel);
    gl.uniform1f(gl.getUniformLocation(this.terrainProg, "uTime"), timeSec);

    gl.drawElements(gl.TRIANGLES, this.terrainBuf.count, gl.UNSIGNED_SHORT, 0);

    // 2. 四周实体地质切面底座
    if (this.skirtBuf) {
      gl.useProgram(this.skirtProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.skirtBuf.vbo);
      const posLoc = gl.getAttribLocation(this.skirtProg, "aPos");
      const shadeLoc = gl.getAttribLocation(this.skirtProg, "aShade");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(shadeLoc);
      gl.vertexAttribPointer(shadeLoc, 1, gl.FLOAT, false, 16, 12);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.skirtProg, "uMvp"), false, this.mvp);
      gl.uniform3fv(gl.getUniformLocation(this.skirtProg, "uSkirtTop"), pal.skirtTop);
      gl.uniform3fv(gl.getUniformLocation(this.skirtProg, "uSkirtBottom"), pal.skirtBottom);
      gl.drawArrays(gl.TRIANGLES, 0, this.skirtBuf.count);
    }

    // 3. 贴地三维包围圈光环与态势大箭头
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false);

    if (this.rings.length > 0 || this.ribbons.length > 0) {
      gl.useProgram(this.ribbonProg);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.ribbonProg, "uMvp"), false, this.mvp);
      gl.uniform1f(gl.getUniformLocation(this.ribbonProg, "uTime"), timeSec);

      const posLoc = gl.getAttribLocation(this.ribbonProg, "aPos");
      const uvLoc = gl.getAttribLocation(this.ribbonProg, "aUv");
      const colLoc = gl.getUniformLocation(this.ribbonProg, "uColor");
      const alphaLoc = gl.getUniformLocation(this.ribbonProg, "uAlpha");
      const dashLoc = gl.getUniformLocation(this.ribbonProg, "uDashScale");
      const speedLoc = gl.getUniformLocation(this.ribbonProg, "uSpeed");
      const progLoc = gl.getUniformLocation(this.ribbonProg, "uProgress");

      for (const ring of this.rings) {
        gl.bindBuffer(gl.ARRAY_BUFFER, ring.vbo);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 3, gl.FLOAT, false, 24, 12);
        gl.uniform3fv(colLoc, ring.color);
        gl.uniform1f(alphaLoc, ring.alpha * (0.7 + 0.3 * Math.sin(timeSec * 3.0)));
        gl.uniform1f(dashLoc, 8.0);
        gl.uniform1f(speedLoc, 0.9);
        gl.uniform1f(progLoc, 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, ring.count);
      }

      const drawProg = Math.min(1.0, phaseElapsed / 1.15);
      const easedProg = 1 - Math.pow(1 - drawProg, 3);

      for (const r of this.ribbons) {
        if (!showEnemy && r.side === "blue") continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, r.vbo);
        gl.enableVertexAttribArray(posLoc);
        gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);
        gl.enableVertexAttribArray(uvLoc);
        gl.vertexAttribPointer(uvLoc, 3, gl.FLOAT, false, 24, 12);
        gl.uniform3fv(colLoc, r.color);
        gl.uniform1f(alphaLoc, r.alpha);
        gl.uniform1f(dashLoc, r.dashScale);
        gl.uniform1f(speedLoc, r.speed);
        gl.uniform1f(progLoc, r.animateDraw ? easedProg : 1.0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, r.count);
      }
    }

    // 4. 三维雪花与战火上升火星粒子
    if (this.particleBuf && this.particleCount > 0) {
      gl.useProgram(this.particleProg);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuf);
      const seedLoc = gl.getAttribLocation(this.particleProg, "aSeed");
      const kindLoc = gl.getAttribLocation(this.particleProg, "aKind");
      gl.enableVertexAttribArray(seedLoc);
      gl.vertexAttribPointer(seedLoc, 3, gl.FLOAT, false, 16, 0);
      gl.enableVertexAttribArray(kindLoc);
      gl.vertexAttribPointer(kindLoc, 1, gl.FLOAT, false, 16, 12);
      gl.uniformMatrix4fv(gl.getUniformLocation(this.particleProg, "uMvp"), false, this.mvp);
      gl.uniform1f(gl.getUniformLocation(this.particleProg, "uTime"), timeSec);
      gl.uniform1f(gl.getUniformLocation(this.particleProg, "uPointScale"), this.dpr);
      gl.drawArrays(gl.POINTS, 0, this.particleCount);
    }

    gl.depthMask(true);
    gl.disable(gl.BLEND);
  }
}
