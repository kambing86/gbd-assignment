import { withFilter } from "graphql-subscriptions";
import { Op } from "sequelize";
import getDB from "~/db/getDB";
import OrderDetailsModel from "~/db/models/OrderDetailsModel";
import OrderModel from "~/db/models/OrderModel";
import ProductModel from "~/db/models/ProductModel";
import {
  Order,
  Resolvers,
  Subscription,
  SubscriptionOrderCreatedArgs,
} from "~/types/graphql";
import pubsub, {
  PUBSUB_ORDER_CREATED,
  publishOrderCreated,
  publishProductUpdated,
} from "../pubsub";
import withAuthResolver from "../utils/withAuthResolver";

function mapToGraphQLOrder(order: OrderModel): Order {
  return {
    ...order.toJSON(),
    createdDate: order.createdDate.toString(),
    details: order.details,
  };
}

export default {
  Query: {
    orders: withAuthResolver(async (_parent, args, context) => {
      const { skip, limit } = args;
      const allowLimit = limit > 20 ? 20 : limit;
      const { user } = context;
      const id = user?.id ?? 0;
      const result = await OrderModel.findAndCountAll({
        include: [
          {
            model: OrderDetailsModel,
            as: "details",
            include: [
              {
                model: ProductModel,
                as: "product",
              },
            ],
          },
        ],
        offset: skip,
        limit: allowLimit,
        where: {
          userId: id,
        },
      });
      return {
        rows: result.rows.map(mapToGraphQLOrder),
        skip,
        limit: allowLimit,
        total: result.count,
      };
    }),
  },
  Mutation: {
    createOrder: withAuthResolver(async (_parent, args, context) => {
      const {
        data: { details },
      } = args;
      const userId = context.user?.id ?? 0;
      const products = await ProductModel.findAll({
        where: { id: { [Op.in]: details.map((d) => d.productId) } },
      });
      if (products.length !== details.length) return false;
      let valid = true;
      for (const product of products) {
        const detail = details.find((d) => d.productId === product.id);
        if (!product.isUp || product.quantity < (detail?.quantity ?? 0)) {
          valid = false;
        }
      }
      if (!valid) return false;
      const sequelize = getDB();
      const transaction = await sequelize.transaction();
      try {
        for (const product of products) {
          const detail = details.find((d) => d.productId === product.id);
          const quantity = product.quantity - (detail?.quantity ?? 0);
          await ProductModel.update(
            { quantity },
            { where: { id: product.id }, transaction },
          );
          await publishProductUpdated({
            ...product.toJSON(),
            quantity,
          });
        }
        const order = await OrderModel.create(
          {
            userId,
          },
          { transaction },
        );
        for (const product of products) {
          const detail = details.find((d) => d.productId === product.id);
          await OrderDetailsModel.create(
            {
              orderId: order.id,
              productId: product.id,
              quantity: detail?.quantity ?? 0,
              price: product.price,
            },
            { transaction },
          );
        }
        const completedOrder = await OrderModel.findOne({
          where: { id: order.id },
          include: {
            model: OrderDetailsModel,
            as: "details",
            include: [
              {
                model: ProductModel,
                as: "product",
              },
            ],
          },
          transaction,
        });
        if (completedOrder != null) {
          await publishOrderCreated(mapToGraphQLOrder(completedOrder));
        }
        await transaction.commit();
        return true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        await transaction.rollback();
        return false;
      }
    }),
  },
  Subscription: {
    orderCreated: {
      subscribe: (...args) => ({
        [Symbol.asyncIterator]: () =>
          withFilter(
            () => pubsub.asyncIterator<Order>(PUBSUB_ORDER_CREATED),
            (
              payload: Pick<Subscription, "orderCreated">,
              subcribeArgs: SubscriptionOrderCreatedArgs,
            ) => {
              if (subcribeArgs.id == null) return true;
              return payload.orderCreated.id === subcribeArgs.id;
            },
          )(...args),
      }),
    },
  },
} as Resolvers;
