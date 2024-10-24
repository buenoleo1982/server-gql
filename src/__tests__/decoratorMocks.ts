import { vi } from 'vitest';

vi.mock('type-graphql', () => ({
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
  InputType: () => vi.fn(),
}));

vi.mock('../decorators/auth', () => ({
  Public: () => vi.fn(),
  Authorized: () => vi.fn(),
}));
