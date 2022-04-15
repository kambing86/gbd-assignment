import { PubSub } from "graphql-subscriptions";
import { Product } from "~/types/graphql";

const pubsub = new PubSub();

export const PUBSUB_PRODUCT = "PUBSUB_PRODUCT";

export function publishProduct(product: Product) {
  return pubsub.publish(PUBSUB_PRODUCT, { products: product, product });
}

export default pubsub;
