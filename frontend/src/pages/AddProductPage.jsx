import React from 'react';
import ProductForm from '../components/ProductForm';

export default function AddProductPage({ onSave, onCancel, isSubmitting }) {
  return (
    <div>
      <ProductForm
        onSubmit={onSave}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEdit={false}
      />
    </div>
  );
}
