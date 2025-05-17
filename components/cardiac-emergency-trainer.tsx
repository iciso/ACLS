"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Heart,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  Activity,
  Zap,
  Brain,
  ImageOff,
  MessageSquare,
  Play,
} from "lucide-react"
import Image from "next/image"
import ConfettiExplosion from "react-confetti-explosion"
import { scenarioData } from "@/data/scenario-data"
import DifficultySelector from "@/components/difficulty-selector"
import { difficultySettings, getScoreWithMultiplier, getTimeAdjustment } from "@/utils/difficulty-settings"
import type { Scenario, Decision, Outcome, Step, DifficultyLevel } from "@/types/scenario"

export default function CardiacEmergencyTrainer() {
  const [currentScenario, setCurrentScenario] = useState<Scenario | null>(null)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const [randomizedSteps, setRandomizedSteps] = useState<Record<string, Step>>({})
  const [timeRemaining, setTimeRemaining] = useState<number>(60)
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false)
  // Removed isPaused state
  const [score, setScore] = useState<number>(0)
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [history, setHistory] = useState<string[]>([])
  const [isExploding, setIsExploding] = useState<boolean>(false)
  const [feedback, setFeedback] = useState<{
    message: string
    type: "success" | "error" | "warning" | "info"
  } | null>(null)
  const [lastDecisionCorrect, setLastDecisionCorrect] = useState<boolean | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel>("intermediate")
  const [scenarioSelected, setScenarioSelected] = useState<boolean>(false)
  const [selectedScenarioId, setSelectedScenarioId] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize the game
  useEffect(() => {
    // Don't automatically start a scenario, just show the selection screen
    setCurrentScenario(null)
    setGameOver(false)
  }, [])

  // Timer effect - simplified without pause functionality
  useEffect(() => {
    if (gameOver) {
      // If game is over, ensure timer is cleared
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    } else if (isTimerActive && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
      }, 1000)
    } else if (timeRemaining === 0 && isTimerActive) {
      handleTimeout()
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
        feedbackTimeoutRef.current = null
      }
    }
  }, [isTimerActive, timeRemaining, gameOver])

  // Function to shuffle an array (Fisher-Yates algorithm)
  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
  }

  // Function to randomize the order of decisions in each step
  const randomizeStepDecisions = (scenario: Scenario) => {
    const randomizedStepsObj: Record<string, Step> = {}

    scenario.steps.forEach((step) => {
      // Create a deep copy of the step
      const stepCopy: Step = {
        ...step,
        decisions: shuffleArray([...step.decisions]),
      }

      randomizedStepsObj[step.id] = stepCopy
    })

    return randomizedStepsObj
  }

  const selectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId)
    setScenarioSelected(true)
  }

  const startNewScenario = () => {
    if (!selectedScenarioId) return

    const selectedScenario = scenarioData.find((s) => s.id === selectedScenarioId)
    if (!selectedScenario) return

    // Randomize the decisions in each step
    const randomizedStepsObj = randomizeStepDecisions(selectedScenario)

    // Get initial time based on difficulty
    const initialTime = difficultySettings[selectedDifficulty].initialTime

    setRandomizedSteps(randomizedStepsObj)
    setCurrentScenario(selectedScenario)
    setCurrentStep(selectedScenario.initialStep)
    setTimeRemaining(initialTime)
    setIsTimerActive(true)
    // Removed isPaused setting
    setScore(0)
    setGameOver(false)
    setSuccess(false)
    setHistory([selectedScenario.title])
    setFeedback(null)
    setLastDecisionCorrect(null)
    setScenarioSelected(false) // Reset for next time
    setImageErrors({}) // Reset image errors
  }

  const handleTimeout = () => {
    setIsTimerActive(false)
    setGameOver(true)
    setFeedback({
      message: "Time's up! In a cardiac emergency, quick decisions are critical. The patient didn't survive.",
      type: "error",
    })
    // Force the UI to update and show the game over screen
    setCurrentScenario(null)
  }

  const handleDecision = (decision: Decision) => {
    if (!currentScenario || !currentStep) return

    // Find the current step in the scenario
    const originalStep = currentScenario.steps.find((s) => s.id === currentStep)
    if (!originalStep) return

    // Find the outcome for this decision from the original step data
    const outcome = originalStep.decisions.find((d) => d.id === decision.id)?.outcome
    if (!outcome) return

    // Update history
    setHistory((prev) => [...prev, decision.text])

    // Store whether the decision was correct
    setLastDecisionCorrect(outcome.isCorrect)

    // Process the outcome
    processOutcome(outcome)
  }

  const processOutcome = (outcome: Outcome) => {
    if (!currentScenario) return

    // Apply difficulty multiplier to score
    const adjustedScoreChange = getScoreWithMultiplier(
      outcome.scoreChange,
      selectedDifficulty,
      currentScenario.complexity || 5,
    )

    // Update score
    setScore((prev) => prev + adjustedScoreChange)

    // Show feedback with adjusted score
    const scoreChangeText =
      outcome.scoreChange !== 0 ? ` (${adjustedScoreChange > 0 ? "+" : ""}${adjustedScoreChange} points)` : ""

    setFeedback({
      message: `${outcome.feedback}${scoreChangeText}`,
      type: outcome.isCorrect ? "success" : "error",
    })

    // If game ending outcome
    if (outcome.isGameOver) {
      // Immediately stop the timer and end the game
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      setIsTimerActive(false)
      // Removed isPaused setting
      setGameOver(true)
      setSuccess(outcome.isCorrect || false)

      if (outcome.isCorrect) {
        setIsExploding(true)
        setTimeout(() => setIsExploding(false), 3000)
      }

      // Show feedback for a moment, then transition to game over screen
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current)
      }

      feedbackTimeoutRef.current = setTimeout(() => {
        // Force the UI to update and show the game over screen
        setCurrentScenario(null)
      }, 1500)

      // Ensure we exit the function immediately
      return
    }

    // Removed pause functionality for incorrect answers

    // Move to next step
    if (outcome.nextStep) {
      setCurrentStep(outcome.nextStep)

      // Add time if specified, adjusted for difficulty
      if (outcome.addTime) {
        const adjustedAddTime = getTimeAdjustment(outcome.addTime, selectedDifficulty)
        setTimeRemaining((prev) => prev + adjustedAddTime)
      }
    }
  }

  // Removed togglePause function

  const resetToScenarioSelection = () => {
    setCurrentScenario(null)
    setSelectedScenarioId(null)
    setScenarioSelected(false)
  }

  const handleImageError = (imagePath: string) => {
    console.error(`Failed to load image: ${imagePath}`)
    setImageErrors((prev) => ({ ...prev, [imagePath]: true }))
  }

  // Add logic to check if the current step is the last step in the scenario
  // and hide the pause/resume button accordingly

  // First, add a function to check if the current step is the last step
  // Add this function before the renderCurrentStep function

  const isLastStep = (): boolean => {
    if (!currentScenario || !currentStep) return false

    // Find the current step
    const step = currentScenario.steps.find((s) => s.id === currentStep)
    if (!step) return false

    // Check if any decision in this step has isGameOver: true
    return step.decisions.some((decision) => {
      const originalStep = currentScenario.steps.find((s) => s.id === currentStep)
      if (!originalStep) return false

      const outcome = originalStep.decisions.find((d) => d.id === decision.id)?.outcome
      return outcome?.isGameOver === true
    })
  }

  // Render the current step
  const renderCurrentStep = () => {
    if (!currentScenario || !currentStep) return null

    // Get the original step data
    const originalStep = currentScenario.steps.find((s) => s.id === currentStep)
    if (!originalStep) return null

    // Use the randomized step if available, otherwise use the original
    const step = randomizedSteps[currentStep] || originalStep

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold break-words text-gray-900">{step.title}</h3>
          <p className="text-gray-700 break-words">{step.description}</p>

          {step.image && (
            <div className="relative w-full h-48 sm:h-64 my-4 rounded-lg overflow-hidden bg-gray-100">
              {imageErrors[step.image] ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
                  <ImageOff className="h-12 w-12 mb-2" />
                  <p className="text-sm text-center px-4">Image could not be loaded - {step.title}</p>
                </div>
              ) : (
                <Image
                  src={step.image || "/placeholder.svg"}
                  alt={step.title}
                  fill
                  className="object-cover"
                  priority={true}
                  onError={() => {
                    console.error(`Failed to load image: ${step.image}`)
                    handleImageError(step.image || "")
                  }}
                />
              )}
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {step.decisions.map((decision) => (
            <Button
              key={decision.id}
              variant={decision.isUrgent ? "destructive" : "default"}
              className="justify-start text-left h-auto py-3 px-4 break-words whitespace-normal text-gray-900 dark:text-white bg-white hover:bg-gray-100 border border-gray-300 shadow-sm"
              onClick={() => handleDecision(decision)}
              // Removed disabled prop related to isPaused
            >
              {decision.isUrgent && <AlertTriangle className="mr-2 h-4 w-4 shrink-0 flex-none text-red-500" />}
              <span className="text-left">{decision.text}</span>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  // Render game over screen
  const renderGameOver = () => {
    const difficultyInfo = difficultySettings[selectedDifficulty]

    return (
      <div className="space-y-6 text-center">
        {isExploding && <ConfettiExplosion duration={3000} particleCount={100} width={1600} />}

        <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-gray-100">
          {success ? <Trophy className="h-10 w-10 text-yellow-500" /> : <XCircle className="h-10 w-10 text-red-500" />}
        </div>

        <div>
          <h3 className="text-2xl font-bold text-gray-900">
            {success ? "Scenario Completed Successfully!" : "Scenario Failed"}
          </h3>
          <p className="mt-2 text-gray-600">
            {success
              ? "You've successfully managed this cardiac emergency following ACLS protocols."
              : "Unfortunately, the patient didn't survive. Review the ACLS protocols and try again."}
          </p>
        </div>

        <div className="pt-4 space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <h4 className="text-lg font-semibold text-blue-800 mb-1">Final Score</h4>
            <p className="text-3xl font-bold text-blue-900">{score}</p>
          </div>
          <div className="flex justify-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {difficultyInfo.level === "beginner" && <Brain className="mr-1 h-4 w-4 text-green-600" />}
              {difficultyInfo.level === "intermediate" && <Clock className="mr-1 h-4 w-4 text-blue-600" />}
              {difficultyInfo.level === "advanced" && <Zap className="mr-1 h-4 w-4 text-red-600" />}
              {difficultyInfo.label} Mode
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
          <Button onClick={resetToScenarioSelection} className="bg-blue-600 hover:bg-blue-700 text-white">
            <RotateCcw className="mr-2 h-4 w-4" />
            Return to Scenarios
          </Button>

          <Button
            onClick={() => {
              if (selectedScenarioId) {
                selectScenario(selectedScenarioId)
              }
            }}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <Play className="mr-2 h-4 w-4" />
            Retry with Different Difficulty
          </Button>
        </div>
      </div>
    )
  }

  // Render difficulty selection
  const renderDifficultySelection = () => {
    if (!selectedScenarioId) return null

    const selectedScenario = scenarioData.find((s) => s.id === selectedScenarioId)
    if (!selectedScenario) return null

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 flex items-center">
            <Heart className="mr-2 h-5 w-5 text-blue-600" />
            Selected Scenario
          </h3>
          <p className="mt-1 text-blue-700 font-medium">{selectedScenario.title}</p>
          <p className="mt-1 text-blue-600 text-sm">{selectedScenario.description}</p>
        </div>

        <DifficultySelector selectedDifficulty={selectedDifficulty} onSelectDifficulty={setSelectedDifficulty} />

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={resetToScenarioSelection} className="border-gray-300">
            Back to Scenarios
          </Button>

          <Button onClick={startNewScenario} className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Scenario
          </Button>
        </div>
      </div>
    )
  }

  // Render scenario selection
  const renderScenarioSelection = () => {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Select a Scenario</h3>
        <div className="grid gap-3">
          {scenarioData.map((scenario) => (
            <Button
              key={scenario.id}
              variant="outline"
              className="justify-start text-left h-auto py-3 px-4 whitespace-normal bg-white hover:bg-gray-100 text-gray-900 border border-gray-300 shadow-sm"
              onClick={() => selectScenario(scenario.id)}
            >
              <div className="w-full">
                <div className="font-medium break-words">{scenario.title}</div>
                <div className="text-sm text-gray-600 mt-1 break-words">{scenario.description}</div>
                {scenario.complexity && (
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Complexity: {scenario.complexity}/10
                    </span>
                  </div>
                )}
              </div>
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 px-2 sm:py-8 sm:px-4 max-w-full sm:max-w-4xl">
      <Card className="border-2 border-blue-200 shadow-lg overflow-hidden bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <CardTitle className="text-xl sm:text-2xl flex items-center text-gray-900">
                <Heart className="mr-2 h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="break-words">ACLS Protocol Trainer</span>
              </CardTitle>
              <CardDescription className="mt-1 text-gray-600">
                {currentScenario
                  ? "Interactive training for cardiac emergency management"
                  : "Select a Scenario to begin Training"}
              </CardDescription>
            </div>
            {currentScenario && (
              <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center">
                <Badge
                  variant="outline"
                  className="text-base px-2 py-1 bg-white self-start sm:self-auto text-blue-700 border-blue-300"
                >
                  <Activity className="mr-1 h-4 w-4 text-blue-500" />
                  Score: {score}
                </Badge>

                <Badge
                  variant="outline"
                  className={`text-sm px-2 py-1 bg-white self-start sm:self-auto 
                    ${
                      selectedDifficulty === "beginner"
                        ? "text-green-700 border-green-300"
                        : selectedDifficulty === "intermediate"
                          ? "text-blue-700 border-blue-300"
                          : "text-red-700 border-red-300"
                    }`}
                >
                  {selectedDifficulty === "beginner" && <Brain className="mr-1 h-3 w-3 text-green-600" />}
                  {selectedDifficulty === "intermediate" && <Clock className="mr-1 h-3 w-3 text-blue-600" />}
                  {selectedDifficulty === "advanced" && <Zap className="mr-1 h-3 w-3 text-red-600" />}
                  {difficultySettings[selectedDifficulty].label}
                </Badge>
              </div>
            )}
          </div>
        </CardHeader>

        {!currentScenario ? (
          <CardContent className="p-4 sm:pt-6 sm:px-6 bg-white">
            {gameOver && renderGameOver()}
            {!gameOver && (scenarioSelected ? renderDifficultySelection() : renderScenarioSelection())}
          </CardContent>
        ) : (
          <>
            <CardContent className="p-4 sm:pt-6 sm:pb-2 sm:px-6 bg-white">
              {/* Timer - simplified without pause button */}
              <div className="mb-4 sm:mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium flex items-center text-gray-700">
                    <Clock className="mr-1 h-4 w-4 text-gray-500" /> Time Remaining
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">{timeRemaining}s</span>
                    {/* Removed pause/resume button */}
                  </div>
                </div>
                <Progress
                  value={(timeRemaining / difficultySettings[selectedDifficulty].initialTime) * 100}
                  className={`h-2 ${
                    selectedDifficulty === "beginner"
                      ? "bg-green-100"
                      : selectedDifficulty === "intermediate"
                        ? "bg-blue-100"
                        : "bg-red-100"
                  }`}
                />
              </div>

              {/* Removed paused notification */}

              {/* Feedback alert */}
              {feedback && (
                <Alert
                  variant={feedback.type === "error" ? "destructive" : "default"}
                  className={`mb-4 sm:mb-6 ${
                    feedback.type === "error"
                      ? "bg-red-50 text-red-900 border-red-200"
                      : "bg-green-50 text-green-900 border-green-200"
                  }`}
                >
                  <AlertTitle className={feedback.type === "error" ? "text-red-900" : "text-green-900"}>
                    {feedback.type === "success" ? (
                      <CheckCircle className="h-4 w-4 inline mr-2 text-green-600" />
                    ) : feedback.type === "error" ? (
                      <XCircle className="h-4 w-4 inline mr-2 text-red-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 inline mr-2 text-amber-600" />
                    )}
                    {feedback.type === "success" ? "Correct Decision" : "Incorrect Decision"}
                  </AlertTitle>
                  <AlertDescription
                    className={`break-words ${feedback.type === "error" ? "text-red-800" : "text-green-800"}`}
                  >
                    {feedback.message}
                  </AlertDescription>
                </Alert>
              )}

              {/* Main content */}
              {renderCurrentStep()}
            </CardContent>

            <CardFooter className="flex-col items-start border-t bg-gray-50 p-4 sm:px-6 sm:py-4">
              <h4 className="text-sm font-semibold mb-2 text-gray-900">Decision History:</h4>
              <div className="w-full space-y-1">
                {history.map((item, index) => (
                  <div
                    key={index}
                    className="text-xs px-2 py-1 rounded bg-gray-100 border border-gray-200 break-words text-gray-800"
                  >
                    {index + 1}. {item}
                  </div>
                ))}
              </div>
            </CardFooter>
          </>
        )}

        {/* Contact footer */}
        <div className="border-t border-gray-200 p-4 text-center text-sm text-gray-600 bg-gray-50">
          <div className="flex items-center justify-center mb-1">
            <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
            <span>For suggestions WhatsApp{" "} 
             <a
                href="https://cvemrafi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                 Rafique
              </a>{" "} at +91 7558845528</span>
          </div>
          <div className="flex items-center justify-center">
            <svg viewBox="0 0 496.08 512" className="h-4 w-4 mr-1 text-gray-500">
              <path
                fill="black"
                d="M245.83 214.87l-33.22 17.28c-9.43-19.58-25.24-19.93-27.46-19.93-22.13 0-33.22 14.61-33.22 43.84 0 23.57 9.21 43.84 33.22 43.84 14.47 0 24.65-7.09 30.57-21.26l30.55 15.5c-6.17 11.51-25.69 38.98-65.1 38.98-22.6 0-73.96-10.32-73.96-77.05 0-58.69 43-77.06 72.63-77.06 30.72-.01 52.7 11.95 65.99 35.86zm143.05 0l-32.78 17.28c-9.5-19.77-25.72-19.93-27.9-19.93-22.14 0-33.22 14.61-33.22 43.84 0 23.55 9.23 43.84 33.22 43.84 14.45 0 24.65-7.09 30.54-21.26l31 15.5c-2.1 3.75-21.39 38.98-65.09 38.98-22.69 0-73.96-9.87-73.96-77.05 0-58.67 42.97-77.06 72.63-77.06 30.71-.01 52.58 11.95 65.56 35.86zM247.56 8.05C104.74 8.05 0 123.11 0 256.05c0 138.49 113.6 248 247.56 248 129.93 0 248.44-100.87 248.44-248 0-137.87-106.62-248-248.44-248zm.87 450.81c-112.54 0-203.7-93.04-203.7-202.81 0-105.42 85.43-203.27 203.72-203.27 112.53 0 202.82 89.46 202.82 203.26-.01 121.69-99.68 202.82-202.84 202.82z"
              />
            </svg>
            <span>
              <a
                href="https://creativecommons.org/licenses/by/4.0/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                 License 4.0
              </a>{" "}
              • TMC Alumni Publications Trust
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
}
