import { Navigate, useLocation } from "react-router-dom";
import ClientDetailsPage from "../pages/ClientDetailsPage";

export default function ClientRouteWrapper() {
  const { state } = useLocation();

  if (!state?.clientName) {
    return <Navigate to="/" replace />;
  }

  return (
    <ClientDetailsPage
      clientName={state.clientName}
      years={state.years}
      months={state.months}
    />
  );
}
