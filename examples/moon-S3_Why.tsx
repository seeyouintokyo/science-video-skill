import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {MoonPhase} from '../components/MoonPhase';
import {SceneShell} from '../components/Starfield';
import {Captions, Label, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S3_WHY_DURATION = sceneDuration('s3');

const SUN = {x: 152, y: 500, r: 76};
const MOON = {x: 1180, y: 490, r: 200};

// 原理：月亮自己不发光，只反射太阳光，太阳只照亮它的一半
export const S3Why: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 24});
  const moonIn = spring({frame: frame - 10, fps, config: tokens.motion.spring, durationInFrames: 24});

  return (
    <SceneShell durationInFrames={S3_WHY_DURATION}>
      <Title lines={['它不发光，只反射太阳光']} />

      <AbsoluteFill>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          {/* 太阳：两层光圈，不用实心光晕（实心会发闷） */}
          <g style={{opacity: enter}}>
            <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 1.42} fill="none" stroke={tokens.color.accent} strokeWidth={2} opacity={0.28} />
            <circle cx={SUN.x} cy={SUN.y} r={SUN.r * 1.18} fill="none" stroke={tokens.color.accent} strokeWidth={6} opacity={0.14} />
            <circle cx={SUN.x} cy={SUN.y} r={SUN.r} fill={tokens.color.accent} />
          </g>

          {/* 平行光线：虚线沿 x 轴流动 */}
          {new Array(7).fill(0).map((_, i) => {
            const y = 250 + i * 80;
            return (
              <line
                key={i}
                x1={268}
                y1={y}
                x2={930}
                y2={y}
                stroke={tokens.color.accent}
                strokeWidth={4}
                strokeDasharray="30 26"
                strokeDashoffset={-frame * 5}
                opacity={interpolate(enter, [0, 1], [0, 0.7])}
              />
            );
          })}

          {/* 月亮：左半亮，右半暗 */}
          <g style={{opacity: moonIn}}>
            <MoonPhase cx={MOON.x} cy={MOON.y} r={MOON.r} k={0.5} litSide="left" glow={0.8} />
          </g>

          {/* 明暗分界线 */}
          <line
            x1={MOON.x}
            y1={MOON.y - MOON.r - 24}
            x2={MOON.x}
            y2={MOON.y + MOON.r + 24}
            stroke={tokens.color.line}
            strokeWidth={2}
            strokeDasharray="8 10"
            opacity={moonIn}
          />
        </svg>
      </AbsoluteFill>

      <Label x={MOON.x} y={MOON.y - MOON.r - 72}>明暗分界线</Label>
      <div
        style={{
          position: 'absolute',
          left: MOON.x + MOON.r + 42,
          top: MOON.y - 22,
          fontSize: tokens.size.label,
          color: tokens.color.muted,
          opacity: moonIn,
          letterSpacing: 2,
        }}
      >
        永远背对太阳
      </div>

      <Captions lines={sceneLines('s3')} durationInFrames={S3_WHY_DURATION} />
    </SceneShell>
  );
};
