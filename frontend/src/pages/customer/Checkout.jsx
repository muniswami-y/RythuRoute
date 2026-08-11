import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { AuthContext } from '../../context/AuthContext';
import addressService from '../../services/addressService';
import orderService from '../../services/orderService';
import paymentService from '../../services/paymentService';
import { MapPin, Plus, CheckCircle2, AlertTriangle, RefreshCw, X, ShieldCheck } from 'lucide-react';

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

export default function Checkout() {
  const { cart, subtotal, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    recipient_name: '', phone: '', address: '', city: '', state: '', pincode: ''
  });

  const gstAmount = subtotal * 0.05;
  const transportCost = 50.00;
  const totalAmount = subtotal + gstAmount + transportCost;

  useEffect(() => {
    // Only redirect if cart was empty when opening checkout
    const savedCart = localStorage.getItem('rythuroute_cart');
    const parsed = savedCart ? JSON.parse(savedCart) : [];
    if (parsed.length === 0 && cart.length === 0) {
      navigate('/customer/cart');
      return;
    }
    fetchAddresses();
  }, []);

  const fetchAddresses = () => {
    addressService.getMyAddresses()
      .then(res => {
        setAddresses(res.data.data);
        if (res.data.data.length > 0 && !selectedAddressId) {
          setSelectedAddressId(res.data.data[0].id);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addressService.createAddress(newAddress);
      setShowAddForm(false);
      setNewAddress({ recipient_name: '', phone: '', address: '', city: '', state: '', pincode: '' });
      fetchAddresses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return setError('Please select a delivery address');
    setError('');
    setPlacingOrder(true);

    try {
      const orderData = {
        address_id: selectedAddressId,
        items: cart.map(item => ({ product_id: item.product_id, quantity: item.quantity }))
      };

      const res = await orderService.createOrder(orderData);
      const newOrderId = res.data.data.orderId;
      navigate(`/customer/payment/${newOrderId}?auto=true`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      setPlacingOrder(false);
    }
  };

  if (loading) return <div className="page container text-center">Loading checkout...</div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h1>Checkout</h1>
        </div>

        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Left Column: Address Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                <h2>Delivery Address</h2>
                {!showAddForm && (
                  <button className="btn btn-outline btn-sm" onClick={() => setShowAddForm(true)}>
                    <Plus size={16} /> Add New
                  </button>
                )}
              </div>

              {showAddForm && (
                <form onSubmit={handleAddAddress} style={{ background: 'var(--gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-6)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group"><input required placeholder="Recipient Name" className="form-input" value={newAddress.recipient_name} onChange={e => setNewAddress({ ...newAddress, recipient_name: e.target.value })} /></div>
                    <div className="form-group"><input required placeholder="Phone Number" className="form-input" value={newAddress.phone} onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><input required placeholder="Street Address" className="form-input" value={newAddress.address} onChange={e => setNewAddress({ ...newAddress, address: e.target.value })} /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
                    <div className="form-group"><input required placeholder="City" className="form-input" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} /></div>
                    <div className="form-group"><input required placeholder="State" className="form-input" value={newAddress.state} onChange={e => setNewAddress({ ...newAddress, state: e.target.value })} /></div>
                    <div className="form-group"><input required placeholder="Pincode" className="form-input" value={newAddress.pincode} onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })} /></div>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button type="submit" className="btn btn-primary">Save Address</button>
                    <button type="button" className="btn btn-ghost" onClick={() => setShowAddForm(false)}>Cancel</button>
                  </div>
                </form>
              )}

              {addresses.length === 0 && !showAddForm ? (
                <p className="text-muted">No saved addresses. Please add one.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      style={{
                        padding: 'var(--space-4)',
                        border: `2px solid ${selectedAddressId === addr.id ? 'var(--primary)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 'var(--space-4)'
                      }}>
                      <div style={{ color: selectedAddressId === addr.id ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {selectedAddressId === addr.id ? <CheckCircle2 size={24} /> : <MapPin size={24} />}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{addr.recipient_name} <span className="text-muted" style={{ fontWeight: 400 }}>({addr.phone})</span></div>
                        <div className="text-muted text-sm">{addr.address}, {addr.city}, {addr.state} - {addr.pincode}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
              <span>Items ({cart.length})</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
              <span>GST (5%)</span>
              <span>₹{gstAmount.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
              <span>Transport Cost</span>
              <span>₹{transportCost.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', fontSize: 'var(--font-xl)', fontWeight: 700 }}>
              <span>Total Amount</span>
              <span style={{ color: 'var(--primary)' }}>₹{totalAmount.toFixed(2)}</span>
            </div>
            <button
              className="btn btn-primary btn-lg w-full"
              style={{ justifyContent: 'center' }}
              onClick={handlePlaceOrder}
              disabled={placingOrder || !selectedAddressId}
            >
              {placingOrder ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
