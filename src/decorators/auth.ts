import { UseMiddleware } from "type-graphql";
import { GraphQLContext } from "../types/context";
import { GraphQLError } from "graphql";

// Decorator para marcar métodos como públicos
export function Public(): MethodDecorator {
  return (target, propertyKey) => {
    Reflect.defineMetadata("isPublic", true, target, propertyKey);
  };
}

// Decorator de autorização
export function Authorized(): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    UseMiddleware(
      async (
        { context }: { context: GraphQLContext },
        next: () => Promise<any>
      ) => {
        const isPublic: boolean = Reflect.getMetadata(
          "isPublic",
          target,
          propertyKey
        );

        if (isPublic) {
          return next();
        }

        if (!context.user) {
          throw new GraphQLError("Not authenticated");
        }

        return next();
      }
    )(target, propertyKey, descriptor);
  };
}
