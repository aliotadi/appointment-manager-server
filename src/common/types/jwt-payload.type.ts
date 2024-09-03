import { USER_ROLE } from './user-roles.enum';

export type JwtPayload = {
  id: number;
  role: USER_ROLE;
};
