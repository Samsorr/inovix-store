"use client"

import { Check, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"

interface Step {
  num: number
  label: string
  icon: LucideIcon
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
  const CurrentIcon = currentStep.icon

  return (
    <div aria-label="Checkout voortgang">
      {/* Mobile: icon + label + progress bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-full bg-teal-400 text-white">
              <CurrentIcon className="size-4" strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                Stap {activeStep} van {totalSteps}
              </span>
              <span className="text-sm font-semibold text-navy-500">
                {currentStep.label}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {steps.map((s) => (
              <span
                key={s.num}
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full transition-colors",
                  completedSteps.has(s.num) || activeStep === s.num
                    ? "bg-teal-400"
                    : "bg-border"
                )}
              />
            ))}
          </div>
        </div>
        <div className="mt-3 h-0.5 w-full overflow-hidden bg-border">
          <div
            className="h-full bg-teal-400 transition-all duration-500"
            style={{ width: `${(activeStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop: labeled stepper with icons */}
      <ol className="hidden sm:flex sm:items-start">
        {steps.map((step, i) => {
          const isCompleted = completedSteps.has(step.num)
          const isCurrent = activeStep === step.num
          const isLast = i === steps.length - 1
          const canJump = isCompleted && !isCurrent
          const StepIcon = step.icon

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
                  aria-label={`${step.label}${isCompleted ? " voltooid" : isCurrent ? " actief" : ""}`}
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 transition-all duration-300",
                    isCompleted &&
                      "border-teal-400 bg-teal-400 text-white hover:bg-teal-500 hover:border-teal-500 hover:-translate-y-px hover:shadow-sm",
                    isCurrent &&
                      !isCompleted &&
                      "border-teal-400 bg-white text-teal-500 shadow-sm",
                    !isCompleted &&
                      !isCurrent &&
                      "border-border bg-white text-muted-foreground",
                    canJump ? "cursor-pointer" : "cursor-default"
                  )}
                >
                  {isCompleted ? (
                    <Check className="size-4" strokeWidth={2.5} />
                  ) : (
                    <StepIcon className="size-4" strokeWidth={2} />
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
                  className="mx-3 mt-5 h-px flex-1 bg-border sm:mx-4"
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
