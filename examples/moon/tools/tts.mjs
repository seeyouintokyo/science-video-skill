// 用 MiniMax 把每屏的解说词合成一段 mp3，并量出每段的实际长度，写成 src/voice.json
// 用法：node tools/tts.mjs
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const envText = fs.readFileSync(path.join(root, '.env'), 'utf8');
// 兼容两种写法：MINIMAX_API_KEY=sk-xxx，或文件里直接放一行 sk-xxx
const key = (
  envText.match(/MINIMAX_API_KEY\s*=\s*["']?([^"'\s]+)/)?.[1] ??
  envText.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('sk-')).pop() ??
  ''
).trim();
if (!key) {
  console.error('没有读到 MINIMAX_API_KEY，检查 .env');
  process.exit(1);
}

const narration = JSON.parse(fs.readFileSync(path.join(root, 'src/narration.json'), 'utf8'));
const VOICE_ID = 'presenter_male';
const FPS = 30;
const PAD_FRAMES = 24; // 每屏时长 = 解说长度 + 0.8 秒

const outDir = path.join(root, 'public/voice');
fs.mkdirSync(outDir, {recursive: true});

const durations = {};

for (const [id, item] of Object.entries(narration)) {
  const text = item.lines.join('');
  const res = await fetch('https://api.minimaxi.com/v1/t2a_v2', {
    method: 'POST',
    headers: {'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: 'speech-2.8-hd',
      text,
      stream: false,
      language_boost: 'Chinese',
      voice_setting: {voice_id: VOICE_ID, speed: 1.0, vol: 1.0, pitch: 0},
      audio_setting: {sample_rate: 32000, bitrate: 128000, format: 'mp3', channel: 1},
    }),
  });

  const json = await res.json();
  const status = json?.base_resp?.status_code;
  if (status !== 0) {
    console.error(`${id} 合成失败：${json?.base_resp?.status_msg ?? JSON.stringify(json).slice(0, 200)}`);
    process.exit(1);
  }

  const file = path.join(outDir, `${id}.mp3`);
  fs.writeFileSync(file, Buffer.from(json.data.audio, 'hex'));

  const dur = parseFloat(
    execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file])
      .toString()
      .trim()
  );
  const frames = Math.ceil(dur * FPS) + PAD_FRAMES;
  durations[id] = {seconds: Number(dur.toFixed(3)), frames};
  console.log(`${id}  ${dur.toFixed(2)}s  → ${frames} 帧  ${text}`);
}

fs.writeFileSync(path.join(root, 'src/voice.json'), JSON.stringify(durations, null, 2) + '\n');
console.log('总时长', (Object.values(durations).reduce((a, b) => a + b.frames, 0) / FPS).toFixed(2), '秒');
