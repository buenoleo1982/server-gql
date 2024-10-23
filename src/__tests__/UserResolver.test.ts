import { describe, it, expect, vi } from "vitest";
import { UserResolver } from "../resolvers/UserResolver";
import { User } from "../entities/User";

// Mock the decorators
vi.mock("type-graphql", () => ({
  Resolver: () => vi.fn(),
  Query: () => vi.fn(),
  Mutation: () => vi.fn(),
  Arg: () => vi.fn(),
  Ctx: () => vi.fn(),
  Field: () => vi.fn(),
  ObjectType: () => vi.fn(),
  ID: vi.fn(),
  UseMiddleware: () => vi.fn(),
  createParameterDecorator: () => vi.fn(),
}));

vi.mock("../../../decorators/auth", () => ({
  Authorized: () => vi.fn(),
  CurrentUser: () => vi.fn(),
  Public: () => vi.fn(),
}));

// Mock the User class
vi.mock("../../../entities/User", () => ({
  User: class MockUser {
    id: string;
    name: string;
    email: string;
    createdAt: Date;

    constructor(id: string, name: string, email: string, createdAt: Date) {
      this.id = id;
      this.name = name;
      this.email = email;
      this.createdAt = createdAt;
    }
  },
}));

describe("UserResolver", () => {
  const userResolver = new UserResolver();

  describe("users", () => {
    it("should return all users", async () => {
      const currentUser = { id: "1", name: "Test User" };
      const context = {} as any;

      const users = await userResolver.users(currentUser, context);

      expect(users).toHaveLength(1);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[0].name).toBe("John Doe");
    });
  });

  describe("publicUser", () => {
    it("should return a user by id", async () => {
      const user = await userResolver.publicUser("1");

      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe("1");
      expect(user?.name).toBe("John Doe");
    });

    it("should return undefined for non-existent user", async () => {
      const user = await userResolver.publicUser("999");

      expect(user).toBeUndefined();
    });
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const currentUser = { id: "1", name: "Test User" };
      const newUser = await userResolver.createUser(
        "Jane Doe",
        "jane@example.com",
        currentUser
      );

      expect(newUser).toBeInstanceOf(User);
      expect(newUser.id).toBe("2");
      expect(newUser.name).toBe("Jane Doe");
      expect(newUser.email).toBe("jane@example.com");
    });
  });
});
