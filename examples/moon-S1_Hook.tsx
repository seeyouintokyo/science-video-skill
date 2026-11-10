import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {MoonPhase} from '../components/MoonPhase';
import {SceneShell, useRise} from '../components/Starfield';
import {Captions} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S1_HOOK_DURATION = sceneDuration('s1');

// 钩子：月亮形状没变，变的是我们看到的部分
export const S1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 26});
  // 第 40 帧起，暗影从右侧啃进来
  const k = interpolate(frame, [34, S1_HOOK_DURATION - 14], [1, 0.42], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(...tokens.motion.ease),
  });

  const line1 = useRise(8);
  const line2 = useRise(8 + tokens.motion.stagger * 2);

  return (
    <SceneShell durationInFrames={S1_HOOK_DURATION}>
      <AbsoluteFill>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          <g style={{opacity: enter, transform: `translateY(${(1 - enter) * 24}px)`}}>
            <MoonPhase cx={1400} cy={470} r={205 * (0.9 + enter * 0.1)} k={k} litSide="left" glow={1} />
          </g>
        </svg>

        <div style={{position: 'absolute', left: tokens.space.safe, top: 300, maxWidth: 1010}}>
          <div
            style={{
              ...line1,
              fontSize: tokens.size.hero,
              fontWeight: 600,
              color: tokens.color.text,
              lineHeight: 1.3,
              letterSpacing: 3,
            }}
          >
            月亮一直是圆的
          </div>
          <div
            style={{
              ...line2,
              marginTop: 18,
              fontSize: tokens.size.hero,
              fontWeight: 600,
              color: tokens.color.primary,
              lineHeight: 1.3,
              letterSpacing: 3,
            }}
          >
            缺的那块去哪了？
          </div>
        </div>

        <Captions lines={sceneLines('s1')} durationInFrames={S1_HOOK_DURATION} />
      </AbsoluteFill>
    </SceneShell>
  );
};
