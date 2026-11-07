import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S6_DURATION = sceneDuration('s6');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S6: React.FC = () => (
  <SceneShell durationInFrames={S6_DURATION}>
    <Title lines={['第 6 屏标题']} />
    <Captions lines={sceneLines('s6')} durationInFrames={S6_DURATION} />
  </SceneShell>
);
