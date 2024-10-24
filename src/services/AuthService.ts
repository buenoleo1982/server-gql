import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { GraphQLError } from 'graphql';
import { AuthResponse } from '../entities/Auth';
import { generateTokens } from '../utils/auth';

export class AuthService {
  async login(prisma: PrismaClient, email: string, password: string): Promise<AuthResponse> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: email }, { email: email }],
      },
    });
    console.log(user);

    if (!user) {
      throw new GraphQLError('invalid.credentials', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 401 },
        },
      });
    }

    const isPasswordValid = await argon2.verify(user.passhash, password);

    if (!isPasswordValid) {
      throw new GraphQLError('invalid.credentials', {
        extensions: {
          code: 'UNAUTHORIZED',
          http: { status: 401 },
        },
      });
    }

    const { accessToken, refreshToken } = generateTokens({
      userId: String(user.id),
      email: user.email,
    });

    return new AuthResponse({
      accessToken,
      refreshToken,
      user: user.username,
    });
  }
}
