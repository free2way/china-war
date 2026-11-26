// Sinai Counteroffensive / Operation Gazelle (Oct 6–24, 1973) — English Translation Overlay
export default {
  title: "Sinai Counteroffensive",
  subtitle: "Operation Gazelle · Birth of Modern Combined-Arms Warfare",
  period: "Oct 6 – Oct 24, 1973",
  era: "Yom Kippur War · Modern Combined Arms",
  seal: "SN",
  meta: {
    heroTitle: ["Sinai", "Counteroffensive"],
    eyebrow: ["OPERATION GAZELLE", "OCT 1973 · COMBINED ARMS"],
    deck: "From the disaster of pure-tank charges against missile shields to integrated infantry-armor-artillery-engineer breaches and ground raids that tore open the SAM umbrella for airpower.",
    facts: [
      ["DATE", "Oct 6–24, 1973"],
      ["THEATER", "Suez Canal & Sinai"],
      ["ARMOR", "3,000+ Tanks"]
    ],
    quote: '"On the modern missile battlefield, no single branch can survive alone; infantry, armor, artillery, engineers, and airpower must mesh as one system."',
    quoteAuthor: "Post-1973 Combined-Arms Doctrine Consensus",
    quoteMark: "CA",
    quoteDesc: "The Sinai campaign shattered the myth of pure-tank blitzkrieg and directly inspired US AirLand Battle and modern combined-arms brigades."
  },
  mapConfig: {
    scaleNote: "Suez Canal & Sinai Peninsula · Combined-Arms Tactical Schematic",
    filterSides: { all: "All Units", red: "Israel Defense Forces", blue: "Egyptian Armed Forces" },
    legends: [
      "IDF Combined-Arms Thrusts",
      "Egyptian Crossings & Attacks",
      "Suez Canal & Bitter Lakes"
    ]
  },
  regionLabels: {
    "埃及西岸": "Egypt (West Bank)",
    "西奈半岛": "Sinai Peninsula"
  },
  riverLabels: {
    "苏伊士运河": "Suez Canal",
    "苏伊士湾": "Gulf of Suez"
  },
  locations: {
    "塞得港": { name: "Port Said", sub: "Northern Mediterranean entrance to the Suez Canal" },
    "坎塔拉": { name: "Qantara", sub: "Northern canal sector stormed by Egyptian 18th Infantry Division" },
    "菲尔丹桥": { name: "Firdan Bridge", sub: "Site where IDF 190th Armored Brigade's unsupported tank charge was wiped out" },
    "伊斯梅利亚": { name: "Ismailia", sub: "Central canal west-bank hub and Egyptian 2nd Army rear anchor" },
    "中国农场": { name: "Chinese Farm", sub: "Former agricultural station; scene of brutal close-quarters fighting to open the crossing corridor" },
    "德维苏瓦": { name: "Deversoir", sub: "North tip of Great Bitter Lake at the seam of Egypt's 2nd & 3rd Armies; Operation Gazelle crossing site" },
    "大苦湖": { name: "Great Bitter Lake", sub: "Wide natural lake dividing Egyptian 2nd and 3rd Armies" },
    "法伊德": { name: "Fayid", sub: "West-bank airfield & SAM hub captured and turned into a forward IDF airhead" },
    "吉奈法高地": { name: "Geneifa Hills", sub: "High ground dense with SAM batteries overrun by Adan's 162nd Division" },
    "塔萨": { name: "Tasa", sub: "Key Sinai forward road junction and armored staging area" },
    "雷菲迪姆基地": { name: "Refidim (Bir Gifgafa)", sub: "IDF Sinai forward command center and airbase" },
    "吉迪山口": { name: "Gidi Pass", sub: "Northern mountain defile guarding central Sinai" },
    "米特拉山口": { name: "Mitla Pass", sub: "Southern mountain defile guarding central Sinai" },
    "苏伊士城": { name: "Suez City", sub: "Southern canal terminus and Egyptian 3rd Army rear anchor" },
    "阿达比亚港": { name: "Adabiya Port", sub: "Gulf of Suez port whose capture sealed the encirclement of Egypt's 3rd Army" },
    "101公里处": { name: "Kilometer 101", sub: "Milestone on the Cairo–Suez Highway; high-water mark & ceasefire talks site" }
  },
  phases: [
    {
      short: "Shock",
      tag: "Pure-Tank Failure",
      name: "Operation Badr · Pure-Tank Charges Repulsed",
      date: "Oct 6 – Oct 9, 1973",
      intent: "On October 6, Egyptian forces launched Operation Badr, blasting breaches through the Bar-Lev sand rampart with high-pressure water cannons and ferrying five infantry divisions across the Suez Canal. Sheltered beneath a dense west-bank SAM-2/3/6 umbrella, Egyptian infantry formed lethal AT-3 Sagger and RPG anti-tank webs. Overconfident in pure-tank doctrine, unsupported IDF armor counterattacked piecemeal and suffered devastating losses.",
      goal: "Egypt consolidates east-bank bridgeheads; IDF attempts pure-armor counterattacks",
      result: "IAF denied by SAM umbrella; 190th Armored Brigade mauled at Firdan, forcing IDF doctrinal reset",
      markers: [
        { label: "Water Cannons Breach Wall", desc: "Egyptian engineers Liquefied the Bar-Lev sand ramparts in hours with high-pressure water pumps, laying 10 pontoon bridges." },
        { label: "190th Brigade Destroyed", desc: "Charging without infantry or artillery smoke at Firdan on Oct 8, Israeli tanks were ambushed by Sagger ATGMs—losing 80+ tanks." }
      ],
      detail: [
        ["Oct 6 14:00", "Operation Badr Crosses Canal", "Behind 200 jets and 2,000 guns, Egyptian engineers breached the sand wall with water cannons and put 80,000 infantry ashore."],
        ["Oct 6–7", "SAM Umbrella Locks the Sky", "Interlocking SAM-2/3/6 batteries and ZSU-23-4 flak inflicted heavy losses on Israeli jets, halting close air support."],
        ["Oct 8", "Firdan Pure-Tank Disaster", "Charging without mechanized infantry or artillery suppression, IDF 190th Armored Brigade was shattered in minutes by Sagger teams."],
        ["Oct 9", "Halt & Combined-Arms Regroup", "IDF Southern Command halted unsupported charges, urgently pairing tanks with M113 infantry, self-propelled howitzers, and smoke."]
      ],
      formations: {
        "idf-hq": { label: "IDF Southern Cmd", sub: "Bar-Lev / Elazar HQ" },
        "idf-162": { label: "162nd Armored Div", sub: "Adan · Repulsed at Firdan" },
        "idf-143": { label: "143rd Armored Div", sub: "Sharon · Central Sector" },
        "idf-252": { label: "252nd Armored Div", sub: "Holding Pass Approaches" },
        "egy-2army": { label: "Egyptian 2nd Army", sub: "5 Divs · Sagger ATGM Web" },
        "egy-3army": { label: "Egyptian 3rd Army", sub: "Southern Canal Bridgehead" },
        "egy-sam": { label: "West Bank SAM Belt", sub: "SAM-2/3/6 Air Denial Dome" }
      }
    },
    {
      short: "Armor Clash",
      tag: "Lured Beyond SAMs",
      name: "Sinai Tank Battle · Spotting the Seam",
      date: "Oct 10 – Oct 14, 1973",
      intent: "To ease Israeli pressure on Syria, President Sadat overruled Gen. Shazly and ordered the Egyptian 21st and 4th Armored Divisions to lunge east toward the Sinai passes on October 14—advancing beyond their west-bank SAM umbrella. Waiting in hull-down sand ridges with newly airlifted TOW missiles and unrestricted air support, IDF divisions shattered the Egyptian spearheads while high-altitude reconnaissance pinpointed a fatal gap at Deversoir.",
      goal: "Destroy Egyptian armored reserves outside their SAM shield and locate a crossing seam",
      result: "~250 Egyptian tanks destroyed on Oct 14; seam between Egypt's 2nd & 3rd Armies locked at Deversoir",
      markers: [
        { label: "Oct 14 Sinai Tank Battle", desc: "Nearly 2,000 tanks clashed; stepping outside SAM cover cost Egypt ~250 tanks against hull-down IDF armor and air strikes." },
        { label: "Recon Spots Deversoir Seam", desc: "SR-71 & aerial recon confirmed the boundary gap between Egyptian 2nd and 3rd Armies at the north tip of Great Bitter Lake." }
      ],
      detail: [
        ["Oct 10–12", "Holding the Ridges & Airlift", "IDF stabilized along central Sinai ridges as US Operation Nickel Grass airlifted TOW anti-tank missiles and ammunition."],
        ["Oct 13", "SR-71 Spots Army Boundary Gap", "High-altitude reconnaissance confirmed Deversoir at Great Bitter Lake lay squarely on the thinly held 2nd–3rd Army seam."],
        ["Oct 14 AM", "Egyptian Armor Leaves SAM Cover", "Egyptian 21st and 4th Armored Divisions advanced east in four thrusts, outrunning their protective west-bank SAM umbrella."],
        ["Oct 14 PM", "Largest Tank Clash Since Kursk", "Combined hull-down tank gunnery, TOW teams, and Skyhawks destroyed ~250 Egyptian tanks for minimal IDF loss, flipping momentum."]
      ],
      formations: {
        "idf-hq": { label: "IDF Southern Cmd", sub: "Finalizing Op. Gazelle" },
        "idf-162": { label: "162nd Armored Div", sub: "Adan · Staged to Exploit" },
        "idf-143": { label: "143rd Armored Div", sub: "Sharon · Crushes 21st Div" },
        "idf-252": { label: "252nd Armored Div", sub: "Guarding Gidi & Mitla" },
        "egy-21ar": { label: "Egyptian 21st Armored", sub: "Mauled Beyond SAM Cover" },
        "egy-4ar": { label: "Egyptian 4th Armored", sub: "Halted Before Mitla Pass" },
        "egy-2army": { label: "Egyptian 2nd Army", sub: "Northern Bridgehead" },
        "egy-3army": { label: "Egyptian 3rd Army", sub: "Southern Bridgehead" },
        "egy-sam": { label: "West Bank SAM Belt", sub: "Outranged by East Push" }
      }
    },
    {
      short: "Gazelle",
      tag: "Combined-Arms Breach",
      name: "Operation Gazelle · Chinese Farm & Bridging",
      date: "Night of Oct 15 – Oct 17, 1973",
      intent: "On the night of October 15, IDF launched Operation Gazelle. Sharon's 143rd Division pinned Ismailia while threading the 247th Paratroop Brigade to Deversoir in rubber dinghies. When Egyptian 16th Division troops choked the narrow supply road at 'Chinese Farm', IDF unleashed full combined-arms warfare: heavy artillery smoke and HE barrages blinded ATGM gunners, paratroopers cleared trenches at bayonet range, and combat engineers towed a 180-ton roller bridge into place under fire.",
      goal: "Clear the Chinese Farm corridor and bridge heavy armor onto the West Bank",
      result: "Infantry-armor-artillery-engineer teamwork opened two bridges; Sharon and Adan crossed into Africa",
      markers: [
        { label: "Battle of Chinese Farm", desc: "48 hours of brutal night combat: artillery barrages, paratroopers, and tanks worked together to clear dense anti-tank trenches." },
        { label: "Bridging at Deversoir", desc: "Under shellfire, combat engineers emplaced pontoon and roller bridges, passing Adan's 162nd Armored Division west." }
      ],
      detail: [
        ["Oct 15 Night", "247th Paratroops Cross West", "While Sharon fixed Tasa, Col. Danny Matt's paratroopers paddled across Deversoir in rubber boats, securing a west-bank foothold."],
        ["Oct 16", "Fierce Fight at Chinese Farm", "With the access road ambushed at Chinese Farm, IDF brought in 35th Paratroopers and massed howitzers to clear ATGM nests trench by trench."],
        ["Oct 17 AM", "Pontoon & Roller Bridges Laid", "Shielded by combined infantry-armor perimeters, engineers floated both the pontoon bridge and the giant roller bridge."],
        ["Oct 17 Night", "25th Brigade Ambush & Crossing", "Adan's 162nd Division wiped out the relieving Egyptian 25th Independent T-62 Brigade along Great Bitter Lake, then rolled west across the canal!"]
      ],
      formations: {
        "idf-143": { label: "143rd Armored Div", sub: "Sharon · West Bank Bridgehead" },
        "idf-para": { label: "247th & 35th Paratroops", sub: "Trench Clearing & Bridge Guard" },
        "idf-162": { label: "162nd Armored Div", sub: "Adan · Crossing Roller Bridge" },
        "idf-252": { label: "252nd Armored Div", sub: "Magen · Securing East Corridor" },
        "egy-16inf": { label: "Egyptian 16th/21st Divs", sub: "Fierce Defense at Chinese Farm" },
        "egy-25bde": { label: "Egyptian 25th Armored Bde", sub: "Ambushed Along Bitter Lake" },
        "egy-2army": { label: "Egyptian 2nd Army", sub: "Pinned in Northern Sector" },
        "egy-3army": { label: "Egyptian 3rd Army", sub: "Holding Southern East Bank" },
        "egy-sam": { label: "West Bank SAM Sites", sub: "Now Exposed to Ground Raid" }
      }
    },
    {
      short: "SAM Hunt",
      tag: "Ground Opens Sky",
      name: "Ground Raids Tear the SAM Net · Encircling 3rd Army",
      date: "Oct 18 – Oct 24, 1973",
      intent: "Once across the Suez Canal, IDF executed a textbook reversal of modern combined arms: ground forces opened the sky for the Air Force! Adan's 162nd, Magen's 252nd, and Sharon's 143rd Divisions fanned out across the West Bank, overrunning dozens of Egyptian SAM-2/3/6 batteries around Fayid and Geneifa. Pouring through the gap in the air-defense dome, the Israeli Air Force regained air supremacy and covered Adan's southward drive to Adabiya Port—completely trapping Egypt's 3rd Army.",
      goal: "Destroy west-bank SAM batteries by ground raid to unleash airpower and sever 3rd Army's lifelines",
      result: "SAM dome shattered; IDF cut the Cairo–Suez road at Km 101 and encircled ~30,000 Egyptian troops",
      markers: [
        { label: "Ground Raids Smash SAM Belt", desc: "Armored task forces overran SAM-2/3/6 sites directly on the ground, tearing open an air corridor for the Israeli Air Force!" },
        { label: "Adabiya Taken · 3rd Army Trapped", desc: "Adan reached Gulf of Suez at Adabiya and severed the Cairo–Suez road, encircling ~30,000 troops of Egypt's 3rd Army." }
      ],
      detail: [
        ["Oct 18–19", "Armored Task Forces Hunt SAMs", "Sharon pressed toward Ismailia while Adan stormed Fayid airfield and the Geneifa Hills, knocking out SAM batteries one by one."],
        ["Oct 19–20", "Sky Reopened · IAF Swarms In", "With the missile umbrella torn open from below, Mirages and Phantoms surged over the West Bank, winning dogfights and flying close support."],
        ["Oct 21–22", "Southward Blitz Cuts Cairo Road", "Backed by Magen's 252nd Division on the flank and overhead air cover, Adan swept south and severed the main Cairo–Suez highway."],
        ["Oct 23–24", "Adabiya Seized · Ceasefire at Km 101", "IDF captured Adabiya Port on the Gulf of Suez, sealing the Egyptian 3rd Army pocket and halting just 101 km from Cairo."]
      ],
      formations: {
        "idf-143": { label: "143rd Armored Div", sub: "Sharon · South of Ismailia" },
        "idf-252": { label: "252nd Armored Div", sub: "Magen · Geneifa to Km 101" },
        "idf-162": { label: "162nd Armored Div", sub: "Adan · Seals Adabiya Pocket" },
        "idf-iaf": { label: "Israeli Air Force Wing", sub: "Flying Through Torn SAM Gap" },
        "egy-2army": { label: "Egyptian 2nd Army", sub: "Defending Ismailia Approaches" },
        "egy-3army": { label: "Egyptian 3rd Army (Cut Off)", sub: "~30,000 Encircled on East Bank" },
        "egy-cairo": { label: "Cairo Defense Force", sub: "Blocking Line at Km 101" }
      }
    }
  ],
  commanders: {
    redLabel: "Israel Defense Forces",
    redSub: "Southern Command · Combined-Arms Task Forces",
    blueLabel: "Egyptian Armed Forces",
    blueSub: "General Staff · 2nd & 3rd Field Armies",
    red: [
      { name: "Lt. Gen. David Elazar", role: "IDF Chief of Staff; steadied the front and greenlit Operation Gazelle" },
      { name: "Lt. Gen. Chaim Bar-Lev", role: "Special Southern Front Commander; restored operational discipline in Sinai" },
      { name: "Maj. Gen. Ariel Sharon", role: "143rd Armored Division Commander; pierced the seam and led the initial canal crossing" },
      { name: "Maj. Gen. Avraham Adan", role: "162nd Armored Division Commander; led west-bank SAM raids and encircled 3rd Army" },
      { name: "Maj. Gen. Kalman Magen", role: "252nd Armored Division Commander; expanded the west-bank flank toward Km 101" },
      { name: "Maj. Gen. Benny Peled", role: "IAF Commander; surged airpower through the SAM corridor opened by ground forces" }
    ],
    blue: [
      { name: "Anwar Sadat", role: "President of Egypt; launched the war and ordered the risky Oct 14 eastward push" },
      { name: "Gen. Ahmad Ismail Ali", role: "Minister of War & Commander-in-Chief; directed the two-front strategic surprise" },
      { name: "Lt. Gen. Saad el-Shazly", role: "Chief of Staff; architect of Operation Badr, water-cannon breaches & the SAM-ATGM shield" },
      { name: "Maj. Gen. Abdel Ghani el-Gamasy", role: "Director of Operations; planned exact canal tides and H-Hour timing" },
      { name: "Maj. Gen. Mamoun / Khalil", role: "2nd Field Army Commanders; held northern canal bridgehead and Ismailia" },
      { name: "Maj. Gen. Abdel Moneim Wassel", role: "3rd Field Army Commander; crossed southern canal before being encircled on east bank" }
    ]
  },
  orderOfBattle: {
    red: [
      ["IDF Southern Command", "Bar-Lev / Gonen", "Directed Sinai defense reorganization and Operation Gazelle"],
      ["143rd Armored Division", "Ariel Sharon", "3 armored brigades + 247th Paratroop Bde; spearheaded the Deversoir crossing"],
      ["162nd Armored Division", "Avraham Adan", "3 armored brigades; exploited across roller bridge to smash SAMs and encircle 3rd Army"],
      ["252nd Armored Division", "Mandler (KIA) / Magen", "Held Sinai passes, then crossed west to drive toward Kilometer 101"],
      ["Paratroop & Bridging Task Force", "247th & 35th Para + Engineers", "Cleared Chinese Farm trenches by night and towed the 180-ton roller bridge"],
      ["Israeli Air Force (IAF)", "Benny Peled", "Regained air superiority once ground raids tore open the west-bank SAM belt"]
    ],
    blue: [
      ["Egyptian General Staff", "Ismail / Shazly / Gamasy", "Masterminded Operation Badr and the integrated SAM-ATGM defensive umbrella"],
      ["2nd Field Army", "Mamoun / Khalil", "5 divisions across northern canal; repulsed early unsupported IDF tank charges"],
      ["3rd Field Army", "Abdel Moneim Wassel", "Held southern canal east bank; ~30,000 troops encircled by ceasefire"],
      ["21st & 4th Armored Divisions", "Mobile Armored Reserves", "Ordered east beyond SAM cover on Oct 14, suffering heavy tank losses"],
      ["Air Defense Command", "SAM-2 / 3 / 6 & ZSU-23-4", "Locked Suez airspace until overrun by IDF armored raids on the West Bank"],
      ["16th Infantry Div & 25th Armored Bde", "Corridor & Bitter Lake Forces", "Fought fiercely at Chinese Farm; 25th T-62 Brigade destroyed in Bitter Lake ambush"]
    ]
  },
  situation: {
    eyebrow: "OCTOBER 1973 · MISSILE SHIELD VS. COMBINED ARMS",
    title: "When SAMs and ATGMs locked the front,<br />only combined arms could tear the net.",
    deck: "In the opening 72 hours, Egypt's integrated SAM umbrella and infantry Sagger missiles paralyzed both the Israeli Air Force and pure-tank brigades. Victory came only when IDF fused artillery smoke, mechanized infantry, engineers, armor, and airpower into a mutually enabling loop.",
    forces: {
      red: {
        label: "IDF Sinai Front Peak",
        count: "3 Armored Divs (~800 Tanks)",
        width: "48%",
        desc: "Initially thin and overly reliant on pure tank charges; rapidly reorganized into balanced task forces pairing tanks with M113 infantry, howitzers, and bridging engineers."
      },
      blue: {
        label: "Egyptian Campaign Force",
        count: "2 Field Armies (~200k · ~1,700 Tanks)",
        width: "100%",
        desc: "Brilliant canal-crossing engineering and world-leading SAM/ATGM integration, but vulnerable once armor stepped outside its fixed missile umbrella."
      },
      note: "Note: Force figures reflect Sinai theater peaks, excluding the Syrian Golan Heights front."
    },
    deployments: {
      red: {
        title: "IDF Combined-Arms Pivot",
        subtitle: "SUPPRESS · PIERCE · HUNT SAMS · ENCIRCLE",
        items: [
          ["Infantry-Armor-Artillery Mesh", "Howitzer smoke blinded ATGM teams, infantry cleared trenches, engineers bridged, armor exploited."],
          ["Intelligence-Led Seam Strike", "SR-71 recon pinpointed the boundary gap between Egypt's 2nd and 3rd Armies at Deversoir."],
          ["Ground Raids Unlock Airpower", "West-bank tank columns hunted SAM batteries directly, opening safe corridors for jets."],
          ["Air–Ground Encirclement", "With IAF back overhead, 162nd Division raced to Adabiya to trap the Egyptian 3rd Army."]
        ]
      },
      blue: {
        title: "Egyptian Integrated Shield",
        subtitle: "WATER CANNONS · SAM DOME · ATGM WEB",
        items: [
          ["Hydraulic Breaching", "High-pressure water pumps washed open towering Bar-Lev sand ramparts in hours."],
          ["Layered SAM Umbrella", "Overlapping SAM-2, SAM-3, and mobile SAM-6 batteries denied Suez airspace."],
          ["Infantry Anti-Tank Web", "Dense Sagger wire-guided missiles and RPGs punished unsupported tank charges."],
          ["Fatal Overreach", "The Oct 14 political order pushed armor east beyond SAM cover while leaving the Deversoir seam exposed."]
        ]
      }
    }
  },
  logic: {
    eyebrow: "FOUR PILLARS OF MODERN COMBINED ARMS",
    title: "The era of single-branch dominance ended;<br />integrated systems took command.",
    steps: [
      { roman: "I", title: "End Pure-Tank Dogma · Rebuild Combined Arms", desc: "Firdan proved unsupported tanks cannot survive modern ATGM webs. IDF rapidly restored artillery smoke suppression, dismounted infantry clearing, and armor mutual support.", keyword: "Synergy" },
      { roman: "II", title: "Draw Out the Enemy · Fight Beyond the SAM Dome", desc: "Holding Sinai ridges forced Egyptian armor to step east beyond west-bank SAM protection on Oct 14, where hull-down tanks, TOWs, and jets decimated them.", keyword: "Counter" },
      { roman: "III", title: "Recon-Guided Thrust · Pierce the Army Seam", desc: "Aerial intelligence located the unguarded boundary between Egypt's 2nd and 3rd Armies at Great Bitter Lake, enabling the Deversoir crossing.", keyword: "Seam" },
      { roman: "IV", title: "Reverse Enablement · Army Opens the Sky for Air", desc: "Flipping WWII orthodoxy: armored raids destroyed west-bank SAM batteries from the ground so jets could surge back in to seal the encirclement.", keyword: "Loop" }
    ],
    decisionLoop: {
      eyebrow: "FOUR TURNING POINTS THAT RESHAPED DOCTRINE",
      title: "From shock defeat to strategic encirclement:<br />18 days that birthed AirLand Battle.",
      items: [
        ["01", "Halt Solo Charges", "Oct 9 order stopped pure-tank attacks and forged balanced combined-arms task forces under fire"],
        ["02", "Ridge Ambush", "Oct 14 hull-down defense crushed two Egyptian armored divisions outside their SAM umbrella"],
        ["03", "Chinese Farm Grit", "Night infantry-artillery-engineer combat cleared the corridor to float the roller bridge"],
        ["04", "SAM Hunt & Pocket", "Ground raids tore open the SAM belt, letting air–ground forces trap Egypt's 3rd Army"]
      ]
    }
  },
  chronicle: {
    eyebrow: "OCT 6 – OCT 24, 1973",
    title: "18 days & nights,<br />forging modern combined warfare.",
    deck: "Click any event to return directly to that scene.",
    events: [
      { date: "Oct 6 14:00", stage: "Op. Badr", title: "Water cannons breach Bar-Lev wall; SAM umbrella locks sky", desc: "Five Egyptian infantry divisions stormed across the Suez Canal behind an impenetrable SAM and ATGM shield.", tag: "Surprise", phaseIndex: 0 },
      { date: "Oct 8", stage: "Firdan Shock", title: "IDF 190th Armored Brigade's pure-tank charge wiped out", desc: "Attacking without infantry or artillery suppression into Sagger missiles became history's classic anti-combined-arms lesson.", tag: "Hard Lesson", phaseIndex: 0 },
      { date: "Oct 13", stage: "Aerial Recon", title: "SR-71 pinpoints the 2nd–3rd Army seam at Deversoir", desc: "High-altitude photography revealed the thinly guarded boundary at the north tip of Great Bitter Lake.", tag: "The Seam", phaseIndex: 1 },
      { date: "Oct 14", stage: "Sinai Tank Clash", title: "Egyptian armor advances beyond SAM cover, losing ~250 tanks", desc: "The largest tank battle since Kursk decisively shifted operational initiative to Israel.", tag: "Reversal", phaseIndex: 1 },
      { date: "Oct 15–17", stage: "Op. Gazelle", title: "Battle of Chinese Farm clears way for Deversoir roller bridge", desc: "Infantry, artillery, engineers, and armor fought together to bridge two armored divisions onto the West Bank.", tag: "Combined Arms", phaseIndex: 2 },
      { date: "Oct 18–20", stage: "Air–Ground Loop", title: "Ground raids smash SAM batteries; IAF reclaims the sky", desc: "Armored columns destroyed dozens of west-bank missile sites, opening safe corridors for Israeli jets.", tag: "Ground Opens Sky", phaseIndex: 3 },
      { date: "Oct 23–24", stage: "Encirclement", title: "Adabiya captured, trapping 3rd Army; ceasefire at Km 101", desc: "Cutting the Cairo–Suez road isolated ~30,000 Egyptian troops on the east bank as superpower diplomacy halted fighting.", tag: "Ceasefire", phaseIndex: 3 },
      { date: "1978 → 1982", stage: "Legacy", title: "Camp David Accords & US AirLand Battle revolution", desc: "Led to Egypt–Israel peace and directly inspired the US Army's FM 100-5 AirLand Battle combined-arms doctrine.", tag: "Aftermath", phaseIndex: 3, isOutcome: true }
    ]
  },
  sources: [
    { title: "US Army CSI: The 1973 Arab-Israeli War", url: "https://www.armyupress.army.mil/Portals/7/combat-studies-institute/csi-books/leavenworth-papers-21-the-1973-arab-israeli-war.pdf" },
    { title: "Britannica: Yom Kippur War", url: "https://www.britannica.com/event/Yom-Kippur-War" },
    { title: "CIA Historical Review: 1973 Sinai Campaign", url: "https://www.cia.gov/readingroom/" }
  ]
};
