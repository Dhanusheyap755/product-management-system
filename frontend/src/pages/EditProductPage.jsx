import React from 'react';
import ProductForm from '../components/ProductForm';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditProductPage({ 
  product, 
  onSave, 
  onCancel, 
  isSubmitting 
}) {
  if (!product) {
    return <LoadingSpinner message="Loading product data for editing..." />;
  }

  return (
    <div>
      <ProductForm
        initialData={product}
        onSubmit={(data) => onSave(product._id, data)}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        isEdit={true}
      />
    </div>
  );
}
