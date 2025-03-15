import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { pathname } = useLocation();
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  // Ensure cartItems is always an array
  const { cartItems = [] } = useSelector((state) => state.auth);

  //Ensure logged-out users cannot access admin pages
  // if (!isAuthenticated && pathname.startsWith("/admin")) {
  //   return <Navigate to="/admin/login" />;
  // }

  // Admin login redirect logic: redirect to /admin/dashboard after successful login
  if (isAuthenticated && role === "admin" && pathname === "/admin/login") {
    return <Navigate to="/admin/dashboard" />;
  }

  // Prevent users from accessing the admin dashboard or login page
  if (
    isAuthenticated &&
    role === "user" &&
    (pathname.startsWith("/admin/dashboard") || pathname === "/admin/login")
  ) {
    return <Navigate to="/" />;
  }

  // Redirect non-authenticated users to login when trying to access the admin dashboard
  if (!isAuthenticated && pathname === "/admin/dashboard") {
    return <Navigate to="/admin/login" />;
  }

  // Admin should be redirected to the dashboard if trying to access any other admin route
  if (
    isAuthenticated &&
    role === "admin" &&
    pathname !== "/admin/dashboard" &&
    pathname.startsWith("/admin")
  ) {
    return <Navigate to="/admin/dashboard" />;
  }

  // If the user is trying to access login or signup and is already authenticated, redirect to homepage
  if (
    isAuthenticated &&
    role === "user" &&
    (pathname === "/login" || pathname === "/signup")
  ) {
    return <Navigate to="/" />;
  }

  // Redirect unauthenticated users to login if trying to access orders
  if (!isAuthenticated && pathname === "/orders") {
    return <Navigate to="/login" />;
  }

  // If cartItems is empty, prevent proceeding to checkout
  if (isAuthenticated && cartItems.length === 0 && pathname === "/checkout") {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
