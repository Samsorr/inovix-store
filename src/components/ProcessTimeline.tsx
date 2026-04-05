"use client"

import { motion } from "motion/react"

interface Step {
  step: string
  title: string
  description: string
}

/* Stagger children one by one */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
}

/* Empty wrapper — only serves as stagger target for its children */
const itemVariants = {
  hidden: {},
  visible: {},
}

/* Circle pops in with spring */
const circleVariants = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { type: "spring" as const, stiffness: 400, damping: 17 },
  },
}

/* Text fades up slightly after its circle */
const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const, delay: 0.1 },
  },
}

export function ProcessTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative">
      {/* Connecting line — draws left→right on desktop */}
      <motion.div
        className="absolute left-0 right-0 top-5 hidden h-px origin-left bg-border lg:block"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      />

      <motion.div
        className="grid gap-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 lg:gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {steps.map(({ step, title, description }) => (
          <motion.div
            key={step}
            variants={itemVariants}
            className="relative text-center"
          >
            {/* Numbered circle */}
            <motion.div
              variants={circleVariants}
              className="relative z-10 mx-auto flex size-10 items-center justify-center border-2 border-teal-400 bg-white"
            >
              <span className="text-xs font-bold tabular-nums text-teal-400">
                {step}
              </span>
            </motion.div>

            {/* Title + description */}
            <motion.div variants={textVariants}>
              <h3 className="mt-5 text-sm font-semibold text-navy-500 sm:text-base">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
