import { FileText } from 'lucide-react';

export default function Reports() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Reports</h1><p>Export and view platform reports</p></div>
        <div className="card" style={{ padding: 'var(--space-10)', textAlign: 'center' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto var(--space-4)' }} />
          <h3>Reports Generation</h3>
          <p className="text-muted">Connect backend to generate Excel and PDF reports.</p>
        </div>
      </div>
    </div>
  );
}
