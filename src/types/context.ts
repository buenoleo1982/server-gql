import type { PrismaClient } from '@prisma/client';

export interface GraphQLContext {
  token: string | null;
  datasource: string | null;
  prisma: PrismaClient;
  user?: {
    id: string | number;
    email: string;
  };
}
