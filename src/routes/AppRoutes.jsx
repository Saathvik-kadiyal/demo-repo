import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Layout from "../Layout/Layout.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import ClientRouteWrapper from "./ClientRouteWrapper.jsx";

const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const ClientSummaryDetailedPage = lazy(
  () => import("../pages/ClientSummaryDetailPage.jsx")
);
const ClientDetailsPage = lazy(
  () => import("../pages/ClientDetailsPage.jsx")
);
const FileInput = lazy(() => import("../pages/FileInput.jsx"));
const EmployeeEditPage = lazy(() => import("../pages/EmployeeEditPage.jsx"));
const NotFound = lazy(() => import("../pages/NotFound.jsx"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/login" element={<LoginPage />} />

      {/* ALL PRIVATE ROUTES */}
      <Route
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        {/* DASHBOARD */}
        <Route
          index
          element={
            <Suspense fallback={<div className="p-6">Loading Dashboard...</div>}>
              <DashboardPage />
            </Suspense>
          }
        />

        {/* CLIENT DETAIL (FROM DASHBOARD CLICK) */}
        <Route
          path="client"
          element={
            <Suspense fallback={<div className="p-6">Loading Client...</div>}>
              <ClientRouteWrapper />
            </Suspense>
          }
        />

        {/* CLIENT SUMMARY PAGE (EXISTING) */}
        <Route
          path="client-summary"
          element={
            <Suspense fallback={<div className="p-6">Loading Client Summary...</div>}>
              <ClientSummaryDetailedPage />
            </Suspense>
          }
        />

        {/* SHIFT ALLOWANCE */}
        <Route
          path="shift-allowance"
          element={
            <Suspense fallback={<div className="p-6">Loading Employee Page...</div>}>
              <FileInput />
            </Suspense>
          }
        />

        <Route
          path="shift-allowance/edit"
          element={
            <Suspense fallback={<div className="p-6">Loading Edit Page...</div>}>
              <EmployeeEditPage />
            </Suspense>
          }
        />
      </Route>

      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <Suspense fallback={<div className="p-6">Loading...</div>}>
              <NotFound />
            </Suspense>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
