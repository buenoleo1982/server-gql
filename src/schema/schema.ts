import { buildSchema } from "type-graphql";
import { UserResolver } from "../resolvers/UserResolver";

export const createSchema = async () => {
  return await buildSchema({
    resolvers: [UserResolver],
    validate: false,
  });
};
