import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "XHS Viral Topic Generator · 小红书爆款选题生成",
  description: "AI 驱动的小红书爆款选题生成工具 — 输入行业和产品，30秒生成30条高分选题",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark h-full">
      <body className="h-full bg-zinc-950 text-zinc-200 antialiased">{children}</body>
    </html>
  )
}
