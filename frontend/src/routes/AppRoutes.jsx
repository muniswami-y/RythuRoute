import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/Loader';

// Public pages
import Home from '../pages/customer/Home';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import Products from '../pages/customer/Products';
import ProductDetails from '../pages/customer/ProductDetails';

// Customer pages
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerOrders from '../pages/customer/Orders';
import CustomerOrderDetails from '../pages/customer/OrderDetails';
import Cart from '../pages/customer/Cart';
import Checkout from '../pages/customer/Checkout';
import Addresses from '../pages/customer/Addresses';
import CustomerProfile from '../pages/customer/Profile';
import LiveTracking from '../pages/customer/LiveTracking';
import Payment from '../pages/customer/Payment';
import PaymentSuccess from '../pages/customer/PaymentSuccess';
import PaymentFailed from '../pages/customer/PaymentFailed';

// Farmer pages
import FarmerDashboard from '../pages/farmer/Dashboard';
import FarmerProducts from '../pages/farmer/Products';
import AddProduct from '../pages/farmer/AddProduct';
import EditProduct from '../pages/farmer/EditProduct';
import FarmerOrders from '../pages/farmer/Orders';
import FarmerOrderDetails from '../pages/farmer/OrderDetails';
import FarmerEarnings from '../pages/farmer/Earnings';

// Driver pages
import DriverDashboard from '../pages/driver/Dashboard';
import ActiveDelivery from '../pages/driver/ActiveDelivery';
import DriverHistory from '../pages/driver/History';
import DriverEarnings from '../pages/driver/Earnings';
import DriverProfile from '../pages/driver/Profile';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminFarmers from '../pages/admin/Farmers';
import AdminDrivers from '../pages/admin/Drivers';
import AdminProducts from '../pages/admin/Products';
import AdminOrders from '../pages/admin/Orders';
import AdminPayments from '../pages/admin/Payments';
import AdminDeliveries from '../pages/admin/Deliveries';
import AdminReports from '../pages/admin/Reports';

// Route guard component
function ProtectedRoute({ children, roles }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <Loader size="page" text="Loading..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <Loader size="page" text="Loading..." />;
  if (isAuthenticated) {
    const paths = {
      customer: '/customer/dashboard',
      farmer: '/farmer/dashboard',
      delivery_partner: '/driver/dashboard',
      admin: '/admin/dashboard',
    };
    return <Navigate to={paths[user?.role] || '/'} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      <Route path="/track" element={<div className="page container"><h1>Track Your Order</h1><p>Enter your tracking ID to see order status</p></div>} />
      <Route path="/about" element={<div className="page container"><h1>About RythuRoute</h1><p>Connecting farmers directly with customers.</p></div>} />

      {/* Customer */}
      <Route path="/customer/dashboard" element={<ProtectedRoute roles={['customer']}><CustomerDashboard /></ProtectedRoute>} />
      <Route path="/customer/orders" element={<ProtectedRoute roles={['customer']}><CustomerOrders /></ProtectedRoute>} />
      <Route path="/customer/orders/:id" element={<ProtectedRoute roles={['customer']}><CustomerOrderDetails /></ProtectedRoute>} />
      <Route path="/customer/cart" element={<ProtectedRoute roles={['customer']}><Cart /></ProtectedRoute>} />
      <Route path="/customer/checkout" element={<ProtectedRoute roles={['customer']}><Checkout /></ProtectedRoute>} />
      <Route path="/customer/addresses" element={<ProtectedRoute roles={['customer']}><Addresses /></ProtectedRoute>} />
      <Route path="/customer/profile" element={<ProtectedRoute roles={['customer']}><CustomerProfile /></ProtectedRoute>} />
      <Route path="/customer/tracking/:id" element={<ProtectedRoute roles={['customer']}><LiveTracking /></ProtectedRoute>} />
      <Route path="/customer/payment/:orderId" element={<ProtectedRoute roles={['customer']}><Payment /></ProtectedRoute>} />
      <Route path="/customer/payment/success" element={<ProtectedRoute roles={['customer']}><PaymentSuccess /></ProtectedRoute>} />
      <Route path="/customer/payment/failed" element={<ProtectedRoute roles={['customer']}><PaymentFailed /></ProtectedRoute>} />

      {/* Farmer */}
      <Route path="/farmer/dashboard" element={<ProtectedRoute roles={['farmer']}><FarmerDashboard /></ProtectedRoute>} />
      <Route path="/farmer/products" element={<ProtectedRoute roles={['farmer']}><FarmerProducts /></ProtectedRoute>} />
      <Route path="/farmer/products/add" element={<ProtectedRoute roles={['farmer']}><AddProduct /></ProtectedRoute>} />
      <Route path="/farmer/products/edit/:id" element={<ProtectedRoute roles={['farmer']}><EditProduct /></ProtectedRoute>} />
      <Route path="/farmer/orders" element={<ProtectedRoute roles={['farmer']}><FarmerOrders /></ProtectedRoute>} />
      <Route path="/farmer/orders/:id" element={<ProtectedRoute roles={['farmer']}><FarmerOrderDetails /></ProtectedRoute>} />
      <Route path="/farmer/earnings" element={<ProtectedRoute roles={['farmer']}><FarmerEarnings /></ProtectedRoute>} />

      {/* Driver */}
      <Route path="/driver/dashboard" element={<ProtectedRoute roles={['delivery_partner']}><DriverDashboard /></ProtectedRoute>} />
      <Route path="/driver/active" element={<ProtectedRoute roles={['delivery_partner']}><ActiveDelivery /></ProtectedRoute>} />
      <Route path="/driver/history" element={<ProtectedRoute roles={['delivery_partner']}><DriverHistory /></ProtectedRoute>} />
      <Route path="/driver/earnings" element={<ProtectedRoute roles={['delivery_partner']}><DriverEarnings /></ProtectedRoute>} />
      <Route path="/driver/profile" element={<ProtectedRoute roles={['delivery_partner']}><DriverProfile /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/farmers" element={<ProtectedRoute roles={['admin']}><AdminFarmers /></ProtectedRoute>} />
      <Route path="/admin/drivers" element={<ProtectedRoute roles={['admin']}><AdminDrivers /></ProtectedRoute>} />
      <Route path="/admin/products" element={<ProtectedRoute roles={['admin']}><AdminProducts /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><AdminOrders /></ProtectedRoute>} />
      <Route path="/admin/payments" element={<ProtectedRoute roles={['admin']}><AdminPayments /></ProtectedRoute>} />
      <Route path="/admin/deliveries" element={<ProtectedRoute roles={['admin']}><AdminDeliveries /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="page container" style={{ textAlign: 'center', paddingTop: 'var(--space-20)' }}>
          <h1 style={{ fontSize: 'var(--font-5xl)', color: 'var(--primary)' }}>404</h1>
          <p style={{ marginBottom: 'var(--space-6)' }}>Page not found</p>
          <a href="/" className="btn btn-primary">Go Home</a>
        </div>
      } />
    </Routes>
  );
}
