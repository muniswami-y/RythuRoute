import { DollarSign, TrendingUp } from 'lucide-react';

export default function Earnings() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Delivery Earnings</h1><p>Track your delivery earnings</p></div>
        <div className="grid grid-3" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}><DollarSign size={22} /></div>
            <div><div className="stat-value">₹0</div><div className="stat-label">Total Earnings</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: '#8a6200' }}><TrendingUp size={22} /></div>
            <div><div className="stat-value">₹0</div><div className="stat-label">This Week</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}><DollarSign size={22} /></div>
            <div><div className="stat-value">0</div><div className="stat-label">Deliveries</div></div>
          </div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
          <p className="text-muted">Earnings breakdown will appear once you complete deliveries.</p>
        </div>
      </div>
    </div>
  );
}
