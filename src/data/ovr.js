export const OVR_WEIGHTS = {
  PG: {
    'b-iq-base': 25, 'sht-base': 15, 'drbl-base': 35, 'atl-base': 25,
    'b-iq-decision': 20, 'sht-ft': 15, 'sht-move': 15, 'sht-drive': 10,
    'drbl-pressure': 25, 'drbl-hands': 20,
    'atl-jump': 10, 'atl-run': 10, 'atl-endurance': 15,
  },
  SG: {
    'b-iq-base': 20, 'sht-base': 30, 'drbl-base': 25, 'atl-base': 25,
    'b-iq-decision': 15, 'sht-ft': 20, 'sht-move': 20, 'sht-drive': 15,
    'drbl-pressure': 20, 'drbl-hands': 20,
    'atl-jump': 10, 'atl-run': 10, 'atl-endurance': 15,
  },
  SF: {
    'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25,
    'b-iq-decision': 20, 'sht-ft': 15, 'sht-move': 15, 'sht-drive': 15,
    'drbl-pressure': 20, 'drbl-hands': 15,
    'atl-jump': 15, 'atl-run': 15, 'atl-endurance': 15,
  },
  PF: {
    'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 15, 'atl-base': 35,
    'b-iq-decision': 20, 'sht-ft': 15, 'sht-move': 15, 'sht-drive': 10,
    'drbl-pressure': 15, 'drbl-hands': 10,
    'atl-jump': 15, 'atl-run': 20, 'atl-endurance': 20,
  },
  C: {
    'b-iq-base': 25, 'sht-base': 20, 'drbl-base': 10, 'atl-base': 45,
    'b-iq-decision': 20, 'sht-ft': 15, 'sht-move': 10, 'sht-drive': 5,
    'drbl-pressure': 10, 'drbl-hands': 5,
    'atl-jump': 20, 'atl-run': 20, 'atl-endurance': 25,
  },
  default: {
    'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25,
  },
}

export function calculateOVR(categories, positions) {
  const allTests = categories.flatMap((c) => c.tests)
  const freeTests = allTests.filter((t) => t.plan === 'free')
  const doneTests = freeTests.filter((t) => t.status === 'done' && t.score !== null)
  if (doneTests.length < freeTests.length) return null

  const main = positions && positions[0] ? positions[0] : 'default'
  const weights = OVR_WEIGHTS[main] || OVR_WEIGHTS.default

  let weightedSum = 0
  let totalWeight = 0

  freeTests.forEach((t) => {
    const w = weights[t.id] || 0
    weightedSum += (t.score || 0) * w
    totalWeight += w
  })

  if (totalWeight === 0) return null
  // 🎯 Кап на 99 — идеал недостижим
  return Math.min(99, Math.round(weightedSum / totalWeight))
}

export function calculateFinalScore(blockScores, blocks) {
  let totalWeighted = 0
  let totalWeight = 0
  blocks.forEach((block, bIdx) => {
    const points = blockScores[bIdx] || []
    const totalPossible = block.totalPerPoint
    if (points.length === 0) return
    block.weights.forEach((weight, pIdx) => {
      const score = Number(points[pIdx]) || 0
      const norm = block.norm || totalPossible
      const percent = Math.min(1, score / norm)
      totalWeighted += percent * weight
      totalWeight += weight
    })
  })
  if (totalWeight === 0) return 0
  // 🎯 Кап на 99 — идеал недостижим
  return Math.min(99, Math.round((totalWeighted / totalWeight) * 100))
}