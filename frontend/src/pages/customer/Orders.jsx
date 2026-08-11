import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle2, AlertCircle, ArrowRight, CreditCard, Truck, MapPin } from 'lucide-react';
import orderService from '../../services/orderService';

export default function CustomerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    orderService.getMyOrders()
      .then(res => {
        setOrders(res.data.data || []);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Failed to load your orders');
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="page container text-center" style={{ padding: 'var(--space-12) 0' }}>
        <div style={{ fontSize: 'var(--font-lg)', color: 'var(--text-muted)' }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>My Orders</h1>
            <p>Track your fresh farm orders and view order history</p>
          </div>
          <Link to="/products" className="btn btn-outline btn-sm">
            Shop More Products
          </Link>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-6)' }}>{error}</div>}

        {orders.length === 0 ? (
          <div className="empty-state card" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
            <div className="empty-state-icon" style={{ margin: '0 auto var(--space-4)' }}>
              <Package size={48} color="var(--primary)" />
            </div>
            <h3>No orders yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-6)' }}>
              When you purchase farm products, your orders and real-time tracking will appear here.
            </p>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            {orders.map(order => {
              const isPaid = order.payment_status === 'paid';
              return (
                <div key={order.id} className="card" style={{ padding: 'var(--space-6)', transition: 'all 0.2s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-1)' }}>
                        <span style={{ fontWeight: 700, fontSize: 'var(--font-base)' }}>Order #{order.tracking_id || order.id}</span>
                        <span className={`badge ${isPaid ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {isPaid ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                          {isPaid ? 'Payment Confirmed' : 'Payment Pending'}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Clock size={13} />
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 'var(--font-xl)', fontWeight: 700, color: 'var(--primary)' }}>
                        ₹{Number(order.total_amount).toFixed(2)}
                      </div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
                        {order.item_count || 1} {order.item_count === 1 ? 'Item' : 'Items'}
                      </div>
                    </div>
                  </div>

                  {order.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--space-4)' }}>
                      <MapPin size={14} color="var(--text-muted)" />
                      <span>Delivering to: {order.address}, {order.city}, {order.state} - {order.pincode}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                    {!isPaid ? (
                      <Link to={`/customer/payment/${order.id}?auto=true`} className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <CreditCard size={15} /> Complete Payment
                      </Link>
                    ) : (
                      <Link to={`/customer/tracking/${order.id}`} className="btn btn-outline btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        <Truck size={15} /> Live Tracking
                      </Link>
                    )}
                    <Link to={`/customer/orders/${order.id}`} className="btn btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      View Details <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
