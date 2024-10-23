export interface GraphQLContext {
  token: string | null;
  datasource: string | null;
  user?: {
    id: string;
    email: string;
  };
}
