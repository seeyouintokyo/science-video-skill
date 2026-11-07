import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S1_DURATION = sceneDuration('s1');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S1: React.FC = () => (
  <SceneShell durationInFrames={S1_DURATION}>
    <Title lines={['第 1 屏标题']} />
    <Captions lines={sceneLines('s1')} durationInFrames={S1_DURATION} />
  </SceneShell>
);
