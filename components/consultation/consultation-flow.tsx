"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Stethoscope,
} from "lucide-react"

import {
  ConsultationMedication,
  ConsultationVitals,
  buildConsultationPayload,
  emptyVitals,
  saveConsultation,
  savePendingConsultation,
} from "@/lib/consultation-store"
import { patientProfile } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { ConsultationStepper, StepMeta } from "@/components/consultation/stepper"
import { PatientStep } from "@/components/consultation/step-patient"
import { VitalsStep } from "@/components/consultation/step-vitals"
import { SymptomsStep } from "@/components/consultation/step-symptoms"
import { AssessmentStep } from "@/components/consultation/step-assessment"
import { MedicationsStep } from "@/components/consultation/step-medications"
import { DecisionStep } from "@/components/consultation/step-decision"

const steps: StepMeta[] = [
  { key: "patient", label: "Patient" },
  { key: "vitals", label: "Vitals" },
  { key: "symptoms", label: "Symptoms" },
  { key: "assessment", label: "Assessment" },
  { key: "medications", label: "Medications" },
  { key: "decision", label: "Decision" },
]

export function ConsultationFlow() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [vitals, setVitals] = useState<ConsultationVitals>(emptyVitals)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [notes, setNotes] = useState("")
  const [diagnosis, setDiagnosis] = useState("")
  const [clinicalNotes, setClinicalNotes] = useState("")
  const [recommendedAction, setRecommendedAction] = useState("")
  const [medications, setMedications] = useState<ConsultationMedication[]>([])

  const last = step === steps.length - 1

  function next() {
    if (last) return
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleComplete() {
    setSaving(true)
    const payload = buildConsultationPayload({
      vitals,
      symptoms,
      notes,
      diagnosis,
      clinicalNotes,
      recommendedAction,
      medications,
    })
    saveConsultation(payload)
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      router.push(`/patient/${patientProfile.swasthyaId}`)
    }, 1400)
  }

  function handleRefer() {
    const payload = buildConsultationPayload({
      vitals,
      symptoms,
      notes,
      diagnosis,
      clinicalNotes,
      recommendedAction,
      medications,
    })
    savePendingConsultation(payload)
    router.push(`/referrals/new`)
  }

  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-success/25 bg-success-muted/30 px-6 py-16 text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-success text-success-foreground">
          <CheckCircle2 className="size-8" />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Consultation recorded
        </h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground text-pretty">
          The visit has been added to {patientProfile.name}&apos;s medical
          timeline. Taking you to the patient profile…
        </p>
        <Loader2 className="mt-4 size-5 animate-spin text-success" />
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-teal-muted text-teal">
          <Stethoscope className="size-5.5" />
        </span>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            New Consultation
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Record a visit on {patientProfile.name}&apos;s continuous care
            journey.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <ConsultationStepper
          steps={steps}
          current={step}
          onStepClick={(i) => setStep(i)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        {step === 0 && <PatientStep />}
        {step === 1 && <VitalsStep vitals={vitals} onChange={setVitals} />}
        {step === 2 && (
          <SymptomsStep
            symptoms={symptoms}
            notes={notes}
            onChange={(s, n) => {
              setSymptoms(s)
              setNotes(n)
            }}
          />
        )}
        {step === 3 && (
          <AssessmentStep
            diagnosis={diagnosis}
            clinicalNotes={clinicalNotes}
            recommendedAction={recommendedAction}
            onChange={(d, n, a) => {
              setDiagnosis(d)
              setClinicalNotes(n)
              setRecommendedAction(a)
            }}
          />
        )}
        {step === 4 && (
          <MedicationsStep medications={medications} onChange={setMedications} />
        )}
        {step === 5 && (
          <DecisionStep onComplete={handleComplete} onRefer={handleRefer} />
        )}
      </div>

      {!last && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={back}
            disabled={step === 0}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
          <Button onClick={next}>
            Continue
            <ArrowRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
