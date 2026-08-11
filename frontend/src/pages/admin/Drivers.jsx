import { Search } from 'lucide-react';

export default function Drivers() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Delivery Partners</h1><p>Manage delivery partners</p></div>
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ position: 'relative', maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search drivers..." style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Phone</th><th>Active Deliveries</th><th>Completed</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody><tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No delivery partners registered yet.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
