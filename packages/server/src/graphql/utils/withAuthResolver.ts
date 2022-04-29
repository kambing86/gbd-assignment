import { GraphQLResolveInfo } from "graphql";
import { GraphQLContext } from "~/types/context";
import { ResolverFn } from "~/types/graphql";

const withAuthResolver =
  <TResult, TParent, TContext extends GraphQLContext, TArgs>(
    resolver: ResolverFn<TResult, TParent, TContext, TArgs>,
  ): ResolverFn<TResult, TParent, TContext, TArgs> =>
  (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
  ): Promise<TResult> | TResult => {
    if (context.auth === null) {
      throw new Error("Auth Error");
    }
    return resolver(parent, args, context, info);
  };

export default withAuthResolver;
