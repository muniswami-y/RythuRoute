import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts()
      .then(res => {
        setProducts(res.data.data.products || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Fresh Products</h1>
          <p>Browse farm-fresh produce from local farmers</p>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 240, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search products..." style={{ paddingLeft: 38 }} />
          </div>
          <button className="btn btn-secondary">
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={32} /></div>
            <h3>Products Coming Soon</h3>
            <p>We are currently onboarding farmers. Check back soon for fresh products!</p>
          </div>
        ) : (
          <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
            {products.map(product => (
              <Link to={`/products/${product.id}`} key={product.id} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden', transition: 'transform 0.2s', ':hover': { transform: 'translateY(-4px)' } }}>
                <div style={{ height: 200, background: 'var(--gray-100)', position: 'relative' }}>
                  {product.image_url ? (
                    <img src={`http://localhost:5000${product.image_url}`} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Package size={48} color="var(--gray-300)" />
                    </div>
                  )}
                  {product.quantity_available < 10 && (
                    <span className="badge badge-warning" style={{ position: 'absolute', top: 12, right: 12 }}>Only {product.quantity_available} left!</span>
                  )}
                </div>
                <div style={{ padding: 'var(--space-4)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 'var(--space-1)' }}>{product.category}</div>
                  <h3 style={{ marginBottom: 'var(--space-2)' }}>{product.name}</h3>
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'var(--primary)' }}>₹{product.price} <span style={{ fontSize: 'var(--font-sm)', fontWeight: 400, color: 'var(--text-muted)' }}>/{product.unit}</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
