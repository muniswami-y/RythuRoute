import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import adminService from '../../services/adminService';

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await adminService.getFarmers();
      setFarmers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch farmers', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await adminService.updateFarmerStatus(id, 'approved');
      setFarmers(farmers.map(f => f.id === id ? { ...f, approval_status: 'approved' } : f));
    } catch (err) {
      alert('Failed to approve farmer');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.updateFarmerStatus(id, 'rejected');
      setFarmers(farmers.map(f => f.id === id ? { ...f, approval_status: 'rejected' } : f));
    } catch (err) {
      alert('Failed to reject farmer');
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header"><h1>Farmers & Approvals</h1><p>Manage registered farmers</p></div>
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ position: 'relative', maxWidth: 300 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search farmers..." style={{ paddingLeft: 38 }} />
          </div>
        </div>
        <div className="table-container">
          <table className="table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Approval Status</th><th>Actions</th></tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" className="text-center text-muted" style={{ padding: 'var(--space-4)' }}>Loading...</td></tr>
              ) : farmers.map(farmer => (
                <tr key={farmer.id}>
                  <td>{farmer.name}</td>
                  <td>{farmer.email}</td>
                  <td>{farmer.phone}</td>
                  <td>
                    <span className={`badge badge-${farmer.approval_status === 'approved' ? 'success' : farmer.approval_status === 'rejected' ? 'danger' : 'warning'}`}>
                      {farmer.approval_status}
                    </span>
                  </td>
                  <td>
                    {farmer.approval_status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                        <button className="btn btn-success btn-sm" onClick={() => handleApprove(farmer.id)}>Approve</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleReject(farmer.id)}>Reject</button>
                      </div>
                    ) : (
                      <span className="text-muted text-sm">Action Complete</span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && farmers.length === 0 && (
                <tr><td colSpan="5" className="text-center text-muted" style={{ padding: 'var(--space-4)' }}>No farmers found in the database.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
