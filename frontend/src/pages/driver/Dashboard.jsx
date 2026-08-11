import { Truck, Package, MapPin, DollarSign } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();
  const stats = [
    { label: "Today's Deliveries", value: '0', icon: Truck, color: 'var(--primary)', bg: 'var(--primary-bg)' },
    { label: 'Active', value: '0', icon: MapPin, color: 'var(--info)', bg: 'var(--info-bg)' },
    { label: 'Completed', value: '0', icon: Package, color: 'var(--success)', bg: 'var(--success-bg)' },
    { label: 'Earnings', value: '₹0', icon: DollarSign, color: '#8a6200', bg: 'var(--warning-bg)' },
  ];

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>Delivery Dashboard</h1>
          <p>Welcome, {user?.name?.split(' ')[0] || 'Driver'}. Manage your deliveries.</p>
        </div>
        <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          {stats.map(s => (
            <div className="stat-card" key={s.label}>
              <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
              <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            </div>
          ))}
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <Truck size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: 'var(--space-4)' }}>No active deliveries</h3>
          <p className="text-muted">New delivery assignments will appear here.</p>
        </div>
      </div>
    </div>
  );
}
