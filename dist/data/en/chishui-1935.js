// Four Crossings of the Chishui River (1935) — English Translation Overlay
export default {
  title: "Four Crossings of the Chishui",
  subtitle: "Central Red Army Mobile Warfare Across Sichuan, Guizhou & Yunnan",
  period: "Jan 19 – May 9, 1935",
  era: "The Long March · Modern China",
  seal: "CS",
  meta: {
    heroTitle: ["Four Crossings", "of Chishui"],
    eyebrow: ["3D BATTLE SANDTABLE", "1935 · LONG MARCH"],
    deck: "Facing a tenfold encirclement of 400,000 troops, the Red Army traded direction for time and turned relentless mobility into decisive openings.",
    facts: [
      ["DATE", "Jan–Mar 1935"],
      ["THEATER", "Sichuan–Guizhou–Yunnan"],
      ["FORCES", "~30k vs. ~400k"]
    ],
    quote: '"Fight when you can win; move when you cannot."',
    quoteAuthor: "Mao Zedong",
    quoteMark: "变",
    quoteDesc: "The genius of the Four Crossings lay not in crossing a river four times, but in constantly seizing initiative amid shifting uncertainty."
  },
  mapConfig: {
    scaleNote: "Sichuan–Guizhou–Yunnan Border · Tactical Schematic",
    filterSides: { all: "All Units", red: "Red Army", blue: "KMT Forces" },
    legends: [
      "Red Army Maneuver",
      "KMT Encirclement",
      "Rivers"
    ]
  },
  regionLabels: {
    "四川": "Sichuan",
    "贵州": "Guizhou",
    "云南": "Yunnan"
  },
  riverLabels: {
    "赤水河": "Chishui River",
    "乌江": "Wu River",
    "长江": "Yangtze River"
  },
  locations: {
    "遵义": { name: "Zunyi", sub: "Site of the Zunyi Conference; retaken after the 2nd Crossing" },
    "桐梓": { name: "Tongzi", sub: "Captured after the 2nd Crossing, opening the road to Loushan Pass" },
    "娄山关": { name: "Loushan Pass", sub: "Northern gateway to Guizhou; stormed by the 3rd Army Group" },
    "土城": { name: "Tucheng", sub: "Qinggangpo clash; 1st Crossing ford" },
    "元厚": { name: "Yuanhou", sub: "1st Crossing ford" },
    "太平渡": { name: "Taiping Ford", sub: "2nd & 4th Crossing ford" },
    "二郎滩": { name: "Erlangtan", sub: "2nd & 4th Crossing ford" },
    "茅台": { name: "Maotai", sub: "3rd Crossing ford; open westward crossing to lure KMT forces" },
    "古蔺": { name: "Gulin", sub: "Westward feint direction after the 3rd Crossing" },
    "叙永": { name: "Xuyong", sub: "Key town in southern Sichuan" },
    "扎西": { name: "Zhaxi", sub: "Zhaxi Conference; army streamlined into 16 regiments" },
    "石厢子": { name: "Shixiangzi", sub: "Staging town during the eastward countermarch" },
    "水潦": { name: "Shuiliao", sub: "Route back toward the Chishui River" },
    "老鸦山": { name: "Laoya Mtn.", sub: "Fierce battle site during the Zunyi campaign" },
    "鲁班场": { name: "Lubanchang", sub: "Site of Mar 15 assault before pivoting west" },
    "苟坝": { name: "Gouba", sub: "Gouba Conference forming the three-man military command" },
    "临江场": { name: "Linjiangchang", sub: "Southbound route after the 4th Crossing" },
    "楠木坝": { name: "Nanmuba", sub: "Southbound route toward the Wu River" },
    "花茂": { name: "Huamao", sub: "Rapid push south toward the Wu River" },
    "乌江": { name: "Wu River", sub: "Crossed south on Mar 31 to break the encirclement" },
    "贵阳": { name: "Guiyang", sub: "Guizhou capital; feinted against to draw Yunnan troops east" },
    "昆明": { name: "Kunming", sub: "Yunnan provincial capital" }
  },
  phases: [
    {
      short: "1st Cross",
      tag: "Break Contact",
      name: "First Crossing of the Chishui",
      date: "Jan 28 – Feb 9, 1935",
      intent: "When Sichuan troops at Tucheng proved stronger than intelligence indicated, the Red Army broke off the costly fight overnight, crossed west over the Chishui at Tucheng and Yuanhou, and regrouped around Zhaxi.",
      goal: "Disengage from unfavorable frontal combat and preserve the main force",
      result: "Entered the Sichuan–Yunnan–Guizhou borderlands to regain freedom of maneuver",
      markers: [
        { label: "Qinggangpo Clash", desc: "After fierce combat with Guo Xunqi's Sichuan force on Jan 28, the Red Army broke off and crossed west." },
        { label: "Zhaxi Reorganization", desc: "Early February conference streamlined the Central Red Army into 16 agile regiments." }
      ],
      detail: [
        ["Jan 28", "Qinggangpo Battle", "Sichuan strength and reinforcements exceeded estimates, prompting an immediate reassessment."],
        ["Jan 28 Night", "Plan Abandoned", "Disengaged cleanly rather than clinging to the original northward crossing plan."],
        ["Jan 29", "Westward Crossing", "1st, 3rd, and 5th Army Groups crossed at Tucheng and Yuanhou while the 9th screened the rear."],
        ["Feb 5–9", "Zhaxi Conference", "Streamlined divisions into 16 mobile regiments for rapid mountain warfare."]
      ],
      formations: {
        "red-command": { label: "CMC Column", sub: "Mao · Zhou · Zhu · Wang" },
        "red-1": { label: "1st Army Group", sub: "Lin Biao / Nie Rongzhen" },
        "red-3": { label: "3rd Army Group", sub: "Peng Dehuai / Yang Shangkun" },
        "red-5": { label: "5th Army Group", sub: "Dong Zhentang / Li Zhuoran" },
        "red-9": { label: "9th Army Group", sub: "Luo Binghui / He Changgong" },
        "sichuan": { label: "Sichuan · Guo Xunqi", sub: "Tucheng Sector" },
        "central-zhou": { label: "KMT Zhou Hunyuan", sub: "Pushing West" },
        "central-wu": { label: "KMT Wu Qiwei", sub: "Pursuing North Guizhou" },
        "yunnan": { label: "Yunnan · Sun Du", sub: "Advancing on Zhaxi" },
        "guizhou": { label: "Guizhou · Hou Zhidan", sub: "Zunyi–Chishui Line" }
      }
    },
    {
      short: "2nd Cross",
      tag: "Strike the Weak",
      name: "Second Crossing of the Chishui",
      date: "Feb 18 – Feb 28, 1935",
      intent: "With Sichuan troops sealing the Yangtze and Yunnan divisions closing on Zhaxi, the Red Army suddenly pivoted east, recrossed the Chishui at Taiping and Erlangtan, and struck the weakly held northern Guizhou corridor.",
      goal: "Bypass dense enemy blocks and seize an opening in northern Guizhou",
      result: "Captured Tongzi, stormed Loushan Pass, and retook Zunyi in a major victory",
      markers: [
        { label: "Loushan Pass Victory", desc: "Feb 25–26: The 3rd Army Group stormed the mountain gateway to northern Guizhou." },
        { label: "Zunyi Retaken", desc: "Destroyed two divisions and eight regiments—the biggest triumph of the Long March." }
      ],
      detail: [
        ["Feb 18–21", "Eastward Crossing", "3rd Army Group vanguard seized Taiping and Erlangtan fords for a rapid crossing."],
        ["Feb 24", "Capture of Tongzi", "1st and 3rd Army Groups coordinated to open the approach to Loushan Pass."],
        ["Feb 25–26", "Battle of Loushan Pass", "3rd Army Group stormed the precipitous pass and threw back counterattacks."],
        ["Feb 27–28", "Zunyi & Laoya Mtn.", "Shattered Wu Qiwei's relieving column and recaptured Zunyi."]
      ],
      formations: {
        "red-command": { label: "CMC Column", sub: "Moving East with Main" },
        "red-1": { label: "1st Army Group", sub: "Tongzi – Zunyi" },
        "red-3": { label: "3rd Army Group", sub: "Storming Loushan Pass" },
        "red-5": { label: "5th Army Group", sub: "Main Rearguard" },
        "red-9": { label: "9th Army Group", sub: "Erlangtan Flank" },
        "sichuan": { label: "Sichuan · Pan Wenhua", sub: "Guarding South Sichuan" },
        "central-zhou": { label: "Zhou Hunyuan Col.", sub: "Southwest of Zunyi" },
        "central-wu": { label: "Wu Qiwei Col.", sub: "Relieving Zunyi South" },
        "yunnan": { label: "Yunnan · Sun Du", sub: "Missed at Zhaxi" },
        "guizhou": { label: "Guizhou · Wang Jialie", sub: "Tongzi & Loushan Pass" }
      }
    },
    {
      short: "3rd Cross",
      tag: "Lure Enemy West",
      name: "Third Crossing of the Chishui",
      date: "Mar 5 – Mar 17, 1935",
      intent: "As KMT armies converged on Zunyi again, the Red Army broke off an inconclusive assault at Lubanchang, shifted to Maotai, and openly crossed west over the Chishui to simulate a renewed push toward the Yangtze.",
      goal: "Draw KMT main columns west into southern Sichuan",
      result: "Enemy center of gravity shifted west, opening a gap to the southeast",
      markers: [
        { label: "Gouba Conference", desc: "Mar 10–12: Formed the three-man military command group and canceled the risky Dagu Xinchang attack." },
        { label: "Crossing at Maotai", desc: "Openly crossed west to convince Chiang Kai-shek the Red Army was heading back to the Yangtze." }
      ],
      detail: [
        ["Mar 5–12", "After Zunyi: The Gouba Conference", "The Red Army probed west of Zunyi. At Gouba it called off the attack on Dagu Xinchang and later reorganized field command."],
        ["Mar 15", "From Lubanchang to Maotai", "The Red Army broke off the fighting at Lubanchang and moved toward the upper Chishui."],
        ["Mar 16–17", "Maotai West Crossing", "The Red Army advanced toward Gulin and Xuyong as if preparing to cross the Yangtze."],
        ["After the third crossing", "KMT Columns Shift West", "KMT columns reinforced southern Sichuan and the approaches to the Yangtze."]
      ],
      formations: {
        "red-command": { label: "3-Man Command", sub: "Mao · Zhou · Wang" },
        "red-1": { label: "1st Army Group", sub: "West of Maotai" },
        "red-3": { label: "3rd Army Group", sub: "Lubanchang – Maotai" },
        "red-5": { label: "5th Army Group", sub: "Main Screen" },
        "red-9": { label: "9th Army Group", sub: "Feinting toward Gulin" },
        "sichuan": { label: "Sichuan · Pan Wenhua", sub: "Blocking Gulin / Xuyong" },
        "central-zhou": { label: "Zhou Hunyuan Col.", sub: "Lubanchang Sector" },
        "central-wu": { label: "Wu Qiwei Col.", sub: "Southeast of Zunyi" },
        "yunnan": { label: "Yunnan · Sun Du", sub: "Marching Northwest" },
        "guizhou": { label: "Guizhou · Wang Jialie", sub: "Northern Guizhou" }
      }
    },
    {
      short: "4th Cross",
      tag: "Breakout",
      name: "Fourth Crossing of the Chishui",
      date: "Mar 20 – Apr 1, 1935",
      intent: "While Sichuan, Central, and Yunnan columns rushed to seal Gulin, the Red Army left a single regiment feinting west and secretly doubled back east across Erlangtan and Taiping Ford, slipping cleanly through the open seam.",
      goal: "Punch through the unclosed gap before enemy lines tighten",
      result: "Crossed south over the Wu River, threatened Guiyang, and escaped encirclement",
      markers: [
        { label: "Secret East Crossing", desc: "Mar 21–22: Doubled back across Erlangtan and Taiping Ford right past converging KMT columns." },
        { label: "Across the Wu River", desc: "Mar 31: Main force crossed south toward Guiyang, breaking clean out of the 400,000-man ring." }
      ],
      detail: [
        ["Mar 20", "Secret Pivot East", "One regiment of the 1st Army Group kept feinting toward Gulin while the main body turned east by night."],
        ["Mar 21–22", "4th Crossing", "Recrossed at Erlangtan and Taiping Ford, passing opposite to westward-marching KMT divisions."],
        ["Mar 23–30", "Dash South", "Drove swiftly through Linjiangchang and Huamao before enemy lines could reform."],
        ["Mar 31–Apr 1", "South of Wu River", "Crossed the Wu River toward Guiyang, setting up the feint that drew Yunnan troops away from Kunming."]
      ],
      formations: {
        "red-command": { label: "CMC Column", sub: "Secret East Pivot" },
        "red-1": { label: "1st Army Group", sub: "Pivoting South" },
        "red-3": { label: "3rd Army Group", sub: "Taiping – Nanmuba" },
        "red-5": { label: "5th Army Group", sub: "Rearguard" },
        "red-9": { label: "9th Army Group", sub: "Flank Screen" },
        "red-decoy": { label: "1st AG Decoy Regt", sub: "Feinting at Gulin" },
        "sichuan": { label: "Sichuan · Pan Wenhua", sub: "Around Gulin" },
        "central-zhou": { label: "Zhou Hunyuan Col.", sub: "Drawn West of Chishui" },
        "central-wu": { label: "Wu Qiwei Col.", sub: "Repositioning North" },
        "yunnan": { label: "Yunnan · Sun Du", sub: "Western Sichuan Flank" },
        "guizhou": { label: "Guizhou · Wang Jialie", sub: "North Bank of Wu River" }
      }
    }
  ],
  commanders: {
    redLabel: "Central Red Army",
    redSub: "Supreme Strategic Command",
    blueLabel: "KMT Forces",
    blueSub: "Multi-Province Encirclement",
    red: [
      { name: "Mao Zedong", role: "Politburo Standing Committee; core architect of mobile warfare strategy" },
      { name: "Zhou Enlai", role: "Chief operational commander executing daily field directives" },
      { name: "Zhu De", role: "Chairman of the Central Military Commission & Red Army Commander-in-Chief" },
      { name: "Wang Jiaxiang", role: "CMC Vice Chairman; member of the three-man military command group" }
    ],
    blue: [
      { name: "Chiang Kai-shek", role: "Chairman of the National Military Council; directed overall encirclement" },
      { name: "Xue Yue", role: "Frontline Commander of the 2nd Route Army coordinating Central columns" },
      { name: "Liu Xiang / Pan Wenhua", role: "Sichuan provincial commanders sealing the Yangtze and southern Sichuan" },
      { name: "Long Yun / Sun Du", role: "Yunnan provincial commanders advancing from the southwest" },
      { name: "Wang Jialie / Hou Zhidan", role: "Guizhou provincial commanders defending northern Guizhou" }
    ]
  },
  orderOfBattle: {
    red: [
      ["CMC / Headquarters Column", "Zhu De, Zhou Enlai, Mao Zedong, Wang Jiaxiang", "Unified strategic command and radio communications"],
      ["1st Army Group", "Lin Biao / Nie Rongzhen", "Vanguard assault and seizing key crossings"],
      ["3rd Army Group", "Peng Dehuai / Yang Shangkun", "Main shock attacks at Loushan Pass and Zunyi"],
      ["5th Army Group", "Dong Zhentang / Li Zhuoran", "Rearguard screening and blocking actions"],
      ["9th Army Group", "Luo Binghui / He Changgong", "Flank security, pinning, and strategic feints"],
      ["Cadre Regiment", "Chen Geng / Song Renqiong", "CMC reserve for crossing security and special missions"]
    ],
    blue: [
      ["National Military Council", "Chiang Kai-shek", "Coordinated Central and provincial armies to trap the Red Army"],
      ["2nd Route Front HQ", "Xue Yue", "Directed Wu Qiwei and Zhou Hunyuan's Central columns"],
      ["Wu Qiwei Column", "Wu Qiwei", "Central Army pursuit across Zunyi and northern Guizhou"],
      ["Zhou Hunyuan Column", "Zhou Hunyuan", "Central Army push west of Zunyi toward southern Sichuan"],
      ["Sichuan Army", "Liu Xiang / Pan Wenhua; Guo Xunqi", "Guarded Yangtze crossings, Gulin, Xuyong, and Tucheng"],
      ["Yunnan Army", "Long Yun / Sun Du", "Advanced north from Yunnan and Bijie"],
      ["Guizhou Army", "Wang Jialie; Hou Zhidan", "Local garrisons and pursuit across northern Guizhou"],
      ["Hunan & Outer Forces", "He Jian et al.", "Outer perimeter containment and reserve cordons"]
    ]
  },
  situation: {
    eyebrow: "POST-ZUNYI CONFERENCE · EARLY 1935",
    title: "Not a pre-scripted four crossings,<br />but reading the battlefield in real time.",
    narrative: "Severely depleted after the Xiang River crossing, the Central Red Army faced converging Central, Sichuan, Guizhou, and Yunnan armies. Every sharp pivot was forged dynamically from real-time terrain and enemy movement.",
    forceComparison: {
      red: {
        label: "Central Red Army",
        count: "~30,000+",
        width: "8%",
        desc: "1st, 3rd, 5th, and 9th Army Groups; light, cohesive, and fast-moving, though scarce on heavy weapons and supplies."
      },
      blue: {
        label: "KMT Encirclement Forces",
        count: "~400,000",
        width: "100%",
        desc: "Central and provincial armies forming concentric rings; massive numbers, but fractured loyalty and slow coordination."
      },
      note: "Note: ~400,000 represents total forces deployed across the multi-province cordon, not all engaged simultaneously."
    },
    deployments: {
      red: {
        title: "Red Army Posture",
        subtitle: "Concentrated · Light · Rapid",
        items: [
          ["1st Army Group", "Vanguard spearhead seizing mountain passes and river fords."],
          ["3rd Army Group", "Primary assault force at Loushan Pass and Zunyi."],
          ["5th & 9th Army Groups", "Rearguard screening and strategic deception to buy maneuver room."],
          ["CMC Column", "Moved alongside the main body with centralized radio command."]
        ]
      },
      blue: {
        title: "KMT Posture",
        subtitle: "Zoned · Blocking · Closing In",
        items: [
          ["North · Sichuan Army", "Sealed the Yangtze banks to prevent a link-up with the 4th Front Army."],
          ["East · Central & Guizhou", "Pressed west through Zunyi to compress the Red Army pocket."],
          ["South · Yunnan Army", "Marched north from Yunnan to close the southwest border."],
          ["Overall Goal", "Layer overwhelming manpower to annihilate the Red Army northwest of the Wu River."]
        ]
      }
    }
  },
  logic: {
    sectionLabel: "Strategic Logic",
    eyebrow: "WHY MOVE THIS WAY?",
    title: "Make the foe chase your 'intent',<br />then slip through the seam.",
    steps: [
      { roman: "I", title: "Shape Enemy Belief", desc: "Visible crossings and feints convinced opponents the Red Army aimed north for the Yangtze or a fixed town.", keyword: "Feint" },
      { roman: "II", title: "Pull Heavy Masses", desc: "Larger armies take longer to pivot; as KMT columns shifted toward the decoy, gaps tore open behind them.", keyword: "Lure" },
      { roman: "III", title: "Double Back Fast", desc: "Night forced marches and small decoy units masked sudden reversals, clearing gaps before the trap snapped shut.", keyword: "Breakout" }
    ],
    decisionLoop: {
      eyebrow: "DECISION LOOP",
      title: "Intelligence is not a verdict,<br />but the spark for the next pivot.",
      items: [
        ["01", "Read the Ring", "Spot dense blocks versus weakly held seams"],
        ["02", "Pick the Fight", "Bypass heavy columns; strike isolated units"],
        ["03", "Outmarch Odds", "Use marching tempo to reset battlefield geometry"],
        ["04", "Re-evaluate", "Abandon obsolete plans without hesitation"]
      ]
    }
  },
  chronicle: {
    eyebrow: "JAN 19 – MAR 22, 1935",
    title: "64 days,<br />four reversals of direction.",
    deck: "Click any event to return directly to that scene. Dates reflect campaign-level summaries.",
    events: [
      { date: "Jan 19", stage: "Opening", title: "Depart Zunyi toward the Sichuan border", desc: "Initial plan aimed to cross the Yangtze north into Sichuan to join the 4th Front Army.", tag: "Pivot", phaseIndex: 0 },
      { date: "Jan 28", stage: "Tucheng", title: "Enemy strength exceeds intel; break contact", desc: "Refusing a losing battle of attrition at Qinggangpo, command ordered an overnight withdrawal.", tag: "Decisive", phaseIndex: 0 },
      { date: "Jan 28–29", stage: "1st Crossing", title: "Cross west at Tucheng and Yuanhou", desc: "Main force entered southern Sichuan, shedding frontal pressure.", tag: "Disengage", phaseIndex: 0 },
      { date: "Feb 18–21", stage: "2nd Crossing", title: "Pivot east at Taiping & Erlangtan", desc: "Exploiting thinned Guizhou defenses, the army swung back toward Tongzi and Zunyi.", tag: "Counter", phaseIndex: 1 },
      { date: "Feb 25–28", stage: "Loushan · Zunyi", title: "Storm Loushan Pass and retake Zunyi", desc: "Won a decisive mobile victory, routing Wu Qiwei's relieving divisions.", tag: "Victory", phaseIndex: 1 },
      { date: "Mar 16–17", stage: "3rd Crossing", title: "Cross west openly at Maotai", desc: "Marched toward Gulin and Xuyong to draw KMT columns west.", tag: "Lure West", phaseIndex: 2 },
      { date: "Mar 21–22", stage: "4th Crossing", title: "Secret reversal east across Chishui", desc: "Leaving one decoy regiment west, the main body slipped east past converging foes.", tag: "Breakout", phaseIndex: 3 },
      { date: "Mar 31–May 9", stage: "Aftermath", title: "Cross Wu River, feint Guiyang, cross Jinsha", desc: "Drew Yunnan troops east, entered Yunnan, and crossed the Jinsha River to escape encirclement.", tag: "Strategic Win", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "China Military Online (81.mil.cn)", url: "https://www.81.mil.cn/yljnt_208627/lsda_208656/16451606.html" },
    { title: "12371 Historical Archive", url: "https://www.12371.cn/2021/10/21/ARTI1634810104798403.shtml" },
    { title: "CPC News Historical Feature", url: "https://cpc.people.com.cn/n1/2022/0825/c443712-32510938.html" },
    { title: "Reference Documentary", url: "https://www.bilibili.com/video/BV11RSYBtEu3/" }
  ]
};
