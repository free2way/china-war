# China War · 交互战争沙盘

一个以数据驱动方式呈现中国战争史的交互沙盘框架。首个战役为 1935 年中央红军四渡赤水。

## 本地运行

项目无构建依赖，直接托管 `dist/` 即可：

```bash
python3 -m http.server 43119 --directory dist
```

然后访问 `http://127.0.0.1:43119`。

## Vercel 部署

仓库根目录的 `vercel.json` 已将静态输出目录声明为 `dist`。将仓库导入 Vercel 后无需填写构建命令；Vercel 会直接发布 `dist/index.html` 及其资源。

## 目录

```text
dist/
├── index.html                 # 共享页面骨架与 SVG 地图
├── styles.css                # 共享视觉系统与响应式规则
├── app.js                    # 通用沙盘交互引擎
└── data/
    ├── battles.js            # 战役注册表与数据加载器
    └── chishui-1935.js       # 四渡赤水战役数据
```

## 添加新战役

1. 在 `dist/data/` 新建 `<battle-id>.js`，按 `chishui-1935.js` 的结构提供：
   - `commanders`：双方主要指挥者
   - `orderOfBattle`：双方战斗序列
   - `phases`：阶段日期、目的、结果、路线、地点、事件和部队位置
2. 在 `dist/data/battles.js` 注册战役，并在 `loadBattle()` 中添加动态导入。
3. 为新战役准备地图底图与地点坐标。当前 SVG 底图位于 `index.html`；后续可继续抽象为每场战役自己的 SVG 模板。
4. 通过 `?battle=<battle-id>` 加载指定战役。

### 阶段数据约定

每个阶段的核心字段：

```js
{
  id: "phase-id",
  name: "阶段名",
  date: "日期范围",
  intent: "为什么这样行动",
  goal: "行动目的",
  result: "行动结果",
  route: "SVG path d",
  keys: ["关键地点"],
  detail: [["日期", "事件", "解释"]],
  formations: [
    {
      id: "跨阶段稳定的部队 ID",
      side: "red | blue",
      label: "地图番号",
      sub: "指挥员或当前任务",
      x: 300,
      y: 260
    }
  ]
}
```

跨阶段复用同一个 `formation.id`，引擎会把该番号移动到新坐标；新增或撤出的部队则会淡入、淡出。

## 史料原则

- 战役地图用于展示方向、相对位置和指挥关系，不作为精确测绘地图。
- 数字、日期、番号和指挥关系应优先采用军事科学院、国防部、中国军网、中央党史和文献研究院等公开资料。
- 对存在不同记载的细节，应在页面中使用“约”“主要”“态势示意”等限定语。
