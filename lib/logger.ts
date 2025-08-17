type LogLevel = "debug" | "info" | "warn" | "error"

const enabledLevels: Record<LogLevel, boolean> = {
  debug: process.env.NODE_ENV !== "production",
  info: true,
  warn: true,
  error: true,
}

function formatPrefix(level: LogLevel) {
  const ts = new Date().toISOString()
  return `[ui:${level}] ${ts}`
}

function log(level: LogLevel, message: string, data?: unknown) {
  if (!enabledLevels[level]) return
  const prefix = formatPrefix(level)
  const fn =
    level === "debug"
      ? console.log
      : level === "info"
      ? console.info
      : level === "warn"
      ? console.warn
      : console.error
  // Using unknown preserves type-safety while allowing console params
  fn(
    prefix as unknown as string,
    message as unknown as string,
    data as unknown as object
  )
}

export const logger = {
  debug: (message: string, data?: unknown) => log("debug", message, data),
  info: (message: string, data?: unknown) => log("info", message, data),
  warn: (message: string, data?: unknown) => log("warn", message, data),
  error: (message: string, data?: unknown) => log("error", message, data),
}

export default logger
