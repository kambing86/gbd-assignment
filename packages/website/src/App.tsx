import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, HashRouter as Router, Switch } from "react-router-dom";
import { useAppTheme } from "./hooks/useAppTheme";
import ErrorFallback from "./pages/ErrorFallback";
import Loading from "./pages/Loading";

const SignInPage = lazy(() => import("./pages/SignIn"));
const AdminPage = lazy(() => import("./pages/Admin"));
const CustomerPage = lazy(() => import("./pages/Customer"));
const NotFoundPage = lazy(() => import("./pages/NotFound"));

export default function App() {
  const { theme } = useAppTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          // reset the state of your app so the error doesn't happen again
        }}
      >
        <Suspense fallback={<Loading />}>
          <Router basename={process.env.PUBLIC_URL ?? ""}>
            <Switch>
              <Route exact path="/" component={SignInPage} />
              <Route exact path="/admin" component={AdminPage} />
              <Route exact path="/customer" component={CustomerPage} />
              <Route component={NotFoundPage} />
            </Switch>
          </Router>
        </Suspense>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
