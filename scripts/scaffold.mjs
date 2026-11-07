// 在目标目录铺出一个可运行的 Remotion 科普视频项目
// 用法：node scripts/scaffold.mjs <目标目录>
import fs from 'node:fs';
import path from 'node:path';

const skillRoot = path.resolve(import.meta.dirname, '..');
const target = path.resolve(process.argv[2] ?? '');
if (!process.argv[2]) {
  console.error('用法：node scripts/scaffold.mjs <目标目录>');
  process.exit(1);
}
if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
  console.error(`目标目录不是空的：${target}\n换一个空目录，或先清空它。`);
  process.exit(1);
}

const copyDir = (from, to) => {
  fs.mkdirSync(to, {recursive: true});
  for (const item of fs.readdirSync(from, {withFileTypes: true})) {
    const src = path.join(from, item.name);
    const dst = path.join(to, item.name);
    if (item.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
};

// 1. 项目骨架
copyDir(path.join(skillRoot, 'assets/scaffold'), target);

// 2. 设计 tokens + 自带 CC0 音乐
fs.copyFileSync(path.join(skillRoot, 'assets/tokens.ts'), path.join(target, 'src/tokens.ts'));
fs.mkdirSync(path.join(target, 'public/voice'), {recursive: true});
fs.copyFileSync(path.join(skillRoot, 'assets/bgm.mp3'), path.join(target, 'public/bgm.mp3'));

// 3. 配音脚本
fs.mkdirSync(path.join(target, 'tools'), {recursive: true});
fs.copyFileSync(path.join(skillRoot, 'scripts/tts.mjs'), path.join(target, 'tools/tts.mjs'));

// 4. Key 模板
fs.writeFileSync(path.join(target, '.env.example'), 'MINIMAX_API_KEY=\n');
if (!fs.existsSync(path.join(target, '.env'))) {
  fs.writeFileSync(path.join(target, '.env'), 'MINIMAX_API_KEY=\n');
}

console.log(`项目已铺好：${target}`);
console.log('');
console.log('下一步：');
console.log('  1. 把 MiniMax Key 填进 .env，或 export MINIMAX_API_KEY=sk-xxx');
console.log('  2. npm install --registry=https://registry.npmmirror.com');
console.log('  3. 改 src/narration.json 里的解说词');
console.log('  4. node tools/tts.mjs        # 生成 public/voice/s1..s6.mp3 并回写 src/voice.json');
console.log('  5. npx remotion render src/index.ts Main out/video.mp4');
