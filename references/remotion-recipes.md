# 画法速查

都是纯 SVG + 帧号计算，复制进 `src/scenes/Sx.tsx` 就能用。所有颜色、尺寸从 `tokens` 取。

## 1. 月相（被照亮比例 k）

亮区 = 亮侧半圆 + 一条椭圆明暗界线，椭圆半宽 = `r * |2k - 1|`。`k=0` 新月、`0.5` 半月、`1` 满月。

```tsx
const rx = Math.max(0.5, r * Math.abs(2 * k - 1));
const sweep = k < 0.5 ? 0 : 1; // 小于半月朝亮侧鼓，大于半月朝暗侧鼓
// 亮面路径（litSide === 'left' 时给外层 <g> 加 scale(-1 1) 镜像）
<path
  d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${rx} ${r} 0 0 ${sweep} ${cx} ${cy - r} Z`}
  fill="url(#moonLit)"
/>
```

`assets/scaffold/src/components/MoonPhase.tsx` 是封装好的版本，直接 `<MoonPhase cx cy r k litSide glow />`。

## 2. 轨道运动

角度由帧号线性推进，位置用极坐标。太阳在右侧时，朝太阳那半永远亮 → `MoonTopView`。

```tsx
const a = interpolate(frame, [24, DURATION - 30], [0, Math.PI], {
  extrapolateLeft: 'clamp',
  extrapolateRight: 'clamp',
});
const mx = earth.x + orbit * Math.cos(a);
const my = earth.y - orbit * Math.sin(a); // 减号：逆时针
```

一个周期走完 `2π`；走半圈用 `Math.PI`。别用 `frame % n` 之外的时间函数，帧号必须唯一决定画面。

## 3. 平行光束

从天体边缘出发的一组虚线，`strokeDashoffset={-frame * 5}` 让虚线流动起来。

```tsx
{new Array(7).fill(0).map((_, i) => {
  const y = 250 + i * 80;
  return (
    <line key={i} x1={268} y1={y} x2={930} y2={y}
      stroke={tokens.color.accent} strokeWidth={4}
      strokeDasharray="30 26" strokeDashoffset={-frame * 5} opacity={0.7} />
  );
})}
```

## 4. 左右分屏

一条竖线分两半，`width/2` 为界。左侧放「从太空看」俯视图，右侧放「从地球看」的主视角，两边共用同一个 `k`，观众才能对上。

```tsx
<line x1={960} y1={205} x2={960} y2={900} stroke={tokens.color.line} strokeWidth={2} />
```

## 5. 逐句字幕的时间分配

一段语音里有多句时，按字数比例切时间，比平均分更贴人声。

```tsx
const total = lines.reduce((a, l) => a + l.length, 0);
const speakStart = tokens.audio.voiceDelay;
const speakEnd = durationInFrames - 24; // 尾部留 0.8 秒
let acc = 0;
const spans = lines.map((text) => {
  const start = speakStart + (acc / total) * (speakEnd - speakStart);
  acc += text.length;
  const end = speakStart + (acc / total) * (speakEnd - speakStart);
  return {text, start, end};
});
```

`Captions` 组件已实现，直接传 `lines` 和 `durationInFrames`。

## 6. 进场与强调

- 元素进场：`useRise(delay)`（淡入 + 上移 22px）或 `spring({frame, fps, config: tokens.motion.spring})`。
- 关键数字弹入：`spring({frame: frame - (DURATION - 116), ...})`，保证它出现在解说提到这个数字之后。
- 打叉 / 打勾：`<line>` 交叉叠在主体上，`strokeWidth` 给到 17 才看得清。

## 7. 时长自适应

所有动画节点写成 `DURATION - 常数`，不要写死帧号。改了 `narration.json` 重新跑 `tts.mjs` 后，画面节奏自动跟着变长变短。

```tsx
export const S4_DURATION = sceneDuration('s4');
const a = interpolate(frame, [24, S4_DURATION - 30], [0, Math.PI], ...);
```
