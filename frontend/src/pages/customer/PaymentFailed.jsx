import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw, ShoppingCart, Home, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';
import orderService from '../../services/orderService';

export default function PaymentFailed() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('orderId');
  const [latestOrderId, setLatestOrderId] = useState(orderId);

  useEffect(() => {
    if (!latestOrderId) {
      orderService.getMyOrders()
        .then(res => {
          if (res.data?.data && res.data.data.length > 0) {
            setLatestOrderId(res.data.data[0].id);
          }
        })
        .catch(err => console.error(err));
    }
  }, [latestOrderId]);

  const handleRetryPayment = () => {
    if (latestOrderId) {
      navigate(`/customer/payment/${latestOrderId}?auto=true`);
    } else {
      navigate('/customer/cart');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(180deg, #fef2f2 0%, #f9fafb 100%)', padding: 'var(--space-4)' }}>
      <div className="card" style={{ 
        width: '100%', 
        maxWidth: 460, 
        padding: 0, 
        overflow: 'hidden', 
        borderRadius: 'var(--radius-2xl)', 
        boxShadow: '0 20px 45px rgba(220, 38, 38, 0.12)', 
        border: '1px solid #fecaca', 
        background: 'white',
        animation: 'scaleIn 0.3s ease-out' 
      }}>
        
        {/* Warning Modal Header */}
        <div style={{ background: '#fef2f2', borderBottom: '1px solid #fee2e2', padding: 'var(--space-6) var(--space-6)', textAlign: 'center' }}>
          <div style={{ 
            width: 68, 
            height: 68, 
            borderRadius: '50%', 
            background: '#fee2e2', 
            color: 'var(--danger)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto var(--space-3)',
            boxShadow: '0 8px 16px rgba(220, 38, 38, 0.15)'
          }}>
            <AlertTriangle size={36} strokeWidth={2.2} />
          </div>
          <h2 style={{ fontSize: 'var(--font-2xl)', color: '#991b1b', fontWeight: 800, margin: '0 0 var(--space-1)' }}>
            Payment Incomplete
          </h2>
          <div style={{ fontSize: 'var(--font-sm)', color: '#b91c1c', fontWeight: 500 }}>
            Transaction Rejected / Cancelled
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
          <div style={{ background: '#fffbeb', border: '1px solid #fef3c7', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)', color: '#92400e', lineHeight: 1.5 }}>
            <strong>What happened?</strong> Your payment was cancelled or declined by the payment provider. No funds were debited from your bank account or card.
          </div>

          <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.5, textAlign: 'center' }}>
            Your selected farm items remain saved in your order. You can retry paying with Razorpay using UPI, Cards, Netbanking, or Wallets.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button 
              className="btn btn-primary btn-lg w-full" 
              style={{ justifyContent: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-md)', fontWeight: 600, boxShadow: '0 4px 14px rgba(45, 106, 79, 0.25)' }} 
              onClick={handleRetryPayment}
            >
              <RefreshCw size={18} /> Retry Payment with Razorpay
            </button>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              <Link 
                to="/customer/cart" 
                className="btn btn-secondary" 
                style={{ justifyContent: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-sm)' }}
              >
                <ShoppingCart size={16} /> Return to Cart
              </Link>
              <Link 
                to="/" 
                className="btn btn-ghost" 
                style={{ justifyContent: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-sm)' }}
              >
                <Home size={16} /> Home
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
