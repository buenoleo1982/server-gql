// src/decorators/auth.ts
import { createParameterDecorator, UseMiddleware } from "type-graphql";
import { GraphQLError } from "graphql";
import { GraphQLContext } from "../types/context";

// Middleware de autenticação
const authMiddleware = async (
  { context }: { context: GraphQLContext },
  next: () => Promise<any>
) => {
  if (!context.user) {
    throw new GraphQLError("Não autorizado. Token inválido ou expirado.", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
  return next();
};

// Decorator para marcar rotas públicas
export function Public(): MethodDecorator {
  return function (
    target: any,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor
  ) {
    Reflect.defineMetadata("isPublic", true, target, propertyKey);
    return descriptor;
  };
}

// Decorator de autorização
export function Authorized() {
  return UseMiddleware(
    async (
      { context }: { context: GraphQLContext },
      next: () => Promise<any>
    ) => {
      const isPublic = Reflect.getMetadata(
        "isPublic",
        context.operation?.parentType,
        context.operation?.fieldName ?? ""
      );

      if (isPublic) {
        return next();
      }

      return authMiddleware({ context }, next);
    }
  );
}

// Decorator para injetar usuário atual - usando createParameterDecorator ao invés de createParamDecorator
export function CurrentUser() {
  return createParameterDecorator<GraphQLContext>(
    ({ context }) => context.user
  );
}
