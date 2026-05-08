/*
 * Tiny structured logger. Emits one JSON line per call so logs can be parsed
 * by any aggregator (Loki, Datadog, CloudWatch). Falls back to pretty printing
 * in development.
 */

type Fields = Record<string, unknown>;
type Level = "debug" | "info" | "warn" | "error";

const pretty = process.env.NODE_ENV !== "production";

const emit = (level: Level, fields: Fields): void => {
  const record = {
    level,
    time: new Date().toISOString(),
    ...fields,
  } as Record<string, unknown>;

  if (pretty) {
    const { msg, requestId, ...rest } = record as { msg?: string; requestId?: string } & Fields;
    const tag = requestId ? ` [${String(requestId).slice(0, 8)}]` : "";
    const extra = Object.keys(rest).length ? " " + JSON.stringify(rest) : "";
    const fn = level === "error" ? "error" : level === "warn" ? "warn" : "log";
    // eslint-disable-next-line no-console
    console[fn](`${record.time} ${level.toUpperCase()}${tag} ${msg ?? ""}${extra}`);
  } else {
    process.stdout.write(JSON.stringify(record) + "\n");
  }
};

const logger = {
  debug: (msg: string, fields: Fields = {}): void => {
    if (process.env.LOG_LEVEL === "debug") emit("debug", { msg, ...fields });
  },
  info: (msg: string, fields: Fields = {}): void => emit("info", { msg, ...fields }),
  warn: (msg: string, fields: Fields = {}): void => emit("warn", { msg, ...fields }),
  error: (msg: string, fields: Fields = {}): void => emit("error", { msg, ...fields }),
  child: (extra: Fields) => ({
    debug: (msg: string, fields: Fields = {}) => logger.debug(msg, { ...extra, ...fields }),
    info: (msg: string, fields: Fields = {}) => logger.info(msg, { ...extra, ...fields }),
    warn: (msg: string, fields: Fields = {}) => logger.warn(msg, { ...extra, ...fields }),
    error: (msg: string, fields: Fields = {}) => logger.error(msg, { ...extra, ...fields }),
  }),
};

export default logger;
