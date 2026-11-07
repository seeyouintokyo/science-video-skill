# MiniMax 语音合成（TTS）接口说明

`scripts/tts.mjs` 就是照这份写的。想换音色、换模型、换成别家 TTS，先看这里，再去改脚本。

## 1. 端点与鉴权

```
POST https://api.minimaxi.com/v1/t2a_v2
Authorization: Bearer <MINIMAX_API_KEY>
Content-Type: application/json
```

- 国内注册的账号用 `api.minimaxi.com`；海外账号连不上就换 `https://api.minimax.io`，其余不变。

## 2. 请求体

```json
{
  "model": "speech-2.8-hd",
  "text": "这一屏要念的话",
  "stream": false,
  "language_boost": "Chinese",
  "voice_setting": { "voice_id": "presenter_male", "speed": 1.0, "vol": 1.0, "pitch": 0 },
  "audio_setting": { "sample_rate": 32000, "bitrate": 128000, "format": "mp3", "channel": 1 }
}
```

| 字段 | 能改什么 |
|---|---|
| `model` | `speech-2.8-hd` 为默认；报「模型不存在」改 `speech-2.6-hd`。脚本支持 `MINIMAX_TTS_MODEL` 覆盖 |
| `text` | 一屏一句，整句拼好再传，不要逐句分别合成（否则句间会有停顿） |
| `voice_id` | `presenter_male` 男声主持 / `presenter_female` 女声。脚本支持 `MINIMAX_VOICE` 覆盖 |
| `speed` | 1.0 为正常语速。**这项会影响时长**，改了要重跑 `tts.mjs` 重新量 |
| `sample_rate` / `bitrate` / `channel` | 视频用 32kHz、128kbps、单声道足够，不必调高 |
| `stream` | 必须 `false`，脚本按整包解析 |

## 3. 返回怎么处理

- 成功：音频在 `data.audio`，是**十六进制字符串**，要 `Buffer.from(json.data.audio, 'hex')` 才得到 mp3。当成 base64 解会得到坏文件。
- 成功与否先看 `base_resp.status_code`，等于 `0` 才算成功，`base_resp.status_msg` 是错误原因。

## 4. 常见错误

| status_msg | 原因 | 处理 |
|---|---|---|
| `insufficient balance` | 账户没余额 | 去 MiniMax 开放平台充值，**不要反复重试** |
| `invalid api key` 类 | Key 错或过期 | 检查 `.env` 或环境变量 |
| 模型不存在 | 模型名被下线 | 换 `speech-2.6-hd` |
| 连接超时 | 账号在海外 | 换 `api.minimax.io` |

## 5. 时长怎么变成帧数

```
帧数 = ceil(语音秒数 × 30) + 24
```

- 30 是 `tokens.canvas.fps`；那 24 帧是 0.8 秒留白，避免切屏切掉尾音。
- 结果写进 `src/voice.json`，各屏用 `sceneDuration('s3')` 取，**不要把帧数写死**。
- 总量超过 60 秒时 `tts.mjs` 只报错不截断，需要回头删短解说词。
