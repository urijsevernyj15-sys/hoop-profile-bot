export const OVR_WEIGHTS = {
  PG: { 'b-iq-base': 25, 'sht-base': 15, 'drbl-base': 35, 'atl-base': 25 },
  SG: { 'b-iq-base': 20, 'sht-base': 30, 'drbl-base': 25, 'atl-base': 25 },
  SF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
  PF: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 15, 'atl-base': 35 },
  C:  { 'b-iq-base': 25, 'sht-base': 20, 'drbl-base': 10, 'atl-base': 45 },
  default: { 'b-iq-base': 25, 'sht-base': 25, 'drbl-base': 25, 'atl-base': 25 },
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
  return Math.round(weightedSum / totalWeight)
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
      const percent = score / totalPossible
      totalWeighted += percent * weight
      totalWeight += weight
    })
  })
  if (totalWeight === 0) return 0
  return Math.round((totalWeighted / totalWeight) * 100)
}