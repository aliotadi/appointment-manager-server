import { SetMetadata } from '@nestjs/common';

import { USER_ROLE } from '../types';

export const Roles = (...roles: USER_ROLE[]) => SetMetadata('roles', roles);
