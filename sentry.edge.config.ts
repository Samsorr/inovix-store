import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
  tracesSampleRate: Number(
    process.env.SENTRY_TRACES_SAMPLE_RATE ??
      (process.env.NODE_ENV === "development" ? "1.0" : "0.1")
  ),

  // GDPR: keep false until privacy policy explicitly covers IP + header capture
  sendDefaultPii: false,

  enableLogs: true,
})
