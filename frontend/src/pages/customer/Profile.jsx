import { User, Mail, Phone, Save } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 600 }}>
        <div className="page-header"><h1>My Profile</h1><p>Manage your account information</p></div>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-6)', paddingBottom: 'var(--space-6)', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ width: 64, height: 64, borderRadius: 'var(--radius-full)', background: 'var(--primary-bg)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--font-2xl)', fontWeight: 700 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3>{user?.name || 'User'}</h3>
              <span className="badge badge-success" style={{ marginTop: 4 }}>{user?.role || 'customer'}</span>
            </div>
          </div>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input className="form-input" defaultValue={user?.name || ''} placeholder="Your name" />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" defaultValue={user?.email || ''} placeholder="Email" type="email" />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" defaultValue={user?.phone || ''} placeholder="Phone" type="tel" />
            </div>
            <button type="button" className="btn btn-primary"><Save size={16} /> Save Changes</button>
          </form>
        </div>
      </div>
    </div>
  );
}
