import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Save, X } from 'lucide-react';
import productService from '../../services/productService';

export default function AddProduct() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: '',
    price: '',
    quantity_available: '',
    description: ''
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      if (imageFile) {
        data.append('image', imageFile);
      }

      await productService.createProduct(data);
      navigate('/farmer/products'); // Redirect on success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 700 }}>
        <Link to="/farmer/products" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Products
        </Link>
        <div className="page-header"><h1>Add New Product</h1></div>
        
        {error && <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <div className="card">
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label">Product Image</label>
              <input 
                type="file" 
                accept="image/png, image/jpeg" 
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleImageChange}
              />
              
              {!imagePreview ? (
                <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-10)', textAlign: 'center', cursor: 'pointer', background: 'var(--gray-50)' }}>
                  <Upload size={32} color="var(--text-muted)" style={{ margin: '0 auto var(--space-3)' }} />
                  <p className="text-sm text-muted">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted">PNG, JPG up to 5MB</p>
                </div>
              ) : (
                <div style={{ position: 'relative', width: '200px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={imagePreview} alt="Preview" style={{ width: '100%', display: 'block' }} />
                  <button type="button" onClick={removeImage} style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', padding: '4px', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Product Name *</label>
              <input required className="form-input" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Organic Tomatoes" />
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
                <input required className="form-input" name="price" value={formData.price} onChange={handleInputChange} type="number" placeholder="0.00" min="0.01" step="0.01" />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity Available *</label>
                <input required className="form-input" name="quantity_available" value={formData.quantity_available} onChange={handleInputChange} type="number" placeholder="0" min="1" />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Describe your product..." rows={4} />
            </div>
            
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg">
              <Save size={16} /> {loading ? 'Saving...' : 'Add Product'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
