import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class PerformanceMiddleware implements NestMiddleware {
  private readonly logger = new Logger(PerformanceMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const { method, originalUrl } = req;

    // Логируем начало запроса
    this.logger.log(`🚀 ${method} ${originalUrl} - Request started`);

    // Перехватываем завершение запроса
    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      // Логируем результат с цветовой индикацией
      if (statusCode >= 200 && statusCode < 300) {
        this.logger.log(`✅ ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
      } else if (statusCode >= 400 && statusCode < 500) {
        this.logger.warn(`⚠️  ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
      } else if (statusCode >= 500) {
        this.logger.error(`❌ ${method} ${originalUrl} - ${statusCode} - ${duration}ms`);
      }

      // Предупреждение о медленных запросах
      if (duration > 1000) {
        this.logger.warn(`🐌 Slow request: ${method} ${originalUrl} took ${duration}ms`);
      }
    });

    next();
  }
} 