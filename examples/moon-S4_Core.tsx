import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {MoonPhase, MoonTopView} from '../components/MoonPhase';
import {SceneShell} from '../components/Starfield';
import {Captions, Label, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S4_CORE_DURATION = sceneDuration('s4');

const EARTH = {x: 500, y: 590, r: 58};
const ORBIT = 206;
const BIG_MOON = {x: 1390, y: 545, r: 185};

const phaseName = (deg: number) => {
  if (deg < 12) return '新月';
  if (deg < 78) return '蛾眉月';
  if (deg < 102) return '上弦月';
  if (deg < 168) return '盈凸月';
  return '满月';
};

// 核心演示：同一个月亮，公转位置不同，从地球看到被照亮部分的比例不同
export const S4Core: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 24});
  const pillIn = spring({frame: frame - (S4_CORE_DURATION - 116), fps, config: tokens.motion.spring, durationInFrames: 20});

  // 月球沿轨道走半圈：新月 → 满月
  const a = interpolate(frame, [24, S4_CORE_DURATION - 30], [0, Math.PI], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const deg = (a * 180) / Math.PI;
  const mx = EARTH.x + ORBIT * Math.cos(a);
  const my = EARTH.y - ORBIT * Math.sin(a);
  const k = (1 - Math.cos(a)) / 2;

  return (
    <SceneShell durationInFrames={S4_CORE_DURATION}>
      <Title lines={['位置一变，看到的部分就变']} />

      <AbsoluteFill style={{opacity: enter}}>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          {/* 分屏竖线 */}
          <line x1={960} y1={205} x2={960} y2={900} stroke={tokens.color.line} strokeWidth={2} />

          {/* 左：从太空看 */}
          <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT} fill="none" stroke={tokens.color.line} strokeWidth={2} strokeDasharray="6 12" />

          {/* 阳光：从右侧平行射入 */}
          {new Array(5).fill(0).map((_, i) => {
            const y = 380 + i * 90;
            return (
              <g key={i}>
                <line x1={910} y1={y} x2={746} y2={y} stroke={tokens.color.accent} strokeWidth={3} strokeDasharray="20 22" strokeDashoffset={-frame * 4} opacity={0.55} />
                <polygon points={`730,${y} 746,${y - 8} 746,${y + 8}`} fill={tokens.color.accent} opacity={0.7} />
              </g>
            );
          })}

          {/* 视线：地球看向月亮 */}
          <line x1={EARTH.x} y1={EARTH.y} x2={mx} y2={my} stroke={tokens.color.primary} strokeWidth={2} strokeDasharray="6 10" opacity={0.4} />

          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill={tokens.color.primary} opacity={0.85} />
          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="none" stroke={tokens.color.line} strokeWidth={2} />
          <MoonTopView cx={mx} cy={my} r={26} />

          {/* 右：从地球看 */}
          <MoonPhase cx={BIG_MOON.x} cy={BIG_MOON.y} r={BIG_MOON.r} k={k} litSide="right" glow={0.6} />
        </svg>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: tokens.space.safe + 4, top: 228, fontSize: tokens.size.label, color: tokens.color.muted, letterSpacing: 2}}>
        从太空看
      </div>
      <div style={{position: 'absolute', left: 1004, top: 228, fontSize: tokens.size.label, color: tokens.color.muted, letterSpacing: 2}}>
        从地球看
      </div>

      <Label x={EARTH.x} y={EARTH.y + 72}>地球</Label>
      <Label x={812} y={332}>阳光</Label>
      <Label x={BIG_MOON.x} y={BIG_MOON.y + BIG_MOON.r + 34}>{phaseName(deg)}</Label>

      {/* 关键数字 */}
      <div style={{position: 'absolute', right: tokens.space.safe, top: 150, textAlign: 'right', opacity: pillIn, transform: `translateY(${(1 - pillIn) * 18}px)`}}>
        <div style={{fontSize: tokens.size.label, color: tokens.color.muted, letterSpacing: 2}}>从新月到满月</div>
        <div style={{fontSize: tokens.size.title, color: tokens.color.accent, fontFamily: tokens.font.number, fontWeight: 700, lineHeight: 1.2}}>
          约 15 天
        </div>
      </div>

      <Captions lines={sceneLines('s4')} durationInFrames={S4_CORE_DURATION} />
    </SceneShell>
  );
};
