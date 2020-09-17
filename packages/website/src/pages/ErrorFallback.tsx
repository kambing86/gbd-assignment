import React from "react";
import { FallbackProps } from "react-error-boundary";

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error?.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default ErrorFallback;
