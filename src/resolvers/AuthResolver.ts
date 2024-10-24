import { GraphQLError } from 'graphql';
import { Arg, Mutation, Resolver } from 'type-graphql';
import { Public } from '../decorators/auth';
import { AuthResponse } from '../entities/Auth';
import { generateTokens, refreshAccessToken } from '../utils/auth';

@Resolver()
export class AuthResolver {
  private users = [{ id: '1', email: 'leonardo@mail.com', password: '123456' }];

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ): Promise<AuthResponse> {
    const user = this.users.find((u) => u.email === email && u.password === password);

    if (!user) {
      throw new GraphQLError('Credenciais inválidas', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 401 },
        },
      });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
    });

    return new AuthResponse({
      accessToken,
      refreshToken,
      user: user.email,
    });
  }

  @Mutation(() => String, { nullable: true })
  refreshToken(@Arg('refreshToken', () => String) refreshToken: string): string | null {
    return refreshAccessToken(refreshToken);
  }
}
