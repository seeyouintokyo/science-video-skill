// 用 MiniMax 把每屏解说词合成一段 mp3，并量出实际长度写成 src/voice.json
// 在项目根目录跑：node tools/tts.mjs
//
// Key 的优先级：环境变量 MINIMAX_API_KEY > 项目根目录 .env
// .env 支持两种写法：MINIMAX_API_KEY=sk-xxx，或者文件里直接放一行 sk-xxx
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const root = process.cwd();
const envFile = path.join(root, '.env');
const envText = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf8') : '';

const key = (
  process.env.MINIMAX_API_KEY?.trim() ||
  envText.match(/MINIMAX_API_KEY\s*=\s*["']?([^"'\s]+)/)?.[1] ||
  envText.split('\n').map((l) => l.trim()).filter((l) => l.startsWith('sk-')).pop() ||
  ''
).trim();

if (!key) {
  console.error('没有读到 MINIMAX_API_KEY：填进 .env，或 export MINIMAX_API_KEY=sk-xxx');
  process.exit(1);
}

const VOICE_ID = process.env.MINIMAX_VOICE ?? 'presenter_male'; // 女声用 presenter_female
const MODEL = process.env.MINIMAX_TTS_MODEL ?? 'speech-2.8-hd'; // 报模型不存在就换 speech-2.6-hd
const FPS = 30;
const PAD_FRAMES = 24; // 每屏时长 = 解说长度 + 0.8 秒

const narrationPath = path.join(root, 'src/narration.json');
const narration = JSON.parse(fs.readFileSync(narrationPath, 'utf8'));
const outDir = path.join(root, 'public/voice');
fs.mkdirSync(outDir, {recursive: true});

const durations = {};

for (const [id, item] of Object.entries(narration)) {
  if (id.startsWith('_')) continue;
  const text = item.lines.join('');
  if (!text.trim()) {
    console.error(`${id} 没有解说词，先改 src/narration.json`);
    process.exit(1);
  }

  const res = await fetch('https://api.minimaxi.com/v1/t2a_v2', {
    method: 'POST',
    headers: {Authorization: `Bearer ${key}`, 'Content-Type': 'application/json'},
    body: JSON.stringify({
      model: MODEL,
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
    const msg = json?.base_resp?.status_msg ?? JSON.stringify(json).slice(0, 200);
    console.error(`${id} 合成失败：${msg}`);
    if (String(msg).includes('balance')) console.error('账户余额不足，去 MiniMax 开放平台充值后再跑。');
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
const total = Object.values(durations).reduce((a, b) => a + b.frames, 0);
console.log(`总时长 ${(total / FPS).toFixed(2)} 秒（${total} 帧）`);
if (total / FPS > 60) console.error('超过 60 秒了，删短解说词再跑一次。');
