// Normandy Landings / Operation Overlord (1944) — English Translation Overlay
export default {
  title: "Normandy Landings",
  subtitle: "Operation Overlord · Opening the Western Front",
  period: "Jun 6 – Jul 25, 1944",
  era: "World War II · Western Front",
  seal: "DD",
  meta: {
    heroTitle: ["Normandy", "Landings"],
    eyebrow: ["OPERATION OVERLORD", "1944 · WORLD WAR II"],
    deck: "History's greatest amphibious assault crossed the English Channel—deceiving Germany at Calais while overwhelming the Atlantic Wall by sea and air.",
    facts: [
      ["DATE", "Jun–Jul 1944"],
      ["THEATER", "Normandy, France"],
      ["D-DAY", "~156,000 Landed"]
    ],
    quote: '"You are about to embark upon the Great Crusade, toward which we have striven these many months. The eyes of the world are upon you."',
    quoteAuthor: "Gen. Dwight D. Eisenhower · June 6, 1944",
    quoteMark: "D",
    quoteDesc: "Victory in Normandy combined strategic deception, total air–sea dominance, engineering marvels like Mulberry harbors, and sheer courage on the beaches."
  },
  mapConfig: {
    scaleNote: "English Channel & Normandy · Tactical Schematic",
    filterSides: { all: "All Units", red: "Allied Forces", blue: "German Forces" },
    legends: [
      "Allied Airborne & Landings",
      "German Counterattacks",
      "Channel & Rivers"
    ]
  },
  regionLabels: {
    "英格兰": "England",
    "英吉利海峡": "English Channel",
    "诺曼底": "Normandy"
  },
  riverLabels: {
    "奥恩河": "Orne River",
    "维尔河": "Vire River"
  },
  locations: {
    "朴次茅斯": { name: "Portsmouth", sub: "Primary staging and embarkation port for the Allied armada" },
    "瑟堡": { name: "Cherbourg", sub: "Deep-water Cotentin port captured by US VII Corps in late June" },
    "圣梅尔埃格利斯": { name: "Ste-Mère-Église", sub: "First French town liberated by US 82nd Airborne" },
    "犹他海滩": { name: "Utah Beach", sub: "US 4th Infantry Division landing zone; lightest casualties" },
    "奥马哈海滩": { name: "Omaha Beach", sub: "US 1st & 29th Divisions faced fierce German 352nd resistance ('Bloody Omaha')" },
    "金滩": { name: "Gold Beach", sub: "British 50th Division landing zone driving toward Bayeux" },
    "朱诺海滩": { name: "Juno Beach", sub: "Canadian 3rd Division landing zone; deepest D-Day inland advance" },
    "宝剑海滩": { name: "Sword Beach", sub: "British 3rd Division landing zone linking to Orne airborne bridges" },
    "飞马桥": { name: "Pegasus Bridge", sub: "Orne Canal bridge seized intact by British 6th Airborne gliders" },
    "卡朗唐": { name: "Carentan", sub: "Vital crossroads linking Utah and Omaha beachheads" },
    "巴约": { name: "Bayeux", sub: "Liberated on D+1, becoming a key Allied rear hub" },
    "卡昂": { name: "Caen", sub: "Strategic road hub where British & Canadian armies pinned German panzers" },
    "圣洛": { name: "Saint-Lô", sub: "Bocage crossroads and launchpad for Operation Cobra" },
    "法莱斯": { name: "Falaise", sub: "Site of the August encirclement that shattered German forces in Normandy" },
    "阿夫朗什": { name: "Avranches", sub: "Gateway into Brittany and open French countryside" }
  },
  phases: [
    {
      short: "Airborne",
      tag: "Seize Flanks",
      name: "Midnight Airborne Drop · Seal the Flanks",
      date: "Night of Jun 5 – Dawn Jun 6, 1944",
      intent: "Hours before H-Hour, three Allied airborne divisions (~23,000 troops) parachuted and glided onto both flanks of Normandy to lock down Cotentin causeways and Orne River bridges—while Operation Fortitude kept German commanders fixated on Pas-de-Calais.",
      goal: "Secure Cotentin beach exits and eastern Orne bridges",
      result: "British gliders took Pegasus Bridge in 10 minutes; US paratroopers took Sainte-Mère-Église despite wide dispersion",
      markers: [
        { label: "US 82nd / 101st Drop", desc: "Scattered by cloud and flak, paratroopers still rallied to capture Sainte-Mère-Église and disrupt German command." },
        { label: "Pegasus Bridge Coup", desc: "British 6th Airborne gliders landed yards from the Orne Canal bridge, capturing it intact." }
      ],
      detail: [
        ["Jun 5 23:00", "Armada Sails", "Seizing a brief weather break, Eisenhower launched ~6,900 vessels across the Channel."],
        ["Jun 6 00:16", "Pegasus Bridge Taken", "Maj. Howard's glider platoon stunned the garrison and seized the Orne bridge intact."],
        ["Jun 6 01:30", "Cotentin Drops", "Low clouds scattered 82nd and 101st paratroopers, ironically confusing German intelligence."],
        ["Jun 6 04:30", "Ste-Mère-Église Freed", "505th PIR secured the vital crossroads blocking German reinforcements north."]
      ],
      formations: {
        "allied-hq": { label: "Allied Armada", sub: "Op. Neptune · 6,900 Ships" },
        "us-82": { label: "US 82nd Airborne", sub: "Ste-Mère-Église" },
        "us-101": { label: "US 101st Airborne", sub: "Utah Causeway Exits" },
        "uk-6": { label: "UK 6th Airborne", sub: "Pegasus Bridge · Left Flank" },
        "ger-7": { label: "German 7th Army", sub: "Rommel Away · Slow Alert" },
        "ger-21pz": { label: "21st Panzer Div", sub: "Near Caen · Awaiting Orders" },
        "ger-352": { label: "352nd Infantry Div", sub: "Hidden Behind Omaha" }
      }
    },
    {
      short: "D-Day",
      tag: "Five Beaches",
      name: "D-Day · Assault on Five Beaches",
      date: "Jun 6, 1944 · 06:30–Dusk",
      intent: "Under massive naval and aerial bombardment, Allied forces stormed five beaches across an 80 km front. At Omaha Beach, the veteran German 352nd Infantry Division inflicted heavy casualties, until daring close-in destroyer fire and small-unit grit breached the bluffs.",
      goal: "Breach the Atlantic Wall and establish beachheads on all five sectors",
      result: "~156,000 troops ashore by dusk; all five beaches held and 21st Panzer's counterattack repulsed",
      markers: [
        { label: "Bloody Omaha", desc: "US 1st & 29th Divisions fought through brutal bluff crossfire to clear exits inland." },
        { label: "21st Panzer Counter", desc: "The sole German armored counterattack on D-Day was halted by British anti-tank guns and air strikes." }
      ],
      detail: [
        ["06:30", "Utah & Omaha", "Tidal drift shifted Utah onto lighter defenses; Omaha became a desperate fight on the shingle."],
        ["07:25–07:55", "Gold, Juno, Sword", "British and Canadian troops with Hobart's Funnies breached coastal bunkers swiftly."],
        ["11:00+", "Omaha Breached", "US destroyers closed into shallow surf to blast pillboxes as infantry scaled the bluffs."],
        ["Dusk", "Foothold Secured", "~156,000 Allied troops stood ashore (~10,000 casualties) while Hitler still withheld panzer reserves."]
      ],
      formations: {
        "us-4": { label: "US 4th Infantry Div", sub: "Utah Beach Advance" },
        "us-1": { label: "US 1st & 29th Div", sub: "Omaha Bluff Breakout" },
        "uk-50": { label: "UK 50th Division", sub: "Gold Beach to Bayeux" },
        "can-3": { label: "Canadian 3rd Div", sub: "Juno · Deepest Push" },
        "uk-3": { label: "UK 3rd Division", sub: "Sword toward Caen" },
        "ger-352": { label: "352nd Infantry Div", sub: "Pulling Back from Omaha" },
        "ger-21pz": { label: "21st Panzer Div", sub: "Counterattacking Sword" }
      }
    },
    {
      short: "Cherbourg",
      tag: "Link-Up & Port",
      name: "Link Beachheads & Capture Cherbourg",
      date: "Jun 7 – Jun 30, 1944",
      intent: "While prefabricated Mulberry harbors poured supplies onto the beaches, the US 101st Airborne fought bitterly to take Carentan and unite Utah with Omaha. US VII Corps then severed the Cotentin Peninsula and captured Cherbourg as British troops pinned German panzers around Caen.",
      goal: "Unite all five beachheads and seize deep-water Cherbourg",
      result: "Continuous 80 km lodgment formed; Cherbourg fell late June; over 850,000 Allied troops ashore",
      markers: [
        { label: "Battle of Carentan", desc: "US 101st Airborne seized Carentan, welding Utah and Omaha into one unified front." },
        { label: "Fall of Cherbourg", desc: "US VII Corps isolated the Cotentin tip and captured Cherbourg with ~39,000 German POWs." }
      ],
      detail: [
        ["Jun 7", "Bayeux Liberated", "British forces quickly freed Bayeux, linking Gold, Juno, and Sword sectors."],
        ["Jun 10–12", "Battle of Carentan", "101st Airborne repulsed German paratroopers, completing an 80 km unified lodgment."],
        ["Jun 18", "Cotentin Severed", "US VII Corps reached the western coast, trapping Cherbourg's garrison."],
        ["Jun 26–30", "Cherbourg Taken", "Gen. von Schlieben surrendered; despite ruined docks, the western flank was fully secure."]
      ],
      formations: {
        "us-7corps": { label: "US VII Corps", sub: "Collins · Assaulting Cherbourg" },
        "us-101": { label: "US 101st Airborne", sub: "Linked Beachheads at Carentan" },
        "uk-2army": { label: "British 2nd Army", sub: "Pressing Bayeux – Caen" },
        "ger-cherbourg": { label: "Cherbourg Garrison", sub: "Cut Off · Surrendered" },
        "ger-ss12": { label: "12th SS Panzer Div", sub: "Defending Caen Sector" },
        "ger-lehr": { label: "Panzer Lehr Div", sub: "Battered by Air Strikes" }
      }
    },
    {
      short: "Cobra",
      tag: "Breakout",
      name: "Battle of Caen & Operation Cobra",
      date: "Jul 8 – Jul 25, 1944",
      intent: "Dense Normandy hedgerows (bocage) slowed advances into grinding attrition. Montgomery's repeated offensives around Caen (Charnwood, Goodwood) acted as an anvil pinning most German panzer divisions in the east, allowing US First Army to unleash Operation Cobra's carpet bombing west of Saint-Lô and break into open France.",
      goal: "Pin German armor at Caen and smash through the western flank",
      result: "Caen and Saint-Lô taken; Patton's 3rd Army poured through Avranches, collapsing the German front",
      markers: [
        { label: "Battle for Caen", desc: "British and Canadian offensives seized Caen and magnetized Germany's elite armored divisions." },
        { label: "Operation Cobra", desc: "Jul 25: ~1,800 heavy bombers shattered German lines west of Saint-Lô for a decisive armored breakout." }
      ],
      detail: [
        ["Jul 8–9", "Northern Caen Taken", "Fierce urban combat won northern Caen, forcing Germany to keep armor tied east."],
        ["Jul 18", "Goodwood & Saint-Lô", "Operation Goodwood drew panzers east as US troops seized the ruins of Saint-Lô."],
        ["Jul 25", "Operation Cobra", "Heavy bomber saturation blasted a narrow corridor west of Saint-Lô for US armor."],
        ["Jul 31", "Avranches Gateway", "Patton's Third Army surged through Avranches toward Brittany, Falaise, and Paris."]
      ],
      formations: {
        "uk-2army": { label: "UK/CA 2nd Army", sub: "Caen Taken · Pinning Panzers" },
        "us-1army": { label: "US 1st Army", sub: "Cobra Breakout at Saint-Lô" },
        "us-3army": { label: "US 3rd Army Spear", sub: "Patton · Sweeping Avranches" },
        "ger-pzg": { label: "Panzer Group West", sub: "Pinned at Caen – Falaise" },
        "ger-7": { label: "German 7th Remnants", sub: "West Flank Collapsing" }
      }
    }
  ],
  commanders: {
    redLabel: "Allied Expeditionary Force",
    redSub: "SHAEF · Joint Land, Sea & Air",
    blueLabel: "German Wehrmacht",
    blueSub: "OB West · Army Group B",
    red: [
      { name: "Dwight D. Eisenhower", role: "Supreme Allied Commander (SHAEF); made the historic call to launch on June 6" },
      { name: "Bernard Montgomery", role: "21st Army Group Commander; overall ground commander for Normandy" },
      { name: "Omar Bradley", role: "US First Army Commander; led Utah, Omaha, Cherbourg, and Operation Cobra" },
      { name: "Miles Dempsey", role: "British Second Army Commander; led Gold, Juno, Sword, and Caen operations" },
      { name: "Bertram Ramsay", role: "Allied Naval Commander; orchestrated Operation Neptune's 6,900-ship crossing" },
      { name: "Trafford Leigh-Mallory", role: "Allied Air Commander; achieved total air supremacy and interdicted French rail" }
    ],
    blue: [
      { name: "Gerd von Rundstedt", role: "OB West Commander; favored holding panzers inland for a mobile counterstrike" },
      { name: "Erwin Rommel", role: "Army Group B Commander; insisted invaders had to be stopped on the beaches" },
      { name: "Friedrich Dollmann", role: "German 7th Army Commander responsible for Normandy and Brittany defenses" },
      { name: "Leo Geyr von Schweppenburg", role: "Panzer Group West Commander overseeing armored reserves" },
      { name: "Dietrich Kraiss", role: "352nd Infantry Division Commander who inflicted heavy losses on Omaha" },
      { name: "Edgar Feuchtinger", role: "21st Panzer Division Commander; led the only German armored counter on D-Day" }
    ]
  },
  orderOfBattle: {
    red: [
      ["SHAEF / 21st Army Group", "Eisenhower / Montgomery", "Supreme theater direction and Normandy ground operations"],
      ["US First Army", "Omar Bradley", "Utah & Omaha landings, Cherbourg capture, and Operation Cobra"],
      ["British Second Army", "Miles Dempsey", "Gold, Juno & Sword landings and pinning panzers at Caen"],
      ["Allied Airborne Corps", "US 82nd, 101st / UK 6th Div", "Night flank drops seizing causeways and Orne bridges"],
      ["Allied Naval Force", "Bertram Ramsay", "~6,900 vessels delivering troops and heavy naval gunfire"],
      ["Allied Air Forces", "Leigh-Mallory / Spaatz", "11,000+ aircraft securing skies and cutting German rail lines"]
    ],
    blue: [
      ["OB West HQ", "Gerd von Rundstedt", "Theater defense; clashed with Rommel over panzer deployment"],
      ["Army Group B", "Erwin Rommel", "Fortified Atlantic Wall beaches; away in Germany on June 6"],
      ["German 7th Army", "Friedrich Dollmann", "Coastal defense of Normandy absorbing the initial invasion"],
      ["352nd Infantry Division", "Dietrich Kraiss", "Moved forward pre-D-Day, heavily contesting Omaha Beach"],
      ["21st Panzer Division", "Edgar Feuchtinger", "Sole panzer division to counterattack on June 6"],
      ["Panzer Group West", "Panzer Lehr, 1st & 12th SS", "Delayed by Hitler's release authority and air interdiction; tied down at Caen"]
    ]
  },
  situation: {
    eyebrow: "SUMMER 1944 · ASSAULT ON THE ATLANTIC WALL",
    title: "Not mere brute force,<br />but total combined-arms mastery.",
    narrative: "By June 1944 Germany guarded thousands of miles of Western European coastline with ~50 divisions. Yet Operation Fortitude fooled Berlin into holding its strongest force—the 15th Army—idly at Pas-de-Calais while Normandy bore the true blow.",
    forceComparison: {
      red: {
        label: "Allied Forces in Normandy (by late July)",
        count: "~1.56 Million",
        width: "100%",
        desc: "~156,000 landed on D-Day; total air–sea dominance and Mulberry harbors sustained 1.5M+ troops and 300,000+ vehicles."
      },
      blue: {
        label: "German Forces Committed",
        count: "~380k–640k",
        width: "40%",
        desc: "Only ~50,000 held Normandy on D-Day; reinforcing panzers were crippled by shattered railways and daytime fighter-bombers."
      },
      note: "Note: Force levels grew steadily through June and July; totals compare overall buildup before the Cobra breakout."
    },
    deployments: {
      red: {
        title: "Allied Strategy",
        subtitle: "Deception · Air Power · Logistics",
        items: [
          ["Operation Fortitude", "Phantom First US Army Group under Patton locked German 15th Army at Calais."],
          ["Flank Airborne Shield", "Three airborne divisions sealed both wings before H-Hour."],
          ["Five-Beach Combined Arms", "Naval gunfire, air support, and specialized armor struck an 80 km front."],
          ["Mulberry & PLUTO", "Artificial concrete harbors and undersea pipelines solved beach logistics."]
        ]
      },
      blue: {
        title: "German Defense",
        subtitle: "Linear Wall · Divided Command",
        items: [
          ["Atlantic Wall", "Mines, beach obstacles, and concrete bunkers—still incomplete in Normandy."],
          ["Calais Paralysis", "German 15th Army remained pinned north of the Seine for crucial weeks."],
          ["Split Panzer Doctrine", "Rommel vs. Rundstedt rift plus Hitler's personal reserve veto delayed armor."],
          ["Lost Skies", "Allied fighter-bombers turned daylight road movement into a gauntlet."]
        ]
      }
    }
  },
  logic: {
    sectionLabel: "Strategic Logic",
    eyebrow: "FOUR PILLARS OF OPERATION OVERLORD",
    title: "Freeze enemy reserves by deception,<br />then crush the wall with joint power.",
    steps: [
      { roman: "I", title: "Deceive & Pin Calais", desc: "Double agents, dummy armor, and fake radio traffic froze German 15th Army away from Normandy.", keyword: "Deception" },
      { roman: "II", title: "Paralyze Transport", desc: "Months of air strikes wrecked northern French rail hubs and Seine bridges, stranding panzer reserves.", keyword: "Interdiction" },
      { roman: "III", title: "Bring Your Own Harbors", desc: "Prefabricated Mulberry ports overturned the classic rule that major invasions needed an intact port immediately.", keyword: "Logistics" },
      { roman: "IV", title: "Anvil & Hammer", desc: "Caen served as the eastern anvil pinning German panzers while Operation Cobra struck the decisive hammer blow west.", keyword: "Breakout" }
    ],
    decisionLoop: {
      eyebrow: "DECISIVE COMMAND CALLS",
      title: "Amid storm clouds and immense risk,<br />seizing the lone strategic window.",
      items: [
        ["01", "Weather Gamble", "Delayed 24 hours on meteorologist Stagg's forecast and seized the brief June 6 gap"],
        ["02", "Full Accountability", "Eisenhower drafted a failure message taking sole responsibility before launch"],
        ["03", "Frontline Grit", "At Omaha, destroyers closed into surf and infantry improvised breaches under fire"],
        ["04", "Operational Pivot", "Adapted after bocage gridlock—using Caen to fix armor and Saint-Lô to break out"]
      ]
    }
  },
  chronicle: {
    eyebrow: "JUN 5 – AUG 25, 1944",
    title: "50 days of combat,<br />unlocking Western Europe.",
    deck: "Click any event to return directly to that scene.",
    events: [
      { date: "Jun 5 Night", stage: "Launch", title: "Eisenhower gives the order: 'OK, Let's Go'", desc: "Seizing the June 6 weather window, ~6,900 ships and three airborne divisions set out.", tag: "Decision", phaseIndex: 0 },
      { date: "Jun 6 00:16", stage: "Airborne", title: "Pegasus Bridge & Ste-Mère-Église seized", desc: "British 6th and US 82nd/101st Airborne fired the opening shots on both flanks.", tag: "Airborne", phaseIndex: 0 },
      { date: "Jun 6 Dawn", stage: "D-Day", title: "Five-beach assault & Bloody Omaha", desc: "~156,000 Allied troops stormed the Atlantic Wall and secured all five beachheads.", tag: "Landings", phaseIndex: 1 },
      { date: "Jun 12", stage: "Link-Up", title: "US 101st Airborne captures Carentan", desc: "Utah and Omaha merged into a continuous 80 km Allied lodgment.", tag: "Unified", phaseIndex: 2 },
      { date: "Jun 26", stage: "Deep Port", title: "US VII Corps takes Cherbourg", desc: "Cotentin Peninsula cleared and nearly 39,000 German defenders captured.", tag: "Cherbourg", phaseIndex: 2 },
      { date: "Jul 9", stage: "Eastern Anvil", title: "British & Canadian forces take Caen", desc: "Relentless pressure kept elite German panzers pinned east of the Orne.", tag: "Anvil", phaseIndex: 3 },
      { date: "Jul 25", stage: "Op. Cobra", title: "Carpet bombing & breakout west of Saint-Lô", desc: "German western flank shattered; Patton's Third Army poured through Avranches.", tag: "Breakout", phaseIndex: 3 },
      { date: "Aug 21–25", stage: "Aftermath", title: "Falaise Pocket closed & Paris liberated", desc: "German forces in Normandy were routed; Paris was freed on Aug 25.", tag: "Liberation", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "US Army CMH: Cross-Channel Attack", url: "https://history.army.mil/html/books/007/7-4-1/index.html" },
    { title: "Imperial War Museums: D-Day", url: "https://www.iwm.org.uk/history/the-10-things-you-need-to-know-about-d-day" },
    { title: "Britannica: Normandy Invasion", url: "https://www.britannica.com/event/Normandy-Invasion" }
  ]
};
