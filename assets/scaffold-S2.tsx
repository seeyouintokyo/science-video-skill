import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S2_DURATION = sceneDuration('s2');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S2: React.FC = () => (
  <SceneShell durationInFrames={S2_DURATION}>
    <Title lines={['第 2 屏标题']} />
    <Captions lines={sceneLines('s2')} durationInFrames={S2_DURATION} />
  </SceneShell>
);
