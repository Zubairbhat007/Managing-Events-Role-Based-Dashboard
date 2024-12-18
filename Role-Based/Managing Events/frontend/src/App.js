import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Auth/login";
import Register from "./components/Auth/Register";
import EventList from "./components/Events/EventList";
import EventCreate from "./components/Events/EventCreate";
import EventEdit from "./components/Events/EventEdit";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import UserDashboard from "./components/Dashboard/UserDashboard";
import PrivateRoute from "./components/Auth/PrivateRoute";
import Reports from "./components/Admin/Reports";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/UserDashboard"
            element={
              <PrivateRoute>
                <EventList />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/create"
            element={
              <PrivateRoute adminOnly={true}>
                <EventCreate />
              </PrivateRoute>
            }
          />
          <Route
            path="/events/edit/:id"
            element={
              <PrivateRoute adminOnly={true}>
                <EventEdit />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute adminOnly={true}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <PrivateRoute adminOnly={true}>
                <Reports />
              </PrivateRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <PrivateRoute>
                <UserDashboard />
              </PrivateRoute>
            }
          />

          {/* Redirect */}
          <Route path="/" element={<Navigate to="/events" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
