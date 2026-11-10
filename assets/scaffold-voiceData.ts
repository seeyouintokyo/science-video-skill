// 解说词的唯一来源：文字在 narration.json，每段实际长度在 voice.json（由 tools/tts.mjs 生成）
import narration from './narration.json';
import voice from './voice.json';

export type SceneId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6';

export const NARRATION = narration as Record<SceneId, {title: string; lines: string[]}>;
export const VOICE = voice as Record<SceneId, {seconds: number; frames: number}>;

// 每屏帧数 = 解说长度 + 0.8 秒（24 帧），在 tools/tts.mjs 里算好
export const sceneDuration = (id: SceneId) => VOICE[id].frames;
export const sceneLines = (id: SceneId) => NARRATION[id].lines;
