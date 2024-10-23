import { buildSchema } from "type-graphql";
import { importResolvers } from "../resolvers";

export const createSchema = async () => {
  const resolvers = importResolvers();

  return await buildSchema({
    resolvers,
    validate: false,
    authChecker: ({ context }) => {
      return !!context.user;
    },
  });
};
