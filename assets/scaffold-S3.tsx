import React from 'react';
import {SceneShell} from '../components/Starfield';
import {Captions, Title} from '../components/Typography';
import {sceneDuration, sceneLines} from '../voiceData';

export const S3_DURATION = sceneDuration('s3');

// 占位屏：换成真画面，画法见 references/remotion-recipes.md
export const S3: React.FC = () => (
  <SceneShell durationInFrames={S3_DURATION}>
    <Title lines={['第 3 屏标题']} />
    <Captions lines={sceneLines('s3')} durationInFrames={S3_DURATION} />
  </SceneShell>
);
