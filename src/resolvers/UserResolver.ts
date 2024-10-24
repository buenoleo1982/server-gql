import { GraphQLError } from 'graphql';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Authorized, Public } from '../decorators/auth';
import { User } from '../entities/User';
import { CreateUserInput } from '../inputs/UserInput';
import { UserService } from '../services/UserService';
import { GraphQLContext } from '../types/context';

@Resolver()
export class UserResolver {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  @Public()
  @Mutation(() => User)
  async createUser(
    @Arg('data', () => CreateUserInput) data: CreateUserInput,
    @Ctx() context: GraphQLContext,
  ): Promise<User> {
    return await this.userService.createUser(context.prisma, data);
  }

  @Authorized()
  @Query(() => [User])
  async getUsers(@Ctx() context: GraphQLContext): Promise<User[]> {
    console.log('Current User:', context.user);
    return await this.userService.getAllUsers(context.prisma);
  }

  @Authorized()
  @Query(() => User, { nullable: true })
  async getUser(@Arg('id') id: number, @Ctx() context: GraphQLContext): Promise<User | undefined> {
    const user = await this.userService.getUserById(context.prisma, id);
    if (!user) {
      throw new GraphQLError('User not found');
    }
    return user;
  }

  // Adicione outros métodos conforme necessário
}
