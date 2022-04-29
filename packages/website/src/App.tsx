import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { ErrorPage, LoginPage, MainLayoutPage, preloadAll } from "preload";
import { Suspense, useCallback, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Route, HashRouter as Router, Routes } from "react-router-dom";
import CommonDialog from "./components/common/CommonDialog";
import LoadingBackdrop from "./components/common/LoadingBackdrop";
import { useAppTheme } from "./hooks/useAppTheme";
import Loading from "./pages/Loading";

export default function App() {
  const { theme } = useAppTheme();
  useEffect(() => {
    setTimeout(preloadAll, 2000);
  }, []);
  const onResetHandler = useCallback(() => {
    // reset the state of your app so the error doesn't happen again
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Suspense fallback={<Loading />}>
        <ErrorBoundary FallbackComponent={ErrorPage} onReset={onResetHandler}>
          <Router basename={process.env.PUBLIC_URL ?? ""}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="*" element={<MainLayoutPage />} />
            </Routes>
          </Router>
        </ErrorBoundary>
      </Suspense>
      <CommonDialog />
      <LoadingBackdrop />
    </ThemeProvider>
  );
}
