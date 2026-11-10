---
name: axing-science-video
description: 用 Remotion 代码画一条横屏科普动画短片（45 秒左右），配 MiniMax 中文解说、逐句字幕和 CC0 背景音乐，导出 mp4。当用户要做科普视频、知识短视频、原理动画、月相/四季/彩虹/行星这类"讲清楚一个现象"的动画视频，或提到 Remotion 科普片时使用。
---

# 科普视频 Skill

用代码画一条横屏科普动画视频，配中文解说 + 背景音乐，导出 mp4。整个流程：**分镜 → 用户确认 → 铺项目 → 配音定长 → 逐屏写画面 → 渲染**。

## 一、先确认用户给了什么

| 项 | 必须？ | 没给时的默认 |
|---|---|---|
| 题目 | 必须 | 停下来问，不要替用户选题 |
| MiniMax Key | 有解说就必填 | 没有就做无解说版，最后说明原因 |
| 分镜确认 | 必须 | 出了分镜等用户说「可以」再动手 |
| 时长 | 否 | 45 秒，上限 60 秒 |
| 画幅 | 否 | 横屏 1920×1080，30fps |
| 音乐 | 否 | `assets/bgm.mp3`（Outer Space Loop / wipics / CC0 可商用） |
| 音色 | 否 | `presenter_male`，女声用 `presenter_female` |
| 解说开关 | 否 | 默认有；用户明确说「不要解说」才关 |

Key 只从环境变量或项目 `.env` 读，**不要写进代码、分镜、回复，也不要打印出来**。

**用户提示词里已经写明的事（题目、时长、画幅、音乐怎么来），直接照做，不要再问一遍。唯一必须等用户点头的是分镜。**

## 二、五步流程

### 第 1 步：写分镜，给用户看

在项目根目录写 `分镜.md`，表格六列：

| 屏 | 时长 | 这屏讲什么 | 画面上有什么、怎么动 | 屏幕上的字 | 解说词 |

解说词按每秒 4.5 个字估长。**写完就发给用户，等确认再继续。**

### 第 2 步：铺项目

```bash
node <skill目录>/scripts/scaffold.mjs <项目目录>
cd <项目目录>
npm install --registry=https://registry.npmmirror.com
```

铺出来的是可运行骨架：`src/components/` 有星空背景、场景外壳、逐句字幕、标题、标注；`src/scenes/S1–S6` 是占位屏，逐个替换成真画面。

### 第 3 步：配音，用真实长度定每屏时长

1. 把六屏解说词写进 `src/narration.json`，`lines` 是字幕分段（一条 ≤20 字），拼起来就是这句语音。
2. 先填 `.env` 的 `MINIMAX_API_KEY`（或 `export MINIMAX_API_KEY=sk-xxx`）。
3. 跑 `node tools/tts.mjs`，它会合成 `public/voice/s1–s6.mp3`，并把「时长 = 语音长度 + 0.8 秒」写进 `src/voice.json`。
4. 各屏**从 `voice.json` 取时长**（`sceneDuration('s3')`），不要把帧数写死；画面里所有动画节点都用 `DURATION - 常数` 表达，改解说词不用重调节奏。

### 第 4 步：一屏一个文件，写完就截图

```bash
npx remotion still src/index.ts Main out/check-S1.png --frame=<这屏中间帧>
```

打开图看：文字溢出、元素重叠、画面空洞、字幕被挡。**有问题只改这一屏，改好再写下一屏。**
单屏调试时，临时在 `src/Root.tsx` 加一条 Composition 指向那个屏组件，比在整片里找帧快。

### 第 5 步：渲染

```bash
npx remotion render src/index.ts Main out/video.mp4
ffmpeg -i out/video.mp4 -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:"
```

响度按 **-16 LUFS、峰值 ≤ -1.5 dBFS** 交付。偏轻就抬 `src/Video.tsx` 里的 `VOICE_GAIN` / `BGM_GAIN`，别用 ffmpeg 二次压，保持一条命令能重出。

## 三、内容规则

六段结构，45 秒左右：

1. **钩子**（4–5s）反常识问题开场。
2. **误区**（5–7s）先说大家以为的答案，打红叉。
3. **原理**（6–8s）一张图 + 一句话说清。
4. **核心演示**（10–15s）全片最重要，必须真动起来，最好同时给两种视角（如「从太空看」vs「从地球看」）。
5. **彩蛋**（6–8s）再补一个冷知识。
6. **总结**（5–8s）一句话 + 一个关键数字。

- 一屏只讲一件事，屏上字 ≤2 行，一行 ≤16 字。
- 能用图就不用字：比例用大小、过程用移动、对比用左右、因果用箭头。
- 关键数字用 `tokens.color.accent`，要大。
- 知识点必须准确；不确定的数字不写，宁可不给。

## 四、画面规则

- 颜色、字号、间距、动画帧数**只从 `src/tokens.ts` 取**，不新造色值。换风格只改这个文件。
- 四边留 `tokens.space.safe`，字不贴边；主体放中上部，底部留给字幕。
- 只画：圆、线、矩形、SVG 路径、渐变、文字。不联网、不用外部图片和 3D。
- 动画只能由帧号算出来：`useCurrentFrame` + `interpolate` / `spring`。**禁用 CSS 动画、`setTimeout`、`Math.random()`**；要随机用 Remotion 的 `random('种子')`。
- 统一缓动 `Easing.bezier(...tokens.motion.ease)`；元素按 `tokens.motion.stagger` 依次进场；屏间淡入淡出 `tokens.motion.sceneFade` 帧。
- 动要有意义：轨道在转、光在照、箭头在指，不为动而动。

常用画法（月相、轨道、平行光束、分屏对比、逐句字幕时间分配）见 `references/remotion-recipes.md`。

## 五、音频

- 解说：每屏一段 mp3，从该屏第 `tokens.audio.voiceDelay` 帧开口，避免切屏切掉尾音。
- 字幕：就是解说词原句，按字数比例分配时间，一句一条，跟着语音出现消失。`components/Typography.tsx` 的 `Captions` 已实现，传 `lines` + `durationInFrames` 即可。
- 音乐：有解说时用 `tokens.audio.bgmVolumeWithVoice`，无解说用 `bgmVolume`。音乐比片子短用 `<Loop>` 包一层，比片子长就靠结尾淡出截断。
- 用户自己给 mp3 就替换 `public/bgm.mp3`（商用授权由用户负责）；没有可用音乐时回落到自带 CC0，并在交付时说明来源。
- MiniMax 语音接口的端点、请求体、返回字段、错误码见 `references/minimax-tts.md`，`scripts/tts.mjs`（项目里是 `tools/tts.mjs`）已按它实现。

## 六、常见失败

| 现象 | 处理 |
|---|---|
| `npm install` 慢或报网络错 | 加 `--registry=https://registry.npmmirror.com` |
| 渲染时下载浏览器失败 | 加 `--browser-executable="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"`，Windows 用 `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| 中文变方块 | 字体走 `tokens.font.family`，不要引网络字体 |
| `insufficient balance` | 停下来让用户充值，**不要反复重试** |
| 模型不存在 | `.env` 里加 `MINIMAX_TTS_MODEL=speech-2.6-hd` |
| 连不上 `api.minimaxi.com` | 海外账号换 `https://api.minimax.io` 再试一次 |
| 截图里没元素 | 透明度动画还没开始，换靠后的帧 |
| 画面每次不一样 | 用了 `Math.random()` 或 CSS 动画，改成按帧计算 |

单屏代码 ≤150 行，复杂就拆 `components/`。同一条命令 3 分钟没进度就停下来告诉用户卡在哪。同一个报错连修 3 次不好就停下来，把报错原文和试过的办法交给用户。
