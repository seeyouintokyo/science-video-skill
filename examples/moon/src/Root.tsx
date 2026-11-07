import React from 'react';
import {Composition} from 'remotion';
import {Video, TOTAL_FRAMES} from './Video';
import {tokens} from './tokens';
import {S1Hook, S1_HOOK_DURATION} from './scenes/S1_Hook';
import {S2Myth, S2_MYTH_DURATION} from './scenes/S2_Myth';
import {S3Why, S3_WHY_DURATION} from './scenes/S3_Why';
import {S4Core, S4_CORE_DURATION} from './scenes/S4_Core';
import {S5Bonus, S5_BONUS_DURATION} from './scenes/S5_Bonus';
import {S6Summary, S6_SUMMARY_DURATION} from './scenes/S6_Summary';

const {width, height, fps} = tokens.canvas;

export const RemotionRoot = () => (
  <>
    <Composition id="Main" component={Video} durationInFrames={TOTAL_FRAMES} fps={fps} width={width} height={height} />
    {/* 下面是单屏预览用，方便逐屏截图检查 */}
    <Composition id="S1" component={S1Hook} durationInFrames={S1_HOOK_DURATION} fps={fps} width={width} height={height} />
    <Composition id="S2" component={S2Myth} durationInFrames={S2_MYTH_DURATION} fps={fps} width={width} height={height} />
    <Composition id="S3" component={S3Why} durationInFrames={S3_WHY_DURATION} fps={fps} width={width} height={height} />
    <Composition id="S4" component={S4Core} durationInFrames={S4_CORE_DURATION} fps={fps} width={width} height={height} />
    <Composition id="S5" component={S5Bonus} durationInFrames={S5_BONUS_DURATION} fps={fps} width={width} height={height} />
    <Composition id="S6" component={S6Summary} durationInFrames={S6_SUMMARY_DURATION} fps={fps} width={width} height={height} />
  </>
);
