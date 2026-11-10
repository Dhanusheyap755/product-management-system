import React, { useState, useEffect } from 'react';
import { 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  IndianRupee,
  Package,
  Calendar,
  Clock
} from 'lucide-react';
import { formatRupees, formatDateTime } from '../utils/formatters';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Office Furniture',
  'Home & Kitchen',
  'Clothing',
  'Sports & Outdoors',
  'Books',
  'Health & Beauty',
  'Toys & Games',
  'Other',
];

export default function ProductForm({ 
  initialData = null, 
  onSubmit, 
  onCancel, 
  isSubmitting = false,
  isEdit = false 
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    quantity: '',
    sku: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [now] = useState(new Date());

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? initialData.price.toString() : '',
        category: initialData.category || 'Electronics',
        quantity: initialData.quantity !== undefined ? initialData.quantity.toString() : '',
        sku: initialData.sku || '',
      });
    }
  }, [initialData]);

  const validate = (fieldValues = formData) => {
    const newErrors = { ...errors };

    if ('name' in fieldValues) {
      const name = fieldValues.name.trim();
      if (!name) {
        newErrors.name = 'Product name is required';
      } else if (name.length < 2) {
        newErrors.name = 'Must be at least 2 characters';
      } else if (name.length > 120) {
        newErrors.name = 'Cannot exceed 120 characters';
      } else {
        delete newErrors.name;
      }
    }

    if ('description' in fieldValues) {
      const desc = fieldValues.description.trim();
      if (!desc) {
        newErrors.description = 'Description is required';
      } else if (desc.length < 5) {
        newErrors.description = 'Must be at least 5 characters';
      } else if (desc.length > 1000) {
        newErrors.description = 'Cannot exceed 1000 characters';
      } else {
        delete newErrors.description;
      }
    }

    if ('price' in fieldValues) {
      const priceStr = fieldValues.price.toString().trim();
      const num = Number(priceStr);
      if (!priceStr) {
        newErrors.price = 'Price is required';
      } else if (isNaN(num) || num <= 0) {
        newErrors.price = 'Price must be greater than ₹0';
      } else {
        delete newErrors.price;
      }
    }

    if ('category' in fieldValues) {
      if (!fieldValues.category || !fieldValues.category.trim()) {
        newErrors.category = 'Category is required';
      } else {
        delete newErrors.category;
      }
    }

    if ('quantity' in fieldValues) {
      const qtyStr = fieldValues.quantity.toString().trim();
      const num = Number(qtyStr);
      if (!qtyStr && qtyStr !== '0') {
        newErrors.quantity = 'Quantity is required';
      } else if (isNaN(num) || !Number.isInteger(num) || num < 0) {
        newErrors.quantity = 'Must be a non-negative whole integer (0, 1, 2...)';
      } else {
        delete newErrors.quantity;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    if (touched[name]) {
      validate({ [name]: value });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validate({ [name]: formData[name] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      name: true,
      description: true,
      price: true,
      category: true,
      quantity: true,
      sku: true,
    });

    const isValid = validate(formData);
    if (!isValid) return;

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category.trim(),
      quantity: parseInt(formData.quantity, 10),
      sku: formData.sku.trim() || undefined,
    });
  };

  const handleReset = () => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price !== undefined ? initialData.price.toString() : '',
        category: initialData.category || 'Electronics',
        quantity: initialData.quantity !== undefined ? initialData.quantity.toString() : '',
        sku: initialData.sku || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'Electronics',
        quantity: '',
        sku: '',
      });
    }
    setErrors({});
    setTouched({});
  };

  // Preview status calculation
  const previewQuantity = parseInt(formData.quantity, 10);
  let previewStatus = 'In Stock';
  if (isNaN(previewQuantity) || previewQuantity === 0) {
    previewStatus = 'Out of Stock';
  } else if (previewQuantity <= 5) {
    previewStatus = 'Low Stock';
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '2rem', alignItems: 'start' }} className="form-layout-wrapper">
      {/* Main Form Card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title-group">
            <h2 className="card-title">{isEdit ? 'Edit Product Details' : 'Add New Product'}</h2>
            <p className="card-subtitle">
              {isEdit ? 'Modify product information and save updates permanently to MongoDB' : 'Fill in the information below to register a product into the catalog'}
            </p>
          </div>
          {onCancel && (
            <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="card-body">
            <div className="form-grid">
              {/* Product Name */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="prod-name">
                  <span>Product Name <span className="required-star">*</span></span>
                  <span className="input-help-text">{formData.name.length}/120</span>
                </label>
                <input
                  id="prod-name"
                  type="text"
                  name="name"
                  placeholder="e.g. Logitech MX Master 3S Wireless Mouse"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.name && errors.name ? 'error' : ''}`}
                />
                {touched.name && errors.name && (
                  <span className="input-error-text">
                    <AlertCircle size={14} /> {errors.name}
                  </span>
                )}
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-category">
                  <span>Category <span className="required-star">*</span></span>
                </label>
                <select
                  id="prod-category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-select ${touched.category && errors.category ? 'error' : ''}`}
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {touched.category && errors.category && (
                  <span className="input-error-text">
                    <AlertCircle size={14} /> {errors.category}
                  </span>
                )}
              </div>

              {/* SKU / Code */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-sku">
                  <span>SKU / Product Code</span>
                  <span className="input-help-text">Optional (Auto-generated if empty)</span>
                </label>
                <input
                  id="prod-sku"
                  type="text"
                  name="sku"
                  placeholder="e.g. PRD-89412"
                  value={formData.sku}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                />
              </div>

              {/* Price in Rupees */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-price">
                  <span>Price (INR ₹) <span className="required-star">*</span></span>
                </label>
                <div className="input-with-prefix">
                  <span className="input-prefix" style={{ fontWeight: 700 }}>₹</span>
                  <input
                    id="prod-price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.price && errors.price ? 'error' : ''}`}
                  />
                </div>
                {touched.price && errors.price && (
                  <span className="input-error-text">
                    <AlertCircle size={14} /> {errors.price}
                  </span>
                )}
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label className="form-label" htmlFor="prod-qty">
                  <span>Quantity in Stock <span className="required-star">*</span></span>
                </label>
                <input
                  id="prod-qty"
                  type="number"
                  step="1"
                  min="0"
                  placeholder="0"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.quantity && errors.quantity ? 'error' : ''}`}
                />
                {touched.quantity && errors.quantity ? (
                  <span className="input-error-text">
                    <AlertCircle size={14} /> {errors.quantity}
                  </span>
                ) : (
                  <span className="input-help-text">0 = Out of Stock, 1-5 = Low Stock alert</span>
                )}
              </div>

              {/* Description */}
              <div className="form-group full-width">
                <label className="form-label" htmlFor="prod-desc">
                  <span>Description <span className="required-star">*</span></span>
                  <span className="input-help-text">{formData.description.length}/1000</span>
                </label>
                <textarea
                  id="prod-desc"
                  name="description"
                  rows={4}
                  placeholder="Enter detailed specifications, features, or notes about the product..."
                  value={formData.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-textarea ${touched.description && errors.description ? 'error' : ''}`}
                />
                {touched.description && errors.description && (
                  <span className="input-error-text">
                    <AlertCircle size={14} /> {errors.description}
                  </span>
                )}
              </div>
            </div>

            {/* Form Action Controls */}
            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
                disabled={isSubmitting}
              >
                <RotateCcw size={16} />
                <span>Reset Fields</span>
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderColor: '#ffffff', borderTopColor: 'transparent' }} />
                    <span>Saving to MongoDB...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{isEdit ? 'Update Product' : 'Save Product'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Live Preview Card */}
      <div className="card" style={{ position: 'sticky', top: '90px' }}>
        <div className="card-header" style={{ padding: '1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--indigo-600)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Sparkles size={18} />
            <span>Live Catalog Preview</span>
          </div>
        </div>
        <div className="card-body" style={{ padding: '1.25rem' }}>
          <div style={{
            border: '1px solid var(--border-light)',
            borderRadius: '12px',
            padding: '1.25rem',
            backgroundColor: '#ffffff',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span className="category-pill">{formData.category || 'Category'}</span>
              <span className={`badge-status ${
                previewStatus === 'In Stock' ? 'in-stock' : previewStatus === 'Low Stock' ? 'low-stock' : 'out-of-stock'
              }`}>
                {previewStatus}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem', wordBreak: 'break-word' }}>
              {formData.name || 'Product Title Appears Here'}
            </h3>

            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#64748b', marginBottom: '0.75rem' }}>
              SKU: {formData.sku ? formData.sku.toUpperCase() : 'PRD-XXXXX'}
            </p>

            <p style={{
              fontSize: '0.825rem',
              color: '#475569',
              marginBottom: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3.6rem',
              lineHeight: 1.45
            }}>
              {formData.description || 'Description summary will show up right here in the catalog and table views.'}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--border-light)' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Price</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  {formatRupees(formData.price || 0)}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Units</span>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>
                  {formData.quantity !== '' ? `${formData.quantity} in stock` : '0 units'}
                </div>
              </div>
            </div>

            {/* Date and Time preview badge */}
            <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px dashed var(--border-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.725rem', color: '#64748b' }}>
              <Clock size={12} style={{ color: 'var(--indigo-600)' }} />
              <span>Timestamp: {formatDateTime(now)}</span>
            </div>
          </div>

          <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle size={15} style={{ color: '#10b981' }} />
            <span>Changes persist to MongoDB in real-time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
