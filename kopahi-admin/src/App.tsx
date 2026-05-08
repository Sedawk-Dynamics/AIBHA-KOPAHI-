import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";

import AdminOverview from "./pages/admin/Overview";
import AdminOrders from "./pages/admin/Orders";
import AdminProducts from "./pages/admin/Products";
import AdminVendors from "./pages/admin/Vendors";
import AdminCustomers from "./pages/admin/Customers";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminRevenue from "./pages/admin/Revenue";
import AdminSettings from "./pages/admin/Settings";
import AdminProfile from "./pages/admin/Profile";

import VendorOverview from "./pages/vendor/Overview";
import VendorOrders from "./pages/vendor/Orders";
import VendorProducts from "./pages/vendor/Products";
import VendorProductNew from "./pages/vendor/ProductNew";
import VendorProductEdit from "./pages/vendor/ProductEdit";
import VendorEarnings from "./pages/vendor/Earnings";
import VendorReviews from "./pages/vendor/Reviews";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminOverview />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/orders" element={<ProtectedRoute allow={["admin"]}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute allow={["admin"]}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/vendors" element={<ProtectedRoute allow={["admin"]}><AdminVendors /></ProtectedRoute>} />
      <Route path="/admin/customers" element={<ProtectedRoute allow={["admin"]}><AdminCustomers /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute allow={["admin"]}><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/revenue" element={<ProtectedRoute allow={["admin"]}><AdminRevenue /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute allow={["admin"]}><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/profile" element={<ProtectedRoute allow={["admin"]}><AdminProfile /></ProtectedRoute>} />

      {/* Vendor */}
      <Route path="/vendor" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorOverview /></ProtectedRoute>} />
      <Route path="/vendor/products" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorProducts /></ProtectedRoute>} />
      <Route path="/vendor/products/new" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorProductNew /></ProtectedRoute>} />
      <Route path="/vendor/products/:id/edit" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorProductEdit /></ProtectedRoute>} />
      <Route path="/vendor/orders" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorOrders /></ProtectedRoute>} />
      <Route path="/vendor/earnings" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorEarnings /></ProtectedRoute>} />
      <Route path="/vendor/reviews" element={<ProtectedRoute allow={["vendor", "admin"]}><VendorReviews /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
