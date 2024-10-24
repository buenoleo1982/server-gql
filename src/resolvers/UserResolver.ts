import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { User } from "../entities/User";
import { GraphQLContext } from "../types/context";
import { Authorized, Public } from "../decorators/auth";

@Resolver((of) => User)
export class UserResolver {
  private usersData: User[] = [
    new User("1", "John Doe", "john@example.com", new Date()),
  ];

  @Authorized()
  @Query(() => [User])
  async users(@Ctx() context: GraphQLContext): Promise<User[]> {
    console.log("Current User:", context.user);
    return this.usersData;
  }

  @Public()
  @Query(() => User, { nullable: true })
  async publicUser(@Arg("id") id: string): Promise<User | undefined> {
    return this.usersData.find((user) => user.id === id);
  }

  @Authorized()
  @Mutation(() => User)
  async createUser(
    @Arg("name") name: string,
    @Arg("email") email: string
  ): Promise<User> {
    const user = new User(
      String(this.usersData.length + 1),
      name,
      email,
      new Date()
    );

    this.usersData.push(user);
    return user;
  }
}
