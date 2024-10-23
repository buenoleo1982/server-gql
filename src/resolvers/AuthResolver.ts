import { Resolver, Mutation, Arg } from "type-graphql";
import { AuthResponse } from "../entities/Auth";
import { generateToken } from "../utils/auth";
import { Public } from "../decorators/auth";
import { GraphQLError } from "graphql";

@Resolver()
export class AuthResolver {
  private users = [{ id: "1", email: "leonardo@mail.com", password: "123456" }];

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<AuthResponse> {
    const user = this.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw new GraphQLError("Credenciais inválidas", {
        extensions: {
          code: "UNAUTHORIZED",
          http: { status: 401 },
        },
      });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return new AuthResponse({
      token,
      user: user.email,
    });
  }
}
