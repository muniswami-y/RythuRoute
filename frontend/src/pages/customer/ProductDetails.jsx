import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Star, Truck, ShieldCheck, Minus, Plus, Package } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import productService from '../../services/productService';
import { CartContext } from '../../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProductDetails(id)
      .then(res => setProduct(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, qty);
    alert('Added to cart!');
  };

  if (loading) return <div className="page container" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>Loading product details...</div>;
  if (!product) return <div className="page container" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>Product not found.</div>;

  return (
    <div className="page">
      <div className="container">
        <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>
          {/* Image */}
          <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', background: 'var(--gray-100)', aspectRatio: '1/1', position: 'relative' }}>
            {product.image_url ? (
              <img src={`http://localhost:5000${product.image_url}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #d8f3dc, #95d5b2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={64} color="rgba(255,255,255,0.5)" />
              </div>
            )}
          </div>
          {/* Info */}
          <div>
            <span className="badge badge-success" style={{ marginBottom: 'var(--space-3)' }}>In Stock ({product.quantity_available})</span>
            <h1 style={{ marginBottom: 'var(--space-2)' }}>{product.name}</h1>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }}>Category: {product.category}</p>
            
            <div style={{ fontSize: 'var(--font-3xl)', fontWeight: 700, color: 'var(--primary)', marginBottom: 'var(--space-6)' }}>
              ₹{product.price} <span style={{ fontSize: 'var(--font-sm)', fontWeight: 400, color: 'var(--text-muted)' }}>/ {product.unit}</span>
            </div>
            <p style={{ marginBottom: 'var(--space-6)', lineHeight: 1.7 }}>
              {product.description || 'No description provided.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
              <span className="text-sm font-medium">Quantity:</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
                <button className="btn btn-ghost btn-icon" onClick={() => setQty(Math.max(1, qty - 1))}><Minus size={16} /></button>
                <span style={{ padding: '0 var(--space-4)', fontWeight: 600, minWidth: 40, textAlign: 'center' }}>{qty}</span>
                <button className="btn btn-ghost btn-icon" onClick={() => setQty(Math.min(product.quantity_available, qty + 1))}><Plus size={16} /></button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-8)' }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={handleAddToCart}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
              <button 
                className="btn btn-accent btn-lg" 
                onClick={() => { 
                  addToCart(product, qty); 
                  navigate('/customer/checkout'); 
                }}
              >
                ⚡ Buy Now
              </button>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                <Truck size={16} /> Free delivery
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
                <ShieldCheck size={16} /> Quality assured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
