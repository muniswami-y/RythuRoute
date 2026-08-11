import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import productService from '../../services/productService';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    quantity_available: '',
    description: ''
  });

  useEffect(() => {
    productService.getProductDetails(id)
      .then(res => {
        const product = res.data.data;
        setFormData({
          name: product.name || '',
          category: product.category || '',
          unit: product.unit || '',
          price: product.price || '',
          quantity_available: product.quantity_available || '',
          description: product.description || ''
        });
      })
      .catch(err => {
        setError('Failed to load product details.');
        console.error(err);
      })
      .finally(() => {
        setFetching(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await productService.updateProduct(id, formData);
      navigate('/farmer/products'); // Redirect on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="container" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>Loading product...</div>;

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <Link to="/farmer/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div className="page-header"><h1>Edit Product #{id}</h1></div>
        
        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input required className="form-input" name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select required className="form-select" name="category" value={formData.category} onChange={handleInputChange}>
                  <option value="">Select category</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Grains & Pulses">Grains & Pulses</option>
                  <option value="Dairy & More">Dairy & More</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit *</label>
                <select required className="form-select" name="unit" value={formData.unit} onChange={handleInputChange}>
                  <option value="">Select unit</option>
                  <option value="kg">kg</option>
                  <option value="gram">gram</option>
                  <option value="piece">piece</option>
                  <option value="dozen">dozen</option>
                  <option value="litre">litre</option>
                  <option value="bundle">bundle</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Price (₹) *</label>
                <input required className="form-input" name="price" value={formData.price} onChange={handleInputChange} type="number" step="0.01" />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity Available *</label>
                <input required className="form-input" name="quantity_available" value={formData.quantity_available} onChange={handleInputChange} type="number" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} rows={4} />
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              <Save size={16} /> {loading ? 'Saving...' : 'Update Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
