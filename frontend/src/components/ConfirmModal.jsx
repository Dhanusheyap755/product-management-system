import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X, Calendar } from 'lucide-react';
import { formatRupees, formatDateTime } from '../utils/formatters';

export default function ConfirmModal({ 
  isOpen, 
  title = 'Delete Product', 
  product, 
  onConfirm, 
  onCancel, 
  isDeleting = false 
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onCancel]);

  if (!isOpen || !product) return null;

  return (
    <div 
      className="modal-backdrop" 
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onCancel();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card">
        <div className="modal-header">
          <div className="modal-title" style={{ color: '#b91c1c' }}>
            <Trash2 size={20} />
            <span>{title}</span>
          </div>
          <button 
            type="button" 
            className="modal-close-btn"
            onClick={onCancel}
            disabled={isDeleting}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="delete-warning-box">
            <div className="delete-icon-circle">
              <AlertTriangle size={28} />
            </div>
            <h3 className="delete-title">Are you sure you want to delete this?</h3>
            <p className="delete-desc">
              This action cannot be undone. This product will be permanently removed from MongoDB.
            </p>

            <div className="delete-product-card">
              <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                {product.name}
              </span>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap' }}>
                <span>SKU: <strong style={{ color: '#334155' }}>{product.sku || 'N/A'}</strong></span>
                <span>Category: <strong style={{ color: '#334155' }}>{product.category}</strong></span>
                <span>Price: <strong style={{ color: '#0f172a' }}>{formatRupees(product.price)}</strong></span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} />
                <span>Created on: {formatDateTime(product.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger"
            onClick={() => onConfirm(product._id)}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }} />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={16} />
                <span>Delete Permanently</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
