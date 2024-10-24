import { GraphQLError } from 'graphql';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '../__tests__/decoratorMocks';
import { User } from '../entities/User';
import { CreateUserInput } from '../inputs/UserInput';
import { UserResolver } from '../resolvers/UserResolver';
import { UserService } from '../services/UserService';
import { GraphQLContext } from '../types/context';

// Mock UserService
vi.mock('../services/UserService', () => {
  return {
    UserService: vi.fn().mockImplementation(() => ({
      createUser: vi.fn(),
      getAllUsers: vi.fn(),
      getUserById: vi.fn(),
    })),
  };
});

describe('UserResolver', () => {
  let userResolver: UserResolver;
  let mockUserService: ReturnType<typeof vi.mocked<UserService>>;
  let mockContext: GraphQLContext;

  beforeEach(() => {
    userResolver = new UserResolver();
    mockUserService = (userResolver as any).userService;
    mockContext = {
      prisma: {} as any,
      user: { id: 1, email: 'test@example.com' },
      token: null,
      datasource: null,
    };
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const input: CreateUserInput = {
        username: 'John Doe',
        email: 'new@example.com',
        password: 'password123',
      };
      const expectedUser = new User({
        id: 2,
        username: input.username,
        email: input.email,
        passhash: 'hashed_password',
        createdAt: new Date(),
      });

      mockUserService.createUser.mockResolvedValue(expectedUser);

      const result = await userResolver.createUser(input, mockContext);

      expect(result).toEqual(expectedUser);
      expect(mockUserService.createUser).toHaveBeenCalledWith(mockContext.prisma, input);
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        { id: 1, email: 'user1@example.com' },
        { id: 2, email: 'user2@example.com' },
      ];

      mockUserService.getAllUsers.mockResolvedValue(expectedUsers as any);

      const result = await userResolver.getUsers(mockContext);

      expect(result).toEqual(expectedUsers);
      expect(mockUserService.getAllUsers).toHaveBeenCalledWith(mockContext.prisma);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const userId = 1;
      const expectedUser = { id: userId, email: 'user@example.com' };

      mockUserService.getUserById.mockResolvedValue(expectedUser as any);

      const result = await userResolver.getUser(userId, mockContext);

      expect(result).toEqual(expectedUser);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockContext.prisma, userId);
    });

    it('should throw an error if user is not found', async () => {
      const userId = 999;

      mockUserService.getUserById.mockResolvedValue(null);

      await expect(userResolver.getUser(userId, mockContext)).rejects.toThrow(GraphQLError);
      expect(mockUserService.getUserById).toHaveBeenCalledWith(mockContext.prisma, userId);
    });
  });
});
