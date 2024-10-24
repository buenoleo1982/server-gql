import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';
import { GraphQLError } from 'graphql';
import { User } from '../entities/User';
import { CreateUserInput } from '../inputs/UserInput';

export class UserService {
  async createUser(prisma: PrismaClient, data: CreateUserInput): Promise<User> {
    if (!data.password) {
      throw new GraphQLError('Password is required');
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username: data.username }, { email: data.email }],
      },
    });
    if (existingUser) {
      throw new GraphQLError('Username or email already exists');
    }
    const hashedPassword = await argon2.hash(data.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passhash: hashedPassword, // In a real application, you'd hash this password
      },
    });

    return new User(user);
  }

  async getUserById(prisma: PrismaClient, id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? new User(user) : null;
  }

  async getAllUsers(prisma: PrismaClient): Promise<User[]> {
    const users = await prisma.user.findMany();
    return users.map((user) => new User(user));
  }
}
