import { MapPin } from 'lucide-react';

export default function ActiveDelivery() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Active Delivery</h1></div>
        <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
          <div style={{ textAlign: 'center' }}>
            <MapPin size={48} color="var(--text-muted)" />
            <h3 style={{ marginTop: 'var(--space-4)' }}>No active delivery</h3>
            <p className="text-muted">Accept a delivery assignment to start.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
