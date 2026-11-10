import React from 'react';
import { 
  LayoutDashboard, 
  Package, 
  PlusCircle, 
  Layers, 
  Database, 
  ExternalLink,
  Box,
  X
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  totalProducts = 0, 
  mobileOpen, 
  setMobileOpen,
  isDbConnected = true 
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'products',
      label: 'Products',
      icon: Package,
      badge: totalProducts > 0 ? totalProducts : null,
    },
    {
      id: 'add-product',
      label: 'Add Product',
      icon: PlusCircle,
      badge: 'New',
    },
  ];

  const handleNavClick = (id) => {
    setCurrentTab(id);
    if (setMobileOpen) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div 
          className="sidebar-backdrop" 
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Box size={22} strokeWidth={2.5} />
            </div>
            <span>Core<span style={{ color: '#818cf8' }}>Stock</span></span>
          </div>
          <span className="sidebar-badge">v1.0</span>

          {/* Close button on mobile */}
          <button 
            className="mobile-menu-btn" 
            style={{ display: mobileOpen ? 'flex' : 'none', color: '#94a3b8' }}
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="sidebar-nav">
          <div className="nav-section-title">Main Menu</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id || (item.id === 'products' && currentTab === 'edit-product');
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-count-pill">{item.badge}</span>
                )}
              </button>
            );
          })}

          <div className="nav-section-title" style={{ marginTop: '1.5rem' }}>Management</div>
          
          <button
            type="button"
            className={`nav-item ${currentTab === 'categories' ? 'active' : ''}`}
            onClick={() => handleNavClick('categories')}
          >
            <Layers size={19} />
            <span>Categories</span>
          </button>
        </nav>

        {/* System & Database Connection Status */}
        <div className="sidebar-footer">
          <div className="system-status-widget">
            <span className={`status-dot ${isDbConnected ? '' : 'offline'}`} />
            <div className="status-details">
              <span className="status-title">
                {isDbConnected ? 'MongoDB Live' : 'Connecting DB...'}
              </span>
              <span className="status-desc">
                {isDbConnected ? 'Mongoose v8 • Port 5000' : 'Check connection'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
