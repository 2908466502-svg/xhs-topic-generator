# 🔥 XHS Viral Topic Generator

**小红书爆款选题生成 Skill** — 帮助新媒体运营快速获得内容灵感的 AI 工具。

## ✨ 功能

- ✅ 输入行业、产品、目标用户、内容风格
- ✅ AI 自动生成 30 条爆款选题
- ✅ 每条选题自动评分（1-100 分）
- ✅ 智能推荐理由分析
- ✅ 一键复制 & 导出 Markdown
- ✅ 支持重新生成
- ✅ AI 不可用时自动降级，不会白屏

## 🎯 使用场景

- 小红书运营
- 抖音图文运营
- 新媒体运营
- 电商运营

## 🚀 在线使用

https://xhs-topic-generator.vercel.app

## 📦 本地安装

```bash
git clone https://github.com/2908466502-svg/xhs-topic-generator.git
cd xhs-topic-generator
npm install
```

## ⚙️ 环境变量

复制 `.env.example` 为 `.env.local` 并填入你的 API Key：

```env
NEXT_PUBLIC_AI_API_URL=https://api.deepseek.com/v1
NEXT_PUBLIC_AI_API_KEY=your-api-key-here
NEXT_PUBLIC_AI_MODEL=deepseek-chat
```

支持任何 OpenAI 兼容接口（DeepSeek / OpenAI / vLLM / Ollama 等）。

## 🔧 启动

```bash
npm run dev
```

打开 http://localhost:3000

## 🛠 技术栈

- Next.js 16
- TypeScript
- Tailwind CSS
- Lucide Icons
- OpenAI 兼容 API

## 📝 演示讲稿（1 分钟）

> 我是一名新媒体运营，经常需要为产品寻找内容选题。
>
> 最耗费时间的工作不是写内容，而是想选题。
>
> 所以我开发了这个小程序。输入行业、产品、目标用户和内容风格，AI 会自动生成 30 条选题，并进行评分和推荐理由分析。
>
> 这样可以帮助运营快速获得内容灵感，提高生产效率。
>
> 整个项目使用 Next.js + TypeScript 开发，已发布到网上可直接使用。

## 📄 License

MIT
