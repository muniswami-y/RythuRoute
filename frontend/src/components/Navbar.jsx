import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  Leaf, ShoppingCart, User, Menu, X, LogOut, 
  LayoutDashboard, Package, Truck, Settings, ChevronDown
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    const paths = {
      customer: '/customer/dashboard',
      farmer: '/farmer/dashboard',
      delivery_partner: '/driver/dashboard',
      admin: '/admin/dashboard',
    };
    return paths[user.role] || '/';
  };

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          <span className="logo-icon"><Leaf size={18} /></span>
          RythuRoute
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          {!isAuthenticated && (
            <>
              <NavLink to="/" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`} end>
                Home
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Products
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                About
              </NavLink>
              <NavLink to="/track" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
                Track Order
              </NavLink>
            </>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              {user?.role === 'customer' && (
                <Link to="/customer/cart" className="navbar-cart" aria-label="Cart">
                  <ShoppingCart size={20} />
                </Link>
              )}
              <div className="profile-dropdown" ref={profileRef}>
                <button 
                  className="navbar-profile" 
                  onClick={() => setProfileOpen(!profileOpen)}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <span className="navbar-avatar">{getInitials()}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown-menu">
                    <Link 
                      to={getDashboardPath()} 
                      className="profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    {user?.role === 'customer' && (
                      <Link 
                        to="/customer/orders" 
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Package size={16} />
                        My Orders
                      </Link>
                    )}
                    {user?.role === 'farmer' && (
                      <Link 
                        to="/farmer/products" 
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Package size={16} />
                        My Products
                      </Link>
                    )}
                    {user?.role === 'delivery_partner' && (
                      <Link 
                        to="/driver/active" 
                        className="profile-dropdown-item"
                        onClick={() => setProfileOpen(false)}
                      >
                        <Truck size={16} />
                        Active Delivery
                      </Link>
                    )}
                    <Link 
                      to={`/${user?.role === 'delivery_partner' ? 'driver' : user?.role}/profile`}
                      className="profile-dropdown-item"
                      onClick={() => setProfileOpen(false)}
                    >
                      <Settings size={16} />
                      Profile
                    </Link>
                    <div className="profile-dropdown-divider" />
                    <button className="profile-dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            </>
          )}
          
          {/* Mobile hamburger */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {!isAuthenticated && (
          <>
            <NavLink to="/" className="navbar-link" onClick={() => setMobileOpen(false)} end>
              Home
            </NavLink>
            <NavLink to="/products" className="navbar-link" onClick={() => setMobileOpen(false)}>
              Products
            </NavLink>
            <NavLink to="/about" className="navbar-link" onClick={() => setMobileOpen(false)}>
              About
            </NavLink>
            <NavLink to="/track" className="navbar-link" onClick={() => setMobileOpen(false)}>
              Track Order
            </NavLink>
          </>
        )}
        {isAuthenticated && (
          <>
            <NavLink to={getDashboardPath()} className="navbar-link" onClick={() => setMobileOpen(false)}>
              Dashboard
            </NavLink>
            {user?.role === 'customer' && (
              <NavLink to="/customer/cart" className="navbar-link" onClick={() => setMobileOpen(false)}>
                Cart
              </NavLink>
            )}
          </>
        )}
        <div className="mobile-menu-actions">
          {isAuthenticated ? (
            <button className="btn btn-secondary w-full" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary w-full" onClick={() => setMobileOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary w-full" onClick={() => setMobileOpen(false)}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
