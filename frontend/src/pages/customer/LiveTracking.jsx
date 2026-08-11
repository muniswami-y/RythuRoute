import { useParams } from 'react-router-dom';
import { MapPin } from 'lucide-react';

export default function LiveTracking() {
  const { id } = useParams();
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Live Tracking</h1><p>Order #{id}</p></div>
        <div className="card" style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--gray-50)' }}>
          <div style={{ textAlign: 'center' }}>
            <MapPin size={48} color="var(--text-muted)" />
            <p style={{ marginTop: 'var(--space-4)', color: 'var(--text-muted)' }}>Live tracking will be available when delivery starts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
