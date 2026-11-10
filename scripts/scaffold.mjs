// 在目标目录铺出一个可运行的 Remotion 科普视频项目
// 用法：node scripts/scaffold.mjs <目标目录>
//
// Skill 包只允许「根目录 / 二级目录 / 文件」两层，所以 assets 里的骨架文件是拍平放的
// （scaffold-*.tsx 这种）。assets/scaffold-manifest.json 记录了它们该落到生成项目的哪个路径。
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

const manifest = JSON.parse(
  fs.readFileSync(path.join(skillRoot, 'assets/scaffold-manifest.json'), 'utf8'),
);

// 1. 按 manifest 把拍平的骨架文件铺回 src/components、src/scenes 等真实路径
for (const [dest, src] of Object.entries(manifest.files)) {
  const from = path.join(skillRoot, 'assets', src);
  const to = path.join(target, dest);
  fs.mkdirSync(path.dirname(to), {recursive: true});
  fs.copyFileSync(from, to);
}

// 2. 配音脚本 + 空 voice 目录
fs.mkdirSync(path.join(target, 'tools'), {recursive: true});
fs.copyFileSync(path.join(skillRoot, 'scripts/tts.mjs'), path.join(target, 'tools/tts.mjs'));

// 3. Key 模板
fs.writeFileSync(path.join(target, '.env.example'), 'MINIMAX_API_KEY=\n');
if (!fs.existsSync(path.join(target, '.env'))) {
  fs.writeFileSync(path.join(target, '.env'), 'MINIMAX_API_KEY=\n');
}

const written = Object.keys(manifest.files).length + 1;
console.log(`项目已铺好：${target}（${written} 个文件）`);
console.log('');
console.log('下一步：');
console.log('  1. 把 MiniMax Key 填进 .env，或 export MINIMAX_API_KEY=sk-xxx');
console.log('  2. npm install --registry=https://registry.npmmirror.com');
console.log('  3. 改 src/narration.json 里的解说词');
console.log('  4. node tools/tts.mjs        # 生成 public/voice/s1..s6.mp3 并回写 src/voice.json');
console.log('  5. npx remotion render src/index.ts Main out/video.mp4');
