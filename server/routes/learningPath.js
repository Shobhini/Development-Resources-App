import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import Resource from '../models/Resource.js'

const router = express.Router()

// POST /api/learning-path
// body: { goal: string }
router.post('/', async (req, res) => {
  const { goal } = req.body
  if (!goal || !goal.trim()) {
    return res.status(400).json({ message: 'Goal is required' })
  }

  try {
    const resources = await Resource.find({ status: 'approved' })
      .select('_id title description category tag link img')
      .lean()

    if (resources.length === 0) {
      return res.status(404).json({ message: 'No resources found in database' })
    }

    const resourceList = resources.map(r =>
      `ID:${r._id} | [${r.category}/${r.tag}] ${r.title} — ${r.description.slice(0, 80)}`
    ).join('\n')

    const prompt = `You are a learning path curator for web development resources.

A user wants to: "${goal}"

Below is a list of available resources (each has an ID, category, tag, title, and description snippet):
${resourceList}

Your task:
1. Select 5-8 resources from the list that best match the user's goal
2. Order them from beginner-friendly to advanced
3. For each step, write a SHORT reason (1 sentence) why it fits at that point in the path

Respond with ONLY valid JSON in this exact format, no extra text:
{
  "path": [
    { "id": "<resource _id>", "step": 1, "reason": "<one sentence>" },
    { "id": "<resource _id>", "step": 2, "reason": "<one sentence>" }
  ]
}`

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    const aiResponse = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })
    const rawText = aiResponse.content?.[0]?.text?.trim()

    let parsed
    try {
      // strip markdown code fences if present
      const clean = rawText.replace(/^```json?\n?/, '').replace(/\n?```$/, '')
      parsed = JSON.parse(clean)
    } catch {
      console.error('Failed to parse Grok response:', rawText)
      return res.status(502).json({ message: 'AI returned invalid response' })
    }

    // hydrate IDs back to full resource objects
    const resourceMap = Object.fromEntries(resources.map(r => [String(r._id), r]))
    const hydrated = parsed.path
      .filter(step => resourceMap[step.id])
      .map(step => ({
        step: step.step,
        reason: step.reason,
        resource: resourceMap[step.id],
      }))

    res.json({ goal, path: hydrated })
  } catch (err) {
    console.error('Learning path error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
