import { MapPin, Plus } from 'lucide-react';

export default function Addresses() {
  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <div><h1>My Addresses</h1><p className="text-muted">Manage your delivery addresses</p></div>
          <button className="btn btn-primary"><Plus size={16} /> Add Address</button>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><MapPin size={32} /></div>
          <h3>No addresses saved</h3>
          <p>Add a delivery address to get started.</p>
        </div>
      </div>
    </div>
  );
}
