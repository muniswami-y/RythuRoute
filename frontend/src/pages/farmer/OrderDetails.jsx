import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';

export default function OrderDetails() {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="container">
        <Link to="/farmer/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--text-secondary)', marginBottom: 'var(--space-6)', fontSize: 'var(--font-sm)' }}>
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="page-header"><h1>Order #{id}</h1></div>
        <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
          <Package size={32} color="var(--text-muted)" />
          <p style={{ marginTop: 'var(--space-3)' }} className="text-muted">Order details will load from backend.</p>
        </div>
      </div>
    </div>
  );
}
