type LogLevel = "debug" | "info" | "warn" | "error";

export function createLogger(scope: string) {
  const prefix = `[blocklist:${scope}]`;

  function write(level: LogLevel, message: string, meta?: unknown) {
    const line =
      meta === undefined
        ? `${prefix} ${message}`
        : `${prefix} ${message} ${safeMeta(meta)}`;
    if (level === "error") console.error(line);
    else if (level === "warn") console.warn(line);
    else console.log(line);
  }

  return {
    debug: (message: string, meta?: unknown) => write("debug", message, meta),
    info: (message: string, meta?: unknown) => write("info", message, meta),
    warn: (message: string, meta?: unknown) => write("warn", message, meta),
    error: (message: string, meta?: unknown) => write("error", message, meta),
  };
}

function safeMeta(meta: unknown): string {
  try {
    return JSON.stringify(meta);
  } catch {
    return "";
  }
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}
