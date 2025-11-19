import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { SKIP_TENANT_CHECK } from '../guards/tenant.guard';

export const TenantId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.tenantId || request.user?.tenantId;
  },
);

export const SkipTenantCheck = () => SetMetadata(SKIP_TENANT_CHECK, true);
