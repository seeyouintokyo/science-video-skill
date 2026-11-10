import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {tokens} from '../tokens';

// 底部说明字幕：距底 captionBottom，居中，半透明深色底
export const Caption: React.FC<{text: string; durationInFrames: number}> = ({
  text,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const start = 12;
  const opacity = interpolate(
    frame,
    [start, start + tokens.motion.normal, durationInFrames - 16, durationInFrames - 3],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );
  const rise = interpolate(frame - start, [0, tokens.motion.normal], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(...tokens.motion.ease),
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: tokens.space.captionBottom,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: '16px 44px',
          borderRadius: tokens.radius.pill,
          background: 'rgba(7,11,24,0.72)',
          border: `1px solid ${tokens.color.line}`,
          color: tokens.color.muted,
          fontSize: tokens.size.caption,
          lineHeight: 1.4,
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        {text}
      </div>
    </div>
  );
};

// 逐句字幕：把一屏的解说词拆成几条，按字数比例分配时间，跟着语音出现和消失
export const Captions: React.FC<{lines: string[]; durationInFrames: number}> = ({
  lines,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const total = lines.reduce((a, l) => a + l.length, 0);
  // 语音从 voiceDelay 开始，到「解说长度」结束（durationInFrames 里留了 24 帧尾巴）
  const speakStart = tokens.audio.voiceDelay;
  const speakEnd = Math.max(speakStart + 12, durationInFrames - 24);

  let acc = 0;
  const spans = lines.map((text) => {
    const start = speakStart + (acc / total) * (speakEnd - speakStart);
    acc += text.length;
    const end = speakStart + (acc / total) * (speakEnd - speakStart);
    return {text, start, end};
  });

  const span = spans.find((s) => frame >= s.start - 4 && frame <= s.end + 4) ?? null;
  if (!span) return null;

  const opacity = interpolate(
    frame,
    [span.start - 4, span.start + 6, span.end - 4, span.end + 4],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
  );

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: tokens.space.captionBottom,
        display: 'flex',
        justifyContent: 'center',
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 1500,
          padding: '16px 44px',
          borderRadius: tokens.radius.pill,
          background: 'rgba(7,11,24,0.72)',
          border: `1px solid ${tokens.color.line}`,
          color: tokens.color.text,
          fontSize: tokens.size.caption,
          lineHeight: 1.4,
          letterSpacing: 1,
          textAlign: 'center',
        }}
      >
        {span.text}
      </div>
    </div>
  );
};

// 屏幕上方的标题，逐行进场
export const Title: React.FC<{lines: string[]; top?: number}> = ({lines, top = 88}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: tokens.space.safe, top}}>
      {lines.map((line, i) => {
        const delay = 6 + i * tokens.motion.stagger;
        const p = interpolate(frame - delay, [0, tokens.motion.normal], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(...tokens.motion.ease),
        });
        return (
          <div
            key={line}
            style={{
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px)`,
              fontSize: tokens.size.title,
              fontWeight: 600,
              color: tokens.color.text,
              lineHeight: 1.28,
              letterSpacing: 2,
            }}
          >
            {line}
          </div>
        );
      })}
    </div>
  );
};

// 图上小标注
export const Label: React.FC<{x: number; y: number; children: React.ReactNode; opacity?: number}> = ({
  x,
  y,
  children,
  opacity = 1,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translateX(-50%)',
      fontSize: tokens.size.label,
      color: tokens.color.muted,
      opacity,
      letterSpacing: 2,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
);
