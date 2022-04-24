import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReactComponent = React.ComponentType<any>;
type ReactComponentLazyFactory = () => Promise<{ default: AnyReactComponent }>;
const lazyPreloadQueue: ReactComponentLazyFactory[] = [];

// check https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
function lazyWithPreload(
  factory: ReactComponentLazyFactory,
): React.LazyExoticComponent<AnyReactComponent> {
  const Component = React.lazy(factory);
  lazyPreloadQueue.push(factory);
  return Component;
}

export function preloadAll() {
  for (const preload of lazyPreloadQueue) {
    void preload();
  }
}

export const MainLayoutPage = lazyWithPreload(
  () => import("./components/common/MainLayout"),
);
export const ErrorPage = lazyWithPreload(() => import("./pages/ErrorFallback"));
export const LoginPage = lazyWithPreload(() => import("./pages/Login"));
export const AdminPage = lazyWithPreload(() => import("./pages/Admin"));
export const CustomerPage = lazyWithPreload(() => import("./pages/Customer"));
export const CartPage = lazyWithPreload(() => import("./pages/Cart"));
export const OrderPage = lazyWithPreload(() => import("./pages/Order"));
export const NotFoundPage = lazyWithPreload(() => import("./pages/NotFound"));
