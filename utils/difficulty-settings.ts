import type { DifficultyLevel, DifficultySettings } from "@/types/scenario"

// Update the initialTime to be the same across all difficulty levels
// This makes the challenge consistent while still adjusting scores based on difficulty

export const difficultySettings: Record<DifficultyLevel, DifficultySettings> = {
  beginner: {
    level: "beginner",
    timeMultiplier: 1.0, // Standard time
    scoreMultiplier: 1.0, // Base score
    initialTime: 60, // Same time for all levels
    label: "Beginner",
    description: "Standard time pressure with detailed feedback, ideal for learning ACLS protocols",
    color: "green",
  },
  intermediate: {
    level: "intermediate",
    timeMultiplier: 1.0, // Standard time
    scoreMultiplier: 1.5, // 50% more points
    initialTime: 60, // Same time for all levels
    label: "Intermediate",
    description: "Standard time pressure, balanced challenge for practicing ACLS protocols",
    color: "blue",
  },
  advanced: {
    level: "advanced",
    timeMultiplier: 1.0, // Standard time
    scoreMultiplier: 2.0, // Double points
    initialTime: 60, // Same time for all levels
    label: "Advanced",
    description: "Standard time pressure with complex decision-making, simulates real emergency conditions",
    color: "red",
  },
}

export const getScoreWithMultiplier = (
  baseScore: number,
  difficultyLevel: DifficultyLevel,
  scenarioComplexity = 5,
): number => {
  const { scoreMultiplier } = difficultySettings[difficultyLevel]

  // Adjust score based on both difficulty level and scenario complexity
  // Complexity is on a 1-10 scale, we normalize it to a 0.8-1.2 range
  const complexityMultiplier = 0.8 + scenarioComplexity / 25

  // Calculate final score with both multipliers
  const adjustedScore = Math.round(baseScore * scoreMultiplier * complexityMultiplier)

  return adjustedScore
}

export const getTimeAdjustment = (baseTime: number, difficultyLevel: DifficultyLevel): number => {
  const { timeMultiplier } = difficultySettings[difficultyLevel]
  return Math.round(baseTime * timeMultiplier)
}
