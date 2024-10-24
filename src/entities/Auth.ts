import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AuthResponse {
  @Field(() => String)
  accessToken: string;

  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  user: string;

  constructor(data: Partial<AuthResponse>) {
    Object.assign(this, data);
  }
}
