import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';
import { Public } from '../decorators/auth';
import { AuthResponse } from '../entities/Auth';
import { AuthService } from '../services/AuthService';
import { GraphQLContext } from '../types/context';
import { refreshAccessToken } from '../utils/auth';

@Resolver()
export class AuthResolver {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  @Public()
  @Mutation(() => AuthResponse)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    @Ctx() context: GraphQLContext,
  ): Promise<AuthResponse> {
    return this.authService.login(context.prisma, email, password);
  }

  @Mutation(() => String, { nullable: true })
  refreshToken(@Arg('refreshToken', () => String) refreshToken: string): string | null {
    return refreshAccessToken(refreshToken);
  }
}
