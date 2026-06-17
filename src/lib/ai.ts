export interface TopicInput {
  industry: string
  product: string
  targetUser: string
  style: string
}

export interface Topic {
  score: number
  title: string
  reason: string
}

export async function generateTopics(input: TopicInput): Promise<Topic[]> {
  const baseURL = process.env.NEXT_PUBLIC_AI_API_URL || "https://api.deepseek.com/v1"
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY || ""
  const model = process.env.NEXT_PUBLIC_AI_MODEL || "deepseek-chat"

  const systemPrompt = `你是一名资深小红书内容运营专家，擅长挖掘爆款选题。`
  const userPrompt = `根据以下信息生成30个适合小红书传播的选题：

行业：${input.industry}
产品：${input.product}
目标用户：${input.targetUser}
内容风格：${input.style}

要求：
1. 场景感强，用户一看就有代入感
2. 用户痛点明显，戳中真实需求
3. 标题口语化，像真人写的，不说教
4. 适合收藏和转发
5. 不夸张营销，真实可信

为每个选题给出：
- score: 1-100 的综合评分
- title: 选题标题
- reason: 推荐理由（简短，15字以内）

返回严格的 JSON 格式（不要 markdown 代码块）：
[{"score":95,"title":"高铁上手机剩3%，这个充电宝救了我","reason":"场景真实，代入感极强"}]`

  try {
    const res = await fetch(`${baseURL.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.9,
        max_tokens: 4096,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if (!res.ok) throw new Error(`API 错误 (${res.status})`)
    const data = await res.json()
    const raw = data.choices[0].message.content
    const cleaned = raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim()
    return JSON.parse(cleaned)
  } catch {
    // 降级：本地生成
    return getFallbackTopics(input)
  }
}

function getFallbackTopics(input: TopicInput): Topic[] {
  const templates = [
    { title: `宿舍党必入！${input.product}用了就回不去`, reason: "学生场景精准", baseScore: 92 },
    { title: `${input.targetUser}最值得买的${input.product}，没有之一`, reason: "人群精准触达", baseScore: 90 },
    { title: `避雷！买${input.product}前一定要看这几点`, reason: "避坑类高收藏", baseScore: 95 },
    { title: `${input.product}真实使用一个月，说说大实话`, reason: "真实体验感强", baseScore: 93 },
    { title: `月薪3000也能闭眼入的${input.product}`, reason: "价格敏感人群关注", baseScore: 91 },
    { title: `被问了800遍的${input.product}，今天公开`, reason: "悬念感拉满", baseScore: 88 },
    { title: `${input.product}到底值不值？用数据说话`, reason: "理性消费趋势", baseScore: 87 },
    { title: `开学季必买清单第一名：${input.product}`, reason: "节点营销精准", baseScore: 89 },
    { title: `用了3年${input.product}，总结出血泪教训`, reason: "经验分享类高赞", baseScore: 94 },
    { title: `朋友以为我花了大价钱，其实只用了${input.product}`, reason: "反差感吸引人", baseScore: 86 },
    { title: `${input.product}的隐藏用法，99%的人不知道`, reason: "实用技巧类高收藏", baseScore: 93 },
    { title: `别再买错${input.product}了！内行人教你选`, reason: "专业背书可信", baseScore: 90 },
  ]

  return templates
    .map((t) => ({
      score: t.baseScore + Math.floor(Math.random() * 6),
      title: t.title,
      reason: t.reason,
    }))
    .sort((a, b) => b.score - a.score)
}
