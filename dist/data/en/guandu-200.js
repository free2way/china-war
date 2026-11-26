// Battle of Guandu (200 AD) — English Translation Overlay
export default {
  title: "Battle of Guandu",
  subtitle: "Decisive Central Plains Clash · Victory Against Tenfold Odds",
  period: "5th Year of Jian'an · 200 AD",
  era: "Late Eastern Han · Warlord Era",
  seal: "GD",
  meta: {
    heroTitle: ["Battle of", "Guandu"],
    eyebrow: ["3D BATTLE SANDTABLE", "200 AD · EASTERN HAN"],
    deck: "Holding a vital chokepoint with under 20,000 troops against 110,000, Cao Cao burned Wuchao's grain depot by night and overturned the balance of Northern China.",
    facts: [
      ["DATE", "200 AD"],
      ["THEATER", "Yellow River · Guandu"],
      ["FORCES", "~15–20k vs. ~110k"]
    ],
    quote: '"When the enemy is overextended and exhausted, change is imminent—seize the moment for a bold stroke."',
    quoteAuthor: "Xun Yu · Records of the Three Kingdoms",
    quoteMark: "奇",
    quoteDesc: "Guandu was won not merely by one night's fire at Wuchao, but by 100 days of iron resolve and instant audacity when intelligence arrived."
  },
  mapConfig: {
    scaleNote: "Yellow River South Bank · Tactical Schematic",
    filterSides: { all: "All Forces", red: "Cao Cao", blue: "Yuan Shao" },
    legends: [
      "Cao Cao Maneuver & Raid",
      "Yuan Shao Advance",
      "Yellow River & Hong Canal"
    ]
  },
  regionLabels: {
    "冀州": "Ji Prov.",
    "兖州": "Yan Prov.",
    "豫州": "Yu Prov."
  },
  riverLabels: {
    "大河（黄河）": "Yellow River",
    "大河": "Yellow River",
    "鸿沟 · 官渡水": "Hong Canal · Guandu",
    "济水": "Ji River"
  },
  locations: {
    "邺城": { name: "Ye City", sub: "Yuan Shao's capital and northern hub" },
    "黎阳": { name: "Liyang", sub: "Yuan Shao's forward staging camp north of the river" },
    "白马": { name: "Baima", sub: "Dong Commandery seat; where Guan Yu slew Yan Liang" },
    "延津": { name: "Yanjin", sub: "Yellow River ford; Cao Cao's feint and ambush of Wen Chou" },
    "阳武": { name: "Yangwu", sub: "Yuan Shao's forward base south of the river" },
    "故市": { name: "Gushi", sub: "Site where Xu Huang & Shi Huan burned Yuan supply wagons" },
    "乌巢": { name: "Wuchao", sub: "Yuan Shao's main grain depot guarded by Chunyu Qiong" },
    "官渡": { name: "Guandu", sub: "Cao Cao's fortified chokepoint anchoring the Hong Canal" },
    "中牟": { name: "Zhongmu", sub: "Town west of Guandu" },
    "许都": { name: "Xuchang", sub: "Imperial capital held by Xun Yu for logistics" },
    "汝南": { name: "Runan", sub: "Southern commandery raided by Liu Bei" }
  },
  phases: [
    {
      short: "Baima",
      tag: "Feint & Strike",
      name: "Baima & Yanjin",
      date: "Feb–Apr 200 AD",
      intent: "Yuan Shao marched to Liyang and sent Yan Liang across the river to besiege Baima. Adopting Xun You's plan, Cao Cao feinted toward Yanjin to draw Yuan troops west, then rushed light cavalry east to relieve Baima where Guan Yu slew Yan Liang. Withdrawing along the river, Cao baited Wen Chou with baggage wagons and crushed his pursuit.",
      goal: "Blunt Yuan Shao's crossing and eliminate his vanguard generals",
      result: "Baima relieved; both Yan Liang and Wen Chou slain, shaking Yuan morale",
      markers: [
        { label: "Guan Yu Slays Yan Liang", desc: "After feinting west at Yanjin, Cao Cao raced to Baima where Guan Yu cut down Yan Liang amid his troops." },
        { label: "Ambush at Yanjin", desc: "Using abandoned supply wagons as bait on the southern slope, fewer than 600 Cao horsemen routed and slew Wen Chou." }
      ],
      detail: [
        ["Feb", "Siege of Baima", "Yuan Shao moved to Liyang and dispatched Yan Liang to besiege Liu Yan at Baima despite Ju Shou's warnings."],
        ["Apr", "Feint at Yanjin", "Xun You advised feinting a crossing at Yanjin; Yuan Shao split his army west to respond."],
        ["Apr", "Death of Yan Liang", "Cao Cao forced-marched to Baima; Zhang Liao and Guan Yu led the vanguard, and Guan Yu slew Yan Liang in the melee."],
        ["Apr", "Death of Wen Chou", "Evacuating Baima, Cao Cao scattered baggage to lure Wen Chou's cavalry into disarray, then countercharged and killed him."]
      ],
      formations: {
        "cao-main": { label: "Cao Cao Main", sub: "Yanjin Feint · Baima Strike" },
        "cao-vanguard": { label: "Guan Yu · Zhang Liao", sub: "Baima Vanguard" },
        "cao-west": { label: "Yu Jin", sub: "Holding Yanjin" },
        "cao-base": { label: "Guandu Garrison", sub: "Cao Ren / Cao Hong" },
        "cao-xu": { label: "Xun Yu · Xuchang", sub: "Rear Logistics Hub" },
        "yuan-main": { label: "Yuan Shao HQ", sub: "Camped at Liyang" },
        "yuan-van": { label: "Yan Liang", sub: "Besieging Baima" },
        "yuan-cav": { label: "Wen Chou · Liu Bei", sub: "River Pursuit" }
      }
    },
    {
      short: "Standoff",
      tag: "Siege Warfare",
      name: "Standoff at Guandu",
      date: "Aug–Sep 200 AD",
      intent: "Yuan Shao stretched fortified camps for miles across the sand dunes, raising earthen mounds and arrow towers to rain shafts into Cao Cao's camp. Cao replied with 'Thunderbolt' trebuchets to smash the towers and counter-trenches to defeat Yuan tunnels. Short on grain, Cao considered retreating until Xun Yu urged him to hold fast.",
      goal: "Hold the strategic bottleneck and bleed Yuan momentum",
      result: "Yuan siege stalled; Xu Huang burned Yuan grain convoys at Gushi",
      markers: [
        { label: "Thunderbolt Catapults", desc: "Cao Cao's stone-throwers shattered Yuan siege towers while inner trenches blocked sappers." },
        { label: "Grain Raid at Gushi", desc: "Xu Huang and Shi Huan ambushed Han Meng's supply convoy and burned thousands of carts." }
      ],
      detail: [
        ["Aug", "Miles of Encampments", "Yuan Shao advanced across sandy ridges to lock horns with Cao Cao's fortified line at Guandu."],
        ["Aug", "Catapults vs. Towers", "Yuan troops erected high wooden towers; Cao Cao built traction catapults—dubbed 'Thunderbolt Carts'—to demolish them."],
        ["Sep", "Tunnels & Trenches", "Yuan sappers dug tunnels toward Cao's ramparts; Cao's men excavated deep interior moats to intercept them."],
        ["Sep", "Xun Yu's Letter & Raid", "Xun Yu wrote urging Cao not to yield the throat of the plains; Xu Huang soon burned Han Meng's supply train at Gushi."]
      ],
      formations: {
        "cao-main": { label: "Cao Cao Camp", sub: "Fortified Line at Guandu" },
        "cao-catapult": { label: "Catapult Corps", sub: "Thunderbolt Trebuchets" },
        "cao-raid": { label: "Xu Huang · Shi Huan", sub: "Raiding Convoys at Gushi" },
        "cao-xu": { label: "Xun Yu · Xuchang", sub: "Holding Rear & Morale" },
        "yuan-main": { label: "Yuan Shao Camps", sub: "Sand-Dune Entrenchments" },
        "yuan-tower": { label: "Siege Towers", sub: "Earthen Mounds & Archers" },
        "yuan-supply": { label: "Han Meng Convoy", sub: "Supply Train Ambushed" },
        "yuan-wuchao": { label: "Wuchao Depot", sub: "Chunyu Qiong · 10k Guard" }
      }
    },
    {
      short: "Wuchao",
      tag: "Night Raid",
      name: "Xu You Defects · Night Raid on Wuchao",
      date: "Oct 200 AD",
      intent: "Alienated by Yuan Shao after his family was arrested, strategist Xu You defected to Cao Cao and revealed that Yuan's main grain depot at Wuchao was loosely guarded. Leaving Cao Hong and Xun You to hold Guandu, Cao personally led 5,000 disguised cavalry and footmen by back trails at night, storming Wuchao and putting the depot to the torch.",
      goal: "Destroy Yuan Shao's centralized grain reserve in one bold stroke",
      result: "Wuchao burned to ashes; Chunyu Qiong slain; panic swept the Yuan army",
      markers: [
        { label: "Burning of Wuchao", desc: "Cao Cao led 5,000 troops disguised under Yuan banners by night, killing Chunyu Qiong and incinerating the grain depot." }
      ],
      detail: [
        ["Oct", "Xu You Defects", "Cao Cao ran out barefoot to welcome Xu You, who disclosed Wuchao's lax defenses under Chunyu Qiong."],
        ["Oct Night", "5,000 Raiders March", "Flying Yuan banners with gagged horses, Cao Cao's strike force slipped through back roads carrying bundles of firewood."],
        ["Dawn", "Desperate Assault", "When Yuan relief riders approached, Cao refused to divide his men—ordering them to fight to the death as fire engulfed the camp."],
        ["Oct", "Depot Destroyed", "Chunyu Qiong was slain and all stores burned. Ignoring Zhang He's plea to save Wuchao, Yuan Shao threw his heavy troops at Cao's main camp."]
      ],
      formations: {
        "cao-main": { label: "Cao Cao · 5k Raiders", sub: "Disguised Night Raid" },
        "cao-defense": { label: "Cao Hong · Xun You", sub: "Defending Guandu Camp" },
        "cao-xuyou": { label: "Xu You", sub: "Defector & Guide" },
        "cao-xu": { label: "Xun Yu · Xuchang", sub: "Securing Capital" },
        "yuan-wuchao": { label: "Chunyu Qiong", sub: "Depot Burned · Slain" },
        "yuan-main": { label: "Yuan Shao HQ", sub: "Split Relief & Assault" },
        "yuan-assault": { label: "Zhang He · Gao Lan", sub: "Assaulting Guandu Camp" }
      }
    },
    {
      short: "Rout",
      tag: "Total Collapse",
      name: "Zhang He Defects · Yuan Army Routed",
      date: "Oct–Winter 200 AD",
      intent: "Unable to breach Cao Hong's ramparts and slandered by Guo Tu after Wuchao fell, generals Zhang He and Gao Lan burned their siege engines and surrendered to Cao Cao. Yuan Shao's 100,000-man army disintegrated overnight; Yuan and his son Yuan Tan fled north across the Yellow River with barely 800 horsemen.",
      goal: "Exploit enemy starvation and internal collapse for a general offensive",
      result: "Yuan Shao's main army shattered; hegemony over Northern China shifted to Cao Cao",
      markers: [
        { label: "Zhang He & Gao Lan Defect", desc: "Slandered after Wuchao's fall, Yuan's assault generals burned their engines and joined Cao Cao." },
        { label: "Yuan Shao Flees North", desc: "Yuan Shao escaped across the Yellow River with just 800 cavalry, losing northern supremacy forever." }
      ],
      detail: [
        ["Oct", "Defection at the Gates", "Fearing Guo Tu's accusations after Wuchao fell, Zhang He and Gao Lan burned their siege gear and surrendered to Cao Hong."],
        ["Oct", "Total Collapse", "Word of the burned grain and defections sparked mass panic; Yuan Shao and Yuan Tan fled across the river with 800 riders."],
        ["Oct", "Spoils Captured", "Cao's army seized vast stores, archives, and treasures, with tens of thousands of Yuan troops captured or dispersed."],
        ["Aftermath", "Burning the Letters", "Finding secret letters from his own officers to Yuan Shao, Cao burned them unread to restore unity and confidence."]
      ],
      formations: {
        "cao-main": { label: "Cao Cao Main", sub: "Full Pursuit North" },
        "cao-defense": { label: "Cao Hong", sub: "Receiving Defectors" },
        "cao-defector": { label: "Zhang He · Gao Lan", sub: "Defected to Cao" },
        "cao-xu": { label: "Xun Yu · Xuchang", sub: "Rear Stabilized" },
        "yuan-main": { label: "Yuan Shao · Yuan Tan", sub: "Fleeing with 800 Riders" },
        "yuan-remnant": { label: "Yuan Remnants", sub: "Routed & Surrendering" },
        "yuan-jushou": { label: "Ju Shou", sub: "Captured South of River" }
      }
    }
  ],
  commanders: {
    redLabel: "Cao Cao's Army",
    redSub: "Minister of Works · Field & Rear HQ",
    blueLabel: "Yuan Shao's Army",
    blueSub: "General-in-Chief · Four Northern Provinces",
    red: [
      { name: "Cao Cao", role: "Supreme commander; held Guandu and personally led the night raid on Wuchao" },
      { name: "Xun Yu", role: "Imperial Secretariat at Xuchang; managed logistics and urged Cao to stand firm" },
      { name: "Xun You", role: "Chief strategist; devised the Yanjin feint, baggage bait, and Wuchao strike" },
      { name: "Jia Xu", role: "Senior advisor; backed trusting Xu You and launching the surprise raid" },
      { name: "Guan Yu / Zhang Liao", role: "Vanguard at Baima; Guan Yu charged through the enemy ranks to slay Yan Liang" },
      { name: "Cao Hong", role: "Held Guandu main camp during the raid and received Zhang He's surrender" },
      { name: "Xu Huang / Shi Huan", role: "Intercepted and burned Yuan Shao's grain convoy at Gushi" },
      { name: "Yue Jin / Yu Jin", role: "Yue Jin slew Chunyu Qiong at Wuchao; Yu Jin guarded the Yanjin ford" }
    ],
    blue: [
      { name: "Yuan Shao", role: "Lord of Four Provinces; marched south with 100,000 foot and 10,000 horse" },
      { name: "Ju Shou", role: "Army inspector; urged attrition warfare and strong depot guards, repeatedly ignored" },
      { name: "Tian Feng", role: "Advisor; warned against decisive battle and was imprisoned before the campaign" },
      { name: "Xu You", role: "Strategist; defected to Cao Cao after his advice was rejected and his kin arrested" },
      { name: "Guo Tu / Shen Pei", role: "Guo Tu pressed reckless assaults; Shen Pei managed grain shipments from Ye" },
      { name: "Yan Liang / Wen Chou", role: "Famed Hebei vanguard generals slain successively at Baima and Yanjin" },
      { name: "Chunyu Qiong", role: "Depot commander assigned 10,000 men to guard the vital Wuchao granaries" },
      { name: "Zhang He / Gao Lan", role: "Assault commanders who defected to Cao Cao after Wuchao fell" }
    ]
  },
  orderOfBattle: {
    red: [
      ["Main HQ", "Cao Cao; Xun You, Jia Xu", "Overall command and personal leadership of the Wuchao raid"],
      ["Xuchang Rear", "Xun Yu", "Imperial court security, grain transport, and strategic counsel"],
      ["Baima Relief", "Zhang Liao, Guan Yu", "Vanguard cavalry strike; slew Yan Liang"],
      ["Guandu Ramparts", "Cao Hong", "Defended central camp; accepted Zhang He & Gao Lan's surrender"],
      ["Raiding Force", "Xu Huang, Shi Huan", "Burned Han Meng's supply wagons at Gushi"],
      ["River Guard", "Yu Jin, Yue Jin", "Held Yanjin crossing; Yue Jin fought at Wuchao"],
      ["Logistics Corps", "Ren Jun", "Managed agricultural garrisons (tuntian) and arms supply"]
    ],
    blue: [
      ["Supreme HQ", "Yuan Shao; Guo Tu, Pang Ji", "Commanded four-province host pushing for rapid battle"],
      ["Inspectorate", "Ju Shou", "Advocated protracted attrition; sidelined mid-campaign"],
      ["Ye City Rear", "Shen Pei", "Oversaw northern logistics and grain convoys"],
      ["Vanguard", "Yan Liang, Wen Chou", "Led river crossings at Baima and Yanjin"],
      ["Allied Force", "Liu Bei", "Joined Yanjin pursuit, later sent to raid Runan"],
      ["Wuchao Garrison", "Chunyu Qiong", "Guarded main grain depot with ~10,000 troops"],
      ["Assault Corps", "Zhang He, Gao Lan", "Stormed Guandu camp before defecting to Cao Cao"]
    ]
  },
  situation: {
    eyebrow: "199–200 AD · TURNING POINT OF THE LATE HAN",
    title: "Not a lucky upset,<br />but a duel of resolve and decision.",
    narrative: "Having united the four northern provinces, Yuan Shao mustered 100,000 infantry and 10,000 cavalry to strike Xuchang. Surrounded by rivals on every side, Cao Cao neutralized Liu Bei in the east first, then anchored his outnumbered army at Guandu's bottleneck to fight on his own terms.",
    forceComparison: {
      red: {
        label: "Cao Cao at Guandu",
        count: "~15,000–20,000",
        width: "16%",
        desc: "Chronicles cite 'fewer than 10,000 fit men' at the crisis peak; unified command and nimble cavalry, though critically short of grain."
      },
      blue: {
        label: "Yuan Shao's Southern Host",
        count: "~110,000",
        width: "100%",
        desc: "Overwhelming manpower and supplies, yet plagued by factional advisors, indecisive leadership, and an exposed centralized depot."
      },
      note: "Note: Historical chronicles vary on exact headcounts; figures reflect standard scholarly consensus."
    },
    deployments: {
      red: {
        title: "Cao Cao's Deployment",
        subtitle: "Contract · Bottleneck · Counterstrike",
        items: [
          ["Guandu Ramparts", "Fortified along the Hong Canal to block the direct road to Xuchang."],
          ["Mobile Cavalry", "Zhang Liao, Guan Yu, and Xu Huang executed rapid relief and convoy raids."],
          ["Xuchang Hub", "Xun Yu and Ren Jun sustained tuntian grain supply and political stability."],
          ["Intelligence Edge", "Welcomed defectors and acted instantly when Wuchao's weakness surfaced."]
        ]
      },
      blue: {
        title: "Yuan Shao's Deployment",
        subtitle: "Advance · Entrench · Overwhelm",
        items: [
          ["Liyang Staging Base", "Massed northern levies and grain across the Yellow River."],
          ["Guandu Line", "Extended miles of dune camps with mounds, arrow towers, and tunnels."],
          ["Wuchao Grain Depot", "Concentrated army rations northeast of Guandu under Chunyu Qiong."],
          ["Southern Diversion", "Dispatched Liu Bei to Runan to foment unrest behind Cao Cao's lines."]
        ]
      }
    }
  },
  logic: {
    sectionLabel: "Strategic Logic",
    eyebrow: "FOUR STEPS TO DEFEATING A SUPERIOR FOE",
    title: "Blunt the edge, drain the strength,<br />sever the grain, shatter the will.",
    steps: [
      { roman: "I", title: "Feint & Strike First", desc: "Avoided a head-on river defense; feinted at Yanjin to slay Yan Liang at Baima and ambushed Wen Chou with baggage bait.", keyword: "Deception" },
      { roman: "II", title: "Hold the Chokepoint", desc: "Yielded the wide riverbanks to fortify Guandu, countering Yuan towers with trebuchets and holding firm through near-starvation.", keyword: "Endurance" },
      { roman: "III", title: "Raid the Lifeline", desc: "Acted immediately on Xu You's intelligence, burning Wuchao's centralized depot with 5,000 raiders to flip the logistical equation.", keyword: "Audacity" },
      { roman: "IV", title: "Exploit Internal Collapse", desc: "Yuan's misjudgment and court slander drove Zhang He and Gao Lan to defect, unraveling an army of 100,000 overnight.", keyword: "Breakthrough" }
    ],
    decisionLoop: {
      eyebrow: "CAO CAO'S COMMAND PRINCIPLES",
      title: "Numerical odds are never fixed;<br />resolve and timing reverse them.",
      items: [
        ["01", "Clear the Flank", "Crushed Liu Bei first, betting correctly that Yuan Shao was too slow to intervene"],
        ["02", "Pick the Ground", "Abandoned the river to fight at the end of Yuan's long supply line"],
        ["03", "Trust & Act Fast", "Believed defector Xu You and risked leading the raid in person"],
        ["04", "Magnanimous Unity", "Burned captured correspondence unread to steady wavering officers"]
      ]
    }
  },
  chronicle: {
    eyebrow: "AUTUMN 199 — WINTER 200 AD",
    title: "In a single year,<br />Northern China changed hands.",
    deck: "Click any event to jump the 3D sandtable to that phase. Dates follow Records of the Three Kingdoms and Zizhi Tongjian.",
    events: [
      { date: "199 Aut", stage: "Gathering Storm", title: "Yuan Shao musters 100,000 to march on Xuchang", desc: "Ju Shou and Tian Feng urged attrition; Yuan sided with Guo Tu's push for quick battle.", tag: "Mobilization", phaseIndex: 0 },
      { date: "200 Jan", stage: "Eastern Strike", title: "Cao Cao marches east and defeats Liu Bei", desc: "Predicting Yuan Shao's hesitation, Cao cleared his eastern flank and captured Guan Yu.", tag: "Flank Cleared", phaseIndex: 0 },
      { date: "200 Apr", stage: "Baima", title: "Feint at Yanjin; Guan Yu slays Yan Liang", desc: "Drawing Yuan forces west, Cao's light cavalry broke the siege of Baima.", tag: "First Blow", phaseIndex: 0 },
      { date: "200 Apr", stage: "Yanjin", title: "Baggage trap eliminates Wen Chou", desc: "Luring Yuan horsemen into disorder, Cao's small cavalry slew Wen Chou and pulled back to Guandu.", tag: "Ambush", phaseIndex: 0 },
      { date: "200 Aug", stage: "Standoff", title: "Thunderbolt catapults smash siege towers", desc: "Cao Cao neutralized Yuan's earthen mounds and sappers at Guandu.", tag: "Siege Duel", phaseIndex: 1 },
      { date: "200 Sep", stage: "Holding Firm", title: "Xun Yu's letter; Xu Huang burns convoy", desc: "Encouraged to stand fast, Cao dispatched Xu Huang to burn Yuan's supply train at Gushi.", tag: "Resolve", phaseIndex: 1 },
      { date: "200 Oct", stage: "Defection", title: "Xu You reveals Wuchao grain depot", desc: "Cao Cao greeted Xu You barefoot, seizing the decisive intelligence break.", tag: "Key Intel", phaseIndex: 2 },
      { date: "200 Oct", stage: "Wuchao Raid", title: "5,000 raiders incinerate Yuan's rations", desc: "Disguised under Yuan banners, Cao stormed Wuchao by night and slew Chunyu Qiong.", tag: "Decisive Blow", phaseIndex: 2 },
      { date: "200 Oct", stage: "Collapse", title: "Zhang He & Gao Lan defect; Yuan army routs", desc: "Slandered after Wuchao fell, Yuan's assault generals surrendered and the front collapsed.", tag: "Rout", phaseIndex: 3 },
      { date: "201–207", stage: "Aftermath", title: "Victory at Cangting & unification of the North", desc: "Following Yuan Shao's death, Cao Cao conquered the northern provinces and unified the north.", tag: "Hegemony", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "Records of the Three Kingdoms (Vol. 1)", url: "https://zh.wikisource.org/wiki/三國志/卷01" },
    { title: "Biographies of Xun Yu, Xun You & Jia Xu", url: "https://zh.wikisource.org/wiki/三國志/卷10" },
    { title: "Book of the Later Han · Yuan Shao", url: "https://zh.wikisource.org/wiki/後漢書/卷74上" },
    { title: "Zizhi Tongjian (Vol. 63)", url: "https://zh.wikisource.org/wiki/資治通鑑/卷063" }
  ]
};
