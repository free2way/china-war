// Battle of Lake Changjin / Chosin Reservoir (1950) — English Translation Overlay
export default {
  title: "Battle of Lake Changjin",
  subtitle: "Korean War Eastern Front · Sub-Zero Mountain Crucible",
  period: "Nov 27 – Dec 24, 1950",
  era: "Korean War · Second Phase Offensive",
  seal: "CJ",
  meta: {
    heroTitle: ["Battle of", "Lake Changjin"],
    eyebrow: ["3D BATTLE SANDTABLE", "NOV–DEC 1950 · CHOSIN"],
    deck: "In -40°C blizzards atop the Kaema Plateau, PVA divisions encircled US X Corps, destroyed Task Force Faith, and drove eastern UN forces to evacuate from Hungnam.",
    facts: [
      ["DATE", "Nov–Dec 1950"],
      ["TEMP", "-30°C to -40°C"],
      ["RESULT", "Eastern Front Reversed"]
    ],
    quote: '"Believe there is no mission that cannot be completed, no hardship that cannot be overcome, and no enemy that cannot be defeated!"',
    quoteAuthor: "Yang Gensi · PVA Special-Class Hero",
    quoteMark: "雪",
    quoteDesc: "Fought in brutal sub-zero cold against overwhelming air and armor firepower, Lake Changjin shattered the 'Home by Christmas' offensive on the Eastern Front."
  },
  mapConfig: {
    scaleNote: "Kaema Plateau · Chosin Reservoir to Hungnam Schematic",
    filterSides: { all: "All Forces", red: "PVA 9th Army Grp", blue: "US X Corps" },
    legends: [
      "PVA Envelopment & Assault",
      "US X Corps Advance / Retreat",
      "Frozen Reservoir & East Sea"
    ]
  },
  regionLabels: {
    "盖马高原": "Kaema Plateau",
    "赴战岭": "Pujon Range",
    "东海": "East Sea"
  },
  riverLabels: {
    "长津湖": "Chosin Reservoir",
    "黄草岭险道": "Funchilin Pass Rd"
  },
  locations: {
    "柳潭里": { name: "Yudam-ni", sub: "5th & 7th Marines encircled west of the reservoir" },
    "新兴里": { name: "Sinhung-ni", sub: "East shore; PVA 27th Army destroyed US 31st RCT (Task Force Faith)" },
    "死鹰岭": { name: "Toktong Pass", sub: "Critical frozen mountain pass between Yudam-ni and Hagaru-ri" },
    "下碣隅里": { name: "Hagaru-ri", sub: "1st Marine Div HQ & airstrip; site of Yang Gensi's stand on Xiaogaoling" },
    "古土里": { name: "Koto-ri", sub: "Southern supply base held by 1st Marines" },
    "水门桥": { name: "Funchilin Bridge", sub: "Cliffside hydro-pipe bridge blown three times by PVA sappers" },
    "黄草岭": { name: "Funchilin Pass", sub: "Steep mountain gateway descending from the Kaema Plateau" },
    "真兴里": { name: "Chinhung-ni", sub: "Final mountain bottleneck before the coastal plain" },
    "咸兴": { name: "Hamhung", sub: "Key coastal city and US X Corps headquarters" },
    "兴南港": { name: "Hungnam Port", sub: "East coast port where US X Corps evacuated by sea on Dec 24" }
  },
  phases: [
    {
      short: "Encircle",
      tag: "Snow Ambush",
      name: "Covert Approach · Split & Encircle",
      date: "Nov 27 – Nov 28, 1950",
      intent: "Moving strictly by night in -30°C cold, PVA 9th Army Group concealed over 100,000 troops in the snowy highlands around Chosin Reservoir. Striking on the night of Nov 27, PVA divisions severed the lone mountain highway, isolating US 1st Marine Division and 31st RCT into pockets at Yudam-ni, Sinhung-ni, Hagaru-ri, and Koto-ri.",
      goal: "Achieve total surprise and cut US X Corps into isolated pockets",
      result: "The 'Home by Christmas' eastern drive collapsed into perimeter defense",
      markers: [
        { label: "Yudam-ni Ambush", desc: "Night of Nov 27: PVA 79th & 89th Divisions struck 5th & 7th Marines in blizzard conditions." },
        { label: "Hagaru-ri Cut Off", desc: "PVA 58th Division assaulted Hagaru-ri, severing 1st Marine Division's north–south link." }
      ],
      detail: [
        ["Nov 7–26", "Stealth March", "Over 100,000 PVA troops marched by night in light winter gear, evading total US aerial reconnaissance."],
        ["Nov 27 Night", "Sudden Counterattack", "As temperatures plunged toward -40°C, 20th and 27th Armies struck simultaneously across the reservoir."],
        ["Nov 28", "Four Isolated Pockets", "The mountain road linking Yudam-ni, Sinhung-ni, Hagaru-ri, and Koto-ri was cut in multiple places."],
        ["Nov 28", "Stand at Xiaogaoling", "Fierce hilltop fighting raged outside Hagaru-ri as PVA troops fought to seal the southern exit."]
      ],
      formations: {
        "cpv-hq": { label: "PVA 9th Army Grp HQ", sub: "Song Shilun / Tao Yong" },
        "cpv-27": { label: "PVA 27th Army", sub: "Peng Deqing · Sinhung-ni" },
        "cpv-20": { label: "PVA 20th Army", sub: "Zhang Yixiang · Hagaru / Koto" },
        "cpv-26": { label: "PVA 26th Army", sub: "Zhang Renchu · Reserve" },
        "us-x": { label: "US X Corps HQ", sub: "Almond · Hamhung" },
        "us-mar57": { label: "US 5th & 7th Marines", sub: "Encircled at Yudam-ni" },
        "us-31rct": { label: "US 31st RCT", sub: "Task Force Faith · Sinhung" },
        "us-marhq": { label: "1st Marine Div HQ", sub: "Smith · Hagaru-ri" },
        "us-mar1": { label: "US 1st Marines", sub: "Puller · Holding Koto-ri" }
      }
    },
    {
      short: "Annihilate",
      tag: "East Shore Win",
      name: "Destruction of 31st RCT at Sinhung-ni",
      date: "Nov 28 – Dec 2, 1950",
      intent: "On the reservoir's east shore, the US 7th Division's 31st Regimental Combat Team ('Polar Bear Regiment' / Task Force Faith) stood exposed. PVA 27th Army massed the 80th and 81st Divisions in relentless night assaults, killing successive commanders Col. MacLean and Lt. Col. Faith and destroying the unit by Dec 2.",
      goal: "Concentrate strength to eliminate the isolated east-shore force first",
      result: "US 31st RCT destroyed as a combat formation; regimental colors captured",
      markers: [
        { label: "Victory at Sinhung-ni", desc: "PVA 80th & 81st Divisions wiped out the 31st RCT and captured the Polar Bear regimental flag." }
      ],
      detail: [
        ["Nov 27–28", "East Shore Cut Off", "80th Division penetrated Sinhung-ni perimeters; Col. MacLean was mortally wounded and captured."],
        ["Nov 29", "Relief Repulsed", "81st Division blocked armored relief probes sent north from Hagaru-ri."],
        ["Nov 30 Night", "General Assault", "Deputy Army Commander Zhan Danan led five regiments compressing the perimeter against the frozen lake."],
        ["Dec 1–2", "Breakout Shattered", "Lt. Col. Faith was killed during the desperate breakout south; PVA troops captured the regimental colors."]
      ],
      formations: {
        "cpv-hq": { label: "PVA 9th Army Grp HQ", sub: "Committing 26th Army" },
        "cpv-27": { label: "27th Army 80/81 Div", sub: "Zhan Danan · Sinhung-ni" },
        "cpv-20": { label: "PVA 20th Army", sub: "Pinning Yudam & Hagaru" },
        "cpv-26": { label: "PVA 26th Army", sub: "Forced March South" },
        "us-31rct": { label: "US 31st RCT", sub: "Destroyed · COs Killed" },
        "us-mar57": { label: "US 5th & 7th Marines", sub: "Preparing South Breakout" },
        "us-marhq": { label: "1st Marine Div HQ", sub: "Airstrip Supply · Hagaru" },
        "us-mar1": { label: "US 1st Marines", sub: "Holding Koto-ri" }
      }
    },
    {
      short: "Blocking",
      tag: "Sub-Zero Siege",
      name: "Toktong Pass & Hagaru-ri",
      date: "Dec 1 – Dec 6, 1950",
      intent: "Ordered to withdraw south, 5th and 7th Marines abandoned Yudam-ni under heavy air cover to fight through Toktong Pass toward Hagaru-ri. Despite severe frostbite and bombing, PVA 20th and 27th Armies contested every ridge—with Yang Gensi's stand at Xiaogaoling and entire 'Ice Sculpture Companies' freezing at their posts.",
      goal: "Block the withdrawal road and prevent US 1st Marine Division's escape",
      result: "Inflicted heavy losses; supported by airpower and the Hagaru airstrip, Marines consolidated and pushed south",
      markers: [
        { label: "Toktong Pass Clash", desc: "Fierce seesaw mountain fighting in nearly -40°C cold along the highway." },
        { label: "Xiaogaoling · Yang Gensi", desc: "After repelling 8 assaults, Co. Commander Yang Gensi charged with a satchel charge to hold the hill." }
      ],
      detail: [
        ["Dec 1–4", "Toktong Pass Gauntlet", "Under constant close air support, Marines fought south while PVA 59th & 79th Divisions contested every ridgeline."],
        ["Nov 29–Dec 2", "Hero of Xiaogaoling", "Yang Gensi held the key spur above Hagaru-ri through 8 attacks before sacrificing himself with explosives."],
        ["Dec 4", "Frozen Ambush Lines", "Several PVA companies of the 20th Army froze to death in ambush positions around Toktong and Funchilin."],
        ["Dec 6", "Evacuating Hagaru-ri", "After airlifting 4,000+ casualties from the dirt strip, Marines blew up depots and broke out toward Koto-ri."]
      ],
      formations: {
        "cpv-20": { label: "PVA 20th Army", sub: "Toktong / Xiaogaoling" },
        "cpv-27": { label: "PVA 27th Army", sub: "Pivoting West on Hagaru" },
        "cpv-26": { label: "PVA 26th Army", sub: "Blocking Hagaru – Koto" },
        "us-mar57": { label: "US 5th & 7th Marines", sub: "Fighting to Hagaru-ri" },
        "us-marhq": { label: "1st Marine Main", sub: "Hagaru · Air Cover" },
        "us-mar1": { label: "US 1st Marines", sub: "Holding Koto-ri Link" },
        "us-x": { label: "US X Corps HQ", sub: "Preparing Hungnam Sealift" }
      }
    },
    {
      short: "Pursuit",
      tag: "Funchilin Bridge",
      name: "Funchilin Bridge & Hungnam Evacuation",
      date: "Dec 7 – Dec 24, 1950",
      intent: "Retreating down the sole cliffside road through Funchilin Pass, US troops were halted when PVA sappers blew the vital hydroelectric bridge three times. Air-dropping eight M2 treadway bridge spans, US engineers spanned the chasm to reach Hamhung and Hungnam, evacuating all X Corps personnel by sea on Dec 24.",
      goal: "Sever the cliffside bridge and drive UN forces out of northeastern Korea",
      result: "US X Corps evacuated by sea from Hungnam; PVA liberated Hamhung and reversed the Eastern Front",
      markers: [
        { label: "Bridge Blown 3 Times", desc: "PVA sappers destroyed Funchilin Bridge thrice; US C-119s airdropped M2 steel bridge spans to reopen the road." },
        { label: "Hungnam Evacuation", desc: "By Dec 24, over 100,000 US/ROK troops evacuated by sea, ending UN presence in northeastern Korea." }
      ],
      detail: [
        ["Dec 1–6", "Bridge Blown Thrice", "PVA 20th Army sappers braved frost and fire three times to demolish the cliffside bridge and its abutments."],
        ["Dec 7–9", "Airdropped Steel Spans", "US transport aircraft dropped M2 treadway bridge sections, enabling Marines to descend Funchilin Pass."],
        ["Dec 11–17", "Pursuit to Hamhung", "Despite extreme cold casualties, 26th and 27th Armies pressed the shrinking Hungnam perimeter."],
        ["Dec 24", "Hungnam Evacuated", "US X Corps demolished port facilities and sailed for Pusan; northeastern Korea was fully retaken."]
      ],
      formations: {
        "cpv-20": { label: "PVA 20th Army", sub: "Funchilin Bridge Raids" },
        "cpv-26": { label: "PVA 26th Army", sub: "Pressing Hamhung Perimeter" },
        "cpv-27": { label: "PVA 27th Army", sub: "Pursuing East Shore South" },
        "us-marhq": { label: "1st Marine Div", sub: "Retreating to Hungnam" },
        "us-navy": { label: "US 7th Fleet Sealift", sub: "Naval Gunfire & Evacuation" },
        "us-x": { label: "US X Corps HQ", sub: "Evacuated Dec 24" }
      }
    }
  ],
  commanders: {
    redLabel: "PVA 9th Army Group",
    redSub: "Eastern Front Envelopment & Blocking",
    blueLabel: "US X Corps / UN East",
    blueSub: "Air–Sea–Armor Joint Forces",
    red: [
      { name: "Song Shilun", role: "Commander & Political Commissar, 9th Army Group; led the Lake Changjin campaign" },
      { name: "Tao Yong", role: "Deputy Commander, 9th Army Group; coordinated frontline assaults and pursuit" },
      { name: "Qin Jian", role: "Chief of Staff, 9th Army Group; directed campaign logistics and coordination" },
      { name: "Zhang Yixiang", role: "Commander, 20th Army; led operations at Yudam-ni, Hagaru-ri, and Koto-ri" },
      { name: "Peng Deqing", role: "Commander, 27th Army; directed the Sinhung-ni annihilation and Yudam-ni assault" },
      { name: "Zhan Danan", role: "Deputy Commander, 27th Army; led 80th & 81st Divisions destroying US 31st RCT" },
      { name: "Zhang Renchu", role: "Commander, 26th Army; committed from reserve for the pursuit to Hungnam" }
    ],
    blue: [
      { name: "Edward Almond", role: "Commander, US X Corps; directed eastern advance and Hungnam evacuation" },
      { name: "Oliver P. Smith", role: "Commander, 1st Marine Division; built the Hagaru-ri airstrip and led the breakout" },
      { name: "David G. Barr", role: "Commander, US 7th Infantry Division overseeing east-shore 31st RCT" },
      { name: "MacLean / Faith", role: "Successive commanders of 31st RCT (Task Force Faith), both killed at Sinhung-ni" },
      { name: "Lewis 'Chesty' Puller", role: "Commander, 1st Marines; held Koto-ri and covered the southern withdrawal" }
    ]
  },
  orderOfBattle: {
    red: [
      ["9th Army Group HQ", "Song Shilun, Tao Yong, Qin Jian", "Commanded 20th, 26th, and 27th Armies on the Eastern Front"],
      ["20th Army (58/59/60/89 Div)", "Zhang Yixiang, Tan Youming", "Isolated Hagaru-ri & Koto-ri; blew Funchilin Bridge three times"],
      ["27th Army (79/80/81/94 Div)", "Peng Deqing, Zhan Danan", "Destroyed US 31st RCT at Sinhung-ni; assaulted Yudam-ni"],
      ["26th Army (76/77/78/88 Div)", "Zhang Renchu, Li Yaowen", "Reserve army committed to the Hagaru-ri to Hungnam pursuit"]
    ],
    blue: [
      ["US X Corps HQ", "Edward Almond", "Directed eastern UN forces and the Hungnam sea evacuation"],
      ["1st Marine Division", "Oliver P. Smith", "1st, 5th, and 7th Marines anchoring the west and south reservoir"],
      ["7th Inf Div · 31st RCT", "MacLean / Faith", "'Polar Bear Regiment' destroyed as a unit at Sinhung-ni"],
      ["FEAF & US 7th Fleet", "Joint Air & Naval Support", "Delivered close air support, bridge airdrops, naval gunfire, and sealift"]
    ]
  },
  situation: {
    eyebrow: "LATE NOVEMBER 1950 · EASTERN FRONT",
    title: "Outgunned and freezing,<br />iron will seized the initiative.",
    narrative: "Pushing north from Hamhung toward the Yalu in November 1950, US X Corps aimed to end the war by Christmas. Rushed north from eastern China without adequate winter gear or heavy artillery, PVA 9th Army Group achieved complete concealment in -35°C mountains and enveloped the overextended UN advance.",
    forceComparison: {
      red: {
        label: "PVA 9th Army Group",
        count: "~150,000",
        width: "100%",
        desc: "12 light infantry divisions excelling in stealth and night close combat, yet lacking air cover, heavy artillery, and sub-zero clothing."
      },
      blue: {
        label: "US X Corps at Chosin",
        count: "~30,000 (~100k East)",
        width: "34%",
        desc: "Mechanized elite units backed by total air supremacy, tanks, heavy artillery, airdrops, and naval evacuation capacity."
      },
      note: "Note: Extreme asymmetry in manpower vs. firepower, air supremacy, and winter logistics shaped every phase; figures follow standard histories."
    },
    deployments: {
      red: {
        title: "PVA Deployment",
        subtitle: "Stealth · Infiltration · Envelopment",
        items: [
          ["North · 27th Army", "80th & 81st Divisions targeted Sinhung-ni while 79th struck Yudam-ni."],
          ["Center–South · 20th Army", "Infiltrated deep to sever the road between Yudam-ni, Hagaru-ri, and Koto-ri."],
          ["Reserve · 26th Army", "Held in second echelon before driving toward Hamhung and Hungnam."],
          ["Tactics", "Avoided daytime air strikes, relying on night infiltration and close mountain combat."]
        ]
      },
      blue: {
        title: "US Deployment",
        subtitle: "Road-Bound Advance · Perimeter Defense",
        items: [
          ["West · 5th & 7th Marines", "Pushed deep into Yudam-ni preparing to swing west toward 8th Army."],
          ["East · 31st RCT", "Exposed along the east shore at Sinhung-ni without continuous flank protection."],
          ["Hub · Hagaru-ri Base", "Gen. Smith insisted on building a dirt airstrip that later saved wounded Marines."],
          ["Lifeline · Koto to Hungnam", "Dependent on a single precipitous mountain road and total air–sea support."]
        ]
      }
    }
  },
  logic: {
    sectionLabel: "Strategic Logic",
    eyebrow: "KEYS TO SUB-ZERO MOUNTAIN WARFARE",
    title: "Surprise breaks momentum;<br />chokepoints force retreat.",
    steps: [
      { roman: "I", title: "Total Concealment", desc: "Over 100,000 troops marched by night under total enemy air supremacy, achieving devastating operational surprise.", keyword: "Stealth" },
      { roman: "II", title: "Crush the Exposed Wing", desc: "Concentrating 27th Army at Sinhung-ni wiped out the isolated 31st RCT, shattering the eastern UN offensive.", keyword: "Annihilation" },
      { roman: "III", title: "Seal the Mountain Road", desc: "Fighting for every ridge at Toktong Pass, Xiaogaoling, and Funchilin Bridge maximized attrition on road-bound armor.", keyword: "Chokepoint" },
      { roman: "IV", title: "Strategic Expulsion", desc: "Though extreme cold limited pursuit, forcing X Corps' sea evacuation from Hungnam liberated all of northeastern Korea.", keyword: "Reversal" }
    ],
    decisionLoop: {
      eyebrow: "CAMPAIGN LESSONS",
      title: "Even against modern firepower,<br />stealth, terrain, and logistics set the ceiling.",
      items: [
        ["01", "Operational Surprise", "Concealing 150,000 troops from air recon overturned the front overnight"],
        ["02", "Center of Gravity", "Focusing decisive mass at Sinhung-ni delivered a complete regimental victory"],
        ["03", "Single-Road Risk", "Toktong Pass and Funchilin Bridge exposed mechanized vulnerability in mountains"],
        ["04", "Logistics Ceiling", "Severe frostbite and supply shortfalls sharply constrained how far victory could go"]
      ]
    }
  },
  chronicle: {
    eyebrow: "NOV 27 – DEC 24, 1950",
    title: "28 days & nights,<br />forged in ice and fire.",
    deck: "Click any event to switch the 3D sandtable to its phase.",
    events: [
      { date: "Nov 27 Night", stage: "Opening Strike", title: "9th Army Group launches surprise snow attack", desc: "20th and 27th Armies struck simultaneously, isolating US troops at Yudam-ni, Sinhung-ni, and Hagaru-ri.", tag: "Envelopment", phaseIndex: 0 },
      { date: "Nov 29", stage: "Xiaogaoling", title: "Yang Gensi's heroic stand above Hagaru-ri", desc: "After beating back 8 assaults, Yang Gensi sacrificed himself with a satchel charge to hold the hill.", tag: "Valor", phaseIndex: 0 },
      { date: "Dec 1–2", stage: "Sinhung-ni", title: "US 31st RCT destroyed; colors captured", desc: "PVA 80th and 81st Divisions wiped out Task Force Faith east of the reservoir.", tag: "Victory", phaseIndex: 1 },
      { date: "Dec 1–4", stage: "Toktong Pass", title: "Blizzard blocking actions & 'Ice Sculpture' posts", desc: "Marines fought south from Yudam-ni while freezing PVA defenders held ambush ridges at -40°C.", tag: "Sub-Zero", phaseIndex: 2 },
      { date: "Dec 6", stage: "Hagaru-ri", title: "Marines destroy airstrip and break out south", desc: "After evacuating wounded by air, 1st Marine Division pushed down the highway toward Koto-ri.", tag: "Retreat", phaseIndex: 2 },
      { date: "Dec 1–6", stage: "Funchilin Bridge", title: "Cliffside bridge demolished three times", desc: "PVA sappers blew the bridge thrice before US transports airdropped M2 steel spans.", tag: "Chokepoint", phaseIndex: 3 },
      { date: "Dec 24", stage: "Hungnam", title: "US X Corps evacuates by sea; campaign ends", desc: "PVA liberated Hamhung and northeastern Korea, permanently reversing the Eastern Front.", tag: "Turning Point", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "Academy of Military Sciences · History of the Korean War", url: "https://www.81.mil.cn/" },
    { title: "CPC News · Historical Archives", url: "https://cpc.people.com.cn/" },
    { title: "Military Museum of the Chinese People's Revolution", url: "https://www.jb.mil.cn/" }
  ]
};
