import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class User {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  passhash: string;

  @Field(() => Date)
  createdAt: Date;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
