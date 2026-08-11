import { Link } from 'react-router-dom';
import { 
  Leaf, Truck, ShieldCheck, Users, ArrowRight, 
  Star, Sprout, Package, TrendingUp, MapPin
} from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* ---- Hero ---- */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <div className="hero-badge">
              <Sprout size={16} />
              Farm-Fresh Marketplace
            </div>
            <h1 className="hero-title">
              Fresh From Farmers.{' '}
              <br />
              <span className="highlight">Delivered To You.</span>
            </h1>
            <p className="hero-description">
              Buy fresh, quality produce directly from local farmers with transparent 
              pricing and reliable delivery. No middlemen, just honest food.
            </p>
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Shop Fresh Products
                <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=farmer" className="btn btn-secondary btn-lg">
                Sell on RythuRoute
              </Link>
            </div>
            <div className="hero-stats">
              <div>
                <div className="hero-stat-value">10K+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div>
                <div className="hero-stat-value">500+</div>
                <div className="hero-stat-label">Local Farmers</div>
              </div>
              <div>
                <div className="hero-stat-value">50K+</div>
                <div className="hero-stat-label">Orders Delivered</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-wrapper">
              {/* Gradient placeholder — will be replaced with real image */}
              <div style={{
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #d8f3dc 0%, #95d5b2 40%, #52b788 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Leaf size={80} color="rgba(255,255,255,0.5)" />
              </div>
            </div>
            <div className="hero-float-card card-1">
              <div className="hero-float-icon" style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                <Truck size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Fast Delivery</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Same day available</div>
              </div>
            </div>
            <div className="hero-float-card card-2">
              <div className="hero-float-icon" style={{ background: 'var(--warning-bg)', color: '#8a6200' }}>
                <Star size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>4.8 Rating</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Trusted platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How RythuRoute Works</h2>
            <p>From farm to your table in four simple steps</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>Farmers List Produce</h4>
              <p>Local farmers list their fresh, quality produce with transparent pricing</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>You Place an Order</h4>
              <p>Browse products, add to cart, and pay securely through Razorpay</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>Farmer Prepares</h4>
              <p>The farmer accepts and carefully prepares your order for pickup</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h4>Delivered to You</h4>
              <p>Our delivery partner picks up and delivers fresh produce to your doorstep</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Why RythuRoute ---- */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose RythuRoute?</h2>
            <p>We&rsquo;re building a fairer, fresher food system</p>
          </div>
          <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: 'var(--primary-bg)', color: 'var(--primary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-5)',
              }}>
                <Leaf size={24} />
              </div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Farm Fresh</h4>
              <p style={{ fontSize: 'var(--font-sm)' }}>
                Produce sourced directly from local farms. No warehouses, no middlemen — just fresh food.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: 'var(--info-bg)', color: 'var(--info)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-5)',
              }}>
                <ShieldCheck size={24} />
              </div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Transparent Pricing</h4>
              <p style={{ fontSize: 'var(--font-sm)' }}>
                Know exactly where your money goes. Fair prices for customers and fair earnings for farmers.
              </p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                background: 'var(--warning-bg)', color: '#8a6200',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto var(--space-5)',
              }}>
                <Truck size={24} />
              </div>
              <h4 style={{ marginBottom: 'var(--space-2)' }}>Reliable Delivery</h4>
              <p style={{ fontSize: 'var(--font-sm)' }}>
                Track your order in real-time with GPS. Know exactly when your fresh produce will arrive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Categories ---- */}
      <section style={{ padding: 'var(--space-16) 0' }}>
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of farm-fresh products</p>
          </div>
          <div className="grid grid-4" style={{ gap: 'var(--space-4)' }}>
            {[
              { name: 'Vegetables', icon: Sprout, color: '#2d6a4f', bg: '#d8f3dc' },
              { name: 'Fruits', icon: Leaf, color: '#e76f51', bg: '#fde8e8' },
              { name: 'Grains & Pulses', icon: Package, color: '#8a6200', bg: '#fef3cd' },
              { name: 'Dairy & More', icon: TrendingUp, color: '#1976d2', bg: '#e3f2fd' },
            ].map(cat => (
              <Link 
                key={cat.name} 
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                className="card card-interactive"
                style={{ 
                  display: 'flex', alignItems: 'center', gap: 'var(--space-4)', 
                  padding: 'var(--space-5)', textDecoration: 'none' 
                }}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: cat.bg, color: cat.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <cat.icon size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cat.name}</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Shop now →</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---- For Farmers CTA ---- */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Are You a Farmer?</h2>
            <p>
              Join RythuRoute and sell your produce directly to thousands of customers. 
              No commissions, no middlemen — you set the price.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register?role=farmer" className="btn btn-lg" style={{ 
                background: 'var(--white)', color: 'var(--primary)', fontWeight: 600 
              }}>
                Start Selling
                <ArrowRight size={18} />
              </Link>
              <Link to="/about" className="btn btn-lg" style={{ 
                background: 'transparent', color: 'var(--white)', border: '1px solid rgba(255,255,255,0.3)' 
              }}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Trust Bar ---- */}
      <section style={{ padding: 'var(--space-12) 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="grid grid-4" style={{ gap: 'var(--space-6)', textAlign: 'center' }}>
            {[
              { icon: Users, value: '10,000+', label: 'Customers' },
              { icon: Sprout, value: '500+', label: 'Farmers' },
              { icon: MapPin, value: '100+', label: 'Locations' },
              { icon: Package, value: '50,000+', label: 'Orders Delivered' },
            ].map(stat => (
              <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                <stat.icon size={24} color="var(--primary)" />
                <div style={{ fontSize: 'var(--font-2xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
