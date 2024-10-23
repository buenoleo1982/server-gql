import { Resolver, Query, Ctx, Arg, Mutation } from "type-graphql";
import { User } from "../entities/User";
import { GraphQLContext } from "../types/context";

@Resolver(User)
export class UserResolver {
  private usersData: User[] = [
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      createdAt: new Date(),
    },
  ];

  @Query(() => [User])
  async users(@Ctx() context: GraphQLContext): Promise<User[]> {
    console.log("Context:", {
      token: context.token,
      datasource: context.datasource,
    });
    return this.usersData;
  }

  @Query(() => User, { nullable: true })
  async user(
    @Arg("id") id: string,
    @Ctx() context: GraphQLContext
  ): Promise<User | undefined> {
    return this.usersData.find((user) => user.id === id);
  }

  @Mutation(() => User)
  async createUser(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Ctx() context: GraphQLContext
  ): Promise<User> {
    const user: User = {
      id: String(this.users.length + 1),
      name,
      email,
      createdAt: new Date(),
    };

    this.usersData.push(user);
    return user;
  }
}
