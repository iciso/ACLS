import type { Scenario } from "@/types/scenario"

export const scenarioData: Scenario[] = [
  {
    id: "vf-arrest",
    title: "Ventricular Fibrillation Cardiac Arrest",
    description: "A 62-year-old male collapses in the waiting room. You are the first responder.",
    initialStep: "initial-assessment",
    complexity: 6, // Moderate to high complexity
    steps: [
      {
        id: "initial-assessment",
        title: "Initial Assessment",
        description: "You arrive at the scene. The patient is unresponsive on the floor. What is your first action?",
        image: "/collapsed-patient.png",
        decisions: [
          {
            id: "check-pulse",
            text: "Check for a pulse and assess breathing",
            outcome: {
              feedback: "Correct! Always check for responsiveness, breathing, and pulse first in a collapsed patient.",
              nextStep: "no-pulse",
              isCorrect: true,
              scoreChange: 10,
            },
          },
          {
            id: "call-for-help",
            text: "Call for help first",
            outcome: {
              feedback:
                "You should check the patient first. However, calling for help is important, so you'll do that next.",
              nextStep: "no-pulse",
              isCorrect: false,
              scoreChange: 0,
            },
          },
          {
            id: "start-cpr",
            text: "Start chest compressions immediately",
            outcome: {
              feedback:
                "You should confirm pulselessness before starting CPR. Starting CPR on a patient with a pulse can cause harm.",
              nextStep: "no-pulse",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "no-pulse",
        title: "No Pulse Detected",
        description: "The patient has no pulse and is not breathing. What do you do next?",
        image: "/cpr-assessment.png",
        decisions: [
          {
            id: "activate-code",
            text: "Activate code blue and start CPR",
            isUrgent: true,
            outcome: {
              feedback: "Correct! You've activated the emergency response system and started high-quality CPR.",
              nextStep: "cpr-in-progress",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "check-airway",
            text: "Open the airway and give rescue breaths",
            outcome: {
              feedback:
                "In cardiac arrest, immediate chest compressions take priority over airway management. This delay could reduce survival chances.",
              nextStep: "cpr-in-progress",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "wait-for-help",
            text: "Wait for the code team to arrive",
            outcome: {
              feedback:
                "Critical error! Waiting without starting CPR significantly reduces survival chances. Every minute without CPR decreases survival by 7-10%.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -30,
            },
          },
        ],
      },
      {
        id: "cpr-in-progress",
        title: "CPR In Progress",
        description:
          "You've been performing CPR for about 1 minute. The crash cart and AED have arrived. What is your next priority?",
        image: "/cpr-with-aed.png",
        decisions: [
          {
            id: "apply-aed",
            text: "Apply the AED/defibrillator and analyze rhythm",
            isUrgent: true,
            outcome: {
              feedback:
                "Correct! Early defibrillation is critical for VF/VT cardiac arrest. You've followed the correct sequence.",
              nextStep: "rhythm-check",
              isCorrect: true,
              scoreChange: 15,
              addTime: 10,
            },
          },
          {
            id: "continue-cpr",
            text: "Continue CPR for 5 more minutes before using the AED",
            outcome: {
              feedback:
                "Incorrect. Delaying defibrillation reduces survival chances. The AED should be applied as soon as it's available.",
              nextStep: "rhythm-check",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "establish-iv",
            text: "Establish IV access first",
            outcome: {
              feedback:
                "Incorrect priority. While IV access is important, it should not delay defibrillation in a shockable rhythm.",
              nextStep: "rhythm-check",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "rhythm-check",
        title: "Rhythm Analysis",
        description:
          "The AED analyzes the rhythm and advises: 'Shock advised. Ventricular fibrillation detected.' What do you do?",
        image: "/vf-ecg.png",
        decisions: [
          {
            id: "deliver-shock",
            text: "Clear everyone and deliver shock immediately",
            isUrgent: true,
            outcome: {
              feedback:
                "Correct! You've delivered a shock for VF, which is the appropriate treatment for this shockable rhythm.",
              nextStep: "post-shock",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "give-epi",
            text: "Give epinephrine first, then shock",
            outcome: {
              feedback: "Incorrect sequence. For a shockable rhythm, defibrillation takes priority over medications.",
              nextStep: "post-shock",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "more-cpr",
            text: "Perform 2 more minutes of CPR before shocking",
            outcome: {
              feedback:
                "Incorrect. When VF is identified, immediate defibrillation is indicated without delay for more CPR.",
              nextStep: "post-shock",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "post-shock",
        title: "Post-Shock Management",
        description: "You've delivered the shock. What is your immediate next step?",
        image: "/cpr-after-defibrillation.png",
        decisions: [
          {
            id: "resume-cpr",
            text: "Resume CPR immediately for 2 minutes",
            isUrgent: true,
            outcome: {
              feedback:
                "Correct! CPR should be resumed immediately after a shock without checking for a pulse, and continued for 2 minutes before the next rhythm check.",
              nextStep: "medication-decision",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "check-pulse-post",
            text: "Check for return of pulse",
            outcome: {
              feedback:
                "Incorrect. Checking for a pulse immediately after shock wastes valuable time. Resume CPR immediately for 2 minutes.",
              nextStep: "medication-decision",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "prepare-next-shock",
            text: "Prepare to deliver another shock immediately",
            outcome: {
              feedback:
                "Incorrect. After a shock, you should perform 2 minutes of CPR before reassessing the rhythm and considering another shock.",
              nextStep: "medication-decision",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "medication-decision",
        title: "Medication Administration",
        description: "CPR is ongoing. IV access has been established. Which medication should be administered first?",
        image: "/emergency-medication.png",
        decisions: [
          {
            id: "give-epinephrine",
            text: "Epinephrine 1mg IV",
            outcome: {
              feedback:
                "Correct! Epinephrine is the first-line medication in cardiac arrest, given as soon as IV/IO access is available.",
              nextStep: "second-rhythm-check",
              isCorrect: true,
              scoreChange: 10,
            },
          },
          {
            id: "give-amiodarone",
            text: "Amiodarone 300mg IV",
            outcome: {
              feedback:
                "Incorrect first choice. Amiodarone is considered after epinephrine, typically after the second shock for persistent VF/VT.",
              nextStep: "second-rhythm-check",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "give-atropine",
            text: "Atropine 1mg IV",
            outcome: {
              feedback:
                "Incorrect. Atropine is not indicated for VF/VT arrest. It was previously used for asystole/PEA but is no longer recommended in the ACLS algorithm.",
              nextStep: "second-rhythm-check",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "second-rhythm-check",
        title: "Second Rhythm Check",
        description: "After 2 minutes of CPR, you check the rhythm again. VF persists. What is your next action?",
        image: "/vf-ecg.png",
        decisions: [
          {
            id: "second-shock",
            text: "Deliver second shock, then resume CPR",
            isUrgent: true,
            outcome: {
              feedback: "Correct! For persistent VF, deliver another shock and immediately resume CPR.",
              nextStep: "advanced-management",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "more-epi",
            text: "Give another dose of epinephrine first",
            outcome: {
              feedback:
                "Incorrect sequence. For persistent VF, shock first, then resume CPR. Epinephrine is repeated every 3-5 minutes.",
              nextStep: "advanced-management",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "try-different-approach",
            text: "Try a precordial thump",
            outcome: {
              feedback:
                "Incorrect. Precordial thump is not recommended for VF cardiac arrest in current ACLS guidelines.",
              nextStep: "advanced-management",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "advanced-management",
        title: "Advanced Management",
        description:
          "After the second shock and 2 more minutes of CPR, VF still persists. What medication should you consider now?",
        image: "/advanced-cardiac-life-support-team.png",
        decisions: [
          {
            id: "amiodarone-now",
            text: "Amiodarone 300mg IV push",
            outcome: {
              feedback: "Correct! Amiodarone is indicated after the second shock for persistent VF/VT.",
              nextStep: "rosc-achieved",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "lidocaine-alternative",
            text: "Lidocaine 1-1.5 mg/kg IV push",
            outcome: {
              feedback:
                "Acceptable alternative. Lidocaine can be used if amiodarone is unavailable, though amiodarone is preferred.",
              nextStep: "rosc-achieved",
              isCorrect: true,
              scoreChange: 10,
            },
          },
          {
            id: "calcium-chloride",
            text: "Calcium Chloride 1g IV",
            outcome: {
              feedback:
                "Incorrect. Calcium is not indicated for VF/VT arrest unless there's known hypocalcemia, hyperkalemia, or calcium channel blocker overdose.",
              nextStep: "rosc-achieved",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "rosc-achieved",
        title: "Return of Spontaneous Circulation",
        description: "After continued resuscitation efforts, the patient regains a pulse. What is your priority now?",
        image: "/post-resuscitation-care.png",
        decisions: [
          {
            id: "post-rosc-care",
            text: "Optimize ventilation and oxygenation, obtain 12-lead ECG, and prepare for transfer to ICU",
            outcome: {
              feedback:
                "Excellent! You've successfully resuscitated the patient and initiated appropriate post-cardiac arrest care.",
              isGameOver: true,
              isCorrect: true,
              scoreChange: 25,
            },
          },
          {
            id: "immediate-cath-lab",
            text: "Rush the patient immediately to the cath lab without stabilization",
            outcome: {
              feedback:
                "Premature. While coronary intervention may be needed, immediate post-ROSC care and stabilization take priority.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "therapeutic-hypothermia",
            text: "Immediately start therapeutic hypothermia protocol as the only intervention",
            outcome: {
              feedback:
                "Incomplete. Targeted temperature management is important but should be part of a comprehensive post-cardiac arrest care bundle.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
    ],
  },
  {
    id: "pea-arrest",
    title: "Pulseless Electrical Activity (PEA)",
    description:
      "A 58-year-old female is found unresponsive in her hospital bed. The monitor shows organized electrical activity.",
    initialStep: "pea-initial",
    complexity: 7, // Higher complexity due to diagnostic challenge
    steps: [
      {
        id: "pea-initial",
        title: "Initial Assessment",
        description:
          "You respond to the call and find the patient unresponsive. The monitor shows organized electrical activity at 65 bpm. What is your first action?",
        image: "/hospital-patient-cardiac-monitor.png",
        decisions: [
          {
            id: "check-pulse-pea",
            text: "Check for a pulse",
            outcome: {
              feedback:
                "Correct! Despite organized electrical activity on the monitor, you must confirm the absence of a pulse to diagnose PEA.",
              nextStep: "pea-confirmed",
              isCorrect: true,
              scoreChange: 10,
            },
          },
          {
            id: "assume-rhythm",
            text: "Assume the rhythm is adequate since it's organized",
            outcome: {
              feedback:
                "Incorrect. Electrical activity on the monitor doesn't guarantee mechanical cardiac activity. You must check for a pulse.",
              nextStep: "pea-confirmed",
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "call-patient",
            text: "Try to wake the patient by calling their name",
            outcome: {
              feedback:
                "Incomplete. While assessing responsiveness is important, you need to check circulatory status immediately in an unresponsive patient.",
              nextStep: "pea-confirmed",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "pea-confirmed",
        title: "PEA Confirmed",
        description:
          "You confirm the patient has no pulse despite organized electrical activity on the monitor. What is your immediate next step?",
        image: "/cpr-in-progress.png",
        decisions: [
          {
            id: "start-cpr-pea",
            text: "Start high-quality CPR and activate the code team",
            isUrgent: true,
            outcome: {
              feedback: "Correct! Immediate CPR is essential for any pulseless patient, including those with PEA.",
              nextStep: "pea-causes",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "defibrillate-pea",
            text: "Prepare for immediate defibrillation",
            outcome: {
              feedback:
                "Incorrect. PEA is not a shockable rhythm. Defibrillation is only indicated for VF and pulseless VT.",
              nextStep: "pea-causes",
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "atropine-first",
            text: "Administer atropine 1mg IV",
            outcome: {
              feedback:
                "Incorrect. Atropine is not recommended for PEA in current ACLS guidelines. CPR and epinephrine are the initial interventions.",
              nextStep: "pea-causes",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "pea-causes",
        title: "Identifying Reversible Causes",
        description:
          "While CPR is ongoing and IV access is being established, you need to consider potential reversible causes of PEA. Which of the following should you prioritize checking?",
        image: "/advanced-cardiac-life-support-team.png",
        decisions: [
          {
            id: "h-t-causes",
            text: "Check for the Hs and Ts (Hypovolemia, Hypoxia, Hydrogen ions, Hypo/Hyperkalemia, Hypothermia, Toxins, Tamponade, Tension pneumothorax, Thrombosis)",
            outcome: {
              feedback:
                "Correct! Identifying and treating reversible causes is crucial in PEA. The Hs and Ts provide a framework for considering common causes.",
              nextStep: "pea-medication",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "focus-rhythm",
            text: "Focus only on correcting the electrical rhythm",
            outcome: {
              feedback:
                "Incorrect. In PEA, the electrical activity isn't the primary problem - it's the lack of mechanical contraction. You must identify and treat the underlying cause.",
              nextStep: "pea-medication",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "wait-cardiology",
            text: "Wait for cardiology consultation before considering causes",
            outcome: {
              feedback:
                "Incorrect. Identifying and treating reversible causes should begin immediately, not wait for specialist consultation.",
              nextStep: "pea-medication",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "pea-medication",
        title: "Medication Administration",
        description:
          "CPR is ongoing and you're considering potential causes. IV access has been established. What medication should be administered?",
        image: "/emergency-medication.png",
        decisions: [
          {
            id: "epi-pea",
            text: "Epinephrine 1mg IV",
            outcome: {
              feedback:
                "Correct! Epinephrine is the primary medication for all forms of cardiac arrest, including PEA.",
              nextStep: "pea-specific-cause",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "bicarb-first",
            text: "Sodium bicarbonate 1 mEq/kg IV",
            outcome: {
              feedback:
                "Incorrect as a first-line medication. Sodium bicarbonate is only indicated for specific situations like known pre-existing metabolic acidosis, hyperkalemia, or certain overdoses.",
              nextStep: "pea-specific-cause",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "calcium-first",
            text: "Calcium chloride 1g IV",
            outcome: {
              feedback:
                "Incorrect as a first-line medication. Calcium is only indicated for specific conditions like hyperkalemia, hypocalcemia, or calcium channel blocker overdose.",
              nextStep: "pea-specific-cause",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "pea-specific-cause",
        title: "Specific Cause Identified",
        description:
          "During the resuscitation, you notice distended neck veins and muffled heart sounds. The patient had recent chest trauma. What specific cause of PEA should you suspect?",
        image: "/cardiac-tamponade-signs.png",
        decisions: [
          {
            id: "cardiac-tamponade",
            text: "Cardiac tamponade",
            outcome: {
              feedback:
                "Correct! The combination of distended neck veins, muffled heart sounds, and recent chest trauma suggests cardiac tamponade, which can cause PEA.",
              nextStep: "pea-intervention",
              isCorrect: true,
              scoreChange: 20,
            },
          },
          {
            id: "tension-pneumo",
            text: "Tension pneumothorax",
            outcome: {
              feedback:
                "Plausible but not the best answer. While tension pneumothorax can cause PEA and may occur after chest trauma, the presence of muffled heart sounds is more characteristic of cardiac tamponade.",
              nextStep: "pea-intervention",
              isCorrect: false,
              scoreChange: 5,
            },
          },
          {
            id: "pulmonary-embolism",
            text: "Pulmonary embolism",
            outcome: {
              feedback:
                "Incorrect. While pulmonary embolism can cause PEA, the clinical findings of distended neck veins and muffled heart sounds are more consistent with cardiac tamponade.",
              nextStep: "pea-intervention",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "pea-intervention",
        title: "Specific Intervention",
        description:
          "Based on your diagnosis of cardiac tamponade, what specific intervention should be performed while continuing CPR?",
        image: "/pericardiocentesis.png",
        decisions: [
          {
            id: "pericardiocentesis",
            text: "Emergent pericardiocentesis",
            outcome: {
              feedback:
                "Correct! Pericardiocentesis to drain the fluid compressing the heart is the definitive treatment for cardiac tamponade causing PEA.",
              nextStep: "pea-rosc",
              isCorrect: true,
              scoreChange: 20,
            },
          },
          {
            id: "thoracotomy",
            text: "Emergency thoracotomy",
            outcome: {
              feedback:
                "Possible but not first-line. While thoracotomy may be needed in traumatic cardiac tamponade, pericardiocentesis is typically attempted first when feasible.",
              nextStep: "pea-rosc",
              isCorrect: false,
              scoreChange: 5,
            },
          },
          {
            id: "continue-acls",
            text: "Continue standard ACLS protocol without specific intervention",
            outcome: {
              feedback:
                "Incorrect. When a specific reversible cause of PEA is identified, targeted intervention is essential alongside continued ACLS measures.",
              nextStep: "pea-rosc",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "pea-rosc",
        title: "Return of Spontaneous Circulation",
        description: "After pericardiocentesis, the patient regains a pulse. What is your priority for post-ROSC care?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "post-rosc-pea",
            text: "Stabilize the patient, arrange for definitive treatment of the tamponade, and transfer to ICU",
            outcome: {
              feedback:
                "Excellent! You've successfully identified and treated the cause of PEA. The patient needs continued monitoring and definitive treatment.",
              isGameOver: true,
              isCorrect: true,
              scoreChange: 25,
            },
          },
          {
            id: "discontinue-monitoring",
            text: "Discontinue cardiac monitoring since the immediate crisis is resolved",
            outcome: {
              feedback:
                "Incorrect. Post-cardiac arrest patients require continuous monitoring and intensive care, even after successful resuscitation.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -20,
            },
          },
          {
            id: "immediate-surgery",
            text: "Rush to surgery without stabilization",
            outcome: {
              feedback:
                "Incorrect. While definitive surgical treatment may be needed, initial stabilization is essential before transferring the patient.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
    ],
  },
  {
    id: "post-cardiac-arrest",
    title: "Post-Cardiac Arrest Care",
    description:
      "A 54-year-old male has just been successfully resuscitated after a cardiac arrest. He is now in the ICU with ROSC.",
    initialStep: "initial-assessment-post",
    complexity: 7, // High complexity due to multiple systems management
    steps: [
      {
        id: "initial-assessment-post",
        title: "Initial ICU Assessment",
        description:
          "The patient has been transferred to the ICU after successful resuscitation from VF cardiac arrest. He has a pulse but remains unconscious. Vital signs: HR 110, BP 95/60, RR 18 (ventilated), SpO2 94% on 60% FiO2. What is your first priority?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "abcde-assessment",
            text: "Perform a systematic ABCDE assessment and optimize ventilation/oxygenation",
            outcome: {
              feedback:
                "Correct! A systematic approach ensures all critical aspects of care are addressed. Optimizing ventilation and oxygenation is essential to prevent secondary brain injury.",
              nextStep: "ventilation-management",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "immediate-cooling",
            text: "Start therapeutic hypothermia immediately without other assessments",
            outcome: {
              feedback:
                "Incomplete. While targeted temperature management is important, it should not precede basic stabilization and assessment of the patient.",
              nextStep: "ventilation-management",
              isCorrect: false,
              scoreChange: -10,
            },
          },
          {
            id: "diagnostic-focus",
            text: "Focus exclusively on obtaining diagnostic tests to determine the cause of arrest",
            outcome: {
              feedback:
                "Premature. While identifying the cause is important, immediate stabilization takes priority to prevent re-arrest and secondary injury.",
              nextStep: "ventilation-management",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "ventilation-management",
        title: "Ventilation Management",
        description:
          "The patient is intubated and mechanically ventilated. An arterial blood gas shows: pH 7.21, PaCO2 55 mmHg, PaO2 85 mmHg, HCO3 22 mEq/L. What ventilation strategy is most appropriate?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "normocapnia",
            text: "Adjust ventilation to achieve normocapnia (PaCO2 35-45 mmHg) and avoid hyperoxia (target SpO2 94-98%)",
            outcome: {
              feedback:
                "Correct! Normocapnia prevents cerebral vasoconstriction (hypocapnia) and vasodilation (hypercapnia). Avoiding hyperoxia reduces oxidative stress while ensuring adequate oxygenation.",
              nextStep: "hemodynamic-management",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "hyperventilation",
            text: "Hyperventilate to achieve a PaCO2 of 25-30 mmHg",
            outcome: {
              feedback:
                "Incorrect. Hyperventilation causes cerebral vasoconstriction, potentially worsening cerebral ischemia. It is not recommended in post-cardiac arrest care.",
              nextStep: "hemodynamic-management",
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "high-oxygen",
            text: "Increase FiO2 to 100% to maximize oxygen delivery",
            outcome: {
              feedback:
                "Incorrect. Hyperoxia can increase oxidative stress and worsen reperfusion injury. Oxygen should be titrated to maintain SpO2 94-98%, not maximized.",
              nextStep: "hemodynamic-management",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "hemodynamic-management",
        title: "Hemodynamic Management",
        description:
          "The patient's blood pressure has decreased to 80/45 mmHg. Cardiac output is low on ultrasound assessment. What is your approach to hemodynamic management?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "fluid-vasopressors",
            text: "Administer IV fluids, start norepinephrine if needed, and consider dobutamine for low cardiac output",
            outcome: {
              feedback:
                "Correct! A combination of fluids and vasopressors/inotropes is often needed to maintain adequate perfusion pressure and cardiac output in post-arrest patients.",
              nextStep: "temperature-management",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "fluids-only",
            text: "Administer large volume fluid resuscitation only",
            outcome: {
              feedback:
                "Incomplete. While fluid resuscitation is important, vasopressors are often necessary to maintain adequate perfusion pressure in post-arrest patients with myocardial dysfunction.",
              nextStep: "temperature-management",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "permissive-hypotension",
            text: "Accept lower blood pressure to avoid vasopressor side effects",
            outcome: {
              feedback:
                "Incorrect. Hypotension in post-cardiac arrest patients is associated with worse outcomes. Maintaining adequate perfusion pressure (MAP >65 mmHg) is essential for organ perfusion.",
              nextStep: "temperature-management",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "temperature-management",
        title: "Temperature Management",
        description:
          "The patient remains comatose with a GCS of 6 (E1V1M4). His temperature is 37.8°C and rising. What is your approach to temperature management?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "targeted-temperature",
            text: "Initiate targeted temperature management at 33-36°C for 24 hours",
            outcome: {
              feedback:
                "Correct! Targeted temperature management (TTM) is recommended for comatose post-cardiac arrest patients. Either 33°C or 36°C is acceptable based on current evidence.",
              nextStep: "cardiac-evaluation",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "normothermia",
            text: "Maintain strict normothermia (36.5-37.5°C) without cooling below normal",
            outcome: {
              feedback:
                "Acceptable but not optimal. While fever prevention is essential, current guidelines still recommend TTM at 33-36°C for comatose post-cardiac arrest patients.",
              nextStep: "cardiac-evaluation",
              isCorrect: false,
              scoreChange: 5,
            },
          },
          {
            id: "deep-hypothermia",
            text: "Cool aggressively to 30°C for maximum neuroprotection",
            outcome: {
              feedback:
                "Incorrect. Deep hypothermia (<33°C) has not been shown to improve outcomes and may increase complications such as arrhythmias, coagulopathy, and infection.",
              nextStep: "cardiac-evaluation",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "cardiac-evaluation",
        title: "Cardiac Evaluation",
        description:
          "The 12-lead ECG shows ST-segment elevation in leads V1-V4. The patient has no known history of coronary artery disease. What is your next step?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "emergent-angiography",
            text: "Arrange for emergent coronary angiography and possible PCI",
            outcome: {
              feedback:
                "Correct! Emergent coronary angiography is recommended for post-arrest patients with STEMI. Acute coronary occlusion is a common cause of cardiac arrest.",
              nextStep: "neurological-prognostication",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "thrombolytics",
            text: "Administer thrombolytic therapy in the ICU",
            outcome: {
              feedback:
                "Suboptimal. While thrombolytics may be considered if PCI is not available, primary PCI is preferred for post-arrest patients with STEMI when feasible.",
              nextStep: "neurological-prognostication",
              isCorrect: false,
              scoreChange: 0,
            },
          },
          {
            id: "delay-cardiac",
            text: "Delay cardiac intervention until the patient is neurologically stable",
            outcome: {
              feedback:
                "Incorrect. Delaying coronary intervention in post-arrest STEMI patients may lead to ongoing myocardial damage and hemodynamic instability. Early intervention is recommended.",
              nextStep: "neurological-prognostication",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "neurological-prognostication",
        title: "Neurological Prognostication",
        description:
          "It's now 48 hours post-arrest. The patient remains comatose after rewarming and sedation has been discontinued. The family is asking about the patient's neurological prognosis. What is your approach?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "multimodal-assessment",
            text: "Explain that accurate prognostication requires a multimodal approach and should not be based on a single finding or be performed too early",
            outcome: {
              feedback:
                "Correct! Neurological prognostication should use multiple modalities (clinical exam, EEG, imaging, biomarkers) and not be performed before 72 hours in patients who have undergone TTM.",
              nextStep: "discharge-planning-post",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "early-poor-prognosis",
            text: "Inform the family that continued coma at 48 hours indicates a poor neurological prognosis",
            outcome: {
              feedback:
                "Incorrect. Prognostication at 48 hours is premature, especially after TTM. Sedatives and neuromuscular blockers may still affect the exam, and neurological recovery can continue for days.",
              nextStep: "discharge-planning-post",
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "single-test",
            text: "Order a single definitive test (e.g., CT brain) to determine prognosis",
            outcome: {
              feedback:
                "Incorrect. No single test is sufficiently accurate for prognostication. A multimodal approach using clinical examination, electrophysiological studies, biomarkers, and imaging is recommended.",
              nextStep: "discharge-planning-post",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "discharge-planning-post",
        title: "Long-term Planning",
        description:
          "The patient has shown neurological improvement and is now following commands. He is being prepared for transfer out of the ICU. What elements should be included in his long-term care plan?",
        image: "/post-resuscitation-icu.png",
        decisions: [
          {
            id: "comprehensive-plan",
            text: "Comprehensive cardiac rehabilitation, ICD evaluation, neurological follow-up, and secondary prevention strategies",
            outcome: {
              feedback:
                "Excellent! A comprehensive approach addressing cardiac rehabilitation, arrhythmia prevention, neurological recovery, and secondary prevention is essential for post-cardiac arrest survivors.",
              isGameOver: true,
              isCorrect: true,
              scoreChange: 20,
            },
          },
          {
            id: "cardiac-focus",
            text: "Focus exclusively on cardiac follow-up and medication management",
            outcome: {
              feedback:
                "Incomplete. While cardiac care is important, post-arrest patients often have neurological, psychological, and functional issues that also require attention.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "minimal-follow-up",
            text: "Arrange standard follow-up with primary care physician only",
            outcome: {
              feedback:
                "Inadequate. Post-cardiac arrest patients require specialized follow-up addressing multiple domains including cardiac, neurological, and psychological care.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
    ],
  },
  {
    id: "unstable-tachycardia",
    title: "Unstable Tachycardia",
    description:
      "A 45-year-old female presents to the emergency department with palpitations, dizziness, and chest discomfort for the past hour.",
    initialStep: "tachy-initial",
    complexity: 8, // High complexity due to critical timing and multiple treatment options
    steps: [
      {
        id: "tachy-initial",
        title: "Initial Assessment",
        description:
          "The patient appears anxious and diaphoretic. Vital signs: HR 180, BP 85/50, RR 24, SpO2 94% on room air. What is your first action?",
        image: "/tachycardia-patient.png",
        decisions: [
          {
            id: "assess-stability",
            text: "Assess for signs of clinical instability (hypotension, altered mental status, chest pain, heart failure)",
            outcome: {
              feedback:
                "Correct! Assessing for signs of instability is crucial in determining the urgency and approach to treatment.",
              nextStep: "tachy-ecg",
              isCorrect: true,
              scoreChange: 10,
            },
          },
          {
            id: "immediate-cardioversion",
            text: "Prepare for immediate cardioversion without further assessment",
            outcome: {
              feedback:
                "Premature. While the patient shows signs of instability, you should first identify the rhythm and consider the full clinical picture before proceeding to cardioversion.",
              nextStep: "tachy-ecg",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "vagal-maneuvers",
            text: "Instruct the patient to perform vagal maneuvers",
            outcome: {
              feedback:
                "Inappropriate as first action. In an unstable patient, attempting vagal maneuvers delays definitive treatment and may worsen the condition.",
              nextStep: "tachy-ecg",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "tachy-ecg",
        title: "ECG Interpretation",
        description:
          "A 12-lead ECG shows a regular, narrow-complex tachycardia at 180 bpm without visible P waves. The patient's BP has dropped to 80/45 and she reports worsening dizziness. What is your diagnosis?",
        image: "/svt-ecg.png",
        decisions: [
          {
            id: "diagnose-svt",
            text: "Supraventricular Tachycardia (SVT)",
            outcome: {
              feedback:
                "Correct! The regular, narrow-complex tachycardia without visible P waves at this rate is consistent with SVT, likely AVNRT (AV Nodal Reentrant Tachycardia) or AVRT (AV Reentrant Tachycardia).",
              nextStep: "tachy-management",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "diagnose-afib",
            text: "Atrial Fibrillation with Rapid Ventricular Response",
            outcome: {
              feedback:
                "Incorrect. Atrial fibrillation typically presents with an irregularly irregular rhythm, not the regular rhythm described here.",
              nextStep: "tachy-management",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "diagnose-vt",
            text: "Ventricular Tachycardia",
            outcome: {
              feedback:
                "Incorrect. The description of a narrow-complex tachycardia is inconsistent with ventricular tachycardia, which typically presents with wide QRS complexes.",
              nextStep: "tachy-management",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "tachy-management",
        title: "Management Decision",
        description:
          "Based on your diagnosis of SVT and the patient's unstable condition, what is the most appropriate immediate management?",
        image: "/synchronized-cardioversion-prep.png",
        decisions: [
          {
            id: "synchronized-cardioversion",
            text: "Synchronized cardioversion",
            isUrgent: true,
            outcome: {
              feedback:
                "Correct! For unstable SVT (hypotension, altered mental status, signs of shock), synchronized cardioversion is the recommended immediate treatment.",
              nextStep: "cardioversion-prep",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "adenosine-attempt",
            text: "Adenosine 6mg rapid IV push",
            outcome: {
              feedback:
                "Not optimal for unstable patient. While adenosine is appropriate for stable SVT, this patient's hypotension and symptoms indicate instability requiring immediate cardioversion.",
              nextStep: "cardioversion-prep",
              isCorrect: false,
              scoreChange: -5,
            },
          },
          {
            id: "diltiazem-bolus",
            text: "Diltiazem 0.25 mg/kg IV bolus",
            outcome: {
              feedback:
                "Inappropriate for unstable patient. Calcium channel blockers can worsen hypotension and are contraindicated in unstable tachycardia.",
              nextStep: "cardioversion-prep",
              isCorrect: false,
              scoreChange: -15,
            },
          },
        ],
      },
      {
        id: "cardioversion-prep",
        title: "Cardioversion Preparation",
        description: "You've decided to perform synchronized cardioversion. What is the correct preparation?",
        image: "/defibrillator-sync-mode.png",
        decisions: [
          {
            id: "proper-sedation",
            text: "Ensure the defibrillator is in synchronized mode, administer sedation if possible without delaying treatment, and use appropriate energy level",
            outcome: {
              feedback:
                "Correct! Proper preparation includes synchronization, appropriate sedation if time permits, and correct energy selection (50-100J for SVT).",
              nextStep: "post-cardioversion",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "unsynchronized-shock",
            text: "Deliver an unsynchronized shock at 200J",
            outcome: {
              feedback:
                "Dangerous! Unsynchronized shocks for organized rhythms with a pulse can induce ventricular fibrillation if delivered during the vulnerable period of the cardiac cycle.",
              nextStep: "post-cardioversion",
              isCorrect: false,
              scoreChange: -20,
            },
          },
          {
            id: "deep-sedation",
            text: "Delay cardioversion to achieve deep sedation and intubation first",
            outcome: {
              feedback:
                "Inappropriate delay. While sedation is preferred, it should not significantly delay cardioversion in an unstable patient. Procedural sedation is usually sufficient without intubation.",
              nextStep: "post-cardioversion",
              isCorrect: false,
              scoreChange: -10,
            },
          },
        ],
      },
      {
        id: "post-cardioversion",
        title: "Post-Cardioversion Management",
        description:
          "After synchronized cardioversion, the patient converts to normal sinus rhythm at 90 bpm. BP improves to 110/70. What is your next step in management?",
        image: "/normal-sinus-rhythm.png",
        decisions: [
          {
            id: "post-conversion-care",
            text: "Monitor the patient, obtain a 12-lead ECG, check electrolytes, and consider cardiology consultation for long-term management",
            outcome: {
              feedback:
                "Correct! After successful cardioversion, monitoring for recurrence, identifying precipitating factors, and arranging appropriate follow-up are essential.",
              nextStep: "discharge-planning",
              isCorrect: true,
              scoreChange: 15,
            },
          },
          {
            id: "immediate-discharge",
            text: "Discharge the patient immediately since the rhythm has normalized",
            outcome: {
              feedback:
                "Inappropriate. Patients who have required cardioversion need observation, evaluation for underlying causes, and consideration of preventive measures before discharge.",
              nextStep: "discharge-planning",
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "prophylactic-amiodarone",
            text: "Start amiodarone infusion to prevent recurrence",
            outcome: {
              feedback:
                "Overly aggressive. Amiodarone has significant side effects and is not routinely indicated after a first episode of SVT. Less toxic options or observation may be more appropriate initially.",
              nextStep: "discharge-planning",
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
      {
        id: "discharge-planning",
        title: "Discharge Planning",
        description:
          "After observation, the patient remains stable in normal sinus rhythm. Laboratory results are normal. What discharge recommendations are appropriate?",
        image: "/cardiology-discharge-planning.png",
        decisions: [
          {
            id: "appropriate-followup",
            text: "Arrange cardiology follow-up, educate on vagal maneuvers, consider beta-blocker if appropriate, and provide clear return instructions",
            outcome: {
              feedback:
                "Excellent! You've provided comprehensive care including appropriate follow-up, education, consideration of preventive medication, and safety instructions.",
              isGameOver: true,
              isCorrect: true,
              scoreChange: 20,
            },
          },
          {
            id: "no-followup",
            text: "Discharge without specific follow-up as this was likely a one-time event",
            outcome: {
              feedback:
                "Inadequate. SVT often recurs and patients should have cardiology follow-up to discuss long-term management options including medication or ablation.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -15,
            },
          },
          {
            id: "ep-study",
            text: "Schedule immediate electrophysiology study and ablation before discharge",
            outcome: {
              feedback:
                "Overly aggressive for initial presentation. While EP study and ablation may be appropriate eventually, they're not typically performed emergently after a first episode unless there are specific indications.",
              isGameOver: true,
              isCorrect: false,
              scoreChange: -5,
            },
          },
        ],
      },
    ],
  },
]
