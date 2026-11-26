// Operation Market Garden (Sep 1944) — English Translation Overlay
export default {
  title: "Operation Market Garden",
  subtitle: "Largest Daylight Airborne Drop · A Bridge Too Far",
  period: "Sep 17 – Sep 26, 1944",
  era: "World War II · Western Front",
  seal: "MG",
  meta: {
    heroTitle: ["Market", "Garden"],
    eyebrow: ["OPERATION MARKET GARDEN", "SEP 1944 · NETHERLANDS"],
    deck: "Rolling out a 100 km 'airborne carpet' across five Dutch rivers to bounce the Rhine: an audacious gamble undone by one final bridge at Arnhem.",
    facts: [
      ["DATE", "Sep 17–26, 1944"],
      ["THEATER", "Netherlands · Rhine"],
      ["AIRBORNE", "~35,000 Troops"]
    ],
    quote: '"I think we may be going a bridge too far."',
    quoteAuthor: "Lt. Gen. Frederick Browning · September 1944",
    quoteMark: "B",
    quoteDesc: "Market Garden failed not from lack of bravery, but because a zero-margin plan broke when overlooked SS panzers, a single-lane road, and fog collided."
  },
  mapConfig: {
    scaleNote: "Southern Dutch Corridor · Tactical Schematic",
    filterSides: { all: "All Units", red: "Allied Forces", blue: "German Forces" },
    legends: [
      "Allied Advance & Withdrawal",
      "German Counter & Blockade",
      "Rhine Rivers · Highway 69"
    ]
  },
  regionLabels: {
    "荷兰": "Netherlands",
    "德国": "Germany",
    "比利时": "Belgium"
  },
  riverLabels: {
    "下莱茵河（阿纳姆）": "Lower Rhine (Arnhem)",
    "瓦尔河（奈梅亨）": "Waal River (Nijmegen)",
    "默兹河（马斯河）": "Maas River",
    "威廉敏娜运河": "Wilhelmina Canal",
    "69号公路 · 地狱公路": "Hwy 69 · Hell's Highway"
  },
  locations: {
    "沃尔夫海泽": { name: "Wolfheze", sub: "UK 1st Airborne drop zone, 11 km west of Arnhem Bridge" },
    "奥斯特贝克": { name: "Oosterbeek", sub: "Cauldron perimeter fiercely defended by UK 1st Airborne" },
    "阿纳姆大桥": { name: "Arnhem Bridge", sub: "Lower Rhine road bridge—the famed 'Bridge Too Far'" },
    "德里尔": { name: "Driel", sub: "Polish 1st Independent Parachute Brigade drop zone south of the Rhine" },
    "埃尔斯特": { name: "Elst", sub: "'The Island' town where British armor stalled short of Arnhem" },
    "奈梅亨": { name: "Nijmegen", sub: "Waal River road bridge captured intact after US 82nd assault crossing" },
    "赫拉弗": { name: "Grave", sub: "Maas River bridge seized intact by US 82nd on Sep 17" },
    "费赫尔": { name: "Veghel", sub: "Highway 69 bottleneck repeatedly attacked by German battlegroups" },
    "桑镇": { name: "Son", sub: "Wilhelmina Canal bridge blown ahead of US 101st, delaying XXX Corps" },
    "埃因霍温": { name: "Eindhoven", sub: "Major southern Dutch city liberated on Sep 18" },
    "乔桥": { name: "Joe's Bridge", sub: "Belgian–Dutch border launch point for British XXX Corps" }
  },
  phases: [
    {
      short: "Air Drop",
      tag: "Daylight Drop",
      name: "Daylight Drop · River Coup",
      date: "Sep 17, 1944",
      intent: "Montgomery linked 'Market' (airborne bridge seizures) with 'Garden' (armored thrust) to leap five rivers and outflank the Siegfried Line. ~20,000 first-wave paratroopers dropped in broad daylight—taking Grave and the north end of Arnhem Bridge—yet Son bridge was blown, UK 1st Airborne landed far from Arnhem with faulty radios, and II SS Panzer Corps happened to be refitting right beside Arnhem.",
      goal: "Seize all five river crossings from Eindhoven to Arnhem on Day 1",
      result: "Grave secured and Frost's 2nd Battalion reached Arnhem Bridge, but Son fell and UK 1st main body stalled",
      markers: [
        { label: "Son Bridge Blown", desc: "Germans blew the Wilhelmina Canal bridge before 101st troops, halting XXX Corps to build a Bailey bridge." },
        { label: "UK 1st Airborne Drop", desc: "Dropped 11 km west of Arnhem with malfunctioning radios that severed battalion links." },
        { label: "Frost Takes North End", desc: "Lt. Col. Frost's ~740 paratroopers seized Arnhem Bridge's north ramp while Germans held the south." }
      ],
      detail: [
        ["Sep 17 13:00", "Massive Daylight Drop", "Over 1,500 transports and 500 gliders delivered US 101st, US 82nd, and UK 1st Airborne."],
        ["Sep 17 14:15", "XXX Corps Jumps Off", "Guards Armored Division drove up narrow Highway 69 but hit anti-tank ambushes short of Eindhoven."],
        ["Sep 17 PM", "Son Lost, Grave Won", "Germans blew Son bridge; further north, US 504th PIR captured Grave Bridge intact."],
        ["Sep 17 Night", "Frost at Arnhem", "Frost's 2nd Battalion seized Arnhem's north end as Field Marshal Model rushed 9th SS Panzer to block reinforcements."]
      ],
      formations: {
        "uk-30corps": { label: "UK XXX Corps", sub: "Horrocks · Up Hwy 69" },
        "us-101": { label: "US 101st Airborne", sub: "Son – Veghel Corridor" },
        "us-82": { label: "US 82nd Airborne", sub: "Grave Bridge & Heights" },
        "uk-1ab": { label: "UK 1st Airborne Main", sub: "Blocked East of Wolfheze" },
        "uk-frost": { label: "Frost's 2nd Bn", sub: "~740 Holding Arnhem North" },
        "ger-ss9": { label: "9th SS Panzer Div", sub: "Refitting · Sealing Arnhem" },
        "ger-ss10": { label: "10th SS Panzer Div", sub: "Rushing to Nijmegen" },
        "ger-1fj": { label: "1st Fallschirm Army", sub: "Student · Harassing Hwy 69" }
      }
    },
    {
      short: "Highway",
      tag: "Hell's Highway",
      name: "Hell's Highway & Arnhem Street Fight",
      date: "Sep 18 – Sep 19, 1944",
      intent: "Royal Engineers bridged Son overnight, enabling Guards Armored Division to link with US 82nd at Grave on Sep 19—yet 10th SS Panzer still blocked Nijmegen's Waal Bridge. At Arnhem, UK 1st Airborne's push to relieve Frost was shattered by SS armor and forced back toward Oosterbeek.",
      goal: "Clear Highway 69 to Nijmegen and break through to Arnhem",
      result: "Eindhoven freed and XXX Corps reached Nijmegen, but Arnhem relief attacks collapsed",
      markers: [
        { label: "Hell's Highway Clashes", desc: "Elevated single-lane Highway 69 faced repeated German flank raids trying to sever supply." },
        { label: "Gräbner's Charge Repulsed", desc: "Frost's paratroopers ambushed and burned 20+ SS armored vehicles charging across Arnhem Bridge." }
      ],
      detail: [
        ["Sep 18 AM", "Armored Charge Smashed", "Frost's men annihilated SS Capt. Gräbner's reconnaissance column attempting to rush Arnhem Bridge."],
        ["Sep 18 Night", "Eindhoven & Bailey Bridge", "XXX Corps liberated Eindhoven as engineers spanned the Wilhelmina Canal at Son overnight."],
        ["Sep 19 08:20", "Reached Nijmegen", "Guards Armored crossed Grave Bridge to Nijmegen, halted by 10th SS Panzer defending the Waal."],
        ["Sep 19", "Arnhem Push Fails", "Decimated by tanks and mortars in western Arnhem, UK 1st Airborne fell back into Oosterbeek."]
      ],
      formations: {
        "uk-30corps": { label: "XXX Corps Spearhead", sub: "Linked 82nd · Halted Waal" },
        "us-101": { label: "US 101st Airborne", sub: "Guarding Son – Veghel" },
        "us-82": { label: "US 82nd Airborne", sub: "Pressing Nijmegen Bridge" },
        "uk-1ab": { label: "UK 1st Airborne Main", sub: "Falling Back to Oosterbeek" },
        "uk-frost": { label: "Frost's 2nd Bn", sub: "Low Ammo · Isolated North" },
        "ger-ss9": { label: "9th SS Panzer Div", sub: "Encircling UK 1st Airborne" },
        "ger-ss10": { label: "10th SS Panzer Div", sub: "Holding Nijmegen Bridge" },
        "ger-1fj": { label: "German Flank Groups", sub: "Raiding Highway 69" }
      }
    },
    {
      short: "Waal",
      tag: "River Assault",
      name: "Waal Crossing & Fall of Arnhem Bridge",
      date: "Sep 20 – Sep 21, 1944",
      intent: "To take Nijmegen's giant Waal Bridge intact, US 82nd Airborne's 504th PIR paddled canvas boats across the swift river in broad daylight under withering fire, seizing the north ramp as British tanks charged across. Yet just 15 km north, Frost's ammunition ran dry and Arnhem Bridge fell.",
      goal: "Storm the Waal to seize Nijmegen Bridge and dash for Arnhem",
      result: "Nijmegen Bridge captured intact, but Arnhem Bridge fell as Polish paratroopers dropped late at Driel",
      markers: [
        { label: "Daylight Waal Crossing", desc: "US 504th PIR crossed under heavy fire in 26 canvas boats to take Nijmegen Bridge intact." },
        { label: "Arnhem Bridge Falls", desc: "After ~80 hours under tank fire, Frost's wounded remnant ran out of ammo and surrendered." },
        { label: "Polish Drop at Driel", desc: "Delayed two days by English fog, Sosabowski's Polish Brigade landed south of the Lower Rhine." }
      ],
      detail: [
        ["Sep 20 15:00", "Bloody Waal Crossing", "Paddling canvas boats through machine-gun and 20mm fire, US 504th PIR stormed the north bank."],
        ["Sep 20 Dusk", "Tanks Cross Nijmegen", "Guards Armored rushed across before charges blew, then stalled at dusk facing anti-tank screens near Elst."],
        ["Sep 21 AM", "North Bridge Lost", "German tanks demolished Frost's strongpoints house by house until the final rounds were spent."],
        ["Sep 21 PM", "Polish Brigade Drops", "Gen. Sosabowski's Polish paratroopers landed at Driel, stranded across the river without ferries."]
      ],
      formations: {
        "uk-30corps": { label: "Guards Armored Div", sub: "Across Waal · Blocked Elst" },
        "us-82": { label: "US 82nd Airborne", sub: "Took Nijmegen Bridge" },
        "pol-1ab": { label: "Polish 1st Para Bde", sub: "Dropped at Driel" },
        "uk-1ab": { label: "UK 1st Airborne", sub: "Trapped in Oosterbeek" },
        "ger-ss9": { label: "9th SS Panzer Div", sub: "Retook Bridge · Tightening" },
        "ger-ss10": { label: "10th SS Panzer Div", sub: "Anti-Tank Screen at Elst" }
      }
    },
    {
      short: "Berlin",
      tag: "Bridge Too Far",
      name: "Oosterbeek Stand & Operation Berlin",
      date: "Sep 22 – Sep 26, 1944",
      intent: "German counterattacks cut Hell's Highway at Veghel for hours; though XXX Corps reached Driel to join Polish troops, German firepower sealed the Lower Rhine's north bank. Montgomery ordered Operation Berlin: under driving rain and artillery cover on Sep 25–26, boats evacuated ~2,400 survivors south.",
      goal: "Evacuate surviving airborne troops from the Oosterbeek pocket",
      result: "~2,400 evacuated by night; UK 1st Airborne lost over 75%; Rhine barrier remained unbroken",
      markers: [
        { label: "Operation Berlin Retreat", desc: "Night of Sep 25–26: ~2,400 British and Polish survivors evacuated across the Lower Rhine in storm rain." },
        { label: "Highway Cut at Veghel", desc: "German strikes severed Highway 69 on Sep 22, halting XXX Corps fuel and ammo for two days." }
      ],
      detail: [
        ["Sep 22", "Black Friday at Veghel", "German battlegroups severed Highway 69, forcing US 101st and British armor into fierce reopening fights."],
        ["Sep 23–24", "Crossing Stalled", "Small Polish and Dorset detachments crossed to Oosterbeek, but north-bank fire prevented a bridgehead."],
        ["Sep 25 22:00", "Operation Berlin", "Under heavy rain and XXX Corps artillery barrages, assault boats ferried survivors south across the Rhine."],
        ["Sep 26 Dawn", "Operation Ends", "~2,400 escaped; UK 1st Airborne suffered 7,500+ casualties/POWs out of ~10,000, ending hopes of a 1944 victory."]
      ],
      formations: {
        "uk-1ab": { label: "UK 1st Survivors", sub: "~2,400 Evacuated by Boat" },
        "pol-1ab": { label: "Polish Bde · XXX Art.", sub: "Covering South Bank Driel" },
        "us-82": { label: "US 82nd Airborne", sub: "Holding Nijmegen Salient" },
        "us-101": { label: "US 101st Airborne", sub: "Reopened Veghel Corridor" },
        "ger-ss9": { label: "II SS Panzer Corps", sub: "Held Lower Rhine Line" },
        "ger-1fj": { label: "German Flank Groups", sub: "Salient Remained Intact" }
      }
    }
  ],
  commanders: {
    redLabel: "Allied Forces",
    redSub: "21st Army Group · 1st Allied Airborne Army",
    blueLabel: "German Wehrmacht",
    blueSub: "Army Group B · II SS Panzer Corps",
    red: [
      { name: "Bernard Montgomery", role: "21st Army Group Commander; conceived and championed Operation Market Garden" },
      { name: "Frederick Browning", role: "I Airborne Corps Commander; famously warned Arnhem might be 'a bridge too far'" },
      { name: "Brian Horrocks", role: "British XXX Corps Commander leading the armored sprint up Highway 69" },
      { name: "Roy Urquhart", role: "UK 1st Airborne Division Commander directing the desperate defense of Oosterbeek" },
      { name: "John Frost", role: "2nd Parachute Battalion Commander; held Arnhem Bridge's north end for nearly four days" },
      { name: "Taylor / Gavin", role: "Commanders of US 101st and 82nd Airborne securing Eindhoven and Nijmegen" },
      { name: "Stanisław Sosabowski", role: "Polish 1st Para Brigade Commander; questioned the plan, then dropped at Driel to help" }
    ],
    blue: [
      { name: "Walter Model", role: "Army Group B Commander; quartered in Oosterbeek by chance and rallied defenses immediately" },
      { name: "Wilhelm Bittrich", role: "II SS Panzer Corps Commander; swiftly sent 9th SS to Arnhem and 10th SS to Nijmegen" },
      { name: "Kurt Student", role: "1st Fallschirm Army Commander directing southern blocks and Highway 69 flank raids" },
      { name: "Harzer / Harmel", role: "Commanders of 9th and 10th SS Panzer Divisions refitting near Arnhem" },
      { name: "Viktor Gräbner", role: "9th SS Recon Commander killed leading an armored rush across Arnhem Bridge" }
    ]
  },
  orderOfBattle: {
    red: [
      ["UK 1st Airborne Division", "Maj. Gen. Roy Urquhart", "Dropped at Wolfheze tasked with seizing Arnhem Bridge"],
      ["Polish 1st Ind. Para Bde", "Maj. Gen. Stanisław Sosabowski", "Delayed by fog; dropped at Driel on the Lower Rhine south bank"],
      ["US 82nd Airborne Division", "Brig. Gen. James Gavin", "Seized Grave Bridge, Groesbeek Heights, and Nijmegen Bridge"],
      ["US 101st Airborne Division", "Maj. Gen. Maxwell Taylor", "Secured Eindhoven, Son, and Veghel along Hell's Highway"],
      ["British XXX Corps", "Lt. Gen. Brian Horrocks", "Armored spearhead driving 100 km north up Highway 69"],
      ["Allied Troop Carrier Cmd", "US & RAF Air Wings", "Delivered ~35,000 airborne troops and supplies across multiple lifts"]
    ],
    blue: [
      ["Army Group B HQ", "FM Walter Model", "Present in Oosterbeek on Sep 17; rapidly organized counter-measures"],
      ["II SS Panzer Corps", "Lt. Gen. Wilhelm Bittrich", "Directed 9th & 10th SS Panzer Divisions to seal Arnhem and Nijmegen"],
      ["9th SS Panzer 'Hohenstaufen'", "Walter Harzer", "Understrength yet armored; blocked and encircled UK 1st Airborne"],
      ["10th SS Panzer 'Frundsberg'", "Heinz Harmel", "Defended Nijmegen and blocked XXX Corps near Elst"],
      ["1st Fallschirm Army", "Gen. Kurt Student", "Formed ad-hoc Kampfgruppen raiding Hell's Highway from both flanks"]
    ]
  },
  situation: {
    eyebrow: "SEPTEMBER 1944 · GAMBLE TO END THE WAR",
    title: "A zero-margin gamble:<br />90% won, one bridge short.",
    narrative: "After liberating Paris in August 1944, Allied logistics stretched thin. Montgomery proposed concentrating supply on one narrow strike—Market Garden—to bounce the Rhine via five Dutch bridges and end the war before Christmas.",
    forceComparison: {
      red: {
        label: "Allied Forces (Airborne + XXX Corps)",
        count: "~41,600+",
        width: "100%",
        desc: "~35,000 US, British, and Polish airborne troops plus XXX Corps armor; constrained by a single-lane road and weather."
      },
      blue: {
        label: "German Counter-Forces",
        count: "~20,000–30,000",
        width: "66%",
        desc: "Ad-hoc battlegroups plus refitting 9th & 10th SS Panzer elements; used rivers, armor, and interior lines to choke every bridge."
      },
      note: "Note: Allied casualties reached ~15,000–17,000 (including 7,500+ in UK 1st Airborne); German losses were ~6,000–10,000."
    },
    deployments: {
      red: {
        title: "Allied Plan (Market + Garden)",
        subtitle: "Deep Drop · Single-Road Sprint",
        items: [
          ["Operation Market", "Three airborne divisions and the Polish Brigade laid a 100 km bridge carpet."],
          ["Operation Garden", "XXX Corps aimed to race up Highway 69 and reach Arnhem within 48 hours."],
          ["Multi-Day Airlifts", "Shortage of transports forced drops over three days instead of full Day-1 mass."],
          ["Radio Breakdown", "UK 1st Airborne sets failed in woods and towns, isolating units from HQ."]
        ]
      },
      blue: {
        title: "German Counter-Moves",
        subtitle: "Instant Block · Cut the Corridor",
        items: [
          ["Fateful Coincidence", "9th & 10th SS Panzer were refitting north of Arnhem—spotted by recon yet downplayed."],
          ["Model's Fast Reaction", "Within hours, Model deduced the target and ordered Bittrich to seal both big bridges."],
          ["Choking Hwy 69", "Blowing Son bridge and raiding Veghel repeatedly froze the armored column."],
          ["Armor vs. Light Infantry", "Tanks and self-propelled guns systematically crushed lightly armed paratroopers."]
        ]
      }
    }
  },
  logic: {
    sectionLabel: "Post-Mortem Analysis",
    eyebrow: "WHY ONE BRIDGE TOO FAR?",
    title: "When five bridges form a single chain,<br />one delay snaps the whole plan.",
    steps: [
      { roman: "I", title: "Intelligence Blind Spot", desc: "Dutch resistance and recon photos showed SS tanks near Arnhem, but optimism overrode warnings.", keyword: "Hubris" },
      { roman: "II", title: "Drop Zones Too Far", desc: "Fearing flak, UK 1st Airborne landed 11 km away with broken radios; only Frost's battalion reached the bridge.", keyword: "Friction" },
      { roman: "III", title: "Single-Road Bottleneck", desc: "With armor confined to raised two-lane Highway 69, every blown bridge or flank raid froze the entire corps.", keyword: "Bottleneck" },
      { roman: "IV", title: "Fog & Broken Supply", desc: "English fog delayed reinforcements and drops, leaving Oosterbeek starving while supplies fell to German lines.", keyword: "Weather" }
    ],
    decisionLoop: {
      eyebrow: "STRATEGIC TAKEAWAYS",
      title: "The bolder the stroke,<br />the more margin it needs for friction.",
      items: [
        ["01", "Serial Fragility", "Five sequential bridges meant zero tolerance for delay at any single river"],
        ["02", "Heed Dissent", "Ignoring recon that clashes with a favored plan invites catastrophe"],
        ["03", "Match Force to Role", "Light airborne troops excel at 48-hour coups, not week-long battles against tanks"],
        ["04", "Timely Extraction", "Operation Berlin salvaged ~2,400 veterans before total annihilation"]
      ]
    }
  },
  chronicle: {
    eyebrow: "SEP 17 – SEP 26, 1944",
    title: "Ten days of fire,<br />halted at the Rhine.",
    deck: "Click any event to return directly to that scene. Though the Rhine held, the Nijmegen salient freed much of southern Holland.",
    events: [
      { date: "Sep 17 PM", stage: "Market Launches", title: "~20,000 Allied paratroopers drop in daylight", desc: "US 101st, 82nd, and UK 1st Airborne landed as XXX Corps drove north from Joe's Bridge.", tag: "Daylight Drop", phaseIndex: 0 },
      { date: "Sep 17 Night", stage: "Arnhem North", title: "Frost's 2nd Battalion seizes north bridge", desc: "~740 paratroopers took Arnhem's north ramp as Son bridge blew and Model deployed SS panzers.", tag: "Isolated Hold", phaseIndex: 0 },
      { date: "Sep 18", stage: "Eindhoven", title: "XXX Corps frees Eindhoven; Son bridged overnight", desc: "Frost's men destroyed Gräbner's armored column attempting to rush Arnhem Bridge.", tag: "Hell's Hwy", phaseIndex: 1 },
      { date: "Sep 19", stage: "Nijmegen", title: "Guards reach Nijmegen; Arnhem relief fails", desc: "UK 1st Airborne was hammered in western Arnhem and pushed back into Oosterbeek.", tag: "Stalled", phaseIndex: 1 },
      { date: "Sep 20", stage: "Waal River", title: "US 82nd storms Waal in canvas boats", desc: "Heroic daylight assault captured Nijmegen Bridge intact—the last barrier before Arnhem.", tag: "Waal Crossing", phaseIndex: 2 },
      { date: "Sep 21", stage: "Bridge Lost", title: "Arnhem Bridge falls; Polish drop at Driel", desc: "Frost's garrison ran out of ammo; fog-delayed Polish troops landed across the river.", tag: "Bridge Too Far", phaseIndex: 2 },
      { date: "Sep 22–24", stage: "Corridor Fight", title: "Highway cut at Veghel; Rhine crossing fails", desc: "US 101st reopened the road, but Oosterbeek shrank under constant artillery and armor.", tag: "Siege", phaseIndex: 3 },
      { date: "Sep 25–26", stage: "Op. Berlin", title: "Stormy night evacuation ends Market Garden", desc: "~2,400 survivors escaped south; the European war extended into spring 1945.", tag: "Withdrawal", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "Imperial War Museums: Operation Market Garden", url: "https://www.iwm.org.uk/history/what-was-operation-market-garden" },
    { title: "US Army CMH: The Siegfried Line Campaign", url: "https://history.army.mil/html/books/007/7-7-1/index.html" },
    { title: "Britannica: Operation Market Garden", url: "https://www.britannica.com/event/Operation-Market-Garden" }
  ]
};
