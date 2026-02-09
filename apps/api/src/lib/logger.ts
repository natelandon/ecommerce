/**
 * Logger utility for server-side logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class ServerLogger {
  private isDev = process.env.NODE_ENV === 'development';

  private formatLog(level: LogLevel, message: string): string {
    return `[${new Date().toISOString()}] ${level.toUpperCase()}: ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.isDev) {
      console.debug(this.formatLog('debug', message), data || '');
    }
  }

  info(message: string, data?: unknown): void {
    console.info(this.formatLog('info', message), data || '');
  }

  warn(message: string, data?: unknown): void {
    console.warn(this.formatLog('warn', message), data || '');
  }

  error(message: string, error?: unknown): void {
    console.error(
      this.formatLog('error', message),
      error instanceof Error ? error.message : error || '',
    );
  }
}

export const logger = new ServerLogger();
