// 四渡赤水 (1935年) 战役沙盘推演数据
// 史料参考：军事科学院、中国军网、中央党史和文献研究院公开资料

const redCommanders = [
  { name: "毛泽东", role: "中央政治局常委；核心军事决策" },
  { name: "周恩来", role: "军事指挥主要负责人" },
  { name: "朱德", role: "中革军委主席、红军总司令" },
  { name: "王稼祥", role: "中革军委副主席；三人军事指挥小组成员" }
];

const opposingCommanders = [
  { name: "蒋介石", role: "国民政府军事委员会委员长；统筹围堵" },
  { name: "薛岳", role: "第2路军前敌总指挥" },
  { name: "刘湘 / 潘文华", role: "川军与川南方向堵截" },
  { name: "龙云 / 孙渡", role: "滇军方向指挥" },
  { name: "王家烈 / 侯之担", role: "黔军方向指挥" }
];

const phases = [
  {
    id: "first-crossing",
    short: "一渡",
    tag: "摆脱被动",
    name: "一渡赤水",
    date: "1935.01.28—02.09",
    intent: "土城战斗中发现川军兵力和增援超出预判，红军停止恋战，连夜由土城、元厚一带西渡赤水，转入川南与扎西地区。",
    goal: "脱离土城正面，保存主力",
    result: "进入川滇黔边，争取重新选择方向",
    route: "M552 410 C510 389 454 357 392 326 C350 305 318 298 290 281 C260 262 243 233 226 205 C201 171 184 198 170 245 C154 296 155 345 172 384",
    enemyRoutes: [
      "M390 150 C372 195 352 235 326 270",
      "M760 330 C700 335 640 345 596 380",
      "M225 585 C208 520 192 460 180 405"
    ],
    keys: ["遵义", "土城", "元厚", "古蔺", "叙永", "石厢子", "扎西"],
    markers: [
      { x: 315, y: 288, type: "clash", label: "青杠坡激战", desc: "1月28日与川军郭勋祺部激战，果断撤出转而西渡赤水。" },
      { x: 172, y: 384, type: "turning", label: "扎西整编", desc: "2月上旬召开扎西会议，部队精简缩编为16个团。" }
    ],
    detail: [
      ["01.28", "青杠坡激战", "情报判断由约4个团修正为更多兵力且援军持续到达。"],
      ["01.28夜", "改变北进路线", "撤出战斗，不以既定计划束缚主力。"],
      ["01.29", "土城、元厚西渡", "红一、红三、红五军团与军委纵队分路过河；红九军团担任警戒。"],
      ["02.05—09", "扎西会议与整编", "调整组织和行动方针，中央红军缩编为16个团。"]
    ],
    formations: [
      { id: "red-command", side: "red", label: "军委纵队", sub: "毛·周·朱·王", x: 300, y: 306 },
      { id: "red-1", side: "red", label: "红1军团", sub: "林彪 / 聂荣臻", x: 254, y: 262, anchor: "left" },
      { id: "red-3", side: "red", label: "红3军团", sub: "彭德怀 / 杨尚昆", x: 330, y: 350 },
      { id: "red-5", side: "red", label: "红5军团", sub: "董振堂 / 李卓然", x: 222, y: 345, anchor: "left" },
      { id: "red-9", side: "red", label: "红9军团", sub: "罗炳辉 / 何长工", x: 380, y: 282 },
      { id: "sichuan", side: "blue", label: "川军郭勋祺部", sub: "土城方向", x: 360, y: 215 },
      { id: "central-zhou", side: "blue", label: "中央军周浑元纵队", sub: "由东向西压迫", x: 690, y: 335 },
      { id: "central-wu", side: "blue", label: "中央军吴奇伟纵队", sub: "黔北追堵", x: 690, y: 450 },
      { id: "yunnan", side: "blue", label: "滇军孙渡部", sub: "由南向扎西", x: 220, y: 525 },
      { id: "guizhou", side: "blue", label: "黔军侯之担部", sub: "遵义—赤水间", x: 470, y: 300 }
    ]
  },
  {
    id: "second-crossing",
    short: "二渡",
    tag: "避实击虚",
    name: "二渡赤水",
    date: "1935.02.18—02.28",
    intent: "川军封锁长江、滇军向扎西逼近。红军由扎西地区突然回师，经石厢子、水潦向太平渡、二郎滩东渡，攻击黔北薄弱方向。",
    goal: "避开重兵，夺取黔北战机",
    result: "取桐梓、夺娄山关、再占遵义",
    route: "M172 384 C194 354 214 334 244 316 C270 301 282 318 295 338 C316 367 352 372 390 360 C436 345 489 336 533 344 C550 349 558 358 555 372 C549 390 557 405 570 410",
    enemyRoutes: [
      "M690 500 C650 470 615 445 585 425",
      "M200 520 C190 475 182 435 176 400",
      "M640 260 C610 290 585 320 565 350"
    ],
    keys: ["扎西", "石厢子", "水潦", "太平渡", "二郎滩", "桐梓", "娄山关", "遵义", "老鸦山"],
    markers: [
      { x: 555, y: 372, type: "clash", label: "娄山关大捷", desc: "2月25—26日红三军团主攻夺取黔北门户。" },
      { x: 572, y: 416, type: "victory", label: "再占遵义", desc: "歼敌两个师又八个团，取得长征以来重大胜利。" }
    ],
    detail: [
      ["02.18—21", "太平渡、二郎滩东渡", "红三军团前卫先夺渡口，各军团随即连续过河。"],
      ["02.24", "攻取桐梓", "红一、红三军团协同，打开向娄山关推进的通道。"],
      ["02.25—26", "娄山关战斗", "红三军团主攻并击退反扑，控制黔北门户。"],
      ["02.27—28", "再占遵义、老鸦山激战", "打击吴奇伟纵队，取得长征以来一次重要胜利。"]
    ],
    formations: [
      { id: "red-command", side: "red", label: "军委纵队", sub: "随主力东进", x: 395, y: 372 },
      { id: "red-1", side: "red", label: "红1军团", sub: "桐梓—遵义", x: 515, y: 318, anchor: "left" },
      { id: "red-3", side: "red", label: "红3军团", sub: "娄山关主攻", x: 565, y: 365 },
      { id: "red-5", side: "red", label: "红5军团", sub: "主力后卫", x: 365, y: 420 },
      { id: "red-9", side: "red", label: "红9军团", sub: "二郎滩方向", x: 300, y: 380, anchor: "left" },
      { id: "sichuan", side: "blue", label: "川军潘文华部", sub: "川南封锁", x: 338, y: 145 },
      { id: "central-zhou", side: "blue", label: "周浑元纵队", sub: "遵义西南", x: 540, y: 500 },
      { id: "central-wu", side: "blue", label: "吴奇伟纵队", sub: "遵义南面增援", x: 690, y: 470 },
      { id: "yunnan", side: "blue", label: "滇军孙渡部", sub: "扎西方向扑空", x: 180, y: 505 },
      { id: "guizhou", side: "blue", label: "黔军王家烈部", sub: "桐梓、娄山关", x: 620, y: 290 }
    ]
  },
  {
    id: "third-crossing",
    short: "三渡",
    tag: "调敌西进",
    name: "三渡赤水",
    date: "1935.03.05—03.17",
    intent: "遵义战役后敌军再次收拢。红军在鲁班场攻击未达预期，随即转向茅台，在公开态势下西渡赤水，作出再次北渡长江的姿态。",
    goal: "把国民党军主力调向川南",
    result: "敌军部署重心西移，东南方向出现间隙",
    route: "M570 410 C535 425 492 430 449 417 C418 408 386 395 348 386 C321 376 296 351 288 326 C281 300 267 267 232 239 C206 219 190 203 183 187",
    enemyRoutes: [
      "M580 480 C535 455 490 435 445 422",
      "M262 120 C252 160 244 195 238 226",
      "M290 600 C280 540 268 480 260 430"
    ],
    keys: ["遵义", "苟坝", "鲁班场", "茅台", "古蔺", "叙永"],
    markers: [
      { x: 470, y: 438, type: "turning", label: "苟坝会议", desc: "3月10—12日成立新三人军事指挥小组，放弃攻打打鼓新场。" },
      { x: 348, y: 386, type: "turning", label: "茅台西渡", desc: "公开态势西渡赤水，诱使国民党军主力西移川南。" }
    ],
    detail: [
      ["03.05—12", "遵义战后与苟坝会议", "红军在遵义以西寻找战机。苟坝会议取消进攻打鼓新场的计划，随后调整军事指挥机制。"],
      ["03.15", "由鲁班场转向茅台", "鲁班场战斗未能速决，红军撤出并转向赤水河上游。"],
      ["03.16—17", "茅台及附近西渡", "红军向古蔺、叙永方向机动，摆出北渡长江的态势。"],
      ["三渡后", "国民党军转向川南", "国民党军调集多路部队加强川南及长江沿线部署。"]
    ],
    formations: [
      { id: "red-command", side: "red", label: "三人军事指挥小组", sub: "毛·周·王", x: 395, y: 440 },
      { id: "red-1", side: "red", label: "红1军团", sub: "茅台以西", x: 290, y: 320, anchor: "left" },
      { id: "red-3", side: "red", label: "红3军团", sub: "鲁班场—茅台", x: 365, y: 395 },
      { id: "red-5", side: "red", label: "红5军团", sub: "主力掩护", x: 280, y: 430, anchor: "left" },
      { id: "red-9", side: "red", label: "红9军团", sub: "古蔺方向佯动", x: 225, y: 250, anchor: "left" },
      { id: "sichuan", side: "blue", label: "川军潘文华部", sub: "古蔺、叙永防堵", x: 250, y: 140 },
      { id: "central-zhou", side: "blue", label: "周浑元纵队", sub: "鲁班场一带", x: 470, y: 470 },
      { id: "central-wu", side: "blue", label: "吴奇伟纵队", sub: "遵义东南", x: 680, y: 470 },
      { id: "yunnan", side: "blue", label: "滇军孙渡部", sub: "由南向西北", x: 280, y: 585 },
      { id: "guizhou", side: "blue", label: "黔军王家烈部", sub: "黔北配合", x: 600, y: 320 }
    ]
  },
  {
    id: "fourth-crossing",
    short: "四渡",
    tag: "跳出合围",
    name: "四渡赤水",
    date: "1935.03.20—04.01",
    intent: "当川军、中央军和滇军向古蔺周围调动时，红军以红一军团一个团继续向西佯动，主力秘密折返，由二郎滩至太平渡一线东渡。",
    goal: "从尚未闭合的间隙穿出",
    result: "南渡乌江，直逼贵阳，跳出合围",
    route: "M232 239 C259 264 286 293 302 327 C319 363 347 395 385 423 C416 445 443 463 470 489 C492 512 500 539 469 552 C448 560 430 573 424 592",
    enemyRoutes: [
      "M420 300 C370 282 318 265 262 248",
      "M250 135 C246 175 242 205 238 228",
      "M185 495 C195 410 208 330 222 262",
      "M660 395 C620 400 585 415 548 432"
    ],
    keys: ["古蔺", "二郎滩", "太平渡", "临江场", "楠木坝", "花茂", "乌江", "贵阳"],
    markers: [
      { x: 300, y: 350, type: "turning", label: "秘密东渡", desc: "3月21—22日由二郎滩、太平渡神速折返，穿出敌军合围间隙。" },
      { x: 424, y: 592, type: "victory", label: "南渡乌江", desc: "3月31日主力南渡乌江，直逼贵阳，彻底跳出包围圈。" }
    ],
    detail: [
      ["03.20", "秘密折向东进", "红一军团一个团继续向古蔺佯动；主力以夜行军快速转向。"],
      ["03.21—22", "二郎滩至太平渡东渡", "红军与敌军主力相向穿插，再入黔北。"],
      ["03.23—30", "临江场—楠木坝—花茂南进", "不给敌军重建封锁线的时间，急速指向乌江。"],
      ["03.31—04.01", "南渡乌江", "主力向贵阳方向前进，为随后调出滇军、进军云南创造条件。"]
    ],
    formations: [
      { id: "red-command", side: "red", label: "军委纵队", sub: "随主力秘密东进", x: 412, y: 448, anchor: "left" },
      { id: "red-1", side: "red", label: "红1军团主力", sub: "东渡后转向南", x: 470, y: 490 },
      { id: "red-3", side: "red", label: "红3军团", sub: "太平渡—楠木坝", x: 400, y: 410 },
      { id: "red-5", side: "red", label: "红5军团", sub: "主力后卫", x: 345, y: 372, anchor: "left" },
      { id: "red-9", side: "red", label: "红9军团", sub: "牵制与侧翼警戒", x: 300, y: 318, anchor: "left" },
      { id: "red-decoy", side: "red", label: "红1军团1个团", sub: "向古蔺佯动", x: 205, y: 215, anchor: "left" },
      { id: "sichuan", side: "blue", label: "川军潘文华部", sub: "古蔺周围", x: 250, y: 140 },
      { id: "central-zhou", side: "blue", label: "周浑元纵队", sub: "被调往赤水河西", x: 330, y: 255 },
      { id: "central-wu", side: "blue", label: "吴奇伟纵队", sub: "黔北调整中", x: 640, y: 385 },
      { id: "yunnan", side: "blue", label: "滇军孙渡部", sub: "川南西侧", x: 185, y: 510 },
      { id: "guizhou", side: "blue", label: "黔军王家烈部", sub: "乌江北岸", x: 560, y: 590 }
    ]
  }
];

export default {
  id: "chishui-1935",
  title: "四渡赤水",
  subtitle: "中央红军川黔滇机动作战",
  period: "1935.01.19—05.09",
  theater: "川 · 黔 · 滇",
  era: "中国工农红军长征",
  opponents: "中央红军 VS 国民党军",
  seal: "渡",
  theme: {
    id: "red-army-ink",
    accent: "#c93b2b",
    accentBright: "#e2513f",
    accentDark: "#8f241b",
    accentSoft: "rgba(201, 59, 43, 0.16)",
    opposing: "#8aa2aa",
    opposingSoft: "rgba(138, 162, 170, 0.2)",
    gold: "#d6b56a",
    stageBg: "#121512",
    stageBgAlt: "#1b201b",
    stageGlow: "rgba(130, 150, 110, 0.16)",
    paper: "#ebe6da",
    paperLight: "#f5f2ea",
    paperMuted: "#dcd6c6",
    ink: "#181a17",
    muted: "#62645c",
    closingBg: "#6a1d17"
  },
  meta: {
    heroTitle: ["四渡", "赤水"],
    eyebrow: ["交互战役沙盘", "1935 · 长征"],
    deck: "在十倍兵力的合围中，以方向换时间，以机动造战机。",
    facts: [
      ["时间", "1935.01—03"],
      ["战场", "川黔滇边"],
      ["兵力", "3万余 : 约40万"]
    ],
    quote: "“打得赢就打，打不赢就走。”",
    quoteAuthor: "毛泽东",
    quoteMark: "变",
    quoteDesc: "四渡赤水的关键，不是重复渡河本身，而是在不确定中持续夺回主动。"
  },
  mapConfig: {
    viewBox: "0 0 880 720",
    scaleNote: "川黔滇边 · 态势示意",
    filterSides: { all: "全部番号", red: "红军", blue: "国民党军" },
    legends: [
      { colorClass: "legend-red", label: "红军机动" },
      { colorClass: "legend-dark", label: "国民党军围堵" },
      { colorClass: "legend-river", label: "河流" }
    ],
    terrainSvg: `
      <path class="terrain-region" d="M68 516 C160 453 222 461 296 501 C365 539 420 610 461 718 L48 718 Z" />
      <path class="terrain-region" d="M70 28 L699 28 C693 135 655 192 599 228 C530 271 427 227 360 248 C275 275 239 333 167 325 C105 318 74 240 70 28 Z" />
      <path class="terrain-region" d="M295 346 C389 290 511 284 644 318 C730 340 795 432 826 612 L463 718 C421 613 356 539 296 501 C255 475 250 399 295 346 Z" />
      <path class="terrain-grid" d="M70 28 L699 28 C693 135 655 192 599 228 C530 271 427 227 360 248 C275 275 239 333 167 325 C105 318 74 240 70 28 Z M295 346 C389 290 511 284 644 318 C730 340 795 432 826 612 L463 718 C421 613 356 539 296 501 C255 475 250 399 295 346 Z" />
      <g class="region-labels" aria-hidden="true">
        <text x="400" y="120">四川</text>
        <text x="610" y="575">贵州</text>
        <text x="130" y="650">云南</text>
      </g>
      <g class="mountains" aria-hidden="true">
        <path d="M520 360 l10 -14 l10 14 M538 356 l9 -12 l9 12" />
        <path d="M600 250 l9 -12 l9 12 M615 254 l8 -10 l8 10" />
        <path d="M150 440 l10 -13 l10 13 M166 444 l8 -10 l8 10" />
      </g>
      <path class="river river-key" d="M352 110 C326 170 343 212 310 268 C283 314 316 359 287 411 C259 461 283 515 250 570" />
      <path class="river" d="M351 581 C431 550 507 576 573 622 C635 665 711 655 780 630" />
      <path class="river river-minor" d="M120 70 C260 60 420 80 560 50 C640 34 720 40 820 30" />
      <g class="river-labels" aria-hidden="true">
        <text x="318" y="196" transform="rotate(-72 318 196)">赤水河</text>
        <text x="600" y="640" transform="rotate(18 600 640)">乌江</text>
        <text x="460" y="62">长江</text>
      </g>
    `,
    defaultEnemyRoutes: [],
    futureRoute: "M467 552 C508 602 580 623 646 642 C703 659 729 691 744 714",
    locations: [
      { name: "遵义", x: 552, y: 410, r: 5, kind: "city", labelX: 11, labelY: -9, sub: "遵义会议所在地；二渡后再占" },
      { name: "桐梓", x: 533, y: 344, r: 4, labelX: 10, labelY: -8, sub: "二渡后攻取，打开娄山关通道" },
      { name: "娄山关", x: 555, y: 372, r: 4, kind: "fortress", labelX: 11, labelY: -8, sub: "黔北门户；红3军团主攻夺关" },
      { name: "土城", x: 300, y: 292, r: 5, kind: "ford", labelX: 10, labelY: -9, sub: "青杠坡战斗；一渡渡口" },
      { name: "元厚", x: 282, y: 272, r: 4, kind: "ford", labelX: 10, labelY: -8, sub: "一渡渡口" },
      { name: "太平渡", x: 295, y: 338, r: 4, kind: "ford", labelX: -52, labelY: -7, sub: "二渡、四渡渡口" },
      { name: "二郎滩", x: 306, y: 361, r: 4, kind: "ford", labelX: -52, labelY: 17, sub: "二渡、四渡渡口" },
      { name: "茅台", x: 348, y: 386, r: 5, kind: "ford", labelX: 10, labelY: -8, sub: "三渡渡口；公开西渡诱敌" },
      { name: "古蔺", x: 232, y: 239, r: 4, labelX: -38, labelY: -9, sub: "三渡后佯动方向" },
      { name: "叙永", x: 185, y: 188, r: 4, labelX: -38, labelY: -8, sub: "川南重镇" },
      { name: "扎西", x: 172, y: 384, r: 4, labelX: -38, labelY: -8, sub: "扎西会议；缩编为16个团" },
      { name: "石厢子", x: 208, y: 345, r: 3, labelX: -48, labelY: -9, sub: "回师东进经过地" },
      { name: "水潦", x: 252, y: 318, r: 3, labelX: -34, labelY: 17, sub: "回师东进经过地" },
      { name: "老鸦山", x: 594, y: 427, r: 3, labelX: 10, labelY: 15, sub: "遵义战役激战地" },
      { name: "鲁班场", x: 420, y: 416, r: 3, labelX: 10, labelY: -8, sub: "03.15 攻击未果后转移" },
      { name: "苟坝", x: 470, y: 438, r: 3, labelX: 10, labelY: 16, sub: "苟坝会议" },
      { name: "临江场", x: 400, y: 458, r: 3, labelX: -48, labelY: 17, sub: "四渡后南进经过地" },
      { name: "楠木坝", x: 436, y: 485, r: 3, labelX: 10, labelY: -8, sub: "四渡后南进经过地" },
      { name: "花茂", x: 473, y: 514, r: 3, labelX: 10, labelY: 16, sub: "向乌江急进" },
      { name: "乌江", x: 424, y: 592, r: 4, kind: "ford", labelX: -36, labelY: 18, sub: "03.31 南渡乌江" },
      { name: "贵阳", x: 570, y: 535, r: 5, kind: "capital", labelX: 11, labelY: -8, sub: "贵州省会；佯攻调出滇军" },
      { name: "昆明", x: 276, y: 658, r: 5, kind: "capital", labelX: 11, labelY: -8, sub: "云南省会" }
    ]
  },
  commanders: {
    redLabel: "中央红军",
    redSub: "最高决策与指挥",
    blueLabel: "国民党军",
    blueSub: "围堵体系",
    red: redCommanders,
    blue: opposingCommanders
  },
  orderOfBattle: {
    red: [
      ["中革军委 / 军委纵队", "朱德、周恩来、毛泽东、王稼祥等", "战略决策、统一指挥与中枢保障"],
      ["红1军团", "林彪 / 聂荣臻", "前卫、突击与关键通道控制"],
      ["红3军团", "彭德怀 / 杨尚昆", "主攻、夺关与重要战斗任务"],
      ["红5军团", "董振堂 / 李卓然", "后卫、掩护与阻击"],
      ["红9军团", "罗炳辉 / 何长工", "侧翼警戒、牵制与战略佯动"],
      ["干部团", "陈赓 / 宋任穷", "军委直属；渡河警戒与特殊任务"]
    ],
    blue: [
      ["国民政府军事委员会", "蒋介石", "统筹中央军与各省部队围堵"],
      ["第2路军前敌总指挥部", "薛岳", "协调吴奇伟、周浑元两纵队"],
      ["吴奇伟纵队", "吴奇伟", "中央军；遵义、黔北方向追堵"],
      ["周浑元纵队", "周浑元", "中央军；遵义以西与川南方向推进"],
      ["川军", "刘湘 / 潘文华；郭勋祺等", "长江南岸、古蔺、叙永及土城方向堵截"],
      ["滇军", "龙云 / 孙渡", "由云南、毕节方向北上协同"],
      ["黔军", "王家烈；侯之担等", "黔北地方守备与追击"],
      ["湘军等部", "何键所部等", "外围封锁与策应，未始终直接接战"]
    ]
  },
  situation: {
    eyebrow: "遵义会议之后 · 1935年初",
    title: "不是“计划好的四渡”，<br />而是不断读懂战场。",
    narrative: "湘江战役后，中央红军兵力锐减。蒋介石调集中央军及川、黔、滇等部，从多方向压缩红军活动空间。每一次转向，都来自敌情与地形的即时变化。",
    forceComparison: {
      red: {
        label: "中央红军",
        count: "3万余",
        width: "8%",
        desc: "红一、红三、红五、红九军团及军委纵队；兵力集中，但补给与重装备有限。"
      },
      blue: {
        label: "国民党军围堵兵力",
        count: "约40万",
        width: "100%",
        desc: "中央军与川、黔、滇等部构成多路围堵；数量占优，但隶属分散、协同与判断存在时差。"
      },
      note: "注：约40万为各方向围堵兵力的总体规模，并非同时与红军正面接触。"
    },
    deployments: {
      red: {
        title: "红军部署",
        subtitle: "集中 · 轻装 · 快速",
        items: [
          ["红一军团", "担任前卫与主力突击，控制关键通道。"],
          ["红三军团", "在娄山关、遵义等战斗中承担重要进攻任务。"],
          ["红五、红九军团", "警戒、掩护、牵制，保障主力机动空间。"],
          ["军委纵队", "中枢随主力行动，以电令保持高度集中的指挥。"]
        ]
      },
      blue: {
        title: "国民党军部署",
        subtitle: "分区 · 堵截 · 合围",
        items: [
          ["北面 · 川军", "封锁长江沿线与川南通道，阻止红军北渡。"],
          ["东面 · 中央军、黔军", "沿遵义及黔北推进，追击并压缩活动区域。"],
          ["南面 · 滇军", "由云南方向北上，参与滇黔边堵截。"],
          ["总体企图", "以优势兵力层层设防，将红军围歼于乌江西北。"]
        ]
      }
    }
  },
  logic: {
    eyebrow: "为什么这样调动？",
    title: "让对手追着“意图”走，<br />主力从缝隙中穿过。",
    steps: [
      { roman: "I", title: "先制造判断", desc: "公开行动、佯攻和渡河方向，让对手相信红军将北渡长江或进攻某处。", keyword: "示形" },
      { roman: "II", title: "再调动重兵", desc: "敌军围绕预判方向重新部署；兵力越多，转向与协同越慢，原有防线随之出现间隙。", keyword: "调敌" },
      { roman: "III", title: "最后突然折返", desc: "主力以夜行、急行军和小部队牵制完成方向转换，抢在合围闭合之前通过。", keyword: "穿隙" }
    ],
    decisionLoop: {
      eyebrow: "决策循环",
      title: "情报不是结论，<br />而是下一次转向的起点。",
      items: [
        ["01", "观察敌情", "识别围堵方向与薄弱部位"],
        ["02", "选择战机", "避开主力，打击孤立之敌"],
        ["03", "快速转向", "以行军速度重置战场关系"],
        ["04", "重新评估", "不被原计划束缚，再次决策"]
      ]
    }
  },
  chronicle: {
    eyebrow: "1935.01.19 — 03.22",
    title: "64天，<br />四次改变方向。",
    deck: "点击事件可回到相应一幕。日期与路线为战役级概括，渡河行动往往持续一至数日。",
    events: [
      { date: "01.19", stage: "序幕", title: "离开遵义，向川黔边机动", desc: "原拟由川南北渡长江，与红四方面军会合。", tag: "战略转移", phaseIndex: 0, isBackground: true },
      { date: "01.28", stage: "土城 · 青杠坡", title: "敌情超出预判，停止恋战", desc: "川军实际兵力和增援情况改变，红军当夜决定撤出战斗。", tag: "临机决断", phaseIndex: 0, eventId: "chishui-1-2" },
      { date: "01.28—29", stage: "一渡赤水", title: "从土城、元厚一带西渡", desc: "主力进入川南，摆脱土城正面的不利态势。", tag: "摆脱被动", phaseIndex: 0, eventId: "chishui-1-3" },
      { date: "02.18—21", stage: "二渡赤水", title: "由太平渡、二郎滩等地东渡", desc: "趁黔北守备空虚回师，转向桐梓、娄山关、遵义。", tag: "避实击虚", phaseIndex: 1, eventId: "chishui-2-1" },
      { date: "02.25—28", stage: "娄山关 · 遵义", title: "夺取关隘，再占遵义", desc: "在运动中选择有利战场，取得长征以来一次重要胜利。", tag: "创造战机", phaseIndex: 1, eventId: "chishui-2-3" },
      { date: "03.16—17", stage: "三渡赤水", title: "由茅台及附近西渡", desc: "主力向古蔺、叙永方向行动，造成再次北渡长江的态势。", tag: "调敌西进", phaseIndex: 2, eventId: "chishui-3-3" },
      { date: "03.21—22", stage: "四渡赤水", title: "秘密折返，再次东渡", desc: "以一部继续向西佯动，主力从二郎滩、太平渡一带快速东渡。", tag: "跳出合围", phaseIndex: 3, eventId: "chishui-4-2" },
      { date: "03.31 → 05.09", stage: "战役之后", title: "南渡乌江，佯攻贵阳，进军云南", desc: "调动滇军东援后转入云南，最终巧渡金沙江，摆脱数十万敌军围追堵截。", tag: "打开新局", phaseIndex: 3, isOutcome: true }
    ]
  },
  phases,
  sources: [
    { title: "中国军网", url: "https://www.81.mil.cn/yljnt_208627/lsda_208656/16451606.html" },
    { title: "共产党员网", url: "https://www.12371.cn/2021/10/21/ARTI1634810104798403.shtml" },
    { title: "中国共产党新闻网", url: "https://cpc.people.com.cn/n1/2022/0825/c443712-32510938.html" },
    { title: "参考视频", url: "https://www.bilibili.com/video/BV11RSYBtEu3/" }
  ]
};
