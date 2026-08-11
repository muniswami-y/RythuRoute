import { DollarSign } from 'lucide-react';

export default function Payments() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Payments</h1><p>Monitor platform payments and settlements</p></div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Transaction ID</th><th>User</th><th>Amount</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
            <tbody><tr><td colSpan={6} style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--text-muted)' }}>No transactions yet.</td></tr></tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
