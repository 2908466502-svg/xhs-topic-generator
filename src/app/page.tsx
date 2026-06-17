"use client"

import { useState } from "react"
import { generateTopics, type TopicInput, type Topic } from "@/lib/ai"
import { Sparkles, Loader2, RefreshCw, Download, Copy, Check, Zap, TrendingUp } from "lucide-react"

const STYLES = ["场景种草", "真实体验", "避坑指南", "产品测评", "竞品对比", "好物推荐"]
const DEFAULTS: TopicInput = { industry: "3C数码", product: "倍思充电宝", targetUser: "大学生", style: "场景种草" }

export default function Home() {
  const [input, setInput] = useState<TopicInput>(DEFAULTS)
  const [topics, setTopics] = useState<Topic[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)
    setError("")
    try {
      const result = await generateTopics(input)
      setTopics(result.sort((a, b) => b.score - a.score))
    } catch {
      setError("生成失败，请重试")
    }
    setLoading(false)
  }

  const handleExport = () => {
    let md = `# 🔥 小红书爆款选题\n\n> 行业：${input.industry} | 产品：${input.product} | 目标：${input.targetUser} | 风格：${input.style}\n\n---\n\n`
    topics.forEach((t, i) => {
      md += `## ${t.score}分 · #${i + 1}\n\n**${t.title}**\n\n> ${t.reason}\n\n---\n\n`
    })
    const blob = new Blob([md], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = "小红书爆款选题.md"; a.click()
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    const text = topics.map((t) => `${t.score}分 ${t.title}\n${t.reason}`).join("\n\n---\n\n")
    await navigator.clipboard.writeText(text)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-base text-zinc-100">XHS Viral Topic Generator</h1>
            <p className="text-[11px] text-zinc-500">小红书爆款选题 · AI 生成</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Form */}
        <div className="mb-8 p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800">
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">行业</label>
              <input value={input.industry} onChange={(e) => setInput({ ...input, industry: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">产品</label>
              <input value={input.product} onChange={(e) => setInput({ ...input, product: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">目标用户</label>
              <input value={input.targetUser} onChange={(e) => setInput({ ...input, targetUser: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5">内容风格</label>
              <select value={input.style} onChange={(e) => setInput({ ...input, style: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-zinc-200 focus:outline-none focus:border-rose-500/50 transition-colors">
                {STYLES.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={handleGenerate} disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 disabled:from-zinc-700 disabled:to-zinc-700 text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> AI 生成中...</> : <><Sparkles className="w-4 h-4" /> 生成选题</>}
            </button>
            {topics.length > 0 && (
              <button onClick={handleGenerate} disabled={loading}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors disabled:cursor-not-allowed text-sm">
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        </div>

        {/* Results */}
        {topics.length > 0 && (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-zinc-500">
                <span className="text-zinc-300 font-medium">{topics.length} 条选题</span>
                {topics.filter((t) => t.score >= 90).length > 0 && (
                  <span className="ml-2 text-rose-400">{topics.filter((t) => t.score >= 90).length} 条高分（≥90）</span>
                )}
              </p>
              <div className="flex gap-2">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "已复制" : "复制"}
                </button>
                <button onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
                  <Download className="w-3.5 h-3.5" /> 导出 MD
                </button>
              </div>
            </div>

            {/* Topic Cards */}
            <div className="space-y-3">
              {topics.map((topic, i) => (
                <div key={i} className="group p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                  <div className="flex items-start gap-4">
                    {/* Score */}
                    <div className={`shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center font-bold ${
                      topic.score >= 90 ? "bg-rose-500/10 text-rose-400" :
                      topic.score >= 80 ? "bg-amber-500/10 text-amber-400" :
                      "bg-zinc-800 text-zinc-400"
                    }`}>
                      <span className="text-lg leading-none">{topic.score}</span>
                      <span className="text-[9px] mt-0.5">分</span>
                    </div>

                    <div className="flex-1 min-w-0 pt-1">
                      <h3 className="text-sm font-medium text-zinc-200 mb-1.5 leading-relaxed">{topic.title}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        {topic.reason}
                      </p>
                    </div>

                    {/* Rank */}
                    <span className="shrink-0 text-xs text-zinc-600 font-mono mt-1">#{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {topics.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-zinc-600" />
            </div>
            <h3 className="text-zinc-500 font-medium mb-1">准备好发现爆款选题了吗？</h3>
            <p className="text-zinc-600 text-sm">输入你的行业、产品和目标用户，AI 帮你找选题</p>
          </div>
        )}
      </main>
    </div>
  )
}
