import { useState, useEffect } from 'react';
import { Search, RefreshCw, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await adminService.getOrders();
      setOrders(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.tracking_id && order.tracking_id.toLowerCase().includes(search.toLowerCase())) ||
      (order.customer_name && order.customer_name.toLowerCase().includes(search.toLowerCase())) ||
      (order.id && String(order.id).includes(search));
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter || order.payment_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page">
      <div className="container">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Orders Management</h1>
            <p>Track all customer orders, live statuses, and payment verifications</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={fetchOrders} disabled={loading} style={{ gap: 'var(--space-2)' }}>
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>
        </div>

        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                className="form-input" 
                placeholder="Search by Order ID, Tracking ID, Customer..." 
                style={{ paddingLeft: 38 }} 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select className="form-select" style={{ width: 'auto' }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Statuses</option>
              <option value="paid">Payment: Paid</option>
              <option value="pending">Payment: Pending</option>
              <option value="Paid">Order Status: Paid</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Order / Tracking ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Order Status</th>
                <th>Payment</th>
                <th>Placed Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)' }}>Loading platform orders...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No matching orders found.</td></tr>
              ) : (
                filteredOrders.map(order => (
                  <tr key={order.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'monospace' }}>
                        #{order.tracking_id || `ORD-${order.id}`}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{order.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{order.customer_email || order.customer_phone || ''}</div>
                    </td>
                    <td style={{ fontWeight: 700 }}>₹{Number(order.total_amount || 0).toFixed(2)}</td>
                    <td>
                      <span className="badge badge-info">{order.status || 'Pending'}</span>
                    </td>
                    <td>
                      <span 
                        style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: 700, 
                          padding: '3px 10px', 
                          borderRadius: 'var(--radius-full)', 
                          display: 'inline-block',
                          textTransform: 'uppercase',
                          background: order.payment_status === 'paid' ? '#dcfce7' : '#fef3c7',
                          color: order.payment_status === 'paid' ? '#15803d' : '#b45309'
                        }}
                      >
                        {order.payment_status === 'paid' ? 'PAID ✓' : 'PENDING'}
                      </span>
                    </td>
                    <td style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                      {new Date(order.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
