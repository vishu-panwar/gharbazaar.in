// Professional logging system

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: any
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, context?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    }
  }

  info(message: string, context?: any) {
    if (this.isDevelopment) {
      console.log('ℹ️', message, context || '')
    }
    // In production, send to logging service
  }

  warn(message: string, context?: any) {
    console.warn('⚠️', message, context || '')
    // Send to logging service
  }

  error(message: string, error?: Error | any) {
    console.error('❌', message, error || '')
    // Send to error tracking service (Sentry, etc.)
  }

  debug(message: string, context?: any) {
    if (this.isDevelopment) {
      console.debug('🐛', message, context || '')
    }
  }

  // API request logging
  apiRequest(method: string, url: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`🌐 API ${method}:`, url, data || '')
    }
  }

  // API response logging
  apiResponse(method: string, url: string, status: number, data?: any) {
    if (this.isDevelopment) {
      const emoji = status >= 200 && status < 300 ? '✅' : '❌'
      console.log(`${emoji} API ${method} ${status}:`, url, data || '')
    }
  }
}

export const logger = new Logger()
