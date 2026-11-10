import React from 'react';

export default function StatCard({ 
  label, 
  value, 
  icon: Icon, 
  theme = 'indigo', 
  badgeText, 
  badgeType = 'positive',
  subtext 
}) {
  const iconThemeClass = {
    indigo: 'stat-icon-indigo',
    emerald: 'stat-icon-emerald',
    amber: 'stat-icon-amber',
    navy: 'stat-icon-navy',
  }[theme] || 'stat-icon-indigo';

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        <div className={`stat-icon-wrapper ${iconThemeClass}`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="stat-value">{value}</div>

      <div className="stat-footer">
        {badgeText && (
          <span className={`stat-badge ${badgeType}`}>
            {badgeText}
          </span>
        )}
        {subtext && <span>{subtext}</span>}
      </div>
    </div>
  );
}
