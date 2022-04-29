import { withFilter } from "graphql-subscriptions";
import { Attributes, Op } from "sequelize";
import ProductModel from "~/db/models/ProductModel";
import {
  Product,
  Resolvers,
  Subscription,
  SubscriptionProductUpdatedArgs,
} from "~/types/graphql";
import pubsub, {
  PUBSUB_PRODUCT_UPDATED,
  publishProductUpdated,
} from "../pubsub";
import { removeNullUndefined } from "../utils";
import withAuthResolver from "../utils/withAuthResolver";

export default {
  Query: {
    products: async (_parent, args) => {
      const { skip, limit, onShelf } = args;
      const allowLimit = limit > 20 ? 20 : limit;
      const result = await ProductModel.findAndCountAll({
        offset: skip,
        limit,
        where: removeNullUndefined({ isUp: onShelf }) as { isUp: boolean },
      });
      return {
        rows: result.rows,
        skip,
        limit: allowLimit,
        total: result.count,
      };
    },
    productsByIds: async (_parent, args) => {
      const { ids } = args;
      if (ids.length > 10) {
        throw new Error("too many ids");
      }
      const products = await ProductModel.findAll({
        where: { id: { [Op.in]: ids } },
      });
      return products;
    },
  },
  Mutation: {
    updateProduct: withAuthResolver(async (_parent, args, context) => {
      if (!context.auth?.isAdmin) {
        throw new Error("not allow to update");
      }
      const { id, data } = args;
      const dataEntries = Object.entries(data);
      if (dataEntries.length === 0) return false;
      const result = await ProductModel.update(
        removeNullUndefined(data) as Attributes<ProductModel>,
        {
          where: { id },
        },
      );
      const success = result.at(0) ?? 0 > 0;
      if (success) {
        const product = await ProductModel.findOne({ where: { id } });
        if (product == null) return false;
        await publishProductUpdated(product);
      }
      return success;
    }),
  },
  Subscription: {
    productUpdated: {
      subscribe: (...args) => ({
        [Symbol.asyncIterator]: () =>
          withFilter(
            () => pubsub.asyncIterator<Product>([PUBSUB_PRODUCT_UPDATED]),
            (
              payload: Pick<Subscription, "productUpdated">,
              subcribeArgs: SubscriptionProductUpdatedArgs,
            ) => {
              if (subcribeArgs.id == null) return true;
              return payload.productUpdated.id === subcribeArgs.id;
            },
          )(...args),
      }),
    },
  },
} as Resolvers;
