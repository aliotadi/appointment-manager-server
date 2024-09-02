import { SetMetadata } from '@nestjs/common';

import { USER_ROLE } from '../types/user-roles.enum';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
