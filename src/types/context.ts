export interface GraphQLContext {
  token: string | null;
  datasource: string | null;
  user?: {
    id: string;
    email: string;
  };
  operation?: {
    parentType: any;
    fieldName: string;
  };
}
