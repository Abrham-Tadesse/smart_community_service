export const calculatePriorityScore = ({
  severity,
  affectedPeople,
  durationHours,
  areaImportance
}) => {
  const severityWeights = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  }

  const areaWeights = {
    low: 1,
    medium: 2,
    high: 3,
    critical: 4
  }

  let score = severityWeights[severity] || 1

  if (affectedPeople <= 10) score += 1
  else if (affectedPeople <= 50) score += 2
  else if (affectedPeople <= 200) score += 3
  else score += 4

  if (durationHours <= 2) score += 1
  else if (durationHours <= 24) score += 2
  else if (durationHours <= 72) score += 3
  else score += 4

  score += areaWeights[areaImportance] || 1

  const maxScore = 4 + 4 + 4 + 4
  const normalizedScore = Math.round((score / maxScore) * 10)

  return Math.min(Math.max(normalizedScore, 1), 10)
}

export const getPriorityLabel = (score) => {
  if (score >= 9) return { label: 'Critical', color: 'badge-danger' }
  if (score >= 7) return { label: 'High', color: 'badge-warning' }
  if (score >= 5) return { label: 'Medium', color: 'badge-primary' }
  return { label: 'Low', color: 'badge-success' }
}