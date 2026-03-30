import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserPayload {
  id: string;
  role: string;
  phone: string;
  name: string;
  clinicianRole?: string | null;
  permissions?: {
    canPrescribe: boolean;
    canExportResearch: boolean;
    canManageUsers: boolean;
  } | null;
}

/** Extract the authenticated user from the request */
export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserPayload;
    return data ? user?.[data] : user;
  },
);
