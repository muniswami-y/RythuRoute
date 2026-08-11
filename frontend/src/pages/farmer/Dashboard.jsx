import { Link } from 'react-router-dom';
import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import productService from '../../services/productService';

export default function Dashboard() {
  const { user } = useAuth();
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    if (user?.approval_status === 'approved') {
      productService.getMyProducts()
        .then(res => setProductCount(res.data.data.length))
        .catch(err => console.error(err));
    }
  }, [user]);

  const stats = [
    { label: "Today's Sales", value: '₹0', icon: TrendingUp, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { label: 'Total Orders', value: '0', icon: ShoppingCart, color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Products', value: productCount, icon: Package, color: '#8a6200', bg: 'var(--warning-bg)' },
    { label: 'Revenue', value: '₹0', icon: DollarSign, color: 'var(--success)', bg: 'var(--success-bg)' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Farmer Dashboard</h1>
          <p>Welcome, {user?.name?.split(' ')[0] || 'Farmer'}. Manage your farm produce and orders.</p>
        </div>

        {user?.approval_status === 'pending' && (
          <div style={{ background: 'var(--warning-bg)', color: '#8a6200', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <TrendingUp size={20} />
            <div>
              <strong>Account Pending Approval</strong>
              <div style={{ fontSize: 'var(--font-sm)' }}>Your farmer account is currently being reviewed by an administrator. You cannot list new products until approved.</div>
            </div>
          </div>
        )}
        <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
              <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>
        <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Pending Orders</h3>
            <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
              <Package size={32} color="var(--text-muted)" />
              <p style={{ marginTop: 'var(--space-3)' }}>No pending orders</p>
            </div>
          </div>
          <div className="card">
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Actions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {user?.approval_status === 'approved' ? (
                <Link to="/farmer/products/add" className="btn btn-primary w-full" style={{ justifyContent: 'flex-start' }}>
                  <Package size={16} /> Add New Product
                </Link>
              ) : (
                <button className="btn btn-primary w-full" style={{ justifyContent: 'flex-start', opacity: 0.5, cursor: 'not-allowed' }} disabled>
                  <Package size={16} /> Add New Product (Locked)
                </button>
              )}
              <Link to="/farmer/orders" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                <ShoppingCart size={16} /> View Orders
              </Link>
              <Link to="/farmer/earnings" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
                <TrendingUp size={16} /> View Earnings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
