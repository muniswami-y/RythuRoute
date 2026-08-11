import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Package, Edit, Trash2 } from 'lucide-react';
import productService from '../../services/productService';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productService.getMyProducts();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Failed to fetch products', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productService.deleteProduct(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        alert('Failed to delete product');
      }
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div><h1>My Products</h1><p className="text-muted">Manage your product listings</p></div>
          <Link to="/farmer/products/add" className="btn btn-primary"><Plus size={16} /> Add Product</Link>
        </div>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Package size={32} /></div>
            <h3>No products listed yet</h3>
            <p>Start by adding your first product to the marketplace.</p>
            <Link to="/farmer/products/add" className="btn btn-primary">Add Your First Product</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>
                      {product.image_url ? (
                        <img src={product.image_url.startsWith('http') ? product.image_url : (product.image_url.startsWith('/') ? product.image_url : `/${product.image_url}`)} alt={product.name} style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-sm)', background: 'var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} color="var(--gray-400)" />
                        </div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500 }}>{product.name}</td>
                    <td>{product.category}</td>
                    <td>₹{product.price}/{product.unit}</td>
                    <td>{product.quantity_available} {product.unit}</td>
                    <td>
                      <span className={`badge badge-${product.status === 'active' ? 'success' : 'danger'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <Link to={`/farmer/products/edit/${product.id}`} className="btn btn-outline btn-sm" title="Edit"><Edit size={14} /></Link>
                        <button className="btn btn-danger btn-sm" title="Delete" onClick={() => handleDelete(product.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
