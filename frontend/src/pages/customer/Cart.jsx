import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Minus, Plus, ArrowRight, Package } from 'lucide-react';
import { useContext } from 'react';
import { CartContext } from '../../context/CartContext';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, subtotal, cartCount } = useContext(CartContext);

  if (cartCount === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className="page-header">
            <h1>Shopping Cart</h1>
          </div>
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingCart size={32} /></div>
            <h3>Your cart is waiting for something fresh</h3>
            <p>Browse our farm-fresh products and add items to your cart.</p>
            <Link to="/products" className="btn btn-primary">
              Explore Products <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="page-header">
          <h1>Shopping Cart ({cartCount} items)</h1>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Cart Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {cart.map(item => (
              <div key={item.product_id} className="card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-4)' }}>
                <div style={{ width: 100, height: 100, borderRadius: 'var(--radius-md)', background: 'var(--gray-100)', overflow: 'hidden' }}>
                  {item.image_url ? (
                    <img src={item.image_url.startsWith('http') ? item.image_url : (item.image_url.startsWith('/') ? item.image_url : `/${item.image_url}`)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={32} color="var(--gray-300)" />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ marginBottom: 'var(--space-1)' }}>{item.name}</h3>
                  <div style={{ fontWeight: 600, color: 'var(--primary)', marginBottom: 'var(--space-3)' }}>₹{item.price} <span className="text-sm font-normal text-muted">/ {item.unit}</span></div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateQuantity(item.product_id, item.quantity - 1)}><Minus size={14} /></button>
                      <span style={{ padding: '0 var(--space-3)', fontWeight: 600, fontSize: 'var(--font-sm)' }}>{item.quantity}</span>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => updateQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.max_quantity}><Plus size={14} /></button>
                    </div>
                    <button className="btn btn-ghost btn-icon text-danger" onClick={() => removeFromCart(item.product_id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-4)' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)', color: 'var(--text-secondary)' }}>
              <span>GST (5%)</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
              <span>Delivery Fee</span>
              <span>Calculated at checkout</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-6)', fontSize: 'var(--font-lg)', fontWeight: 700 }}>
              <span>Estimated Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{subtotal.toFixed(2)}</span>
            </div>
            <Link to="/customer/checkout" className="btn btn-primary btn-lg w-full" style={{ justifyContent: 'center' }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
