import { Outlet } from "react-router-dom";

function LoadingRoute({ Component, isLoading = false }) {
  return isLoading ? <Outlet /> : <Component />;
}

export default LoadingRoute;
