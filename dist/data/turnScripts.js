// 战史沙盘 · 手工精编历史回合剧本（纪录片级分步调度 + 中英文解说词 + 关键转折字幕卡）
// 每个阶段按真实史实先后拆分为 4 个回合，精确指定：
// - actor: "red"（我方行动）| "blue"（敌方动向）| "clash"（双方交锋）
// - focusUnits: 本回合真正参战/移动的部队 ID（其余部队自动呼吸收拢为极简战术圆点）
// - focusPlaces: 本回合核心地标（原始中文名，渲染时自动适配英文）
// - redSegment: [startFrac, endFrac] 或 redSubpaths: [subIdx...]，null 表示本回合我方按兵不动
// - enemyIndices: 本回合启动的敌方箭头索引
// - markerIndices: 本回合爆发的关键战事标记索引
// - sfx: "march" | "clash" | "fire" | "victory"
// - banner: 关键转折回合弹出的电影级战报横幅（zh / en）
// - narration: 适合浑厚磁性纪录片男声播报的中英文解说词

export const TURN_SCRIPTS = {
  /* ==================== 官渡之战 (公元200年) ==================== */
  "guandu-200": {
    "baima-yanjin": [
      {
        actor: "blue",
        focusUnits: ["yuan-main", "yuan-van"],
        focusPlaces: ["黎阳", "白马"],
        redSegment: null,
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "建安五年二月，袁绍进军黎阳，遣河北猛将颜良渡过黄河，重兵围攻白马，中原大战由此拉开帷幕。",
          en: "In February 200 AD, Yuan Shao advances to Liyang and dispatches his fierce vanguard general Yan Liang across the Yellow River to besiege Baima."
        }
      },
      {
        actor: "red",
        focusUnits: ["cao-main", "cao-west", "yuan-main"],
        focusPlaces: ["官渡", "延津", "黎阳"],
        redSegment: [0, 0.45],
        enemyIndices: [0],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "曹操采纳荀攸声东击西之计，主力佯向延津做出渡河袭后之势，成功诱使袁绍分兵西向应敌。",
          en: "Following Xun You's stratagem, Cao Cao feints a river crossing west at Yanjin, drawing Yuan Shao to split his forces westward."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-main", "cao-vanguard", "yuan-van"],
        focusPlaces: ["白马"],
        redSegment: [0.42, 1.0],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "建安五年 · 四月 · 声东击西", title: "白马解围 · 关羽斩颜良", sub: "轻骑突袭万众之中，首挫袁军渡河锋芒" },
          en: { kicker: "APRIL 200 AD · FEINT & STRIKE", title: "BAIMA RELIEVED · YAN LIANG SLAIN", sub: "Guan Yu charges through enemy ranks to shatter Yuan Shao's vanguard" }
        },
        narration: {
          zh: "趁袁军西调之际，曹操轻骑兼行急趋白马。关羽策马冲入万众之中刺杀颜良，一举解除白马之围。",
          en: "Racing east to Baima with light cavalry, Cao Cao unleashes Zhang Liao and Guan Yu—who charges through the ranks and slays Yan Liang."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-main", "cao-west", "yuan-cav"],
        focusPlaces: ["延津"],
        redSegment: null,
        enemyIndices: [0],
        markerIndices: [1],
        sfx: "victory",
        narration: {
          zh: "曹军西撤延津南坂，故意委弃辎重诱敌。文丑骑兵争抢阵乱，曹操仅以不满六百骑纵击破之，再斩文丑。",
          en: "Withdrawing along the river, Cao Cao scatters baggage wagons as bait at Yanjin. As Wen Chou's cavalry breaks ranks to plunder, fewer than six hundred horsemen countercharge and slay him."
        }
      }
    ],
    "guandu-stalemate": [
      {
        actor: "blue",
        focusUnits: ["yuan-main", "cao-main"],
        focusPlaces: ["阳武", "官渡"],
        redSegment: null,
        enemyIndices: [0, 2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "建安五年八月，袁绍主力全线渡河，依沙堆连营东西数十里，对扼守官渡的曹军形成泰山压顶之势。",
          en: "By August, Yuan Shao's main army spans miles of fortified sand-dune camps, pressing down upon Cao Cao's outnumbered ramparts at Guandu."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-main", "cao-catapult", "yuan-tower", "yuan-main"],
        focusPlaces: ["官渡"],
        redSegment: null,
        enemyIndices: [1],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "袁军堆起土山高橹俯射曹营，曹操立造发石车将其尽数击毁，袁军惊骇，称之为霹雳车。",
          en: "Yuan troops erect towering arrow platforms over Cao's camp. Cao Cao answers with traction catapults—dubbed Thunderbolt Carts—smashing every siege tower."
        }
      },
      {
        actor: "blue",
        focusUnits: ["yuan-main", "cao-main", "cao-xu"],
        focusPlaces: ["官渡", "许都"],
        redSegment: null,
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "相持日久，曹军粮草告急，曹操致书许都议退。荀彧力谏：公以至弱当至强，扼其喉而不得进，情见势竭，必将有变。",
          en: "Low on grain and exhausted, Cao Cao writes to Xuchang considering retreat. Xun Yu urges him to hold the throat of the plains—the overextended foe will soon crack."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-raid", "yuan-supply", "yuan-wuchao"],
        focusPlaces: ["故市", "乌巢"],
        redSegment: [0, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "fire",
        banner: {
          zh: { kicker: "建安五年 · 九月 · 截断粮道", title: "徐晃奇袭 · 故市焚粮", sub: "烧毁袁军运粮车队，直指十万大军补给软肋" },
          en: { kicker: "SEPTEMBER 200 AD · LOGISTICS STRIKE", title: "CONVOY BURNED AT GUSHI", sub: "Xu Huang raids Yuan Shao's grain wagons, exposing the giant army's lifeline" }
        },
        narration: {
          zh: "曹操坚定死守之志，旋即派遣徐晃、史涣轻骑出击，在故市截杀韩猛运粮车队，将袁军大批军粮付之一炬。",
          en: "Steeled to hold fast, Cao Cao dispatches Xu Huang and Shi Huan to ambush Han Meng's convoy at Gushi, putting thousands of Yuan grain carts to the torch."
        }
      }
    ],
    "wuchao-raid": [
      {
        actor: "red",
        focusUnits: ["cao-xuyou", "cao-defense", "yuan-wuchao"],
        focusPlaces: ["官渡", "乌巢"],
        redSegment: [0, 0.28],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "建安五年十月，袁绍谋士许攸连夜奔曹，曹操跣足出迎。许攸一语道破天机：袁军万余车军粮尽囤于乌巢，守备空虚。",
          en: "In October, alienated strategist Xu You defects by night. Greeting him barefoot, Cao Cao learns Yuan Shao's entire grain reserve sits lightly guarded at Wuchao."
        }
      },
      {
        actor: "red",
        focusUnits: ["cao-main", "cao-defense"],
        focusPlaces: ["官渡", "乌巢"],
        redSegment: [0.25, 0.72],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "曹操留曹洪守营，亲率五千步骑，皆打袁军旗号，人衔枚、马缚口，抱薪从小道昼夜兼程潜向乌巢。",
          en: "Leaving Cao Hong to hold Guandu, Cao Cao personally leads five thousand disguised raiders carrying bundles of firewood through dark back trails toward Wuchao."
        }
      },
      {
        actor: "blue",
        focusUnits: ["yuan-main", "yuan-assault", "cao-defense"],
        focusPlaces: ["阳武", "官渡"],
        redSegment: null,
        enemyIndices: [0, 1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "袁绍闻报却未采纳张郃全力救粮之议，仅派轻骑驰援乌巢，反命张郃、高览重兵强攻官渡曹营。",
          en: "Hearing of the raid, Yuan Shao rejects Zhang He's plea to save Wuchao—sending only light cavalry to relieve the depot while throwing heavy troops at Cao's camp."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-main", "yuan-wuchao"],
        focusPlaces: ["乌巢"],
        redSegment: [0.70, 1.0],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "fire",
        banner: {
          zh: { kicker: "建安五年 · 十月 · 决胜奇袭", title: "夜袭乌巢 · 焚尽袁粮", sub: "五千步骑死战斩淳于琼，十万袁军命脉一夜断绝" },
          en: { kicker: "OCTOBER 200 AD · DECISIVE RAID", title: "NIGHT RAID ON WUCHAO", sub: "5,000 raiders slay Chunyu Qiong and incinerate Yuan Shao's grain depot" }
        },
        narration: {
          zh: "面对背后来援的袁骑，曹操厉声下令死战不退！曹军攻破乌巢，阵斩淳于琼，冲天大火燃尽袁军全部粮草。",
          en: "Refusing to turn even as Yuan relief riders close from behind, Cao Cao storms Wuchao, slays Chunyu Qiong, and turns the granaries into a roaring inferno."
        }
      }
    ],
    "rout": [
      {
        actor: "clash",
        focusUnits: ["cao-defector", "cao-defense"],
        focusPlaces: ["官渡"],
        redSegment: [0, 0.25],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "建安五年 · 十月 · 军心崩塌", title: "张郃、高览阵前降曹", sub: "攻营不下反遭谗言，袁军主战大将焚毁攻具归降" },
          en: { kicker: "OCTOBER 200 AD · COLLAPSE", title: "ZHANG HE & GAO LAN DEFECT", sub: "Slandered after Wuchao's fall, Yuan's assault generals burn their engines and join Cao Cao" }
        },
        narration: {
          zh: "张郃、高览攻营不下，听闻乌巢被焚又遭郭图谗言构陷，愤而烧毁攻城器械，当阵归降曹洪。",
          en: "Blocked at Cao's ramparts and slandered by Guo Tu after Wuchao falls, generals Zhang He and Gao Lan burn their siege engines and surrender to Cao Hong."
        }
      },
      {
        actor: "blue",
        focusUnits: ["yuan-main", "yuan-remnant"],
        focusPlaces: ["官渡", "黎阳"],
        redSegment: null,
        enemyIndices: [0, 1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "粮尽将降的消息传开，十万袁军瞬间土崩瓦解。袁绍与长子袁谭来不及穿戴甲胄，仅率八百骑仓皇渡河北逃。",
          en: "Panic sweeps the starving ranks. Yuan Shao and his son Yuan Tan abandon their host and flee north across the Yellow River with barely eight hundred horsemen."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cao-main", "yuan-remnant", "yuan-jushou"],
        focusPlaces: ["黎阳", "邺城"],
        redSegment: [0.22, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "victory",
        narration: {
          zh: "曹操挥师全线追击，尽收袁军辎重图书珍宝，俘获忠臣沮授，北方霸权至此彻底易手。",
          en: "Cao Cao drives north in general pursuit, capturing vast spoils and strategist Ju Shou as hegemony over Northern China passes to his hands."
        }
      },
      {
        actor: "red",
        focusUnits: ["cao-main", "cao-xu"],
        focusPlaces: ["官渡", "许都"],
        redSegment: null,
        enemyIndices: [],
        markerIndices: [],
        sfx: "victory",
        narration: {
          zh: "战后曹操搜出麾下与袁绍暗通款曲的书信，竟当众全部焚毁，一句“当绍之强，孤犹不能自保”，瞬间安抚天下人心。",
          en: "Discovering secret letters from his own officers to Yuan Shao, Cao Cao burns them unread—declaring that even he doubted survival—instantly uniting his followers."
        }
      }
    ]
  },

  /* ==================== 四渡赤水 (1935年) ==================== */
  "chishui-1935": {
    "first-crossing": [
      {
        actor: "clash",
        focusUnits: ["red-3", "red-5", "sichuan"],
        focusPlaces: ["遵义", "土城"],
        redSegment: [0, 0.34],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "1935年1月28日，红军在土城青杠坡与川军郭勋祺部激战。敌情陡增且援军源源不断，正面硬拼已失战机。",
          en: "On January 28, 1935, fierce combat erupts at Qinggangpo near Tucheng as Sichuan reinforcements exceed intelligence estimates."
        }
      },
      {
        actor: "blue",
        focusUnits: ["sichuan", "central-zhou", "yunnan"],
        focusPlaces: ["土城", "遵义", "扎西"],
        redSegment: null,
        enemyIndices: [1, 2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "与此同时，中央军周浑元纵队由东向西压迫，滇军孙渡部自南逼近扎西，数十万大军正迅速收紧合围圈。",
          en: "Simultaneously, Central Army columns press from the east while Yunnan divisions close from the south, tightening a multi-province ring."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-command", "red-1", "red-3", "red-5", "red-9"],
        focusPlaces: ["土城", "元厚", "古蔺"],
        redSegment: [0.32, 0.72],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "当夜军委果断决策撤出战斗，红军主力由土城、元厚分路西渡赤水河，主动放弃原定北渡计划以保存主力。",
          en: "Refusing a losing battle of attrition, the Red Army disengages overnight and crosses west over the Chishui at Tucheng and Yuanhou."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-command", "red-1", "red-5"],
        focusPlaces: ["叙永", "石厢子", "扎西"],
        redSegment: [0.70, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "victory",
        banner: {
          zh: { kicker: "1935年2月 · 一渡赤水", title: "摆脱被动 · 扎西整编", sub: "主力转入川滇黔边精简缩编，重夺战略机动自由" },
          en: { kicker: "FEBRUARY 1935 · 1ST CROSSING", title: "DISENGAGED · ZHAXI REORGANIZATION", sub: "Streamlined into 16 mobile regiments in the borderlands to regain initiative" }
        },
        narration: {
          zh: "红军转入川滇黔边扎西地区召开整编会议，精简缩编为十六个轻装团，为下一记回马枪蓄足锋芒。",
          en: "Regrouping at Zhaxi, the Red Army streamlines into sixteen agile regiments—poised for a sudden strategic reversal."
        }
      }
    ],
    "second-crossing": [
      {
        actor: "red",
        focusUnits: ["red-command", "red-3", "red-9"],
        focusPlaces: ["扎西", "太平渡", "二郎滩"],
        redSegment: [0, 0.44],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "敌军重兵正扑向扎西之际，中央红军突然掉头东进，由太平渡、二郎滩秘密二渡赤水，令滇军扑空。",
          en: "As KMT columns converge on Zhaxi, the Red Army abruptly pivots east, recrossing the Chishui at Taiping and Erlangtan while Yunnan troops hit empty air."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-1", "red-3", "guizhou"],
        focusPlaces: ["桐梓", "娄山关"],
        redSegment: [0.42, 0.72],
        enemyIndices: [2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "趁黔北守备空虚，红一、红三军团疾驰攻克桐梓，直扑天险娄山关，打得黔军措手不及。",
          en: "Exploiting thin defenses in northern Guizhou, the 1st and 3rd Army Groups capture Tongzi and drive straight for Loushan Pass."
        }
      },
      {
        actor: "clash",
        focusUnits: ["red-3", "red-1", "guizhou"],
        focusPlaces: ["娄山关"],
        redSegment: [0.70, 0.88],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "1935.02.25—26 · 二渡赤水", title: "雄关漫道 · 娄山关大捷", sub: "红三军团浴血夺取黔北门户，打开重占遵义通道" },
          en: { kicker: "FEB 25–26, 1935 · 2ND CROSSING", title: "LOUSHAN PASS STORMED", sub: "The 3rd Army Group seizes northern Guizhou's mountain gateway" }
        },
        narration: {
          zh: "2月25日至26日，红三军团主攻并多次击退反扑，一举攻克苍山如海的黔北第一险关——娄山关。",
          en: "On February 25 and 26, the 3rd Army Group storms the precipitous heights of Loushan Pass, smashing Guizhou counterattacks."
        }
      },
      {
        actor: "clash",
        focusUnits: ["red-1", "red-3", "central-wu", "central-zhou"],
        focusPlaces: ["遵义", "老鸦山"],
        redSegment: [0.86, 1.0],
        enemyIndices: [0],
        markerIndices: [1],
        sfx: "victory",
        narration: {
          zh: "红军乘胜再占遵义，并于老鸦山击溃南面增援的吴奇伟纵队，歼敌两个师又八个团，夺得长征以来空前大捷。",
          en: "Pressing south, the Red Army retakes Zunyi and routs Wu Qiwei's relieving divisions at Laoya Mountain—the greatest victory of the Long March."
        }
      }
    ],
    "third-crossing": [
      {
        actor: "blue",
        focusUnits: ["central-zhou", "central-wu", "red-command"],
        focusPlaces: ["遵义", "苟坝"],
        redSegment: [0, 0.25],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "march",
        narration: {
          zh: "遵义大捷后蒋介石急调重兵重新压迫。3月中旬苟坝会议决定放弃硬攻打鼓新场，成立三人军事指挥小组统一调度。",
          en: "As KMT divisions tighten around Zunyi once more, the Gouba Conference cancels a risky assault and establishes the streamlined three-man military command."
        }
      },
      {
        actor: "clash",
        focusUnits: ["red-3", "red-1", "central-zhou"],
        focusPlaces: ["鲁班场", "茅台"],
        redSegment: [0.24, 0.56],
        enemyIndices: [],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "鲁班场战斗未能速决后，红军绝不恋战，迅速脱离接触，全军转向赤水河上游的茅台镇。",
          en: "When combat at Lubanchang proves inconclusive against fortified blockhouses, the Red Army disengages cleanly toward Maotai."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-1", "red-3", "red-5", "red-9"],
        focusPlaces: ["茅台", "古蔺"],
        redSegment: [0.54, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "march",
        banner: {
          zh: { kicker: "1935.03.16—17 · 三渡赤水", title: "公开西渡 · 调敌川南", sub: "大张旗鼓向古蔺叙永佯动，引数十万敌军重心西移" },
          en: { kicker: "MAR 16–17, 1935 · 3RD CROSSING", title: "OPEN CROSSING AT MAOTAI", sub: "A bold westward feint lures 400,000 KMT troops toward southern Sichuan" }
        },
        narration: {
          zh: "3月16日至17日，红军在茅台公开西渡赤水，大张旗鼓向古蔺、叙永挺进，故意摆出再次北渡长江的战略姿态。",
          en: "On March 16, the Red Army crosses west in full view at Maotai, marching toward Gulin to convince Chiang Kai-shek of a renewed push for the Yangtze."
        }
      },
      {
        actor: "blue",
        focusUnits: ["sichuan", "yunnan", "central-zhou"],
        focusPlaces: ["古蔺", "叙永"],
        redSegment: null,
        enemyIndices: [1, 2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "蒋介石果然判断失误，急令川军、中央军与滇军全线向川南古蔺合拢，东南乌江方向顿时露出致命空隙。",
          en: "Taking the bait, Chiang orders Sichuan, Central, and Yunnan columns rushing westward—tearing wide gaps along the southeastern flank."
        }
      }
    ],
    "fourth-crossing": [
      {
        actor: "blue",
        focusUnits: ["red-decoy", "sichuan", "central-zhou", "yunnan"],
        focusPlaces: ["古蔺"],
        redSegment: null,
        enemyIndices: [0, 1, 2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "敌军重兵云集古蔺周围之际，红军仅留红一军团一个团继续向西大张旗鼓佯动，牢牢吸住数十万敌军视线。",
          en: "While enemy armies crowd around Gulin, a single decoy regiment keeps feinting westward—pinning the entire encirclement's attention."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-command", "red-1", "red-3", "red-5", "red-9"],
        focusPlaces: ["二郎滩", "太平渡"],
        redSegment: [0, 0.48],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "march",
        banner: {
          zh: { kicker: "1935.03.21—22 · 四渡赤水", title: "神速折返 · 秘密东渡", sub: "主力夜行军与敌相向穿插，从合围缝隙一穿而过" },
          en: { kicker: "MAR 21–22, 1935 · 4TH CROSSING", title: "SECRET REVERSAL EAST", sub: "Night forced marches slip past converging enemy columns through the open seam" }
        },
        narration: {
          zh: "3月21日至22日，主力连夜秘密折返，由二郎滩、太平渡神速四渡赤水，与西进的敌军主力相向穿插而过。",
          en: "Under cover of night on March 21, the main body doubles back east over Erlangtan and Taiping Ford, passing straight through the unclosed seam."
        }
      },
      {
        actor: "red",
        focusUnits: ["red-1", "red-3", "red-command", "central-wu"],
        focusPlaces: ["临江场", "楠木坝", "花茂"],
        redSegment: [0.46, 0.80],
        enemyIndices: [3],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "红军不给敌军重建封锁线的时间，经临江场、楠木坝、花茂疾速南下，甩开追兵直指乌江渡口。",
          en: "Giving the KMT zero time to reform a cordon, the Red Army races south through Nanmuba and Huamao toward the Wu River."
        }
      },
      {
        actor: "clash",
        focusUnits: ["red-1", "red-command", "guizhou"],
        focusPlaces: ["乌江", "贵阳"],
        redSegment: [0.78, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "victory",
        banner: {
          zh: { kicker: "1935.03.31 · 跳出合围", title: "南渡乌江 · 直逼贵阳", sub: "彻底粉碎四十万大军围堵，长征战局豁然开朗" },
          en: { kicker: "MARCH 31, 1935 · BREAKOUT", title: "ACROSS THE WU RIVER", sub: "Breaking free from 400,000 troops, the Red Army threatens Guiyang and opens the road west" }
        },
        narration: {
          zh: "3月31日，中央红军主力胜利南渡乌江，兵锋直逼贵阳，彻底跳出四十万大军合围，写就军事史上不朽奇观。",
          en: "On March 31, the Central Red Army crosses south over the Wu River toward Guiyang, breaking completely free of the 400,000-troop encirclement."
        }
      }
    ]
  },

  /* ==================== 长津湖战役 (1950年) ==================== */
  "changjin-1950": {
    "ambush-encirclement": [
      {
        actor: "blue",
        focusUnits: ["us-x", "us-mar57", "us-31rct", "us-marhq", "us-mar1"],
        focusPlaces: ["柳潭里", "新兴里", "下碣隅里", "古土里"],
        redSegment: null,
        enemyIndices: [0, 1, 2],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "1950年11月下旬，美第10军沿唯一盘山公路孤军冒进盖马高原，分驻柳潭里、新兴里与下碣隅里，企图圣诞节前结束战争。",
          en: "In late November 1950, US X Corps pushes deep up the lone mountain road onto the Kaema Plateau, aiming to end the war by Christmas."
        }
      },
      {
        actor: "red",
        focusUnits: ["cpv-hq", "cpv-27", "cpv-20", "cpv-26"],
        focusPlaces: ["柳潭里", "新兴里"],
        redSegment: [0, 0.35],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "而在美军毫无察觉的冰雪密林中，志愿军第9兵团十余万官兵顶着零下三十余度严寒昼伏夜行，已完成绝密隐蔽集结。",
          en: "Unseen beneath total US air supremacy, over one hundred thousand PVA troops march strictly by night in minus thirty degree blizzards to surround the reservoir."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cpv-27", "cpv-20", "us-mar57", "us-31rct"],
        focusPlaces: ["柳潭里", "新兴里"],
        redSegment: [0.33, 0.70],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "1950.11.27夜 · 零下四十度", title: "长津湖雪夜骤然打响", sub: "第9兵团全线突然反击，达成震撼世界的战役突然性" },
          en: { kicker: "NIGHT OF NOV 27, 1950 · -40°C", title: "BLIZZARD AMBUSH AT CHOSIN", sub: "PVA 9th Army Group strikes out of the snow, achieving total operational surprise" }
        },
        narration: {
          zh: "11月27日晚，气温骤降至零下近四十度，志愿军第20、27军同时发起猛烈反击，柳潭里与新兴里骤然枪炮震天。",
          en: "On the freezing night of November 27, the 20th and 27th Armies strike simultaneously across the reservoir, shattering the eastern UN offensive."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cpv-20", "us-marhq", "us-mar1"],
        focusPlaces: ["下碣隅里", "古土里"],
        redSegment: [0.68, 1.0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "clash",
        narration: {
          zh: "志愿军大胆穿插迅速截断山路，将美陆战第1师及第31团级战斗队彻底分割包围于四处孤立雪地据点。",
          en: "Bold infiltration cuts the sole mountain highway in multiple places, sealing US X Corps into four isolated frozen pockets."
        }
      }
    ],
    "sinhung-annihilation": [
      {
        actor: "red",
        focusUnits: ["cpv-27", "us-31rct"],
        focusPlaces: ["新兴里"],
        redSegment: [0, 0.45],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "长津湖东岸新兴里一带，美步兵第7师第31团级战斗队孤立突出。志愿军第27军集中第80、81师主力率先围攻这股强敌。",
          en: "On the reservoir's east shore, the US 31st Regimental Combat Team stands exposed. PVA 27th Army concentrates its 80th and 81st Divisions to crush it first."
        }
      },
      {
        actor: "blue",
        focusUnits: ["us-marhq", "cpv-27", "us-31rct"],
        focusPlaces: ["下碣隅里", "新兴里"],
        redSegment: null,
        enemyIndices: [0],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "美军急由下碣隅里派出坦克步兵分队北上增援，遭第81师顽强阻击打退，新兴里美军彻底沦为绝境孤岛。",
          en: "An armored relief probe sent north from Hagaru-ri is thrown back by the 81st Division, sealing the fate of the east-shore perimeter."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cpv-27", "us-31rct"],
        focusPlaces: ["新兴里", "长津湖"],
        redSegment: [0.43, 0.80],
        enemyIndices: [],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "11月30日夜，副军长詹大南统一指挥五个团发起总攻，将敌压缩于冰封湖岸，团长麦克莱恩上校重伤毙命。",
          en: "On the night of November 30, five PVA regiments launch a general assault, compressing defenders against the frozen lake as Colonel MacLean falls."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cpv-27", "us-31rct", "cpv-26"],
        focusPlaces: ["新兴里", "下碣隅里"],
        redSegment: [0.78, 1.0],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "victory",
        banner: {
          zh: { kicker: "1950.12.02 · 东岸大捷", title: "新兴里全歼“北极熊团”", sub: "整建制歼灭美军加强团级战斗队，缴获团旗" },
          en: { kicker: "DEC 2, 1950 · EAST SHORE VICTORY", title: "US 31ST RCT DESTROYED AT SINHUNG-NI", sub: "PVA 27th Army annihilates Task Force Faith and captures its regimental colors" }
        },
        narration: {
          zh: "12月2日，接任指挥的费斯中校率残部南突遭层层截击阵亡，美军“北极熊团”建制彻底覆灭，团旗被志愿军缴获。",
          en: "By December 2, Lieutenant Colonel Faith is killed in the desperate breakout south. The 31st RCT ceases to exist as a combat unit, its colors captured."
        }
      }
    ],
    "toktong-hagaru": [
      {
        actor: "blue",
        focusUnits: ["us-mar57", "cpv-20"],
        focusPlaces: ["柳潭里", "死鹰岭"],
        redSegment: [0, 0.35],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "12月1日起，美陆战第5、7团在密集航空火力掩护下放弃柳潭里南撤，与志愿军在零下四十度风雪中的死鹰岭展开惨烈拉锯。",
          en: "Abandoning Yudam-ni under heavy air cover, the 5th and 7th Marines fight south through brutal -40°C ridges at Toktong Pass."
        }
      },
      {
        actor: "clash",
        focusUnits: ["cpv-20", "us-marhq"],
        focusPlaces: ["下碣隅里"],
        redSegment: [0.33, 0.65],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "fire",
        banner: {
          zh: { kicker: "下碣隅里 · 小高岭阵地", title: "英雄杨根思 · 血战小高岭", sub: "打退八次进攻后抱起炸药包与敌同归于尽，死守咽喉高地" },
          en: { kicker: "HAGARU-RI · XIAOGAOLING RIDGE", title: "YANG GENSI'S HEROIC STAND", sub: "After repelling eight assaults, the company commander sacrifices himself to hold the vital spur" }
        },
        narration: {
          zh: "在下碣隅里外围小高岭阵地，连长杨根思率部打退敌军八次进攻，弹尽后抱起炸药包冲入敌群，以生命铸就钢铁防线。",
          en: "On the critical ridge above Hagaru-ri, Company Commander Yang Gensi beats back eight attacks before charging with a satchel charge to hold the line."
        }
      },
      {
        actor: "red",
        focusUnits: ["cpv-20", "cpv-27", "cpv-26"],
        focusPlaces: ["死鹰岭", "下碣隅里"],
        redSegment: [0.63, 0.84],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "极寒与断粮带来了难以想象的考验，志愿军多个连队在死鹰岭潜伏待命，全连官兵冻成“冰雕”依然紧握钢枪直指公路。",
          en: "In unimaginable cold without adequate winter gear, entire PVA ambush companies freeze to death on the ridges, still aiming down at the withdrawal road."
        }
      },
      {
        actor: "blue",
        focusUnits: ["us-marhq", "us-mar1", "cpv-26"],
        focusPlaces: ["下碣隅里", "古土里"],
        redSegment: [0.82, 1.0],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "12月6日，美军经简易机场抢运走四千余名伤员后炸毁物资，集中全部剩余兵力继续沿山路向古土里突围。",
          en: "After airlifting over four thousand casualties from Hagaru-ri's dirt strip on December 6, the Marines blow their depots and push south toward Koto-ri."
        }
      }
    ],
    "shuimen-hungnam": [
      {
        actor: "clash",
        focusUnits: ["cpv-20", "us-marhq"],
        focusPlaces: ["古土里", "水门桥"],
        redSegment: [0, 0.45],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "fire",
        banner: {
          zh: { kicker: "1950.12.01—06 · 绝壁咽喉", title: "三炸水门桥 · 斩断退路", sub: "敢死分队冒严寒炮火三次炸毁万丈深渊咽喉大桥" },
          en: { kicker: "DEC 1–6, 1950 · CLIFFSIDE CHOKEPOINT", title: "FUNCHILIN BRIDGE BLOWN THRICE", sub: "PVA sappers brave blizzard and gunfire three times to sever the lone mountain exit" }
        },
        narration: {
          zh: "水门桥高悬于绝壁引水管之上，是美军南撤唯一咽喉。志愿军突击队冒死三次将其彻底炸毁，连同桥基化为断崖。",
          en: "Suspended over a deep chasm, Funchilin Bridge is the Marines' sole exit. Three times PVA sappers brave fire and frost to blow the span and its very abutments."
        }
      },
      {
        actor: "blue",
        focusUnits: ["us-marhq", "us-x"],
        focusPlaces: ["水门桥", "黄草岭", "真兴里"],
        redSegment: null,
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "美军紧急动用大型运输机空投八套重型钢桥组件，连夜抢修通车，在海空火力掩护下艰难撤下黄草岭。",
          en: "Responding with massive airlifts, US transports parachute eight heavy M2 steel bridge spans, allowing the column to descend Funchilin Pass."
        }
      },
      {
        actor: "red",
        focusUnits: ["cpv-26", "cpv-27"],
        focusPlaces: ["咸兴", "兴南港"],
        redSegment: [0.43, 1.0],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "志愿军第26、27军克服极度冻伤与减员，乘胜一路猛追至咸兴外围，步步压缩美军兴南登陆场。",
          en: "Pushing past severe cold casualties, the 26th and 27th Armies pursue down to the coastal plain, steadily shrinking the Hungnam perimeter."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-navy", "us-x", "cpv-26"],
        focusPlaces: ["咸兴", "兴南港"],
        redSegment: null,
        enemyIndices: [2],
        markerIndices: [1],
        sfx: "victory",
        banner: {
          zh: { kicker: "1950.12.24 · 战役胜利", title: "兴南大撤退 · 东线战局逆转", sub: "美第10军十万余人海上撤离，志愿军收复朝鲜东北部" },
          en: { kicker: "DEC 24, 1950 · STRATEGIC REVERSAL", title: "HUNGNAM SEA EVACUATION", sub: "US X Corps sails south as PVA forces liberate northeastern Korea" }
        },
        narration: {
          zh: "12月24日，美第10军炸毁港口设施全部登船撤离兴南港。志愿军收复整个朝鲜东北部，彻底扭转朝鲜战局。",
          en: "On December 24, US X Corps demolishes Hungnam port and evacuates by sea. Northeastern Korea is liberated, permanently reversing the Eastern Front."
        }
      }
    ]
  },

  /* ==================== 诺曼底登陆 (1944年) ==================== */
  "normandy-1944": {
    "airborne-dawn": [
      {
        actor: "red",
        focusUnits: ["allied-hq"],
        focusPlaces: ["朴次茅斯"],
        redSubpaths: [],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "1944年6月5日深夜，艾森豪威尔抓住短暂气象窗口下达总攻令，近七千艘盟军舰艇自英格兰南岸浩荡启航。",
          en: "Late on June 5, 1944, seizing a narrow weather break, Eisenhower gives the order—launching nearly seven thousand vessels across the English Channel."
        }
      },
      {
        actor: "clash",
        focusUnits: ["uk-6", "ger-21pz"],
        focusPlaces: ["飞马桥", "卡昂"],
        redSubpaths: [1],
        enemyIndices: [0],
        markerIndices: [1],
        sfx: "clash",
        banner: {
          zh: { kicker: "1944.06.06 00:16 · 左翼奇袭", title: "滑翔机奇袭飞马桥", sub: "英第6空降师十分钟完好夺取奥恩河运河桥" },
          en: { kicker: "JUNE 6, 00:16 · EASTERN FLANK", title: "PEGASUS BRIDGE SEIZED INTACT", sub: "British glider commandos land yards from the Orne bridge and capture it in ten minutes" }
        },
        narration: {
          zh: "6月6日零时十六分，英第6空降师滑翔机精准迫降奥恩河畔，十分钟内完好夺取飞马桥，死死锁住盟军左翼。",
          en: "At sixteen minutes past midnight, British 6th Airborne gliders touch down beside the Orne Canal, seizing Pegasus Bridge intact to lock the eastern flank."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-82", "us-101", "ger-7"],
        focusPlaces: ["圣梅尔埃格利斯", "犹他海滩"],
        redSubpaths: [0],
        enemyIndices: [1],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "西翼科唐坦半岛，美第82、101空降师在低云高炮中分散着陆，却迅速聚拢解放圣梅尔埃格利斯，令德军指挥陷入混乱。",
          en: "On the western wing, US 82nd and 101st paratroopers scatter in cloud and flak, yet rally to liberate Sainte-Mère-Église and confuse German command."
        }
      },
      {
        actor: "blue",
        focusUnits: ["ger-7", "ger-21pz", "ger-352"],
        focusPlaces: ["卡昂"],
        redSubpaths: [],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "德军B集团军群司令隆美尔当时正巧休假归国，柏林仍误以为加来才是主攻方向，精锐装甲预备队被死死扣留。",
          en: "With Rommel away in Germany and Berlin still fooled by Operation Fortitude into guarding Calais, elite panzer reserves remain frozen."
        }
      }
    ],
    "d-day-landings": [
      {
        actor: "red",
        focusUnits: ["us-4", "us-1", "ger-352"],
        focusPlaces: ["犹他海滩", "奥马哈海滩"],
        redSubpaths: [1, 0],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "6月6日拂晓六时三十分，美军率先抢滩犹他与奥马哈。犹他海滩进展顺利，而奥马哈却迎面撞上德军隐蔽部署的第352步兵师。",
          en: "At 06:30, American troops hit Utah and Omaha Beaches. While Utah advances swiftly, Omaha runs straight into the veteran German 352nd Division."
        }
      },
      {
        actor: "red",
        focusUnits: ["uk-50", "can-3", "uk-3"],
        focusPlaces: ["金滩", "朱诺海滩", "宝剑海滩"],
        redSubpaths: [2, 3, 4],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "随后一小时内，英加部队在特种工程坦克掩护下强登金、朱诺、宝剑三滩，迅速撕开大西洋壁垒并向内陆挺进。",
          en: "Minutes later, British and Canadian divisions storm Gold, Juno, and Sword Beaches behind specialized armor, breaking deep past coastal bunkers."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-1", "ger-352"],
        focusPlaces: ["奥马哈海滩"],
        redSubpaths: [],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "fire",
        banner: {
          zh: { kicker: "1944.06.06 · D日强登", title: "血腥奥马哈 · 绝境突围", sub: "驱逐舰冒险抵近浅水直瞄炮击，步兵爆破悬崖铁丝网打开通道" },
          en: { kicker: "JUNE 6, 1944 · D-DAY", title: "BLOODY OMAHA BREACHED", sub: "Destroyers close into shallow surf to blast pillboxes as infantry scale the bluffs" }
        },
        narration: {
          zh: "奥马哈海滩伤亡惨重之际，美军驱逐舰冒险抵近浅水直瞄轰击德军地堡，步兵小队现场重组爆破铁丝网，终于攻上悬崖。",
          en: "At Omaha's darkest hour, US destroyers steer into shallow surf to fire point-blank at pillboxes while infantry breach the wire and climb the bluffs."
        }
      },
      {
        actor: "clash",
        focusUnits: ["uk-3", "can-3", "ger-21pz"],
        focusPlaces: ["宝剑海滩", "卡昂"],
        redSubpaths: [],
        enemyIndices: [0],
        markerIndices: [1],
        sfx: "victory",
        narration: {
          zh: "德第21装甲师是D日唯一反扑海岸的装甲部队，遭英军反坦克炮与空军击退。当日十五万六千名盟军成功站稳诺曼底。",
          en: "Germany's 21st Panzer Division launches D-Day's sole armored counterattack—only to be halted by anti-tank fire and air strikes as 156,000 Allied troops secure the shore."
        }
      }
    ],
    "cherbourg-linkup": [
      {
        actor: "red",
        focusUnits: ["uk-2army", "ger-ss12", "ger-lehr"],
        focusPlaces: ["巴约", "卡昂"],
        redSubpaths: [],
        enemyIndices: [0, 1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "英军次日解放巴约并将东面三滩连成一线，同时在卡昂正面死死吸住陆续增援的德军党卫军第12师与装甲教导师。",
          en: "British troops liberate Bayeux and unite the eastern beaches, locking arriving SS and Panzer Lehr divisions into relentless combat around Caen."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-101"],
        focusPlaces: ["卡朗唐"],
        redSubpaths: [0, 2],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "6月10日至12日，美第101空降师在卡朗唐与德军伞兵展开激烈巷战，彻底连通孤立的犹他与奥马哈滩头。",
          en: "Fighting bitterly from June 10 to 12, the US 101st Airborne seizes Carentan—welding Utah and Omaha into a single eighty-kilometer front."
        }
      },
      {
        actor: "red",
        focusUnits: ["us-7corps", "ger-cherbourg"],
        focusPlaces: ["瑟堡"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "美第7军随即横切科唐坦半岛直抵西岸，将瑟堡德军守备集群死死封锁在半岛北端。",
          en: "Driving across the Cotentin Peninsula to the west coast, US VII Corps seals Cherbourg's garrison at the peninsula's tip."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-7corps", "ger-cherbourg"],
        focusPlaces: ["瑟堡"],
        redSubpaths: [],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "victory",
        banner: {
          zh: { kicker: "1944.06.26—30 · 夺取深水港", title: "美第7军攻克瑟堡", sub: "俘获德军约三万九千人，盟军上岸兵力突破八十五万" },
          en: { kicker: "JUNE 26–30, 1944 · DEEP-WATER PORT", title: "CHERBOURG CAPTURED", sub: "Nearly 39,000 German defenders surrender as Allied buildup passes 850,000 troops" }
        },
        narration: {
          zh: "6月底美军攻克深水大港瑟堡，俘获德军约三万九千人，西翼后顾之忧彻底解除，盟军登陆兵力突破八十五万。",
          en: "By late June, Cherbourg falls with thirty-nine thousand prisoners. With the western flank clear, Allied strength ashore surges past eight hundred fifty thousand."
        }
      }
    ],
    "cobra-breakout": [
      {
        actor: "clash",
        focusUnits: ["uk-2army", "ger-pzg"],
        focusPlaces: ["卡昂"],
        redSubpaths: [0],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "7月上旬，英加部队连续猛攻夺取卡昂主城，如铁砧般将德军绝大多数精锐装甲师牢牢钉死在东线。",
          en: "In early July, British and Canadian offensives seize Caen—serving as an iron anvil pinning Germany's elite panzer divisions in the east."
        }
      },
      {
        actor: "blue",
        focusUnits: ["ger-pzg", "ger-7", "us-1army"],
        focusPlaces: ["卡昂", "圣洛"],
        redSubpaths: [],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "德军将装甲主力尽数调往卡昂方向后，西线圣洛一带的步兵防线顿时变得脆弱空虚。",
          en: "With German armor magnetized toward Caen, the western infantry line near Saint-Lô grows dangerously thin."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-1army", "ger-7"],
        focusPlaces: ["圣洛"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "fire",
        banner: {
          zh: { kicker: "1944.07.25 · 战略大突破", title: "眼镜蛇行动撕裂德军防线", sub: "一千八百架重轰炸机饱和轰炸，装甲铁流涌出树篱迷宫" },
          en: { kicker: "JULY 25, 1944 · BREAKOUT", title: "OPERATION COBRA SHATTERS THE LINE", sub: "1,800 heavy bombers blast open the western flank for an armored sweep" }
        },
        narration: {
          zh: "7月25日，约一千八百架重轰炸机对圣洛以西实施地毯式轰炸，美第1集团军发动眼镜蛇行动，一举撕裂德军西翼防线。",
          en: "On July 25, eighteen hundred heavy bombers unleash carpet bombing west of Saint-Lô. Operation Cobra rips through the German flank."
        }
      },
      {
        actor: "red",
        focusUnits: ["us-3army", "us-1army", "ger-7"],
        focusPlaces: ["阿夫朗什", "法莱斯"],
        redSubpaths: [],
        enemyIndices: [],
        markerIndices: [],
        sfx: "victory",
        narration: {
          zh: "美军旋即冲出阿夫朗什门户，巴顿第3集团军如决堤洪流横扫法国腹地，法莱斯合围与解放巴黎已势不可挡。",
          en: "Pouring through Avranches, Patton's Third Army sweeps into open France, sealing the Falaise Pocket and opening the road to Paris."
        }
      }
    ]
  },

  /* ==================== 市场花园行动 (1944年) ==================== */
  "market-garden-1944": {
    "daylight-drop": [
      {
        actor: "red",
        focusUnits: ["us-101", "us-82", "uk-1ab"],
        focusPlaces: ["沃尔夫海泽", "赫拉弗", "桑镇"],
        redSubpaths: [0],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "march",
        narration: {
          zh: "1944年9月17日午后，史上最大白昼空降启动，逾两万名盟军伞兵空降荷兰河网，同时英第30军自乔桥沿69号公路北进。",
          en: "On the afternoon of September 17, 1944, twenty thousand Allied paratroopers drop in broad daylight across Dutch rivers as British XXX Corps drives north."
        }
      },
      {
        actor: "blue",
        focusUnits: ["ger-1fj", "us-101", "uk-30corps"],
        focusPlaces: ["桑镇", "埃因霍温"],
        redSubpaths: [],
        enemyIndices: [2],
        markerIndices: [0],
        sfx: "fire",
        narration: {
          zh: "变故接踵而至：德军在美101师逼近前炸毁桑镇运河桥，英第30军受阻延迟整整一日，严密的时间表首日即遭打乱。",
          en: "Disaster strikes early: German defenders blow the canal bridge at Son right before US 101st troops, delaying XXX Corps by a crucial day."
        }
      },
      {
        actor: "clash",
        focusUnits: ["uk-frost", "uk-1ab"],
        focusPlaces: ["阿纳姆大桥"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [2],
        sfx: "clash",
        banner: {
          zh: { kicker: "1944.09.17晚 · 孤军突进", title: "弗罗斯特夺取阿纳姆北桥", sub: "七百四十名英军伞兵冲上桥头，却与主力失去联系" },
          en: { kicker: "NIGHT OF SEP 17 · ISOLATED HOLD", title: "FROST SEIZES ARNHEM NORTH END", sub: "740 British paratroopers reach the final bridge, cut off by faulty radios" }
        },
        narration: {
          zh: "最北端阿纳姆，因着陆过远且电台失灵，最终只有弗罗斯特第2营约七百四十名伞兵冲上阿纳姆大桥北端孤军坚守。",
          en: "Dropped eleven kilometers away with dead radios, only Lieutenant Colonel Frost's seven hundred forty paratroopers reach Arnhem Bridge's north ramp."
        }
      },
      {
        actor: "blue",
        focusUnits: ["ger-ss9", "ger-ss10"],
        focusPlaces: ["阿纳姆大桥"],
        redSubpaths: [],
        enemyIndices: [0, 1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "更致命的是，莫德尔元帅正巧驻节附近，迅即调动休整中的党卫军第9、第10装甲师扑向阿纳姆与奈梅亨。",
          en: "Worse still, Field Marshal Model is quartered nearby and instantly orders the refitting 9th and 10th SS Panzer Divisions to seal Arnhem and Nijmegen."
        }
      }
    ],
    "hells-highway": [
      {
        actor: "clash",
        focusUnits: ["uk-frost", "ger-ss9"],
        focusPlaces: ["阿纳姆大桥"],
        redSegment: null,
        enemyIndices: [2],
        markerIndices: [1],
        sfx: "fire",
        narration: {
          zh: "9月18日晨，党卫军装甲侦察车队强冲阿纳姆大桥，遭到弗罗斯特营精准伏击，二十余辆装甲车在桥面化为火海。",
          en: "At dawn on September 18, an SS armored column rushes Arnhem Bridge—only to be ambushed and burned vehicle by vehicle by Frost's paratroopers."
        }
      },
      {
        actor: "red",
        focusUnits: ["uk-30corps", "us-101"],
        focusPlaces: ["埃因霍温", "桑镇", "费赫尔"],
        redSegment: [0, 0.52],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "南线英第30军解放埃因霍温，工兵通宵在桑镇架起贝利钢桥，装甲纵队重新加速沿单车道69号公路北上。",
          en: "XXX Corps liberates Eindhoven as engineers bridge Son overnight, sending British tanks racing back up single-lane Highway 69."
        }
      },
      {
        actor: "clash",
        focusUnits: ["us-101", "ger-1fj"],
        focusPlaces: ["费赫尔"],
        redSegment: null,
        enemyIndices: [0, 1],
        markerIndices: [0],
        sfx: "clash",
        narration: {
          zh: "德军战斗群不断从两翼猛烈袭扰高出沼泽的69号公路，盟军官兵将这条危机四伏的补给线称为“地狱公路”。",
          en: "German battlegroups repeatedly hammer the raised single-lane road from both flanks—earning Highway 69 the grim name Hell's Highway."
        }
      },
      {
        actor: "red",
        focusUnits: ["uk-30corps", "us-82", "ger-ss10", "uk-1ab"],
        focusPlaces: ["赫拉弗", "奈梅亨"],
        redSegment: [0.50, 1.0],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "9月19日晨，英近卫装甲师高速抵达奈梅亨南郊会师美82师，但党卫军第10装甲师死守瓦尔河桥，阿纳姆救援被迫停摆。",
          en: "Guards Armored links with the US 82nd at Nijmegen on September 19, but 10th SS Panzer blocks the Waal Bridge as Arnhem's relief push fails."
        }
      }
    ],
    "waal-crossing": [
      {
        actor: "clash",
        focusUnits: ["us-82", "uk-30corps", "ger-ss10"],
        focusPlaces: ["奈梅亨"],
        redSegment: [0, 0.72],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "1944.09.20 · 血渡瓦尔河", title: "白昼帆布舟强渡夺桥", sub: "美第82空降师冒密集炮火强渡，南北夹击完好拿下奈梅亨大桥" },
          en: { kicker: "SEP 20, 1944 · WAAL ASSAULT", title: "DAYLIGHT CROSSING AT NIJMEGEN", sub: "US 82nd paratroopers paddle canvas boats under fire to seize the giant bridge intact" }
        },
        narration: {
          zh: "9月20日下午，美第82空降师乘二十六艘简陋帆布舟在白昼炮火中血渡瓦尔河，南北夹击完好夺取奈梅亨大桥。",
          en: "Paddling twenty-six canvas boats through murderous daylight fire on September 20, the US 82nd storms the north bank and seizes Nijmegen Bridge intact."
        }
      },
      {
        actor: "blue",
        focusUnits: ["uk-30corps", "ger-ss10"],
        focusPlaces: ["埃尔斯特"],
        redSegment: [0.70, 1.0],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "英军坦克冲过瓦尔河后，却在埃尔斯特一线遭遇党卫军第10装甲师反坦克屏阻击，距阿纳姆仅咫尺却寸步难行。",
          en: "British tanks charge across the Waal only to stall before Elst against 10th SS anti-tank screens—just fifteen kilometers short of Arnhem."
        }
      },
      {
        actor: "clash",
        focusUnits: ["ger-ss9", "uk-1ab"],
        focusPlaces: ["阿纳姆大桥", "奥斯特贝克"],
        redSegment: null,
        enemyIndices: [0],
        markerIndices: [1],
        sfx: "fire",
        banner: {
          zh: { kicker: "1944.09.21晨 · 遥远的桥", title: "阿纳姆北桥终告陷落", sub: "孤守近八十小时弹尽粮绝，最后一座桥功亏一篑" },
          en: { kicker: "SEP 21, 1944 · A BRIDGE TOO FAR", title: "ARNHEM BRIDGE FALLS", sub: "Out of ammunition after 80 hours, Frost's battered remnant is overrun" }
        },
        narration: {
          zh: "9月21日晨，孤守阿纳姆北桥近八十小时的弗罗斯特营弹尽粮绝，伤重被俘，最北端的“遥远的桥”重落德军之手。",
          en: "After nearly eighty hours under tank fire, Frost's ammunition runs dry on September 21. The final bridge falls back into German hands."
        }
      },
      {
        actor: "red",
        focusUnits: ["pol-1ab", "uk-1ab"],
        focusPlaces: ["德里尔", "奥斯特贝克"],
        redSegment: null,
        enemyIndices: [],
        markerIndices: [2],
        sfx: "march",
        narration: {
          zh: "因英国大雾延误两天的波兰第1独立伞兵旅空降下莱茵河南岸德里尔，与对岸奥斯特贝克苦守的英军隔河相望。",
          en: "Delayed two days by English fog, Sosabowski's Polish paratroopers drop at Driel across the Lower Rhine from the shrinking Oosterbeek pocket."
        }
      }
    ],
    "berlin-withdrawal": [
      {
        actor: "clash",
        focusUnits: ["ger-1fj", "us-101"],
        focusPlaces: ["费赫尔"],
        redSegment: null,
        enemyIndices: [2],
        markerIndices: [1],
        sfx: "clash",
        narration: {
          zh: "9月22日，德军在费赫尔再度切断69号公路，美第101空降师激战两日才重新打通，盟军救援彻底丧失最后时机。",
          en: "On September 22, German counterattacks cut Hell's Highway at Veghel again—halting vital supplies for two days and sealing Oosterbeek's fate."
        }
      },
      {
        actor: "blue",
        focusUnits: ["ger-ss9", "uk-1ab"],
        focusPlaces: ["奥斯特贝克"],
        redSegment: null,
        enemyIndices: [0, 1],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "党卫军第2装甲军从东西两面收紧奥斯特贝克大锅，下莱茵河北岸被德军火力完全封锁，渡河建桥已成绝望。",
          en: "II SS Panzer Corps squeezes the Oosterbeek cauldron from east and west, locking down the riverbanks with heavy fire."
        }
      },
      {
        actor: "red",
        focusUnits: ["uk-1ab", "pol-1ab"],
        focusPlaces: ["奥斯特贝克", "德里尔"],
        redSegment: [0, 0.55],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "march",
        banner: {
          zh: { kicker: "1944.09.25夜 · 柏林行动", title: "暴雨夜渡 · 抢撤奥斯特贝克", sub: "炮火掩护下乘冲锋舟撤出约两千四百名英波幸存官兵" },
          en: { kicker: "NIGHT OF SEP 25 · OPERATION BERLIN", title: "STORM EVACUATION ACROSS THE RHINE", sub: "Under heavy rain and artillery cover, ~2,400 survivors escape across the river" }
        },
        narration: {
          zh: "9月25日暴雨之夜，盟军执行“柏林行动”，在南岸密集炮火掩护下驾驶冲锋舟往返下莱茵河，抢撤被围幸存官兵。",
          en: "Under torrential rain and XXX Corps barrages on the night of September 25, assault boats ferry survivors back across the Lower Rhine in Operation Berlin."
        }
      },
      {
        actor: "red",
        focusUnits: ["uk-1ab", "pol-1ab", "us-82"],
        focusPlaces: ["德里尔", "奈梅亨"],
        redSegment: [0.53, 1.0],
        enemyIndices: [],
        markerIndices: [],
        sfx: "victory",
        narration: {
          zh: "约两千四百名幸存者安全撤回南岸。市场花园行动虽未能跨过莱茵河，却以奈梅亨突出部为翌年春的反攻留下一块跳板。",
          en: "Roughly twenty-four hundred survivors reach the south bank. Though the Rhine barrier held, the Nijmegen salient remained a springboard for 1945."
        }
      }
    ]
  },

  /* =========================================================================
   * 6. 西奈半岛反击战 · 瞪羚行动（1973）
   * ========================================================================= */
  "sinai-1973": {
    "badr-crossing": [
      {
        actor: "blue",
        focusUnits: ["egy-2army", "egy-3army", "egy-sam"],
        focusPlaces: ["坎塔拉", "伊斯梅利亚", "苏伊士城"],
        redSubpaths: [],
        enemyIndices: [0, 1, 2, 3],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "1973.10.06 14:00 · 巴德尔行动", title: "水炮破堤 · 横渡苏伊士", sub: "埃军五师强渡运河，高压水炮数小时冲垮巴列夫巨型沙墙" },
          en: { kicker: "OCT 6, 1973 14:00 · OPERATION BADR", title: "WATER CANNONS BREACH THE CANAL", sub: "Five Egyptian divisions storm across behind hydraulic breaches in the Bar-Lev sand wall" }
        },
        narration: {
          zh: "1973年10月6日下午两点，埃及大军发起“巴德尔行动”，两千门火炮齐射，工兵用高压水炮冲垮巴列夫防线巨型沙堤，五个步兵师迅速横渡苏伊士运河。",
          en: "At 14:00 on October 6, 1973, Egypt launches Operation Badr: behind two thousand guns, high-pressure water cannons wash open the Bar-Lev sand wall as five divisions storm across the Suez Canal."
        }
      },
      {
        actor: "blue",
        focusUnits: ["egy-sam", "egy-2army", "idf-hq"],
        focusPlaces: ["伊斯梅利亚", "雷菲迪姆基地"],
        redSubpaths: [0],
        enemyIndices: [],
        markerIndices: [],
        sfx: "fire",
        narration: {
          zh: "埃军在运河西岸构筑严密的萨姆二、三、六防空导弹保护伞，以色列空军战机刚一抵近运河便接连被击落，彻底丧失近距空中支援能力。",
          en: "On the west bank, interlocking SAM-2, SAM-3, and mobile SAM-6 batteries lock down the sky, downing Israeli jets on approach and denying close air support."
        }
      },
      {
        actor: "clash",
        focusUnits: ["idf-162", "egy-2army"],
        focusPlaces: ["菲尔丹桥", "塔萨"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "fire",
        banner: {
          zh: { kicker: "1973.10.08 · 菲尔丹之败", title: "纯坦莽冲 · 撞碎导弹火网", sub: "无步炮协同的第190装甲旅遭萨格尔导弹伏击，十余分钟覆灭" },
          en: { kicker: "OCT 8, 1973 · FIRDAN DISASTER", title: "PURE-TANK CHARGE SHATTERED", sub: "Charging without infantry or artillery smoke, IDF 190th Brigade is ambushed by Sagger ATGMs" }
        },
        narration: {
          zh: "10月8日，迷信全坦克制胜论的以军第190装甲旅在没有步兵清剿、没有炮火烟幕掩护下直冲菲尔丹桥，一头撞进埃军萨格尔反坦克导弹伏击圈，十余分钟主力覆灭。",
          en: "On October 8, overconfident in pure-tank doctrine, the unsupported 190th Armored Brigade charges toward Firdan—straight into dense Sagger anti-tank missiles, losing over eighty tanks in minutes."
        }
      },
      {
        actor: "red",
        focusUnits: ["idf-hq", "idf-143", "idf-252"],
        focusPlaces: ["塔萨", "雷菲迪姆基地"],
        redSubpaths: [2],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "惨痛教训迫使以军统帅部紧急叫停盲目反扑，依托西奈沙脊转入弹性防御，连夜将坦克与机械化步兵、自行火炮重新编组为合成战斗群。",
          en: "Stunned by the losses, IDF Southern Command halts solo tank charges, stabilizes along the Sinai ridges, and urgently pairs armor with mechanized infantry and howitzers."
        }
      }
    ],
    "sinai-armor-clash": [
      {
        actor: "red",
        focusUnits: ["idf-hq", "idf-252", "idf-143"],
        focusPlaces: ["吉迪山口", "米特拉山口", "塔萨"],
        redSubpaths: [2, 3],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "10月10日至12日，以军扼守吉迪与米特拉山口前沿，美军战略空运的陶式反坦克导弹与补充弹药陆续运抵西奈前线。",
          en: "From October 10 to 12, IDF divisions dig into hull-down positions before Gidi and Mitla Passes as airlifted TOW anti-tank missiles reach the front."
        }
      },
      {
        actor: "red",
        focusUnits: ["idf-hq", "idf-143", "egy-2army", "egy-3army"],
        focusPlaces: ["德维苏瓦", "大苦湖"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "march",
        narration: {
          zh: "10月13日，高空战略侦察拍回关键照片：大苦湖北端德维苏瓦恰处埃及第二与第三军团接合部，正是穿插渡河的绝佳缝隙。",
          en: "On October 13, high-altitude reconnaissance reveals the decisive opening: Deversoir, at the north tip of Great Bitter Lake, sits squarely on the thinly guarded seam between Egypt's Second and Third Armies."
        }
      },
      {
        actor: "blue",
        focusUnits: ["egy-21ar", "egy-4ar", "egy-sam"],
        focusPlaces: ["塔萨", "吉迪山口", "米特拉山口"],
        redSubpaths: [],
        enemyIndices: [0, 1, 2, 3],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "10月14日清晨，为策应叙利亚战线，埃及第21与第4装甲师奉命向东全线出击，主动走出了西岸萨姆防空导弹伞的有效保护半径！",
          en: "At dawn on October 14, ordered east to relieve pressure on Syria, Egypt's 21st and 4th Armored Divisions roll out beyond the protective reach of their west-bank SAM umbrella!"
        }
      },
      {
        actor: "clash",
        focusUnits: ["idf-143", "idf-162", "idf-252", "egy-21ar", "egy-4ar"],
        focusPlaces: ["塔萨", "米特拉山口", "德维苏瓦"],
        redSubpaths: [0],
        enemyIndices: [],
        markerIndices: [0],
        sfx: "clash",
        banner: {
          zh: { kicker: "1973.10.14 · 西奈坦克大决战", title: "诱敌出伞 · 单日摧毁二百五十坦", sub: "二战库尔斯克以来最大装甲交锋，西奈战役主动权彻底翻转" },
          en: { kicker: "OCT 14, 1973 · GREAT SINAI TANK BATTLE", title: "EXPOSED ARMOR CRUSHED BEYOND SAMS", sub: "Largest tank battle since Kursk destroys ~250 Egyptian tanks and flips campaign momentum" }
        },
        narration: {
          zh: "库尔斯克以来最大规模坦克战爆发！失去防空伞庇护的埃军装甲群遭到以军棱线隐蔽坦克炮、反坦导弹与攻击机立体围猎，单日折损约两百五十辆坦克，战役主动权彻底逆转。",
          en: "In the largest tank battle since Kursk, exposed Egyptian armor is caught between hull-down Israeli gunnery, TOW missiles, and swooping attack jets—losing some two hundred fifty tanks in a single day."
        }
      }
    ],
    "chinese-farm-crossing": [
      {
        actor: "red",
        focusUnits: ["idf-143", "idf-para"],
        focusPlaces: ["塔萨", "德维苏瓦", "大苦湖"],
        redSegment: [0, 0.58],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "10月15日夜，“瞪羚行动”打响！沙龙第143师正面佯攻伊斯梅利亚方向，丹尼·马特率第247伞兵旅悄然穿插至德维苏瓦，乘橡皮艇渡过苏伊士运河。",
          en: "On the night of October 15, Operation Gazelle begins: while Sharon fixes Tasa, Danny Matt's 247th Paratroop Brigade slips along Great Bitter Lake to paddle across Deversoir in rubber dinghies."
        }
      },
      {
        actor: "clash",
        focusUnits: ["idf-para", "idf-143", "egy-16inf"],
        focusPlaces: ["中国农场", "德维苏瓦"],
        redSegment: [0.35, 0.72],
        enemyIndices: [0, 1],
        markerIndices: [0],
        sfx: "fire",
        narration: {
          zh: "渡口东岸走廊在“中国农场”遭埃军第16师锁死！以军不再单靠坦克硬冲，而是集中重炮烟幕致盲反坦射手，投入伞兵与机步贴身清剿战壕。",
          en: "When Egyptian 16th Division anti-tank nests choke the corridor at Chinese Farm, IDF fights with true combined arms—blinding gunners with howitzer smoke while paratroopers clear trenches yard by yard."
        }
      },
      {
        actor: "red",
        focusUnits: ["idf-162", "idf-143", "idf-para"],
        focusPlaces: ["德维苏瓦", "中国农场"],
        redSegment: [0.68, 1.0],
        enemyIndices: [2],
        markerIndices: [1],
        sfx: "march",
        banner: {
          zh: { kicker: "1973.10.17 · 穿隙架桥", title: "步坦炮工 · 浮桥横跨苏伊士", sub: "炮火中架通浮筒桥与180吨滚轴桥，装甲主力突入运河西岸" },
          en: { kicker: "OCT 17, 1973 · BRIDGING DEVERSOIR", title: "ROLLER BRIDGE SPANS THE SUEZ", sub: "Combined infantry, artillery, engineers & armor open two bridges onto the West Bank" }
        },
        narration: {
          zh: "10月17日，在步、坦、炮严密掩护下，以军工兵冒着炮火将浮筒桥与一百八十吨巨型滚轴桥拖入运河架通，钢铁洪流开始源源不断涌入西岸！",
          en: "On October 17, shielded by infantry, tanks, and artillery barrages, combat engineers float both pontoon and 180-ton roller bridges across Deversoir, opening the gateway to the West Bank!"
        }
      },
      {
        actor: "clash",
        focusUnits: ["idf-162", "idf-252", "egy-25bde"],
        focusPlaces: ["大苦湖", "德维苏瓦"],
        redSegment: [0.75, 1.0],
        enemyIndices: [],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "阿丹第162师与马根第252师在大苦湖畔设伏，一举歼灭北上增援的埃军第25独立T-62装甲旅，随即全师越过浮桥杀向运河西岸。",
          en: "Along Great Bitter Lake, Adan's 162nd Division ambushes and annihilates Egypt's relieving 25th T-62 Armored Brigade, then thunders across the bridges onto the African shore."
        }
      }
    ],
    "west-bank-encirclement": [
      {
        actor: "red",
        focusUnits: ["idf-162", "idf-143", "idf-iaf"],
        focusPlaces: ["法伊德", "吉奈法高地", "伊斯梅利亚"],
        redSubpaths: [0, 2],
        enemyIndices: [0],
        markerIndices: [0],
        sfx: "fire",
        banner: {
          zh: { kicker: "1973.10.18—20 · 逆向陆空赋能", title: "陆军猎导 · 替空军撕开天空", sub: "地面装甲突击群直接捣毁西岸萨姆导弹阵地，撬垮防空铁幕" },
          en: { kicker: "OCT 18–20, 1973 · REVERSE ENABLEMENT", title: "GROUND RAIDS SMASH THE SAM UMBRELLA", sub: "Armored task forces overrun west-bank missile sites to reopen the sky for airpower" }
        },
        narration: {
          zh: "过河后的以军打出颠覆传统的现代合成神来之笔——陆军替空军开路！阿丹与沙龙师分头突袭法伊德和吉奈法高地，从地面直接碾碎数十座萨姆防空导弹阵地。",
          en: "Across the canal, IDF executes a revolutionary combined-arms stroke—the Army opens the sky for the Air Force! Armored task forces storm Fayid and Geneifa, smashing dozens of SAM batteries from the ground."
        }
      },
      {
        actor: "clash",
        focusUnits: ["idf-iaf", "idf-162", "idf-252"],
        focusPlaces: ["法伊德", "吉奈法高地"],
        redSubpaths: [],
        enemyIndices: [1],
        markerIndices: [],
        sfx: "clash",
        narration: {
          zh: "西岸防空天网被撕开巨大豁口，以色列空军战机立即呼啸涌入，在空中击溃拦截敌机，与地面合成装甲群形成无解的陆空闭环猎杀。",
          en: "Pouring through the torn SAM corridor, Israeli Mirages and Phantoms reclaim air supremacy overhead, forging a lethal air–ground loop with the advancing tank divisions."
        }
      },
      {
        actor: "red",
        focusUnits: ["idf-162", "idf-252", "egy-cairo"],
        focusPlaces: ["苏伊士城", "101公里处"],
        redSubpaths: [1],
        enemyIndices: [],
        markerIndices: [],
        sfx: "march",
        narration: {
          zh: "在空军贴身护航与马根第252师侧翼掩护下，阿丹第162师向南高速席卷，一举截断开罗通往苏伊士城的战略主干公路。",
          en: "With Magen's 252nd Division guarding the western flank and IAF jets striking ahead, Adan's 162nd Division sweeps south to sever the main Cairo–Suez highway."
        }
      },
      {
        actor: "red",
        focusUnits: ["idf-162", "idf-252", "egy-3army"],
        focusPlaces: ["阿达比亚港", "苏伊士城", "101公里处"],
        redSubpaths: [0, 1],
        enemyIndices: [],
        markerIndices: [1],
        sfx: "victory",
        banner: {
          zh: { kicker: "1973.10.23—24 · 战略大合围", title: "封锁阿达比亚 · 合围第三军团", sub: "进抵开罗公路101公里处，东岸三万埃军陷入绝境促成停火" },
          en: { kicker: "OCT 23–24, 1973 · ENCIRCLEMENT COMPLETE", title: "ADABIYA SEIZED · 3RD ARMY TRAPPED", sub: "Reaching Suez Bay and Km 101 toward Cairo seals 30,000 troops in the east-bank pocket" }
        },
        narration: {
          zh: "10月23日至24日，阿丹师夺占苏伊士湾阿达比亚港，将东岸约三万名埃及第三军团官兵彻底合围，先头直抵距开罗仅101公里处，最终促成全面停火，铸就现代合成战争的里程碑。",
          en: "Capturing Adabiya Port on the Gulf of Suez, IDF completely encircles thirty thousand troops of Egypt's Third Army and halts at Kilometer 101—cementing a watershed triumph of modern combined-arms warfare."
        }
      }
    ]
  }
};

export function getPhaseTurnScript(battleId, phaseId) {
  return TURN_SCRIPTS[battleId]?.[phaseId] || null;
}
