import type { Metadata } from "next"
import CardiacEmergencyTrainer from "@/components/cardiac-emergency-trainer"

export const metadata: Metadata = {
  title: "ACLS Protocol Trainer ",
  description: "Interactive training scenarios for cardiac emergency management following ACLS protocols, by TMC Alumni Publications Trust.",
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <CardiacEmergencyTrainer />
    </div>
  )
}
