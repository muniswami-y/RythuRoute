import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="container">
        <Link to="/customer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="page-header">
          <h1>Order #{id}</h1>
          <p>Order details and tracking information</p>
        </div>
        <div className="card">
          <div className="empty-state" style={{ padding: 'var(--space-8)' }}>
            <Package size={32} color="var(--text-muted)" />
            <p style={{ marginTop: 'var(--space-3)' }}>Order details will appear once the backend is connected.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
