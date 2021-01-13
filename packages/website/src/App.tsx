import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { useCheckCart } from "hooks/useCart";
import React, { Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import CommonDialog from "./components/common/CommonDialog";
import LoadingBackdrop from "./components/common/LoadingBackdrop";
import { useAppTheme } from "./hooks/useAppTheme";
import Loading from "./pages/Loading";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyReactComponent = React.ComponentType<any>;
const lazyPreload: (() => Promise<{ default: AnyReactComponent }>)[] = [];

// check https://medium.com/hackernoon/lazy-loading-and-preloading-components-in-react-16-6-804de091c82d
function lazyWithPreload<T extends AnyReactComponent>(
  factory: () => Promise<{ default: T }>,
): React.LazyExoticComponent<T> {
  const Component = React.lazy(factory);
  lazyPreload.push(factory);
  return Component;
}

function preloadAll() {
  for (const preload of lazyPreload) {
    void preload();
  }
}

const ErrorPage = lazyWithPreload(() => import("./pages/ErrorFallback"));
const LoginPage = lazyWithPreload(() => import("./pages/Login"));
const AdminPage = lazyWithPreload(() => import("./pages/Admin"));
const CustomerPage = lazyWithPreload(() => import("./pages/Customer"));
const CartPage = lazyWithPreload(() => import("./pages/Cart"));
const OrderPage = lazyWithPreload(() => import("./pages/Order"));
const NotFoundPage = lazyWithPreload(() => import("./pages/NotFound"));

export default function App() {
  useCheckCart();
  const { theme } = useAppTheme();
  useEffect(() => {
    setTimeout(preloadAll, 2000);
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <ErrorBoundary
          FallbackComponent={ErrorPage}
          onReset={() => {
            // reset the state of your app so the error doesn't happen again
          }}
        >
          <Router basename={process.env.PUBLIC_URL ?? ""}>
            <Switch>
              <Route exact path="/" component={LoginPage} />
              <Route exact path="/admin" component={AdminPage} />
              <Route exact path="/customer" component={CustomerPage} />
              <Route exact path="/customer/cart" component={CartPage} />
              <Route exact path="/customer/order" component={OrderPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </ErrorBoundary>
      </Suspense>
      <CommonDialog />
      <LoadingBackdrop />
    </ThemeProvider>
  );
}
