import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S5_BONUS_DURATION = sceneDuration('s5');

const EARTH = {x: 960, y: 518, r: 68};
const ORBIT = 254;
const MOON_R = 42;

// 彩蛋：潮汐锁定，月亮永远只把同一面朝向地球
export const S5Bonus: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 26});

  // 整组沿轨道缓慢前进 14 度
  const drift = interpolate(frame, [20, S5_BONUS_DURATION - 20], [0, 14], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const angles = [45, 135, 225, 315].map((b) => b + drift);

  return (
    <SceneShell durationInFrames={S5_BONUS_DURATION}>
      <Title lines={['它只给你看同一面']} />

      <AbsoluteFill style={{opacity: enter}}>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          <circle cx={EARTH.x} cy={EARTH.y} r={ORBIT} fill="none" stroke={tokens.color.line} strokeWidth={2} strokeDasharray="6 12" />

          {angles.map((deg, i) => {
            const rad = (deg * Math.PI) / 180;
            const mx = EARTH.x + ORBIT * Math.cos(rad);
            const my = EARTH.y - ORBIT * Math.sin(rad);
            // 朝向地球的单位方向
            const ux = (EARTH.x - mx) / ORBIT;
            const uy = (EARTH.y - my) / ORBIT;
            const p = interpolate(frame - 24 - i * tokens.motion.stagger, [0, tokens.motion.normal], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <g key={i} opacity={p}>
                <line x1={EARTH.x} y1={EARTH.y} x2={mx} y2={my} stroke={tokens.color.line} strokeWidth={1.5} strokeDasharray="4 10" />
                <circle cx={mx} cy={my} r={MOON_R} fill={tokens.color.bgSoft} stroke={tokens.color.line} strokeWidth={2} />
                <circle cx={mx} cy={my} r={MOON_R * 0.92} fill="none" stroke={tokens.color.line} strokeWidth={1} opacity={0.5} />
                <circle cx={mx + ux * MOON_R * 0.6} cy={my + uy * MOON_R * 0.6} r={10} fill={tokens.color.accent} />
              </g>
            );
          })}

          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r * 1.4} fill={tokens.color.primary} opacity={0.1} />
          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill={tokens.color.primary} opacity={0.85} />
          <circle cx={EARTH.x} cy={EARTH.y} r={EARTH.r} fill="none" stroke={tokens.color.line} strokeWidth={2} />
        </svg>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 790,
          textAlign: 'center',
          fontSize: tokens.size.label,
          color: tokens.color.accent,
          letterSpacing: 2,
          opacity: interpolate(frame, [100, 122], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
        }}
      >
        黄点这一面，始终朝着地球
      </div>

      <Captions lines={sceneLines('s5')} durationInFrames={S5_BONUS_DURATION} />
    </SceneShell>
  );
};
