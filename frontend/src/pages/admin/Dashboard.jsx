import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingCart, Truck, TrendingUp, DollarSign, RefreshCw, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_orders: 0,
    total_customers: 0,
    total_farmers: 0,
    total_drivers: 0,
    total_products: 0,
    pending_farmers: 0,
    recent_orders: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const res = await adminService.getDashboardStats();
      if (res.data?.data) {
        setStats(res.data.data);
      }
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load real-time platform statistics');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Auto-refresh stats every 15 seconds for live real-time updates
    const interval = setInterval(() => {
      fetchStats();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₹${Number(stats.total_revenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { label: 'Total Orders', value: stats.total_orders, icon: ShoppingCart, color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Customers', value: stats.total_customers, icon: Users, color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Farmers', value: stats.total_farmers, icon: Package, color: '#8a6200', bg: 'var(--warning-bg)', subtext: stats.pending_farmers > 0 ? `${stats.pending_farmers} pending approval` : null },
    { label: 'Drivers', value: stats.total_drivers, icon: Truck, color: 'var(--accent)', bg: '#fde8e8' },
    { label: 'Active Products', value: stats.total_products, icon: TrendingUp, color: '#0284c7', bg: '#e0f2fe' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Live platform analytics and operations management</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>
              Live auto-syncing
            </span>
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={() => fetchStats(true)} 
              disabled={refreshing}
              style={{ gap: 'var(--space-2)' }}
            >
              <RefreshCw size={14} className={refreshing ? 'spin' : ''} />
              {refreshing ? 'Refreshing...' : 'Refresh Stats'}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        {/* Real-Time Stats Grid */}
        <div className="grid grid-3" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {statCards.map(s => (
            <div className="stat-card" key={s.label} style={{ transition: 'all 0.2s ease', position: 'relative' }}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
              <div>
                <div className="stat-value" style={{ fontWeight: 800 }}>
                  {loading ? '...' : s.value}
                </div>
                <div className="stat-label">{s.label}</div>
                {s.subtext && (
                  <div style={{ fontSize: 'var(--font-xs)', color: '#d97706', fontWeight: 600, marginTop: 'var(--space-1)' }}>
                    {s.subtext}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard Bottom Section */}
        <div className="grid grid-2" style={{ gap: 'var(--space-6)', alignItems: 'start' }}>
          
          {/* Recent Orders List */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3 style={{ margin: 0 }}>Recent Orders</h3>
              <Link to="/admin/orders" style={{ fontSize: 'var(--font-sm)', color: 'var(--primary)', fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <p className="text-muted text-sm text-center" style={{ padding: 'var(--space-8)' }}>Loading latest orders...</p>
            ) : !stats.recent_orders || stats.recent_orders.length === 0 ? (
              <p className="text-muted text-sm" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>No orders placed yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {stats.recent_orders.map(order => (
                  <div 
                    key={order.id} 
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: 'var(--space-3)', 
                      borderRadius: 'var(--radius-md)', 
                      background: 'var(--gray-50)',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                        #{order.tracking_id || `ORD-${order.id}`}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                        {order.customer_name || 'Customer'} • {new Date(order.created_at).toLocaleDateString('en-IN')}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
                        ₹{Number(order.total_amount || 0).toFixed(2)}
                      </div>
                      <span 
                        style={{ 
                          fontSize: '0.7rem', 
                          fontWeight: 700, 
                          padding: '2px 8px', 
                          borderRadius: 'var(--radius-full)', 
                          display: 'inline-block',
                          textTransform: 'uppercase',
                          background: order.payment_status === 'paid' ? '#dcfce7' : '#fef3c7',
                          color: order.payment_status === 'paid' ? '#15803d' : '#b45309'
                        }}
                      >
                        {order.payment_status === 'paid' ? 'PAID ✓' : 'PENDING'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Platform Management */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Quick Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Link to="/admin/farmers" className="btn btn-primary w-full" style={{ justifyContent: 'flex-start', gap: 'var(--space-3)' }}>
                <Package size={18} /> Manage Farmers & Approvals
              </Link>
              <Link to="/admin/users" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start', gap: 'var(--space-3)' }}>
                <Users size={18} /> Manage Customers & Accounts
              </Link>
              <Link to="/admin/orders" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start', gap: 'var(--space-3)' }}>
                <ShoppingCart size={18} /> View All Orders & Shipments
              </Link>
              <Link to="/admin/products" className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start', gap: 'var(--space-3)' }}>
                <TrendingUp size={18} /> Review Farmer Catalog & Inventory
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
