#!/usr/bin/env python3
"""生成 README 用的封面图。运行后得到 cover.html，再用 Chrome 截图成 cover.png。"""
import math, pathlib

def moon_svg(f, size, lit_left=True):
    r = size / 2 - 6
    cx = cy = size / 2
    rx = r * abs(math.cos(math.pi * f))
    if f >= 0.999:
        path = f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#lit)"/>'
    else:
        sweep = 1 if f < 0.5 else 0
        if not lit_left:
            sweep = 0 if f < 0.5 else 1
        path = (f'<path d="M {cx} {cy-r} A {r} {r} 0 0 {0 if lit_left else 1} {cx} {cy+r} '
                f'A {rx:.2f} {r} 0 0 {sweep} {cx} {cy-r} Z" fill="url(#lit)"/>')
    ring = (f'<circle cx="{cx}" cy="{cy}" r="{r+5}" fill="none" '
            f'stroke="rgba(255,255,255,0.16)" stroke-width="1.4"/>')
    return f'''<svg width="{size}" height="{size}" viewBox="0 0 {size} {size}">
  <defs>
    <radialGradient id="lit" cx="35%" cy="32%" r="78%">
      <stop offset="0%" stop-color="#FBFCFE"/><stop offset="62%" stop-color="#E4E9F4"/><stop offset="100%" stop-color="#C6CFE2"/>
    </radialGradient>
    <radialGradient id="dark" cx="42%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#1A2340"/><stop offset="100%" stop-color="#0E1428"/>
    </radialGradient>
  </defs>
  <circle cx="{cx}" cy="{cy}" r="{r}" fill="url(#dark)"/>
  {path}
  {ring}
</svg>'''

def block(f, size, left, top):
    return f'<div class="m" style="left:{left}px;top:{top}px">{moon_svg(f, size)}</div>'

HTML = f'''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<style>
  * {{ margin:0; padding:0; box-sizing:border-box; }}
  html, body {{ width:1280px; height:720px; overflow:hidden; background:#070B18; }}
  .cover {{
    position:relative; width:1280px; height:720px; overflow:hidden;
    font-family:"PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif; color:#F4F6FB;
    background:
      radial-gradient(52% 62% at 73% 42%, rgba(255,200,87,0.16) 0%, rgba(255,200,87,0) 64%),
      radial-gradient(46% 56% at 8% 14%, rgba(110,168,255,0.10) 0%, rgba(110,168,255,0) 68%),
      #070B18;
  }}
  .stars {{
    position:absolute; inset:0; opacity:.7;
    background-image:
      radial-gradient(1.4px 1.4px at 12% 22%, #fff, transparent 60%),
      radial-gradient(1.1px 1.1px at 28% 68%, #cfe0ff, transparent 60%),
      radial-gradient(1.6px 1.6px at 44% 12%, #fff, transparent 60%),
      radial-gradient(1.1px 1.1px at 60% 80%, #cfe0ff, transparent 60%),
      radial-gradient(1.3px 1.3px at 84% 16%, #fff, transparent 60%),
      radial-gradient(1px 1px at 93% 58%, #cfe0ff, transparent 60%),
      radial-gradient(1.2px 1.2px at 7% 86%, #fff, transparent 60%),
      radial-gradient(1px 1px at 70% 30%, #fff, transparent 60%);
  }}
  .orbit {{ position:absolute; left:650px; top:24px; width:560px; height:560px;
           border-radius:50%; border:1px dashed rgba(255,255,255,0.10); }}
  .orbit i {{ position:absolute; left:50%; top:50%; width:7px; height:7px; margin:-3.5px 0 0 -3.5px;
             border-radius:50%; background:#6EA8FF; box-shadow:0 0 18px rgba(110,168,255,0.95); }}
  .m {{ position:absolute; filter:drop-shadow(0 26px 60px rgba(0,0,0,0.55)); }}
  .glow {{ position:absolute; left:770px; top:130px; width:340px; height:340px; border-radius:50%;
          background:radial-gradient(circle, rgba(255,235,200,0.30) 0%, rgba(255,220,160,0.10) 46%, rgba(255,220,160,0) 72%); }}
  .meta {{ position:absolute; left:88px; top:146px; width:580px; }}
  .kicker {{ font-size:19px; letter-spacing:4px; color:#FFC857; margin-bottom:26px; }}
  .title {{ font-size:66px; font-weight:800; line-height:1.16; letter-spacing:1px; }}
  .sub {{ margin-top:26px; font-size:26px; line-height:1.6; color:#A7B1C9; }}
  .pill {{ display:inline-flex; align-items:center; gap:14px; margin-top:40px;
          padding:15px 34px 15px 18px; border-radius:999px; background:#FFC857; color:#17130A;
          font-size:24px; font-weight:700; box-shadow:0 16px 44px rgba(255,200,87,0.22); }}
  .pill .tri {{ width:40px; height:40px; border-radius:50%; background:#17130A;
               display:flex; align-items:center; justify-content:center; }}
  .spec {{ margin-top:26px; font-size:19px; color:#7C87A3; letter-spacing:.3px; }}
  .spec em {{ font-style:normal; margin:0 10px; color:#3D475F; }}
</style>
</head>
<body>
  <div class="cover">
    <div class="stars"></div>
    <div class="orbit"><i></i></div>
    <div class="glow"></div>
    {block(1.00, 430, 745, 76)}
    {block(0.26, 74, 772, 556)}
    {block(0.50, 80, 866, 550)}
    {block(0.78, 86, 960, 544)}
    {block(1.00, 92, 1058, 538)}
    <div class="meta">
      <div class="kicker">SAMPLE · 成片示例</div>
      <div class="title">月亮为什么<br>有阴晴圆缺</div>
      <div class="sub">位置一变，看到的部分就变</div>
      <div class="pill">
        <span class="tri"><svg width="14" height="16" viewBox="0 0 14 16"><path d="M2 2 L12 8 L2 14 Z" fill="#FFC857"/></svg></span>
        播放 44 秒
      </div>
      <div class="spec">1920×1080<em>·</em>MiniMax 中文解说<em>·</em>CC0 配乐</div>
    </div>
  </div>
</body>
</html>'''

out = pathlib.Path(__file__).with_name('cover.html')
out.write_text(HTML, encoding='utf-8')
print('written', out)
