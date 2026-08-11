import { useLocation, Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, PackageCheck, MapPin, Calendar, CreditCard, ArrowRight, ShoppingBag, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

export default function PaymentSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState(location.state?.order || null);
  const [paymentId] = useState(location.state?.paymentId || 'RZP_VERIFIED');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(!location.state?.order);

  useEffect(() => {
    if (!order) {
      // If refreshed or navigated directly, fetch latest customer order
      orderService.getMyOrders()
        .then(res => {
          if (res.data?.data && res.data.data.length > 0) {
            const latest = res.data.data[0];
            return orderService.getOrderDetails(latest.id);
          }
        })
        .then(res => {
          if (res?.data?.data) {
            setOrder(res.data.data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [order]);

  const handleCopyTrackingId = (id) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="page container text-center" style={{ padding: 'var(--space-24) 0' }}>
        <div className="spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
        <h2>Loading Order Confirmation...</h2>
      </div>
    );
  }

  const subtotal = order?.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || (order?.total_amount ? order.total_amount - 50 : 0);
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #f0fdf4 0%, #f8fafc 100%)', padding: 'var(--space-8) var(--space-4)' }}>
      <div className="container" style={{ maxWidth: 900 }}>
        
        {/* Full-Screen Celebration Hero Card */}
        <div className="card" style={{ 
          padding: 'var(--space-10) var(--space-8)', 
          textAlign: 'center', 
          borderRadius: 'var(--radius-2xl)', 
          boxShadow: '0 20px 40px rgba(45, 106, 79, 0.08)',
          border: '1px solid #bbf7d0',
          marginBottom: 'var(--space-8)',
          background: 'white'
        }}>
          
          {/* Animated Success Badge */}
          <div style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-6)',
            boxShadow: '0 10px 25px rgba(45, 106, 79, 0.35)',
            animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
          }}>
            <CheckCircle2 size={52} strokeWidth={2.4} />
          </div>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', background: '#dcfce7', color: '#15803d', padding: 'var(--space-1) var(--space-4)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-sm)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>
            <PackageCheck size={16} /> Payment Verified & Order Confirmed
          </div>

          <h1 style={{ fontSize: 'var(--font-4xl)', color: 'var(--text-primary)', fontWeight: 800, marginBottom: 'var(--space-2)', letterSpacing: '-0.02em' }}>
            Order Placed Successfully!
          </h1>
          
          <p style={{ fontSize: 'var(--font-md)', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto var(--space-6)' }}>
            Thank you for supporting local farmers! Your fresh farm produce order has been sent directly to the farms for harvesting and dispatch.
          </p>

          {/* Tracking ID Badge with Quick Copy */}
          {order?.tracking_id && (
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 'var(--space-3)', 
              background: 'var(--gray-50)', 
              border: '1px solid var(--border)', 
              padding: 'var(--space-2) var(--space-4)', 
              borderRadius: 'var(--radius-lg)',
              marginBottom: 'var(--space-6)'
            }}>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>Tracking ID:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 'var(--font-md)', color: 'var(--primary)' }}>
                {order.tracking_id}
              </span>
              <button 
                onClick={() => handleCopyTrackingId(order.tracking_id)} 
                title="Copy Tracking ID"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#15803d' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: 'var(--space-1)' }}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>
          )}

          {/* Primary Quick Actions */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            {order?.id && (
              <Link to={`/customer/orders/${order.id}`} className="btn btn-primary btn-lg" style={{ gap: 'var(--space-2)', boxShadow: '0 4px 14px rgba(45, 106, 79, 0.3)' }}>
                <span>Track Order Live</span> <ArrowRight size={18} />
              </Link>
            )}
            <Link to="/customer/orders" className="btn btn-secondary btn-lg">
              View All Orders
            </Link>
            <Link to="/products" className="btn btn-ghost btn-lg" style={{ gap: 'var(--space-2)' }}>
              <ShoppingBag size={18} /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Details Breakdown Grid */}
        {order && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
            
            {/* Delivery Info */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>
                <MapPin size={20} />
                <h3 style={{ margin: 0, fontSize: 'var(--font-md)', fontWeight: 700 }}>Delivery Details</h3>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Estimated Delivery:</div>
                <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: 'var(--space-2)' }}>Within 24 - 48 Hours</div>
                <div>Freshly packed & delivered from regional farm clusters</div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>
                <CreditCard size={20} />
                <h3 style={{ margin: 0, fontSize: 'var(--font-md)', fontWeight: 700 }}>Payment Info</h3>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <span>Gateway:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Razorpay (Secure)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <span>Status:</span>
                  <span style={{ fontWeight: 700, color: '#15803d' }}>PAID ✓</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Amount Paid:</span>
                  <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 'var(--font-md)' }}>₹{order.total_amount?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Order Date */}
            <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)', color: 'var(--primary)' }}>
                <Calendar size={20} />
                <h3 style={{ margin: 0, fontSize: 'var(--font-md)', fontWeight: 700 }}>Order Placed Date</h3>
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>{formattedDate}</div>
                <div>Confirmation email and live SMS tracking dispatch updates are active.</div>
              </div>
            </div>

          </div>
        )}

        {/* Order Items Purchased Section */}
        {order?.items && order.items.length > 0 && (
          <div className="card" style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', marginBottom: 'var(--space-8)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-3)', fontSize: 'var(--font-lg)' }}>
              Items in this Order ({order.items.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {order.items.map((item, idx) => (
                <div key={item.id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-3) 0', borderBottom: idx !== order.items.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {item.image_url ? (
                        <img src={item.image_url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <ShoppingBag size={20} color="var(--primary)" />
                      )}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Quantity: {item.quantity} {item.unit || 'units'}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    ₹{(item.subtotal || item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
