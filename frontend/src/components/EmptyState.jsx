import React from 'react';
import { PackageX } from 'lucide-react';

export default function EmptyState({ 
  icon: Icon = PackageX, 
  title = 'No Products Found', 
  description = 'No products match your current search or filter criteria.', 
  actionLabel, 
  onAction,
  secondaryActionLabel,
  onSecondaryAction 
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={32} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {actionLabel && onAction && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
            {actionLabel}
          </button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
