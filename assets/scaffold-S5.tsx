import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S5_DURATION = sceneDuration('s5');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S5: React.FC = () => (
  <SceneShell durationInFrames={S5_DURATION}>
    <Title lines={['第 5 屏标题']} />
    <Captions lines={sceneLines('s5')} durationInFrames={S5_DURATION} />
  </SceneShell>
);
