import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2 } from 'lucide-react';
import orderService from '../../services/orderService';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService.getFarmerOrders()
      .then(res => setOrders(res.data.data))
      .catch(err => setError('Failed to load orders'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page container text-center">Loading your orders...</div>;
  if (error) return <div className="page container text-center text-danger">{error}</div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h1>Incoming Orders</h1>
          <p>Manage customer orders containing your products</p>
        </div>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={32} /></div>
            <h3>No orders yet</h3>
            <p>When customers order your products, they will appear here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {orders.map(order => (
              <div key={`${order.order_id}-${order.product_name}`} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h3 style={{ marginBottom: 'var(--space-1)' }}>Order #{order.tracking_id}</h3>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <Clock size={14} /> Placed on {new Date(order.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`badge ${order.payment_status === 'paid' ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <CheckCircle2 size={14} /> {order.payment_status === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-6)' }}>
                  {/* Product Details */}
                  <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', background: 'var(--gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-md)', background: 'var(--gray-200)', overflow: 'hidden' }}>
                      {order.image_url ? (
                        <img src={order.image_url.startsWith('http') ? order.image_url : (order.image_url.startsWith('/') ? order.image_url : `/${order.image_url}`)} alt={order.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={24} color="var(--gray-400)" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{order.product_name}</div>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                        Quantity: {order.quantity} {order.unit}
                      </div>
                      <div style={{ fontWeight: 600, color: 'var(--primary)', marginTop: 'var(--space-1)' }}>
                        Earnings: ₹{order.subtotal.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)', fontSize: 'var(--font-sm)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Customer Details</div>
                    <div style={{ fontWeight: 500 }}>{order.customer_name}</div>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{order.customer_phone}</div>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)', lineHeight: 1.5 }}>
                      {order.address}, {order.city}, {order.state} - {order.pincode}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
                  <button className="btn btn-outline">Contact Customer</button>
                  <button className="btn btn-primary">Mark as Ready for Pickup</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
