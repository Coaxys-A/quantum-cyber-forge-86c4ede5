import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, user, body, tenantId, ip, headers } = request;

    // Only log state-changing operations
    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const action = this.getActionFromRequest(method, url);
    const resourceType = this.getResourceTypeFromUrl(url);

    return next.handle().pipe(
      tap(async (response) => {
        try {
          if (user && tenantId) {
            await this.prisma.auditLog.create({
              data: {
                tenantId,
                userId: user.userId,
                action,
                resourceType,
                resourceId: response?.id || null,
                details: {
                  method,
                  url,
                  statusCode: 200,
                },
                ipAddress: ip || headers['x-forwarded-for'] || headers['x-real-ip'],
                userAgent: headers['user-agent'],
              },
            });
          }
        } catch (error) {
          // Don't fail the request if audit logging fails
          console.error('Audit log error:', error);
        }
      }),
    );
  }

  private getActionFromRequest(method: string, url: string): string {
    const actions: Record<string, string> = {
      POST: 'CREATE',
      PATCH: 'UPDATE',
      PUT: 'UPDATE',
      DELETE: 'DELETE',
    };
    return actions[method] || 'UNKNOWN';
  }

  private getResourceTypeFromUrl(url: string): string {
    const segments = url.split('/').filter(Boolean);
    return segments[0] || 'UNKNOWN';
  }
}
