import { Clock } from 'lucide-react';

export default function History() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Delivery History</h1><p>Your past deliveries</p></div>
        <div className="empty-state">
          <div className="empty-state-icon"><Clock size={32} /></div>
          <h3>No delivery history</h3>
          <p>Your completed deliveries will appear here.</p>
        </div>
      </div>
    </div>
  );
}
