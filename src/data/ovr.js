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
  // Кап на 99
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
  // Кап на 99
  return Math.min(99, Math.round((totalWeighted / totalWeight) * 100))
}
// ============================================================
// ДЕТАЛЬНАЯ СТАТИСТИКА — 3PT, 2PT, FIN из sht-base
// ============================================================

export function calculateDetailedStats(categories, positions) {
  const allTests = categories.flatMap((c) => c.tests)
  const main = positions && positions[0] ? positions[0] : 'default'

  const getScore = (testId) => {
    const t = allTests.find((x) => x.id === testId)
    return t && t.status === 'done' && t.score !== null ? t.score : null
  }

  const shtBase = getScore('sht-base')
  const bIq = getScore('b-iq-base')
  const drbl = getScore('drbl-base')
  const atl = getScore('atl-base')

  // Модификаторы для разбивки броска по позициям
  // (из общего sht-base выделяем 3PT / 2PT / FIN)
  const SHOOTING_SPLIT = {
    PG: { threePt: 0.95, twoPt: 1.05, fin: 0.95 },
    SG: { threePt: 1.10, twoPt: 1.00, fin: 0.90 },
    SF: { threePt: 1.00, twoPt: 1.00, fin: 1.00 },
    PF: { threePt: 0.85, twoPt: 1.05, fin: 1.10 },
    C:  { threePt: 0.70, twoPt: 1.10, fin: 1.20 },
    default: { threePt: 1.00, twoPt: 1.00, fin: 1.00 },
  }

  const mods = SHOOTING_SPLIT[main] || SHOOTING_SPLIT.default

  const clamp = (v) => (v === null ? null : Math.min(99, Math.max(0, Math.round(v))))

  return {
    'b-iq': bIq,
    sht: shtBase,
    threePt: shtBase !== null ? clamp(shtBase * mods.threePt) : null,
    twoPt: shtBase !== null ? clamp(shtBase * mods.twoPt) : null,
    fin: shtBase !== null ? clamp(shtBase * mods.fin) : null,
    drbl,
    atl,
  }
}