import { YogaInitialContext } from "graphql-yoga";
import { GraphQLContext } from "../types/context";
import { verifyToken } from "../utils/auth";

export const createContext = async ({
  request,
}: YogaInitialContext): Promise<GraphQLContext> => {
  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ?? null;
  const datasource = request.headers.get("x-datasource") ?? null;

  let user;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      user = {
        id: payload.userId,
        email: payload.email,
      };
    }
  }

  return {
    token,
    datasource,
    user,
  };
};
