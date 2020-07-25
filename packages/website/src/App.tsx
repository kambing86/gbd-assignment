import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { useAppTheme } from "./hooks/useAppTheme";
import Loading from "./pages/Loading";

const ErrorPage = lazy(() => import("./pages/ErrorFallback"));
const LoginPage = lazy(() => import("./pages/Login"));
const AdminPage = lazy(() => import("./pages/Admin"));
const CustomerPage = lazy(() => import("./pages/Customer"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

export default function App() {
  const { theme } = useAppTheme();
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
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  );
}
