import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="navbar-logo">
              <span className="logo-icon"><Leaf size={18} /></span>
              RythuRoute
            </Link>
            <p>
              Connecting farmers directly with customers. Fresh produce, 
              transparent pricing, and reliable delivery — from farm to your doorstep.
            </p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <Link to="/products">Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/track">Track Order</Link>
            <Link to="/register">Get Started</Link>
          </div>
          <div className="footer-column">
            <h4>For Partners</h4>
            <Link to="/register?role=farmer">Sell on RythuRoute</Link>
            <Link to="/register?role=delivery_partner">Deliver with Us</Link>
            <Link to="/about">Partner Benefits</Link>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href="mailto:support@rythuRoute.com" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={14} /> support@rythuRoute.com
            </a>
            <a href="tel:+911234567890" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={14} /> +91 12345 67890
            </a>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: 'var(--font-sm)' }}>
              <MapPin size={14} /> Hyderabad, India
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; {new Date().getFullYear()} RythuRoute. All rights reserved.</span>
          <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
            <Link to="/privacy" style={{ color: 'var(--gray-400)' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color: 'var(--gray-400)' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
