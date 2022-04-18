import { PubSub } from "graphql-subscriptions";
import { Order, Product } from "~/types/graphql";

const pubsub = new PubSub();

export const PUBSUB_PRODUCT = "PUBSUB_PRODUCT";
export const PUBSUB_ORDER_CREATED = "PUBSUB_ORDER_CREATED";

export function publishProduct(product: Product) {
  return pubsub.publish(PUBSUB_PRODUCT, { products: product, product });
}

export function publishOrderCreated(order: Order) {
  return pubsub.publish(PUBSUB_ORDER_CREATED, { orderCreated: order });
}

export default pubsub;
