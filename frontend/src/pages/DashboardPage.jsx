import React from 'react';
import { 
  Package, 
  Layers, 
  IndianRupee, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Eye, 
  ArrowRight,
  Database,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRupees, formatDateTime } from '../utils/formatters';

export default function DashboardPage({ 
  stats, 
  loading, 
  onNavigate, 
  onViewProduct, 
  onSeedData 
}) {
  if (loading && !stats) {
    return <LoadingSpinner message="Calculating dashboard metrics..." />;
  }

  const {
    totalProducts = 0,
    totalCategories = 0,
    totalInventoryValue = 0,
    totalQuantity = 0,
    inStockCount = 0,
    lowStockCount = 0,
    outOfStockCount = 0,
    categoryStats = [],
    recentProducts = [],
  } = stats || {};

  // Percentages for inventory health
  const inStockPct = totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
  const lowStockPct = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
  const outOfStockPct = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

  return (
    <div>
      {/* Metric Stat Cards Grid */}
      <div className="stats-grid">
        <StatCard
          label="Total Products"
          value={totalProducts.toLocaleString('en-IN')}
          icon={Package}
          theme="indigo"
          badgeText="Active SKUs"
          badgeType="positive"
          subtext={`${totalQuantity.toLocaleString('en-IN')} total units`}
        />

        <StatCard
          label="Categories"
          value={totalCategories}
          icon={Layers}
          theme="navy"
          badgeText="Catalog Depth"
          badgeType="neutral"
          subtext="Diversified stock"
        />

        <StatCard
          label="Inventory Value"
          value={formatRupees(totalInventoryValue)}
          icon={IndianRupee}
          theme="emerald"
          badgeText="Asset Total (INR)"
          badgeType="positive"
          subtext="Current retail worth"
        />

        <StatCard
          label="Stock Attention"
          value={lowStockCount + outOfStockCount}
          icon={AlertTriangle}
          theme={outOfStockCount > 0 ? 'amber' : 'indigo'}
          badgeText={outOfStockCount > 0 ? `${outOfStockCount} Out of Stock` : `${lowStockCount} Low`}
          badgeType={outOfStockCount > 0 ? 'warning' : 'neutral'}
          subtext={`${lowStockCount} items ≤ 5 units`}
        />
      </div>

      {/* Two Column Grid: Stock Health Overview & Category Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Inventory Stock Health Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-group">
              <h2 className="card-title">Inventory Health</h2>
              <p className="card-subtitle">Real-time breakdown of stock level availability</p>
            </div>
          </div>
          <div className="card-body">
            {/* Visual Multi-Segment Bar */}
            <div style={{ height: '14px', borderRadius: '9999px', display: 'flex', overflow: 'hidden', backgroundColor: '#f1f5f9', marginBottom: '1.5rem' }}>
              <div 
                style={{ width: `${inStockPct}%`, backgroundColor: '#10b981', transition: 'width 0.5s ease' }} 
                title={`In Stock: ${inStockPct}%`} 
              />
              <div 
                style={{ width: `${lowStockPct}%`, backgroundColor: '#f59e0b', transition: 'width 0.5s ease' }} 
                title={`Low Stock: ${lowStockPct}%`} 
              />
              <div 
                style={{ width: `${outOfStockPct}%`, backgroundColor: '#ef4444', transition: 'width 0.5s ease' }} 
                title={`Out of Stock: ${outOfStockPct}%`} 
              />
            </div>

            {/* Health Metrics Legend */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--success-bg)', borderRadius: '8px', border: '1px solid var(--success-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--success-text)' }}>Healthy (In Stock)</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--success-text)' }}>
                  {inStockCount} items ({inStockPct}%)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--warning-bg)', borderRadius: '8px', border: '1px solid var(--warning-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning-text)' }}>Low Stock (≤ 5 units)</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--warning-text)' }}>
                  {lowStockCount} items ({lowStockPct}%)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', backgroundColor: 'var(--danger-bg)', borderRadius: '8px', border: '1px solid var(--danger-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--danger-text)' }}>Out of Stock (0 units)</span>
                </div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--danger-text)' }}>
                  {outOfStockCount} items ({outOfStockPct}%)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className="card" style={{ marginBottom: 0 }}>
          <div className="card-header">
            <div className="card-title-group">
              <h2 className="card-title">Category Breakdown</h2>
              <p className="card-subtitle">Products and inventory values by department in ₹</p>
            </div>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('categories')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
          <div className="card-body">
            {categoryStats.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '2rem 0' }}>
                No category data available yet.
              </p>
            ) : (
              <div className="category-bars-grid">
                {categoryStats.slice(0, 4).map((cat) => {
                  const pct = totalProducts > 0 ? Math.round((cat.count / totalProducts) * 100) : 0;
                  return (
                    <div key={cat.category} className="category-bar-item">
                      <div className="category-bar-label">
                        <span>{cat.category}</span>
                        <span style={{ color: 'var(--text-main)' }}>
                          {cat.count} products • <strong style={{ color: 'var(--indigo-600)' }}>{formatRupees(cat.totalValue)}</strong>
                        </span>
                      </div>
                      <div className="category-progress-track">
                        <div 
                          className="category-progress-fill" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Products Card with Date & Time */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2 className="card-title">Recently Added Products</h2>
            <p className="card-subtitle">Latest items registered with exact addition timestamp</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button 
              type="button" 
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('products')}
            >
              <span>View All Products</span>
              <ArrowRight size={14} />
            </button>
            <button 
              type="button" 
              className="btn btn-primary btn-sm"
              onClick={() => onNavigate('add-product')}
            >
              <Plus size={15} />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (INR)</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Date & Time Added</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <Package size={36} style={{ color: '#94a3b8' }} />
                      <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No products currently in the database.</p>
                      <button 
                        type="button" 
                        className="btn btn-primary btn-sm"
                        onClick={onSeedData}
                      >
                        <Sparkles size={14} />
                        <span>Populate Realistic Sample Data</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                recentProducts.map((prod) => (
                  <tr key={prod._id}>
                    <td>
                      <div className="product-cell">
                        <div className="product-avatar">
                          {prod.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="product-meta">
                          <span className="product-name">{prod.name}</span>
                          <span className="product-sku">{prod.sku || 'PRD-XXXX'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="category-pill">{prod.category}</span>
                    </td>
                    <td>
                      <span className="price-text">{formatRupees(prod.price)}</span>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{prod.quantity} units</span>
                    </td>
                    <td>
                      <span className={`badge-status ${
                        prod.status === 'In Stock' ? 'in-stock' : prod.status === 'Low Stock' ? 'low-stock' : 'out-of-stock'
                      }`}>
                        {prod.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#475569' }}>
                        <Clock size={13} style={{ color: '#94a3b8' }} />
                        <span>{formatDateTime(prod.createdAt)}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button 
                        type="button" 
                        className="btn btn-secondary btn-sm"
                        onClick={() => onViewProduct(prod)}
                        title="View details"
                      >
                        <Eye size={14} />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
