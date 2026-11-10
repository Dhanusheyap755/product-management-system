import React, { useEffect } from 'react';
import { Eye, Edit3, Trash2, X, Calendar, Hash, Tag, Layers, Archive, Clock } from 'lucide-react';
import { formatRupees, formatDateTime } from '../utils/formatters';

export default function ProductDetailModal({ 
  isOpen, 
  product, 
  onClose, 
  onEdit, 
  onDelete 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'In Stock':
        return <span className="badge-status in-stock">In Stock</span>;
      case 'Low Stock':
        return <span className="badge-status low-stock">Low Stock</span>;
      default:
        return <span className="badge-status out-of-stock">Out of Stock</span>;
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card large">
        <div className="modal-header">
          <div className="modal-title">
            <Eye size={20} style={{ color: 'var(--indigo-600)' }} />
            <span>Product Details</span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Header summary */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="category-pill" style={{ marginBottom: '0.5rem' }}>
                {product.category}
              </span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>
                {product.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem', color: '#64748b', fontSize: '0.85rem' }}>
                <Hash size={14} />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{product.sku || 'No SKU'}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>
                {formatRupees(product.price)}
              </div>
              <div style={{ marginTop: '0.35rem' }}>
                {getStatusBadge(product.status)}
              </div>
            </div>
          </div>

          <hr style={{ borderColor: 'var(--border-light)' }} />

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Archive size={14} /> Available Stock
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {product.quantity} units
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Tag size={14} /> Total Value
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {formatRupees(Number(product.price) * Number(product.quantity))}
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={14} /> Created Date & Time
              </span>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginTop: '0.35rem' }}>
                {formatDateTime(product.createdAt)}
              </div>
            </div>

            <div style={{ padding: '0.85rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} /> Last Updated
              </span>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#0f172a', marginTop: '0.35rem' }}>
                {formatDateTime(product.updatedAt || product.createdAt)}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155', marginBottom: '0.4rem' }}>
              Description
            </h4>
            <p style={{ fontSize: '0.925rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line', backgroundColor: '#fcfcfd', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              {product.description}
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button 
            type="button" 
            className="btn btn-danger-outline"
            onClick={() => {
              onClose();
              onDelete(product);
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <button 
            type="button" 
            className="btn btn-primary"
            onClick={() => {
              onClose();
              onEdit(product);
            }}
          >
            <Edit3 size={16} />
            <span>Edit Product</span>
          </button>
        </div>
      </div>
    </div>
  );
}
