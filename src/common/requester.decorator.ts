import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface RequestIdentity {
  userId: string;
  roles: string[];
  permissions: string[];
  cityIds: string[];
  storeIds: string[];
  tenantId: string;
}

// Until Identity Management token validation is wired in Phase 2, local
// development may supply a trusted gateway identity header. Never expose this
// mode publicly; production deployments must replace it with verified claims.
export const Requester = createParamDecorator(
  (_data: unknown, context: ExecutionContext): RequestIdentity => {
    const request = context.switchToHttp().getRequest();
    return request.identity ?? {
      userId: request.headers['x-user-id'] ?? 'local-user',
      roles: String(request.headers['x-user-roles'] ?? 'user').split(','),
      permissions: String(request.headers['x-user-permissions'] ?? '').split(',').filter(Boolean),
      cityIds: String(request.headers['x-city-ids'] ?? '').split(',').filter(Boolean),
      storeIds: String(request.headers['x-store-ids'] ?? '').split(',').filter(Boolean),
      tenantId: request.headers['x-tenant-id'] ?? 'local-tenant',
    };
  },
);
