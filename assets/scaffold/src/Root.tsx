import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL_FRAMES} from './Video';
import {tokens} from './tokens';

// 只有一条完整成片。想单独调某一屏，临时加一条 Composition 指向那个屏组件即可
export const RemotionRoot = () => (
  <Composition
    id="Main"
    component={Video}
    durationInFrames={TOTAL_FRAMES}
    fps={tokens.canvas.fps}
    width={tokens.canvas.width}
    height={tokens.canvas.height}
  />
);
