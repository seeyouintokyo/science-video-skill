import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {SceneShell} from '../components/Starfield';
import {Captions, Label, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S2_MYTH_DURATION = sceneDuration('s2');
const CROSS_AT = S2_MYTH_DURATION - 70; // 解说讲到「挡住了」时打叉

const SUN = {x: 236, y: 556, r: 92};
const EARTH = {x: 900, y: 556, r: 78};
const MOON = {x: 1556, y: 556, r: 40};

// 误区：以为是地球的影子挡住了月亮
export const S2Myth: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 24});
  const crossIn = spring({frame: frame - CROSS_AT, fps, config: tokens.motion.spring, durationInFrames: 20});
  // 打叉后地球这边压暗，太阳保持明亮
  const dim = interpolate(frame, [CROSS_AT, CROSS_AT + 28], [1, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(...tokens.motion.ease),
  });

  // 影子锥：从地球朝月亮方向张开
  const cone = '974,614 1606,672 1606,440 974,498';

  return (
    <SceneShell durationInFrames={S2_MYTH_DURATION}>
      <Title lines={['很多人以为：地球的影子挡住了它']} />

      <AbsoluteFill style={{opacity: dim}}>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          <g style={{opacity: enter}}>
            {/* 影子锥 */}
            <polygon
              points={cone}
              fill={tokens.color.bgSoft}
              opacity={0.95}
              stroke={tokens.color.muted}
              strokeOpacity={0.3}
              strokeWidth={2}
              strokeDasharray="10 12"
            />

            {/* 地球 */}
            <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill={tokens.color.primary} opacity={0.85} />
            <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="none" stroke={tokens.color.line} strokeWidth={2} />

            {/* 月亮 */}
            <circle cx={MOON.x} cy={MOON.y} r={MOON.r} fill={tokens.color.text} opacity={0.92} />

            {/* 红叉：压在月亮上 */}
            <g
              style={{
                opacity: crossIn,
                transform: `translate(${MOON.x}px ${MOON.y}px) scale(${0.6 + crossIn * 0.4}) translate(${-MOON.x}px ${-MOON.y}px)`,
              }}
            >
              <line x1={MOON.x - 70} y1={MOON.y - 70} x2={MOON.x + 70} y2={MOON.y + 70} stroke={tokens.color.warn} strokeWidth={17} strokeLinecap="round" />
              <line x1={MOON.x - 70} y1={MOON.y + 70} x2={MOON.x + 70} y2={MOON.y - 70} stroke={tokens.color.warn} strokeWidth={17} strokeLinecap="round" />
            </g>
          </g>
        </svg>
      </AbsoluteFill>

      {/* 太阳单独一层，不跟着变暗 */}
      <AbsoluteFill style={{opacity: enter}}>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 1.44} fill="none" stroke={tokens.color.accent} strokeWidth={2} opacity={0.26} />
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 1.18} fill="none" stroke={tokens.color.accent} strokeWidth={7} opacity={0.14} />
          <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill={tokens.color.accent} />
          {new Array(8).fill(0).map((_, i) => {
            const a = (i / 8) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={SUN.x + Math.cos(a) * (SUN.r + 16)}
                y1={SUN.y + Math.sin(a) * (SUN.r + 16)}
                x2={SUN.x + Math.cos(a) * (SUN.r + 42)}
                y2={SUN.y + Math.sin(a) * (SUN.r + 42)}
                stroke={tokens.color.accent}
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.55}
              />
            );
          })}
        </svg>
      </AbsoluteFill>

      <Label x={SUN.x} y={SUN.y + 132}>太阳</Label>
      <Label x={EARTH.x} y={EARTH.y + 116}>地球</Label>
      <Label x={MOON.x} y={MOON.y - 132}>月亮</Label>

      <Captions lines={sceneLines('s2')} durationInFrames={S2_MYTH_DURATION} />
    </SceneShell>
  );
};
