import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AuthResponse {
  @Field()
  token: string;

  @Field()
  user: string;

  constructor(data: Partial<AuthResponse>) {
    this.token = data.token || "";
    this.user = data.user || "";
  }
}
