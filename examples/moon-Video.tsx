import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, Sequence, staticFile} from 'remotion';
import {tokens} from './tokens';
import {Starfield} from './components/Starfield';
import {VOICE} from './voiceData';
import {S1Hook, S1_HOOK_DURATION} from './scenes/S1_Hook';
import {S2Myth, S2_MYTH_DURATION} from './scenes/S2_Myth';
import {S3Why, S3_WHY_DURATION} from './scenes/S3_Why';
import {S4Core, S4_CORE_DURATION} from './scenes/S4_Core';
import {S5Bonus, S5_BONUS_DURATION} from './scenes/S5_Bonus';
import {S6Summary, S6_SUMMARY_DURATION} from './scenes/S6_Summary';

// 每屏时长 = 该屏解说长度 + 0.8 秒，由 tools/tts.mjs 量出来写进 src/voice.json
export const SCENE_FRAMES = [
  S1_HOOK_DURATION, // 钩子
  S2_MYTH_DURATION, // 误区
  S3_WHY_DURATION, // 原理
  S4_CORE_DURATION, // 核心演示
  S5_BONUS_DURATION, // 彩蛋
  S6_SUMMARY_DURATION, // 总结
];

export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

const SCENE_IDS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

// 成片响度实测 -20.8 LUFS，偏小；人声和音乐一起抬，目标 -16 LUFS
const VOICE_GAIN = 1.6;
const BGM_GAIN = 1.65;

// 每屏解说：延后 voiceDelay 帧开口
const Voice: React.FC<{id: (typeof SCENE_IDS)[number]}> = ({id}) => (
  <Sequence from={tokens.audio.voiceDelay} durationInFrames={VOICE[id].frames}>
    <Audio src={staticFile(`voice/${id}.mp3`)} volume={tokens.audio.voiceVolume * VOICE_GAIN} />
  </Sequence>
);

export const Video: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: tokens.color.bg}}>
    {/* 星空只在最外层画一次，屏与屏交叉时不会整屏变黑 */}
    <Starfield />

    <Series>
      <Series.Sequence durationInFrames={SCENE_FRAMES[0]}>
        <S1Hook />
        <Voice id="s1" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[1]}>
        <S2Myth />
        <Voice id="s2" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[2]}>
        <S3Why />
        <Voice id="s3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[3]}>
        <S4Core />
        <Voice id="s4" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[4]}>
        <S5Bonus />
        <Voice id="s5" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[5]}>
        <S6Summary />
        <Voice id="s6" />
      </Series.Sequence>
    </Series>

    {/* 背景音乐：套件自带 bgm.mp3（CC0），有解说时压低音量 */}
    <Audio
      src={staticFile('bgm.mp3')}
      volume={(f) =>
        interpolate(
          f,
          [0, tokens.audio.fadeIn, TOTAL_FRAMES - tokens.audio.fadeOut, TOTAL_FRAMES],
          [0, tokens.audio.bgmVolumeWithVoice * BGM_GAIN, tokens.audio.bgmVolumeWithVoice * BGM_GAIN, 0],
          {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}
        )
      }
    />
  </AbsoluteFill>
);
