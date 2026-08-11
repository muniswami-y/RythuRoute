import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MapPin, TrendingUp } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '0', icon: Package, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { label: 'Active Orders', value: '0', icon: ShoppingCart, color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Delivered', value: '0', icon: MapPin, color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Total Spent', value: '₹0', icon: TrendingUp, color: '#8a6200', bg: 'var(--warning-bg)' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'Customer'} 👋</h1>
          <p>Here&rsquo;s what&rsquo;s happening with your orders</p>
        </div>
        <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                <s.icon size={22} />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent Orders</h3>
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <Package size={32} color="var(--text-muted)" />
              <p style={{ marginTop: 'var(--space-3)' }}>No orders yet</p>
              <Link to="/products" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-3)' }}>Start Shopping</Link>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Link to="/products" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                <ShoppingCart size={16} /> Browse Products
              </Link>
              <Link to="/customer/orders" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                <Package size={16} /> View Orders
              </Link>
              <Link to="/customer/addresses" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                <MapPin size={16} /> Manage Addresses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
