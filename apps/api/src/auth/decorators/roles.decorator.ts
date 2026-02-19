import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

/** Restrict route to specific user roles */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
