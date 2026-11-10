import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  Search, 
  Plus, 
  Bell, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle2, 
  X,
  Clock,
  Calendar
} from 'lucide-react';
import { formatDateTime } from '../utils/formatters';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onSearch, 
  searchQuery, 
  setMobileOpen,
  stats,
  onRefresh
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live ticking clock (updates every 10 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const getBreadcrumbTitle = () => {
    switch (currentTab) {
      case 'dashboard':
        return { section: 'Analytics', title: 'Dashboard Overview' };
      case 'products':
        return { section: 'Inventory', title: 'Product Catalog' };
      case 'add-product':
        return { section: 'Inventory', title: 'Add New Product' };
      case 'edit-product':
        return { section: 'Inventory', title: 'Edit Product Details' };
      case 'categories':
        return { section: 'Inventory', title: 'Category Breakdown' };
      default:
        return { section: 'Admin', title: 'Product Management' };
    }
  };

  const { section, title } = getBreadcrumbTitle();
  const lowStockCount = stats?.lowStockCount || 0;
  const outOfStockCount = stats?.outOfStockCount || 0;
  const totalAlerts = lowStockCount + outOfStockCount;

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (onSearch) {
      onSearch(val);
      if (currentTab !== 'products' && val.trim() !== '') {
        setCurrentTab('products');
      }
    }
  };

  return (
    <header className="top-navbar">
      {/* Left Section: Mobile trigger and Page Titles */}
      <div className="navbar-left">
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="page-title-box">
          <div className="page-breadcrumbs">
            <span>{section}</span>
            <ChevronRight size={14} />
            <span>{title}</span>
          </div>
          <h1 className="page-title">{title}</h1>
        </div>
      </div>

      {/* Right Section: Live Date & Time, Search, Quick Action, Alerts & Profile */}
      <div className="navbar-right">
        {/* Live Date and Time Widget */}
        <div 
          className="navbar-datetime-badge"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.4rem 0.85rem',
            backgroundColor: '#f1f5f9',
            border: '1px solid #e2e8f0',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#334155',
            whiteSpace: 'nowrap',
          }}
          title="Current System Date & Time"
        >
          <Calendar size={14} style={{ color: 'var(--indigo-600)' }} />
          <span>{formatDateTime(currentTime)}</span>
        </div>

        {/* Global Quick Search */}
        <div className="global-search-bar">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery || ''}
            onChange={handleSearchChange}
          />
        </div>

        {/* Quick Add Product Button */}
        {currentTab !== 'add-product' && (
          <button 
            type="button" 
            className="btn btn-primary btn-sm"
            onClick={() => setCurrentTab('add-product')}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        )}

        {/* Stock Alerts / Notification Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            type="button" 
            className="nav-icon-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            title="Inventory Alerts"
            aria-label="View inventory alerts"
          >
            <Bell size={18} />
            {totalAlerts > 0 && <span className="nav-notification-badge" />}
          </button>

          {showNotifications && (
            <div 
              style={{
                position: 'absolute',
                right: 0,
                top: '46px',
                width: '320px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                padding: '1rem',
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Inventory Alerts</h4>
                <button 
                  onClick={() => setShowNotifications(false)}
                  style={{ color: '#94a3b8', padding: '2px' }}
                >
                  <X size={16} />
                </button>
              </div>

              {totalAlerts === 0 ? (
                <div style={{ padding: '1rem 0', textAlign: 'center', color: '#059669', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={24} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>All stock levels are optimal!</span>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {outOfStockCount > 0 && (
                    <div 
                      onClick={() => {
                        setCurrentTab('products');
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#fef2f2',
                        borderRadius: '8px',
                        border: '1px solid #fecaca',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <AlertTriangle size={18} style={{ color: '#ef4444', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong style={{ color: '#b91c1c' }}>{outOfStockCount} Out of Stock</strong>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Items need immediate restocking</p>
                      </div>
                    </div>
                  )}

                  {lowStockCount > 0 && (
                    <div 
                      onClick={() => {
                        setCurrentTab('products');
                        setShowNotifications(false);
                      }}
                      style={{
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#fffbeb',
                        borderRadius: '8px',
                        border: '1px solid #fde68a',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem'
                      }}
                    >
                      <AlertTriangle size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                      <div style={{ fontSize: '0.8rem' }}>
                        <strong style={{ color: '#b45309' }}>{lowStockCount} Low Stock Items</strong>
                        <p style={{ color: '#64748b', fontSize: '0.75rem' }}>Stock is 5 units or less</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Info */}
        <div className="user-profile-widget">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Store Manager</span>
          </div>
        </div>
      </div>
    </header>
  );
}
