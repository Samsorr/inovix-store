import * as Sentry from "@sentry/nextjs"

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment:
      process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ?? process.env.NODE_ENV,
    tracesSampleRate: Number(
      process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
        (process.env.NODE_ENV === "development" ? "1.0" : "0.1")
    ),

    // Session Replay: 10% of sessions, 100% of sessions with errors
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // GDPR: keep false until privacy policy explicitly covers IP + header capture
    sendDefaultPii: false,

    enableLogs: true,

    integrations: [
      Sentry.replayIntegration({
        // Mask all text and block media by default to avoid capturing PII
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  })
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
