import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Orders() {
  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={32} /></div>
          <h3>No orders yet</h3>
          <p>When you place an order, it will appear here.</p>
          <Link to="/products" className="btn btn-primary">Start Shopping</Link>
        </div>
      </div>
    </div>
  );
}
