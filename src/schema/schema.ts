import { buildSchema, type ContainerType } from 'type-graphql';
import { importResolvers } from '../resolvers';
import { prismaClient } from '../utils/prisma';

class PrismaContainer implements ContainerType {
  get<T>(someClass: { new (client: typeof prismaClient): T }): T {
    return new someClass(prismaClient);
  }
}

export const createSchema = async () => {
  const resolvers = await importResolvers();

  return await buildSchema({
    resolvers,
    validate: false,
    authChecker: ({ context }) => {
      return !!context.user;
    },
    container: new PrismaContainer(),
  });
};
