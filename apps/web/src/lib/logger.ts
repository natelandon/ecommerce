/**
 * Centralized logger utility for consistent logging across the application
 * Supports different log levels and environment-aware output
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private isDev = process.env.NODE_ENV === 'development';

  private formatLog(context: LogContext): string {
    return `[${context.timestamp}] ${context.level.toUpperCase()}: ${context.message}`;
  }

  private log(context: LogContext): void {
    const formatted = this.formatLog(context);
    const timestamp = new Date().toISOString();

    switch (context.level) {
      case 'debug':
        if (this.isDev) console.debug(formatted, context.data);
        break;
      case 'info':
        console.info(formatted, context.data);
        break;
      case 'warn':
        console.warn(formatted, context.data);
        break;
      case 'error':
        console.error(formatted, context.data);
        break;
    }
  }

  debug(message: string, data?: unknown): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'debug',
      message,
      data,
    });
  }

  info(message: string, data?: unknown): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
    });
  }

  warn(message: string, data?: unknown): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      data,
    });
  }

  error(message: string, error?: unknown): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      data: error instanceof Error ? error.message : error,
    });
  }
}

export const logger = new Logger();
