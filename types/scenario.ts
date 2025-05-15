export interface Decision {
  id: string
  text: string
  isUrgent?: boolean
  outcome: Outcome
}

export interface Outcome {
  feedback: string
  nextStep?: string
  isCorrect: boolean
  isGameOver?: boolean
  scoreChange: number
  addTime?: number
}

export interface Step {
  id: string
  title: string
  description: string
  image?: string
  decisions: Decision[]
}

export interface Scenario {
  id: string
  title: string
  description: string
  initialStep: string
  steps: Step[]
  complexity?: number // 1-10 scale of inherent scenario complexity
}

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface DifficultySettings {
  level: DifficultyLevel
  timeMultiplier: number
  scoreMultiplier: number
  label: string
  description: string
  initialTime: number
  color: string
}
