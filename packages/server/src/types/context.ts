export type GraphQLContext = {
  user?: {
    id: number;
    username: string;
    isAdmin: boolean;
  };
};
