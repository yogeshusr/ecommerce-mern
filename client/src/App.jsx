import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./components/provider/theme-provider.tsx";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "./components/ui/sonner";
import { ToastContainer } from "react-toastify";

// Pages
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import Error from "./pages/Error";
import Success from "./pages/Success";
import MyOrders from "./pages/MyOrders";
import ResetPassword from "./pages/ResetPassword.jsx"; // ResetPassword imported here

// Layouts
import { RootLayout } from "./layouts/RootLayout";
import AdminLayout from "./layouts/AdminLayout";

// Components
import CreateProducts from "./components/custom/CreateProducts";
import AllProducts from "./components/custom/AllProducts";
import Analytics from "./components/custom/Analytics";
import Orders from "./components/custom/Orders";
import Settings from "./components/custom/Settings";

// Protected Route
import ProtectedRoute from "./components/custom/ProtectedRoute";
import AdminSignup from "./pages/AdminSignup.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Home />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/signup",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Signup />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <Login />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/product/:productName",
      element: (
        <RootLayout>
          <Product />
        </RootLayout>
      ),
    },
    {
      path: "/checkout",
      element: (
        <RootLayout>
          <Checkout />
        </RootLayout>
      ),
    },
    {
      path: "/orders",
      element: (
        <RootLayout>
          <MyOrders />
        </RootLayout>
      ),
    },
    // Admin Login - only protect if the user is not authenticated as an admin
    {
      path: "/admin/login",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <AdminLogin />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/signup",
      element: (
        <ProtectedRoute>
          <RootLayout>
            <AdminSignup />
          </RootLayout>
        </ProtectedRoute>
      ),
    },
    // Admin dashboard and other admin routes, wrapped in ProtectedRoute to ensure only admins can access
    {
      path: "/admin/dashboard",
      element: (
        <AdminLayout>
          <CreateProducts />
        </AdminLayout>
      ),
    },
    {
      path: "/admin/dashboard/all-products",
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <AllProducts />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/analytics",
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Analytics />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/orders",
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Orders />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin/dashboard/settings",
      element: (
        <ProtectedRoute>
          <AdminLayout>
            <Settings />
          </AdminLayout>
        </ProtectedRoute>
      ),
    },
    {
      path: "/reset-password",
      element: (
        <RootLayout>
          <ResetPassword />
        </RootLayout>
      ),
    },
    {
      path: "/*", // Error route should be at the bottom
      element: (
        <RootLayout>
          <Error />
        </RootLayout>
      ),
    },
    {
      path: "/success",
      element: <Success />,
    },
  ]);

  return (
    <>
      <ThemeProvider>
        <Provider store={store}>
          <Toaster />
          <ToastContainer />
          <RouterProvider router={router} />
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default App;
