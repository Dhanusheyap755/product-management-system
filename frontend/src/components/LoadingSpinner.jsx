import React from 'react';

export default function LoadingSpinner({ message = 'Loading catalog data...' }) {
  return (
    <div className="loading-container">
      <div className="spinner" />
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message}</span>
    </div>
  );
}
