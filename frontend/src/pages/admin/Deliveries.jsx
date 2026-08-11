import { Truck } from 'lucide-react';

export default function Deliveries() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Deliveries</h1><p>Track active deliveries</p></div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Delivery ID</th><th>Order ID</th><th>Driver</th><th>Status</th><th>Pickup</th><th>Drop-off</th></tr></thead>
            <tbody><tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No active deliveries.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
