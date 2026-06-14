type LogLevel = 'info' | 'warn' | 'error' | 'debug';

type LogData = Record<string, unknown>;

function formatMessage(level: LogLevel, message: string, data?: LogData): string {
  const ts = new Date().toISOString();
  const prefix = `[${ts}] [${level.toUpperCase()}]`;
  return data ? `${prefix} ${message} ${JSON.stringify(data)}` : `${prefix} ${message}`;
}

export const logger = {
  info(message: string, data?: LogData): void {
    console.log(formatMessage('info', message, data));
  },

  warn(message: string, data?: LogData): void {
    console.warn(formatMessage('warn', message, data));
  },

  // الاستخدام: logger.error(message, error?, data?)
  error(message: string, error?: unknown, data?: LogData): void {
    const errDetail =
      error instanceof Error
        ? { name: error.name, message: error.message }
        : error !== undefined
          ? { raw: String(error) }
          : undefined;

    const merged = errDetail ? { ...errDetail, ...data } : data;
    console.error(formatMessage('error', message, merged as LogData | undefined));
  },

  debug(message: string, data?: LogData): void {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(formatMessage('debug', message, data));
    }
  },
};
