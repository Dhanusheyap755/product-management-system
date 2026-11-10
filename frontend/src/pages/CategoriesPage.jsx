import React from 'react';
import { Layers, ArrowRight, Package, IndianRupee, Tag } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatRupees } from '../utils/formatters';

export default function CategoriesPage({ 
  stats, 
  loading, 
  onSelectCategory 
}) {
  if (loading && !stats) {
    return <LoadingSpinner message="Loading category metrics..." />;
  }

  const categoryStats = stats?.categoryStats || [];
  const totalProducts = stats?.totalProducts || 0;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">Category Intelligence</h2>
          <p className="card-subtitle">
            Catalog distribution, inventory concentration, and department valuations in Indian Rupees (₹)
          </p>
        </div>
      </div>

      <div className="card-body">
        {categoryStats.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            No categories available in the database.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            {categoryStats.map((item) => {
              const pct = totalProducts > 0 ? Math.round((item.count / totalProducts) * 100) : 0;
              return (
                <div
                  key={item.category}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--border-light)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    boxShadow: 'var(--shadow-xs)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-xs)';
                    e.currentTarget.style.borderColor = 'var(--border-light)';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span className="category-pill" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                        {item.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--indigo-600)' }}>
                        {pct}% of catalog
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                      <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Package size={12} /> Products
                        </span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          {item.count} items
                        </div>
                      </div>

                      <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '0.6rem 0.75rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <IndianRupee size={12} /> Total Value
                        </span>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                          {formatRupees(item.totalValue)}
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                    onClick={() => onSelectCategory(item.category)}
                  >
                    <span>Browse {item.category} Items</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
