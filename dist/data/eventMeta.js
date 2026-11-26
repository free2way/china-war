// 战史沙盘 · 稳定事件 ID、导览剧本镜头、前后对照位移与事件级史料出处
// 与 turnScripts.js 通过 (battleId, phaseId, turnIndex) 一一对应，确保时间线、地图、字幕、语音与分享链接指向同一幕。

import { getPhaseTurnScript } from "./turnScripts.js?v=2";

const BATTLE_PREFIX = {
  "chishui-1935": "chishui",
  "guandu-200": "guandu",
  "changjin-1950": "changjin",
  "normandy-1944": "normandy",
  "market-garden-1944": "mg",
  "sinai-1973": "sinai"
};

// 重点导览样板配置（首页直达入口与连续跨阶段导览模式）
export const GUIDED_TOURS = {
  "chishui-3-4": {
    id: "chishui-3-4",
    battleId: "chishui-1935",
    startEventId: "chishui-3-1",
    endEventId: "chishui-4-4",
    phaseRange: [2, 3],
    sceneDurations: [8, 8, 11, 10, 9, 12, 8, 9],
    durationLabel: { zh: "约 75 秒导览", en: "~75s Guided Tour" },
    title: { zh: "三渡 → 四渡赤水 · 调敌与穿隙", en: "3rd → 4th Chishui Crossing · Lure & Breakout" },
    cta: { zh: "观看三渡到四渡 →", en: "Watch 3rd → 4th Crossing →" },
    deck: {
      zh: "同一视角看清：红军如何公开西渡茅台把数十万大军调往古蔺，再连夜折返东渡跳出合围。",
      en: "Watch in a locked frame how the Maotai feint pulled 400,000 KMT troops west—opening the seam for a secret night reversal east."
    }
  },
  "normandy-dday": {
    id: "normandy-dday",
    battleId: "normandy-1944",
    startEventId: "normandy-1-1",
    endEventId: "normandy-4-4",
    phaseRange: [0, 3],
    durationLabel: { zh: "五滩登陆导览", en: "Multi-Beach Campaign Tour" },
    title: { zh: "诺曼底登陆 · 五滩抢滩到突破", en: "Normandy · Five Beaches to Breakout" },
    cta: { zh: "观看诺曼底全线突破 →", en: "Watch Normandy Breakout →" },
    deck: {
      zh: "验证同一套事件时间轴与前后对照机制在多登陆点、多战区复杂战役中的复用效果。",
      en: "Validating the same event timeline, locked-frame comparison, and source architecture across a multi-beach invasion."
    }
  },
  "sinai-gazelle": {
    id: "sinai-gazelle",
    battleId: "sinai-1973",
    startEventId: "sinai-2-3",
    endEventId: "sinai-4-4",
    phaseRange: [1, 3],
    durationLabel: { zh: "现代合成破局导览", en: "Combined-Arms Tour" },
    title: { zh: "西奈反击 · 穿隙渡河到猎杀防空伞", en: "Sinai · Seam Crossing to SAM Hunt" },
    cta: { zh: "观看瞪羚行动合成破局 →", en: "Watch Operation Gazelle →" },
    deck: {
      zh: "同一视角看清：以军如何诱敌脱离防空伞、穿插大苦湖两军缝隙，再以地面突击拔除萨姆导弹替空军开路。",
      en: "Watch in a locked frame how IDF crushed exposed armor, bridged the Bitter Lake seam, and tore open the SAM belt from the ground."
    }
  }
};

// 统一锁定对比镜头：三渡茅台西渡 -> 敌军西移古蔺 -> 四渡秘密折返东渡（同比例、同视角前后对照，完整露出川滇中央军与东渡路线）
const CHISHUI_COMPARE_CAM = { pitch: 39, yaw: -7, zoom: 0.96, panX: 78, panY: -8 };
// 诺曼底海岸线五滩同视角对照镜头
const NORMANDY_COAST_CAM = { pitch: 36, yaw: -6, zoom: 1.06, panX: -8, panY: 16 };
// 苏伊士运河与大苦湖接合部锁定对照镜头
const SINAI_CANAL_CAM = { pitch: 38, yaw: -6, zoom: 1.02, panX: 34, panY: -12 };
const GUIZHOU_HISTORY = "https://www.ccphistory.org.cn/shds/shhm/content/13b1cdbd-0432-4ed9-8f15-7082ed2ea754.html";

// 事件级扩展元数据：镜头编排、前后位置对照、史料依据与地图精度标注
// key 格式：`${battleId}:${phaseId}:${turnIndex}`
export const EVENT_META = {
  /* ==================== 四渡赤水 · 三渡 → 四渡核心样板 ==================== */
  "chishui-1935:third-crossing:0": {
    camera: { pitch: 38, yaw: -8, zoom: 1.04, panX: -20, panY: -12 },
    precision: { zh: "史实地点：遵义、苟坝 · 路线为战役示意 · 3D山势为程序模拟", en: "Verified places: Zunyi, Gouba · Schematic routes · Procedural 3D terrain" },
    sources: [
      { title: { zh: "贵州省委党史研究室《中央红军长征在贵州》", en: "The Central Red Army’s Long March in Guizhou" }, note: { zh: "3月5日红一、三军团奉命寻歼周浑元部。3月中旬，苟坝一带调组军事指挥机构。", en: "On March 5 the 1st and 3rd Army Groups sought Zhou Hunyuan's forces. In mid-March, military command was reorganized around Gouba." }, url: GUIZHOU_HISTORY }
    ]
  },
  "chishui-1935:third-crossing:1": {
    camera: CHISHUI_COMPARE_CAM,
    precision: { zh: "史实地点：鲁班场、茅台 · 路线为战役示意", en: "Verified places: Lubanchang, Maotai · Schematic routes" },
    sources: [
      { title: { zh: "贵州省委党史研究室《中央红军长征在贵州》", en: "The Central Red Army’s Long March in Guizhou" }, note: { zh: "3月15日红军进攻鲁班场，国民党军援兵赶来时转向茅台。", en: "On March 15 the Red Army attacked at Lubanchang and shifted toward Maotai as reinforcements approached." }, url: GUIZHOU_HISTORY }
    ]
  },
  "chishui-1935:third-crossing:2": {
    camera: CHISHUI_COMPARE_CAM,
    compareLabel: { zh: "同视角对照 · ① 茅台公开西渡（诱敌起点）", en: "Locked Frame · 1. Open West Crossing at Maotai" },
    precision: { zh: "史实渡口：茅台（3月16—17日） · 路线为示意 · 3D地形程序生成", en: "Verified ford: Maotai (Mar 16–17) · Schematic trajectory · Procedural 3D terrain" },
    sources: [
      { title: { zh: "中国军网 · 四渡赤水战役档案", en: "China Military Online · Chishui Archives" }, note: { zh: "红军于茅台架设浮桥公开西渡赤水，向古蔺、叙永方向佯动，造成再次北渡长江之势。", en: "Red Army bridged Maotai openly on Mar 16–17 and marched toward Gulin to simulate a Yangtze crossing." }, url: "https://www.81.mil.cn/yljnt_208627/lsda_208656/16451606.html" }
    ]
  },
  "chishui-1935:third-crossing:3": {
    camera: CHISHUI_COMPARE_CAM,
    compareToNextPhase: true,
    compareUnits: [
      "central-zhou",
      "yunnan",
      { id: "sichuan-shift", from: [250, 140], to: [238, 228], side: "blue" }
    ],
    compareLabel: { zh: "同视角对照 · ② 国民党军重心西移古蔺（东南露隙）", en: "Locked Frame · 2. KMT Columns Pulled West (SE Seam Opens)" },
    precision: { zh: "史实动向：川军/中央军/滇军西调古蔺 · 箭头为态势示意", en: "Verified shift: Sichuan, Central & Yunnan columns converged on Gulin · Schematic arrows" },
    sources: [
      { title: { zh: "贵州省委党史研究室《中央红军长征在贵州》", en: "The Central Red Army’s Long March in Guizhou" }, note: { zh: "蒋介石判断红军将北渡长江，调川滇黔军和中央军向长江沿线集结。", en: "Expecting a Yangtze crossing, Chiang ordered provincial and Central Army columns to concentrate along the river." }, url: GUIZHOU_HISTORY }
    ]
  },
  "chishui-1935:fourth-crossing:0": {
    camera: CHISHUI_COMPARE_CAM,
    compareUnits: ["central-zhou", "yunnan", "red-decoy"],
    compareLabel: { zh: "同视角对照 · ③ 仅留一团西佯，吸住敌军主力", en: "Locked Frame · 3. Single Decoy Regt Pins KMT West" },
    precision: { zh: "史实部署：红1军团1个团古蔺佯动 · 虚线为对比前一步敌军西移轨迹", en: "Verified tactic: 1st AG decoy regiment at Gulin · Dashed ghosts show KMT westward shift" },
    sources: [
      { title: { zh: "中国共产党新闻网《第九章　四渡赤水（下）》", en: "CPC News · Four Crossings of the Chishui, Part II" }, note: { zh: "3月20日的行动部署令红一军团以一个团向古蔺佯动，主力折转东进。", en: "The March 20 order directed one regiment to feint toward Gulin while the main force turned east." }, url: "https://dangshi.people.com.cn/n1/2016/0814/c406330-28634785.html" }
    ]
  },
  "chishui-1935:fourth-crossing:1": {
    camera: CHISHUI_COMPARE_CAM,
    compareUnits: ["central-zhou", "yunnan"],
    compareLabel: { zh: "同视角对照 · ④ 主力神速折返，二郎滩/太平渡秘密东渡！", en: "Locked Frame · 4. Main Force Reverses East Across Erlangtan!" },
    precision: { zh: "史实渡口：二郎滩、太平渡（3月21—22日） · 实线路线为态势示意", en: "Historical fords: Erlangtan & Taiping (Mar 21–22) · Routes are schematic" },
    sources: [
      { title: { zh: "贵州省委党史研究室《中央红军长征在贵州》", en: "The Central Red Army’s Long March in Guizhou" }, note: { zh: "3月21—22日，红军主力由二郎滩、淋滩、太平渡等渡口东渡赤水。", en: "On March 21–22 the main force crossed east at Erlangtan, Lintan, Taiping and other fords." }, url: GUIZHOU_HISTORY }
    ]
  },
  "chishui-1935:fourth-crossing:2": {
    camera: { pitch: 38, yaw: -6, zoom: 1.06, panX: 4, panY: -44 },
    compareUnits: ["red-1", "red-3", "central-wu"],
    precision: { zh: "史实经行：临江场、楠木坝、花茂 · 路线为战役级示意", en: "Verified route towns: Linjiangchang, Nanmuba, Huamao · Schematic campaign track" },
    sources: [
      { title: { zh: "中国军网 · 四渡赤水战役档案", en: "China Military Online · Chishui Archives" }, note: { zh: "3月23—30日红军急行军甩开黔北敌军，急速南指乌江。", en: "Forced marches from Mar 23–30 outpaced KMT regrouping and drove straight for the Wu River." }, url: "https://www.81.mil.cn/yljnt_208627/lsda_208656/16451606.html" }
    ]
  },
  "chishui-1935:fourth-crossing:3": {
    camera: { pitch: 38, yaw: -4, zoom: 1.02, panX: -12, panY: -78 },
    precision: { zh: "史实节点：3月31日南渡乌江、佯攻贵阳 · 3D地形程序模拟", en: "Verified event: Wu River crossing (Mar 31) & Guiyang feint · Procedural 3D terrain" },
    sources: [
      { title: { zh: "贵州省委党史研究室《中央红军长征在贵州》", en: "The Central Red Army’s Long March in Guizhou" }, note: { zh: "3月31日军委下令渡乌江。红军主力渡江后向贵阳方向挺进。", en: "On March 31 the CMC ordered the Wu River crossing. The main force then moved toward Guiyang." }, url: GUIZHOU_HISTORY }
    ]
  },

  /* ==================== 诺曼底登陆 · 跨战役多登陆点验证 ==================== */
  "normandy-1944:airborne-dawn:1": {
    camera: NORMANDY_COAST_CAM,
    precision: { zh: "史实地点：飞马桥（奥恩河运河桥） · 空降航线为示意", en: "Verified site: Pegasus Bridge (Orne Canal) · Schematic glider track" },
    sources: [
      { title: { zh: "Imperial War Museums: Pegasus Bridge", en: "Imperial War Museums: Pegasus Bridge" }, note: { zh: "1944年6月6日00:16英第6空降师滑翔机着陆，10分钟完好夺桥。", en: "At 00:16 on Jun 6, 1944, British 6th Airborne gliders captured the Orne bridge intact in 10 minutes." }, url: "https://www.iwm.org.uk/history/the-10-things-you-need-to-know-about-d-day" }
    ]
  },
  "normandy-1944:d-day-landings:0": {
    camera: NORMANDY_COAST_CAM,
    compareUnits: [
      "ger-352",
      { from: [262, 198], to: [278, 342], side: "red" },
      { from: [388, 198], to: [392, 368], side: "red" }
    ],
    compareLabel: { zh: "同视角五滩对照 · ① 西翼犹他与奥马哈抢滩", en: "Locked 5-Beach Frame · 1. Western Assault (Utah & Omaha)" },
    precision: { zh: "史实滩头：犹他/奥马哈（06:30） · 跨海航线为示意 · 3D地形程序生成", en: "Verified beaches: Utah & Omaha (06:30) · Schematic sea lanes · Procedural 3D terrain" },
    sources: [
      { title: { zh: "US Army CMH: Cross-Channel Attack", en: "US Army CMH: Cross-Channel Attack" }, note: { zh: "美第4师在犹他滩顺利推进；美第1、29师在奥马哈遭遇德第352师猛烈火力。", en: "US 4th Div advanced smoothly on Utah while 1st & 29th Divs hit heavy 352nd Div fire on Omaha." }, url: "https://history.army.mil/html/books/007/7-4-1/index.html" }
    ]
  },
  "normandy-1944:d-day-landings:1": {
    camera: NORMANDY_COAST_CAM,
    compareUnits: [
      "ger-21pz",
      { from: [492, 198], to: [496, 358], side: "red" },
      { from: [566, 198], to: [568, 352], side: "red" },
      { from: [648, 198], to: [646, 352], side: "red" }
    ],
    compareLabel: { zh: "同视角五滩对照 · ② 东翼金、朱诺、宝剑三滩同步突破", en: "Locked 5-Beach Frame · 2. Eastern Assault (Gold, Juno & Sword)" },
    precision: { zh: "史实滩头：金/朱诺/宝剑（07:25—07:55） · 箭头为登陆方向示意", en: "Verified beaches: Gold, Juno, Sword (07:25–07:55) · Schematic landing vectors" },
    sources: [
      { title: { zh: "Imperial War Museums: D-Day Five Beaches", en: "Imperial War Museums: D-Day Five Beaches" }, note: { zh: "英加部队在特种装甲车掩护下突破岸防，加拿大第3师当日推进纵深最远。", en: "British & Canadian forces breached coastal walls behind Hobart's Funnies; Canadian 3rd Div pushed deepest." }, url: "https://www.iwm.org.uk/history/the-10-things-you-need-to-know-about-d-day" }
    ]
  },
  "normandy-1944:cherbourg-linkup:1": {
    camera: { pitch: 36, yaw: -8, zoom: 1.12, panX: 72, panY: -14 },
    compareUnits: [
      "us-101",
      { from: [278, 342], to: [178, 248], side: "red" },
      { from: [496, 358], to: [525, 432], side: "red" }
    ],
    compareLabel: { zh: "同视角对照 · 夺取卡朗唐，连通犹他与奥马哈滩头", en: "Locked Frame · Carentan Links Utah & Omaha Beachheads" },
    precision: { zh: "史实地点：卡朗唐（6月10—12日） · 路线为示意", en: "Verified town: Carentan (Jun 10–12) · Schematic link-up vector" },
    sources: [
      { title: { zh: "US Army CMH: Utah to Cherbourg", en: "US Army CMH: Utah to Cherbourg" }, note: { zh: "美第101空降师血战卡朗唐，将东西孤立滩头连成80公里宽稳固登陆场。", en: "US 101st Airborne captured Carentan, uniting all five beaches into a continuous 80 km lodgment." }, url: "https://history.army.mil/html/books/007/7-4-1/index.html" }
    ]
  },
  "normandy-1944:cobra-breakout:2": {
    camera: { pitch: 36, yaw: -6, zoom: 1.08, panX: 34, panY: -62 },
    compareUnits: [
      "uk-2army",
      { from: [278, 448], to: [344, 516], side: "red" },
      { from: [540, 506], to: [654, 562], side: "blue" }
    ],
    compareLabel: { zh: "同视角对照 · 牵制卡昂装甲集群，圣洛撕开突破口", en: "Locked Frame · Panzers Pinned at Caen, Breakout at Saint-Lô" },
    precision: { zh: "史实地点：卡昂、圣洛（7月25日） · 箭头为突破示意", en: "Verified cities: Caen & Saint-Lô (Jul 25) · Schematic breakout arrow" },
    sources: [
      { title: { zh: "Britannica: Operation Cobra", en: "Britannica: Operation Cobra" }, note: { zh: "英加军在卡昂死死吸住德军装甲主力，美军于圣洛以西饱和轰炸撕裂防线。", en: "With German panzers pinned at Caen, 1,800 heavy bombers blasted a corridor west of Saint-Lô." }, url: "https://www.britannica.com/event/Normandy-Invasion" }
    ]
  },

  /* ==================== 官渡之战 & 长津湖战役核心节点依据 ==================== */
  "guandu-200:baima-yanjin:2": {
    precision: { zh: "史实地点：白马、延津 · 路线依据《三国志》态势示意 · 3D地形程序生成", en: "Verified sites: Baima, Yanjin · Schematic tracks per Records of Three Kingdoms · Procedural terrain" },
    sources: [
      { title: { zh: "《三国志·武帝纪》《关羽传》", en: "Records of the Three Kingdoms · Cao Cao & Guan Yu" }, note: { zh: "“羽望见良麾盖，策马刺良于万众之中，斩其首还，绍诸将莫能当者，遂解白马围。”", en: "Guan Yu spotted Yan Liang's standard, charged through the ranks, slew him, and broke the siege of Baima." }, url: "https://zh.wikisource.org/wiki/三國志/卷01" }
    ]
  },
  "guandu-200:wuchao-raid:3": {
    precision: { zh: "史实地点：官渡、乌巢（建安五年十月） · 间道路线为示意", en: "Verified sites: Guandu, Wuchao (Oct 200 AD) · Schematic night trail" },
    sources: [
      { title: { zh: "《资治通鉴·卷六十三》", en: "Zizhi Tongjian · Vol. 63" }, note: { zh: "曹操留曹洪守营，自将步骑五千衔枚夜袭乌巢，斩淳于琼，尽燔粮谷。", en: "Cao Cao led 5,000 disguised raiders by night, slaying Chunyu Qiong and burning the Wuchao granaries." }, url: "https://zh.wikisource.org/wiki/資治通鑑/卷063" }
    ]
  },
  "changjin-1950:sinhung-annihilation:3": {
    precision: { zh: "史实地点：长津湖东岸新兴里（1950.12.02） · 3D地形程序模拟盖马高原", en: "Verified site: Sinhung-ni (Dec 2, 1950) · Procedural Kaema Plateau 3D relief" },
    sources: [
      { title: { zh: "军事科学院《抗美援朝战争史》", en: "AMS History of the Korean War" }, note: { zh: "志愿军第27军第80、81师于12月2日全歼美步兵第7师第31团级战斗队，缴获团旗。", en: "PVA 80th & 81st Divisions destroyed US 31st RCT (Task Force Faith) on Dec 2, 1950." }, url: "https://www.81.mil.cn/" }
    ]
  },
  "changjin-1950:shuimen-hungnam:0": {
    precision: { zh: "史实地点：水门桥（黄草岭咽喉） · 路线为沿盘山公路态势示意", en: "Verified site: Funchilin Bridge · Schematic mountain highway track" },
    sources: [
      { title: { zh: "中国人民志愿军战史公开档案", en: "PVA Historical Archives" }, note: { zh: "志愿军第20军突击队于12月1—6日三次炸毁绝壁咽喉水门桥；美军随后空投M2钢桥组件架通。", en: "PVA sappers demolished Funchilin Bridge three times (Dec 1–6) before US transports airdropped M2 spans." }, url: "https://www.jb.mil.cn/" }
    ]
  },

  /* ==================== 西奈半岛反击战 · 现代诸兵种合成作战样板 ==================== */
  "sinai-1973:badr-crossing:2": {
    precision: { zh: "史实地点：菲尔丹桥东侧（1973.10.08） · 路线为战役示意 · 3D地形程序模拟", en: "Verified site: East of Firdan Bridge (Oct 8, 1973) · Schematic tracks · Procedural 3D terrain" },
    sources: [
      { title: { zh: "US Army CSI: Leavenworth Paper No. 21 (Gawrych)", en: "US Army CSI: Leavenworth Paper No. 21 (Gawrych)" }, note: { zh: "10月8日阿丹师第190装甲旅在缺乏步兵与炮火压制下直扑埃军第2步兵师防线，遭萨格尔反坦克导弹伏击覆灭。", en: "On Oct 8, Adan's unsupported 190th Armored Brigade charged into Egyptian 2nd Div Sagger ATGM ambushes at Firdan and was shattered." }, url: "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/leavenworth-papers-21-the-1973-arab-israeli-war.pdf" }
    ]
  },
  "sinai-1973:sinai-armor-clash:3": {
    camera: SINAI_CANAL_CAM,
    compareLabel: { zh: "同视角对照 · ① 埃军脱离防空伞东进受创，德维苏瓦露出缝隙", en: "Locked Frame · 1. Egyptian Armor Mauled Beyond SAMs; Seam Exposed" },
    precision: { zh: "史实节点：10月14日西奈坦克决战与德维苏瓦接合部 · 虚线弧为防空伞示意", en: "Verified event: Oct 14 Sinai tank clash & Deversoir seam · Dashed arc marks SAM umbrella" },
    sources: [
      { title: { zh: "Britannica & US Army CSI: October 14 Tank Battle", en: "Britannica & US Army CSI: October 14 Tank Battle" }, note: { zh: "埃军第21、第4装甲师奉命越出萨姆防空网东攻山口，单日损失约250辆坦克，中路接合部彻底暴露。", en: "Advancing east outside their SAM shield on Oct 14 cost Egypt ~250 tanks and exposed the 2nd–3rd Army boundary." }, url: "https://www.britannica.com/event/Yom-Kippur-War" }
    ]
  },
  "sinai-1973:chinese-farm-crossing:2": {
    camera: SINAI_CANAL_CAM,
    compareUnits: ["idf-143", "idf-162"],
    compareLabel: { zh: "同视角对照 · ② 步坦炮工打通中国农场，滚轴浮桥横跨运河", en: "Locked Frame · 2. Combined Arms Clear Chinese Farm & Bridge Canal" },
    precision: { zh: "史实渡口：德维苏瓦与中国农场（10月15—17日） · 路线为合成穿插示意", en: "Verified sites: Deversoir & Chinese Farm (Oct 15–17) · Schematic combined-arms corridor" },
    sources: [
      { title: { zh: "Avraham Adan《On the Banks of the Suez》& US Army CSI", en: "Avraham Adan, On the Banks of the Suez & US Army CSI" }, note: { zh: "经两昼夜步坦炮工协同激战肃清中国农场反坦阵地后，以军工兵于10月17日架通浮筒桥与180吨滚轴桥。", en: "After 48 hours of combined artillery-paratroop-armor combat at Chinese Farm, engineers bridged Deversoir on Oct 17." }, url: "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/leavenworth-papers-21-the-1973-arab-israeli-war.pdf" }
    ]
  },
  "sinai-1973:west-bank-encirclement:0": {
    camera: SINAI_CANAL_CAM,
    compareUnits: [
      "idf-143",
      { from: [396, 344], to: [332, 446], side: "red" }
    ],
    compareLabel: { zh: "同视角对照 · ③ 地面突击群碾碎西岸萨姆阵地，替空军撕开天空！", en: "Locked Frame · 3. Ground Raids Smash West-Bank SAMs to Unleash Airpower!" },
    precision: { zh: "史实战术：法伊德—吉奈法防空网猎杀（10月18—20日） · 陆替空开路典范", en: "Verified tactic: Fayid–Geneifa SAM raids (Oct 18–20) · Ground forces reopen the sky" },
    sources: [
      { title: { zh: "US Army CSI: Operation Gazelle Exploitation", en: "US Army CSI: Operation Gazelle Exploitation" }, note: { zh: "过河装甲特遣队直接摧毁西岸数十处萨姆导弹连，使以色列空军得以重返战场协同南下合围。", en: "Armored raids destroyed dozens of west-bank SAM sites from the ground, restoring IAF air superiority." }, url: "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/leavenworth-papers-21-the-1973-arab-israeli-war.pdf" }
    ]
  },
  "sinai-1973:west-bank-encirclement:3": {
    camera: { pitch: 38, yaw: -4, zoom: 0.98, panX: 44, panY: -54 },
    compareUnits: ["idf-162", "idf-252"],
    compareLabel: { zh: "同视角对照 · ④ 南卷阿达比亚港切断开罗公路，合围埃第3军团", en: "Locked Frame · 4. Drive to Adabiya Cuts Cairo Road & Traps 3rd Army" },
    precision: { zh: "史实终点：阿达比亚港与开罗公路101公里处（10月23—24日）", en: "Verified endpoints: Adabiya Port & Km 101 on Cairo–Suez Road (Oct 23–24)" },
    sources: [
      { title: { zh: "Britannica: Ceasefire at Kilometer 101", en: "Britannica: Ceasefire at Kilometer 101" }, note: { zh: "阿丹第162师进占阿达比亚港，将东岸埃及第3军团约3万官兵完全切断合围，促成联合国停火。", en: "Adan's 162nd Div seized Adabiya on the Gulf of Suez, completely isolating ~30,000 troops of Egypt's 3rd Army." }, url: "https://www.britannica.com/event/Yom-Kippur-War" }
    ]
  }
};

export function makeEventId(battleId, phaseIndex, turnIndex) {
  const prefix = BATTLE_PREFIX[battleId] || battleId;
  return `${prefix}-${phaseIndex + 1}-${turnIndex + 1}`;
}

export function getEventMeta(battleId, phaseId, turnIndex) {
  return EVENT_META[`${battleId}:${phaseId}:${turnIndex}`] || null;
}

export function getDefaultPrecision(lang = "zh") {
  return lang === "en"
    ? "Verified historical sites · Schematic maneuver arrows · Procedural 3D relief"
    : "史实关键地点 · 示意性机动路线 · 程序模拟三维地形";
}

export function getPhaseSceneCount(battle, phaseIndex) {
  const phase = battle.phases[phaseIndex];
  return getPhaseTurnScript(battle.id, phase.id)?.length || phase.detail?.length || 1;
}

/**
 * 将稳定事件 ID（如 "chishui-3-2"）解析为当前战役对应的 { phaseIndex, turnIndex }
 */
export function resolveEventId(battle, eventId) {
  if (!battle || !eventId) return null;
  const prefix = BATTLE_PREFIX[battle.id] || battle.id;
  const re = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}-(\\d+)-(\\d+)$`);
  const m = String(eventId).trim().match(re);
  if (!m) return null;
  const phaseIndex = Number(m[1]) - 1;
  const turnIndex = Number(m[2]) - 1;
  if (phaseIndex < 0 || phaseIndex >= (battle.phases || []).length) return null;
  if (turnIndex < 0 || turnIndex >= getPhaseSceneCount(battle, phaseIndex)) return null;
  return { phaseIndex, turnIndex };
}
