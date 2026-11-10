import React from 'react';
import {AbsoluteFill, Audio, interpolate, Series, Sequence, staticFile} from 'remotion';
import {tokens} from './tokens';
import {Starfield} from './components/Starfield';
import {VOICE} from './voiceData';
import {S1, S1_DURATION} from './scenes/S1';
import {S2, S2_DURATION} from './scenes/S2';
import {S3, S3_DURATION} from './scenes/S3';
import {S4, S4_DURATION} from './scenes/S4';
import {S5, S5_DURATION} from './scenes/S5';
import {S6, S6_DURATION} from './scenes/S6';

// 每屏时长 = 该屏解说长度 + 0.8 秒，由 tools/tts.mjs 量出来写进 src/voice.json
export const SCENE_FRAMES = [
  S1_DURATION,
  S2_DURATION,
  S3_DURATION,
  S4_DURATION,
  S5_DURATION,
  S6_DURATION,
];

export const TOTAL_FRAMES = SCENE_FRAMES.reduce((a, b) => a + b, 0);

const SCENE_IDS = ['s1', 's2', 's3', 's4', 's5', 's6'] as const;

// 成片响度按 -16 LUFS 交付：素材本身偏轻就抬这两个系数
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
        <S1 />
        <Voice id="s1" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[1]}>
        <S2 />
        <Voice id="s2" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[2]}>
        <S3 />
        <Voice id="s3" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[3]}>
        <S4 />
        <Voice id="s4" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[4]}>
        <S5 />
        <Voice id="s5" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENE_FRAMES[5]}>
        <S6 />
        <Voice id="s6" />
      </Series.Sequence>
    </Series>

    {/* 背景音乐：开头淡入、结尾淡出；音乐比片子短就用 <Loop> 包一层 */}
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
