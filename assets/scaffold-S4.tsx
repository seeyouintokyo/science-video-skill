import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S4_DURATION = sceneDuration('s4');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S4: React.FC = () => (
  <SceneShell durationInFrames={S4_DURATION}>
    <Title lines={['第 4 屏标题']} />
    <Captions lines={sceneLines('s4')} durationInFrames={S4_DURATION} />
  </SceneShell>
);
