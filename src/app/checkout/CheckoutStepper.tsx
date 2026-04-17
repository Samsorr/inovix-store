"use client"

import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

interface Step {
  num: number
  label: string
}

interface CheckoutStepperProps {
  steps: Step[]
  activeStep: number
  completedSteps: Set<number>
  onEdit: (step: number) => void
}

export function CheckoutStepper({
  steps,
  activeStep,
  completedSteps,
  onEdit,
}: CheckoutStepperProps) {
  const currentStep = steps.find((s) => s.num === activeStep) ?? steps[0]
  const totalSteps = steps.length

  return (
    <div aria-label="Checkout voortgang">
      {/* Mobile: compact text + progress bar */}
      <div className="sm:hidden">
        <div className="flex items-baseline justify-between">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            Stap {activeStep} van {totalSteps}
          </span>
          <span className="text-[13px] font-semibold uppercase tracking-[0.08em] text-navy-500">
            {currentStep.label}
          </span>
        </div>
        <div className="mt-2 h-0.5 w-full bg-border">
          <div
            className="h-full bg-teal-400 transition-all duration-500"
            style={{ width: `${(activeStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: labeled stepper */}
      <ol className="hidden sm:flex sm:items-start">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(step.num)
          const isCurrent = activeStep === step.num
          const isLast = i === steps.length - 1
          const canJump = isCompleted && !isCurrent

          return (
            <li
              key={step.num}
              className={cn("flex flex-1 items-start", isLast && "flex-none")}
            >
              <div className="flex min-w-0 flex-col items-center">
                <button
                  type="button"
                  onClick={canJump ? () => onEdit(step.num) : undefined}
                  disabled={!canJump}
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "flex size-8 items-center justify-center rounded-full border text-[12px] font-semibold tabular-nums transition-colors",
                    isCompleted &&
                      "border-teal-400 bg-teal-400 text-white hover:bg-teal-500 hover:border-teal-500",
                    isCurrent &&
                      !isCompleted &&
                      "border-teal-400 bg-white text-teal-500",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-white text-muted-foreground",
                    canJump ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-3.5" strokeWidth={3} />
                  ) : (
                    step.num
                  )}
                </button>
                <span
                  className={cn(
                    "mt-2 text-[11px] font-medium uppercase tracking-widest",
                    isCurrent
                      ? "text-navy-500"
                      : isCompleted
                        ? "text-navy-500/70"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  aria-hidden
                  className="mx-3 mt-4 h-px flex-1 bg-border sm:mx-4"
                >
                  <div
                    className={cn(
                      "h-full bg-teal-400 transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
