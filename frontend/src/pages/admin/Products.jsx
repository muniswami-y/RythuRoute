import { Search } from 'lucide-react';

export default function Products() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Products</h1><p>Manage marketplace products</p></div>
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input className="form-input" placeholder="Search products..." style={{ paddingLeft: 38 }} />
            </div>
            <select className="form-select" style={{ width: 'auto' }}><option>All Categories</option><option>Vegetables</option><option>Fruits</option><option>Grains</option></select>
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Product</th><th>Farmer</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody><tr><td colSpan={7} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No products listed yet.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
