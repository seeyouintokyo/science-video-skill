import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {tokens} from '../tokens';
import {MoonPhase} from '../components/MoonPhase';
import {SceneShell, useRise} from '../components/Starfield';
import {Captions} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S6_SUMMARY_DURATION = sceneDuration('s6');

// 总结：月亮没变，变的是我们看它的角度
export const S6Summary: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame, fps, config: tokens.motion.spring, durationInFrames: 24});
  const pill = spring({frame: frame - (S6_SUMMARY_DURATION - 96), fps, config: tokens.motion.spring, durationInFrames: 20});

  const k = interpolate(frame, [10, S6_SUMMARY_DURATION - 92], [1, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(...tokens.motion.ease),
  });

  const line1 = useRise(18);
  const line2 = useRise(18 + tokens.motion.stagger * 2);

  return (
    <SceneShell durationInFrames={S6_SUMMARY_DURATION}>
      <AbsoluteFill>
        <svg width={tokens.canvas.width} height={tokens.canvas.height}>
          <g style={{opacity: enter}}>
            <MoonPhase cx={560} cy={520} r={196} k={k} litSide="left" glow={0.7} />
          </g>
        </svg>
      </AbsoluteFill>

      <div style={{position: 'absolute', left: 900, top: 360, width: 830}}>
        <div style={{...line1, fontSize: tokens.size.title, fontWeight: 600, color: tokens.color.text, lineHeight: 1.3, letterSpacing: 2}}>
          月亮没有变
        </div>
        <div style={{...line2, marginTop: 14, fontSize: tokens.size.title, fontWeight: 600, color: tokens.color.text, lineHeight: 1.3, letterSpacing: 2}}>
          变的是我们看它的角度
        </div>

        <div
          style={{
            marginTop: 46,
            display: 'flex',
            alignItems: 'center',
            gap: tokens.space.gap,
            opacity: pill,
            transform: `translateY(${(1 - pill) * 16}px)`,
          }}
        >
          <div
            style={{
              fontSize: tokens.size.hero,
              fontWeight: 700,
              fontFamily: tokens.font.number,
              color: tokens.color.accent,
              lineHeight: 1,
              letterSpacing: 2,
            }}
          >
            29.5 天
          </div>
          <div style={{fontSize: tokens.size.label, color: tokens.color.muted, letterSpacing: 2}}>
            一次完整的圆缺
          </div>
        </div>
      </div>

      <Captions lines={sceneLines('s6')} durationInFrames={S6_SUMMARY_DURATION} />
    </SceneShell>
  );
};
