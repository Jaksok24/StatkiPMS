import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import CruisesPage from "./pages/CruisesPage";
import ReservationsPage from "./pages/ReservationsPage";
import SchedulePage from "./pages/SchedulePage";
import BreaksPage from "./pages/BreaksPage";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import HistoryPage from "./pages/HistoryPage";
import WebFormsPage from "./pages/WebFormsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <HomePage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/cruises",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <CruisesPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/reservations",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <ReservationsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/schedule",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <SchedulePage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/breaks",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <BreaksPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <UsersPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <AppLayout>
           <HistoryPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/web-forms",
    element: (
      <ProtectedRoute>
        <AppLayout>
          <WebFormsPage />
        </AppLayout>
      </ProtectedRoute>
    ),
  },
]);