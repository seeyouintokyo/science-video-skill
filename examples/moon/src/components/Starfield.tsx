import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {tokens} from '../tokens';

// 淡星点背景：位置用 random(种子) 固定，闪烁由帧号算出，不用 Math.random
const STARS = new Array(80).fill(0).map((_, i) => ({
  x: random(`sx${i}`) * tokens.canvas.width,
  y: random(`sy${i}`) * tokens.canvas.height,
  r: 0.8 + random(`sr${i}`) * 1.7,
  phase: random(`sp${i}`) * Math.PI * 2,
}));

export const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = tokens.canvas;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 38%, ${tokens.color.bgSoft} 0%, ${tokens.color.bg} 64%)`,
      }}
    >
      <svg width={width} height={height}>
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={tokens.color.text}
            opacity={0.22 + 0.3 * (0.5 + 0.5 * Math.sin(frame / 24 + s.phase))}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// 每屏的统一外壳：淡入淡出 + 背景
export const SceneShell: React.FC<{
  durationInFrames: number;
  children: React.ReactNode;
}> = ({durationInFrames, children}) => {
  const frame = useCurrentFrame();
  const fade = tokens.motion.sceneFade;
  const opacity = interpolate(
    frame,
    [0, fade, durationInFrames - fade, durationInFrames - 1],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  return (
    <AbsoluteFill style={{opacity, fontFamily: tokens.font.family}}>
      {children}
    </AbsoluteFill>
  );
};

// 进场：淡入 + 轻微上移
export const useRise = (delay: number, distance = 22) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, tokens.motion.normal], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(...tokens.motion.ease),
  });
  return {opacity: p, transform: `translateY(${(1 - p) * distance}px)`};
};
