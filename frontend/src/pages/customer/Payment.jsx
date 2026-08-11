import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CreditCard, ArrowLeft, ShieldCheck, X, AlertTriangle, RefreshCw, CheckCircle2, ShoppingBag } from 'lucide-react';
import { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Payment() {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Payment states
  const [processing, setProcessing] = useState(false);
  const [showSimulatedModal, setShowSimulatedModal] = useState(false);
  const [showRejectedModal, setShowRejectedModal] = useState(false);
  const [rejectedReason, setRejectedReason] = useState('');
  const [razorpayOrder, setRazorpayOrder] = useState(null);
  const autoTriggeredRef = useRef(false);

  useEffect(() => {
    orderService.getOrderDetails(orderId)
      .then(res => {
        const orderData = res.data.data;
        setOrder(orderData);
        if (orderData.payment_status === 'paid') {
          navigate('/customer/payment/success', { state: { order: orderData } });
        }
      })
      .catch(() => setError('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [orderId, navigate]);

  // Auto trigger payment gateway if auto=true in URL (e.g. from checkout "Place Order & Pay")
  useEffect(() => {
    const isAuto = searchParams.get('auto') === 'true';
    if (order && !loading && isAuto && !autoTriggeredRef.current && order.payment_status !== 'paid') {
      autoTriggeredRef.current = true;
      handleInitializePayment();
    }
  }, [order, loading, searchParams]);

  const handleInitializePayment = async () => {
    setProcessing(true);
    setError('');
    setShowRejectedModal(false);

    try {
      const res = await paymentService.createPaymentOrder(orderId);
      const rzpData = res.data.data;
      setRazorpayOrder(rzpData);

      // If mock mode is active (no valid keys), open simulation modal
      const isMock = !rzpData.key_id || rzpData.key_id === 'rzp_test_mock_id' || String(rzpData.id).startsWith('mock_');
      if (isMock) {
        setShowSimulatedModal(true);
        setProcessing(false);
        return;
      }

      // Load official Razorpay Checkout SDK
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        setError('Failed to load Razorpay SDK. Please check your internet connection.');
        setProcessing(false);
        return;
      }

      const options = {
        key: rzpData.key_id,
        amount: rzpData.amount, // in paise
        currency: rzpData.currency || 'INR',
        name: 'RythuRoute',
        description: `Order #${order?.tracking_id || orderId}`,
        image: 'https://cdn-icons-png.flaticon.com/512/2909/2909808.png',
        order_id: rzpData.id,
        handler: async function (response) {
          setProcessing(true);
          try {
            await paymentService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            clearCart();
            navigate('/customer/payment/success', { 
              state: { 
                order: { ...order, payment_status: 'paid' }, 
                paymentId: response.razorpay_payment_id 
              } 
            });
          } catch (err) {
            setRejectedReason(err.response?.data?.message || 'Payment signature verification failed.');
            setShowRejectedModal(true);
          } finally {
            setProcessing(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#2d6a4f'
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            setRejectedReason('Payment was cancelled or closed by user.');
            setShowRejectedModal(true);
          }
        }
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on('payment.failed', function (response) {
        setProcessing(false);
        setRejectedReason(response.error?.description || 'Payment rejected by bank or gateway.');
        setShowRejectedModal(true);
      });
      razorpayInstance.open();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize payment gateway.');
      setProcessing(false);
    }
  };

  const handleSimulateSuccess = async () => {
    setProcessing(true);
    try {
      await paymentService.verifyPayment({
        razorpay_order_id: razorpayOrder.id,
        razorpay_payment_id: `mock_pay_${Date.now()}`,
        razorpay_signature: 'mock_success_signature'
      });
      clearCart();
      setShowSimulatedModal(false);
      navigate('/customer/payment/success', { 
        state: { 
          order: { ...order, payment_status: 'paid' }, 
          paymentId: `MOCK_PAY_${Date.now()}` 
        } 
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Payment verification failed');
      setProcessing(false);
      setShowSimulatedModal(false);
      setRejectedReason('Simulated verification error occurred.');
      setShowRejectedModal(true);
    }
  };

  const handleSimulateReject = () => {
    setShowSimulatedModal(false);
    setRejectedReason('Payment was declined by issuing bank (Simulated Rejection).');
    setShowRejectedModal(true);
  };

  if (loading) {
    return (
      <div className="page container text-center" style={{ padding: 'var(--space-20) 0' }}>
        <div className="spinner" style={{ margin: '0 auto var(--space-4)' }}></div>
        <h2>Loading Payment Gateway...</h2>
        <p className="text-muted">Please wait while we prepare your secure checkout session.</p>
      </div>
    );
  }

  if (error && !showSimulatedModal && !showRejectedModal) {
    return (
      <div className="page container text-center" style={{ padding: 'var(--space-16) 0' }}>
        <div className="card" style={{ maxWidth: 500, margin: '0 auto', padding: 'var(--space-8)' }}>
          <AlertTriangle size={48} color="var(--danger)" style={{ margin: '0 auto var(--space-4)' }} />
          <h2 style={{ marginBottom: 'var(--space-2)' }}>Payment Initialization Error</h2>
          <p className="text-muted" style={{ marginBottom: 'var(--space-6)' }}>{error}</p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
            <button className="btn btn-primary" onClick={handleInitializePayment}>Retry Gateway</button>
            <Link to="/customer/cart" className="btn btn-secondary">Return to Cart</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const subtotal = order.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  const gst = subtotal * 0.05;
  const transport = 50.00;

  return (
    <div className="page" style={{ position: 'relative' }}>
      <div className="container" style={{ maxWidth: 850, filter: (showSimulatedModal || showRejectedModal) ? 'blur(3px)' : 'none', transition: 'filter 0.2s ease' }}>
        <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="page-header text-center" style={{ marginBottom: 'var(--space-8)' }}>
          <h1 style={{ fontSize: 'var(--font-3xl)', marginBottom: 'var(--space-1)' }}>Complete Payment</h1>
          <p className="text-muted">Order ID: <span style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary)' }}>#{order.tracking_id || order.id}</span></p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-8)' }}>
          {/* Order Details Left Column */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-3)' }}>
              <ShoppingBag size={20} color="var(--primary)" />
              <h3 style={{ margin: 0 }}>Order Summary</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {order.items && order.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-sm)', paddingBottom: 'var(--space-2)', borderBottom: '1px dashed var(--border-light)' }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.name}</span>
                    <span className="text-muted" style={{ marginLeft: 'var(--space-2)' }}>x{item.quantity}</span>
                  </div>
                  <span style={{ fontWeight: 600 }}>₹{(item.subtotal || item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>GST (5%)</span><span>₹{gst.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transport & Handling</span><span>₹{transport.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ borderTop: '2px solid var(--border)', marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xl)', fontWeight: 700 }}>
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>₹{order.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Action Right Column */}
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-4)' }}>
              <CreditCard size={36} color="var(--primary)" />
            </div>
            
            <h3 style={{ marginBottom: 'var(--space-1)' }}>Amount Due</h3>
            <div style={{ fontSize: 'var(--font-4xl)', fontWeight: 800, color: 'var(--primary)', marginBottom: 'var(--space-6)' }}>
              ₹{order.total_amount.toFixed(2)}
            </div>

            <button 
              className="btn btn-primary btn-lg w-full" 
              style={{ justifyContent: 'center', padding: 'var(--space-4)', fontSize: 'var(--font-md)', fontWeight: 600, marginBottom: 'var(--space-4)', boxShadow: '0 4px 14px rgba(45, 106, 79, 0.3)' }} 
              onClick={handleInitializePayment} 
              disabled={processing || order.payment_status === 'paid'}
            >
              {processing ? (
                <>
                  <RefreshCw size={18} className="spin" style={{ marginRight: 'var(--space-2)' }} /> Opening Razorpay...
                </>
              ) : order.payment_status === 'paid' ? (
                'Already Paid'
              ) : (
                'Pay with Razorpay'
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
              <ShieldCheck size={16} color="var(--primary)" /> 256-Bit SSL Encrypted & RBI Compliant
            </div>
          </div>
        </div>
      </div>

      {/* WARNING SMALL SCREEN / PAYMENT REJECTED MODAL */}
      {showRejectedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: 'var(--space-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 440, padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', border: '1px solid #fecaca', animation: 'scaleIn 0.25s ease-out' }}>
            
            {/* Modal Header */}
            <div style={{ background: '#fef2f2', borderBottom: '1px solid #fee2e2', padding: 'var(--space-5) var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#fee2e2', color: 'var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: 'var(--font-md)', color: '#991b1b', fontWeight: 700 }}>Payment Incomplete</h3>
                  <div style={{ fontSize: 'var(--font-xs)', color: '#b91c1c' }}>Transaction Rejected / Cancelled</div>
                </div>
              </div>
              <button onClick={() => setShowRejectedModal(false)} style={{ background: 'none', border: 'none', color: '#991b1b', cursor: 'pointer', padding: 'var(--space-1)' }}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ background: 'var(--gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-5)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reason</div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                  {rejectedReason || 'The payment request was cancelled or declined by your bank/gateway.'}
                </div>
              </div>

              <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', lineHeight: 1.5 }}>
                No amount was charged. Your items are saved in your order. Click <strong>Retry Payment</strong> to re-launch Razorpay and complete your checkout.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button 
                  className="btn btn-primary btn-lg w-full" 
                  style={{ justifyContent: 'center', gap: 'var(--space-2)', background: 'var(--primary)' }} 
                  onClick={handleInitializePayment}
                  disabled={processing}
                >
                  <RefreshCw size={18} /> Retry Payment with Razorpay
                </button>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn btn-secondary w-full" 
                    style={{ justifyContent: 'center', fontSize: 'var(--font-sm)' }} 
                    onClick={() => setShowRejectedModal(false)}
                  >
                    Review Order
                  </button>
                  <Link 
                    to="/customer/cart" 
                    className="btn btn-ghost w-full" 
                    style={{ justifyContent: 'center', fontSize: 'var(--font-sm)' }}
                  >
                    Return to Cart
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SIMULATED RAZORPAY TEST MODAL (Fallback for Dev/Mock) */}
      {showSimulatedModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 'var(--space-4)' }}>
          <div className="card" style={{ width: '100%', maxWidth: 420, padding: 0, overflow: 'hidden', borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', animation: 'scaleIn 0.2s ease-out' }}>
            <div style={{ background: '#02042b', color: 'white', padding: 'var(--space-4) var(--space-6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <CreditCard size={18} color="#3399cc" />
                <span style={{ fontWeight: 600, fontSize: 'var(--font-md)' }}>Razorpay Simulator</span>
              </div>
              <button onClick={() => setShowSimulatedModal(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            
            <div style={{ padding: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-1)' }}>Amount Payable</div>
                <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 800, color: '#02042b' }}>₹{order.total_amount.toFixed(2)}</div>
              </div>
              
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
                <p style={{ margin: 0, color: '#0369a1', lineHeight: 1.4 }}>
                  <strong>Development Mode Active:</strong> Razorpay API keys are in mock mode. You can test both Successful Payment and Rejected Payment flows instantly.
                </p>
              </div>

              {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <button 
                  className="btn btn-primary btn-lg w-full" 
                  style={{ justifyContent: 'center', background: '#3399cc', borderColor: '#3399cc' }} 
                  onClick={handleSimulateSuccess} 
                  disabled={processing}
                >
                  {processing ? 'Verifying...' : '✓ Simulate Success Payment'}
                </button>

                <button 
                  className="btn btn-outline btn-lg w-full" 
                  style={{ justifyContent: 'center', color: '#d32f2f', borderColor: '#fca5a5' }} 
                  onClick={handleSimulateReject} 
                  disabled={processing}
                >
                  ✕ Simulate Payment Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
