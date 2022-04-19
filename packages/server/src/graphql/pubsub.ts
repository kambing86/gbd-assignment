import { PubSub } from "graphql-subscriptions";
import { Order, Product } from "~/types/graphql";

const pubsub = new PubSub();

export const PUBSUB_PRODUCT_UPDATED = "PUBSUB_PRODUCT_UPDATED";
export const PUBSUB_ORDER_CREATED = "PUBSUB_ORDER_CREATED";

export function publishProductUpdated(product: Product) {
  return pubsub.publish(PUBSUB_PRODUCT_UPDATED, { productUpdated: product });
}

export function publishOrderCreated(order: Order) {
  return pubsub.publish(PUBSUB_ORDER_CREATED, { orderCreated: order });
}

export default pubsub;
