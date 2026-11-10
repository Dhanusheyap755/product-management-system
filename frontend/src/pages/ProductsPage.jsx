import React from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpDown, 
  RotateCcw,
  Sparkles,
  PackageX,
  Clock,
  Calendar
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatRupees, formatDateTime } from '../utils/formatters';

export default function ProductsPage({
  products,
  loading,
  totalCount,
  pagination,
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  sortBy,
  setSortBy,
  order,
  setOrder,
  page,
  setPage,
  categories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onViewProduct,
  onResetFilters,
  onSeedData,
}) {
  const handleSortToggle = (field) => {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('desc');
    }
  };

  const hasActiveFilters = Boolean(
    (search && search.trim() !== '') ||
    (category && category !== 'All') ||
    (status && status !== 'All')
  );

  return (
    <div className="card">
      {/* Top Header */}
      <div className="card-header">
        <div className="card-title-group">
          <h2 className="card-title">Product Inventory</h2>
          <p className="card-subtitle">
            Manage, filter, and track {totalCount} permanent products in MongoDB
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {hasActiveFilters && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onResetFilters}
              title="Reset all filters"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          )}

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={onAddProduct}
          >
            <Plus size={16} />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="table-toolbar">
        {/* Search by Name */}
        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, SKU, or details..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        {/* Filter Controls */}
        <div className="filter-group">
          {/* Category Filter */}
          <select
            className="select-custom"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Category"
          >
            <option value="All">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            className="select-custom"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by Stock Status"
          >
            <option value="All">All Stock Statuses</option>
            <option value="In Stock">In Stock (&gt; 5)</option>
            <option value="Low Stock">Low Stock (1 - 5)</option>
            <option value="Out of Stock">Out of Stock (0)</option>
          </select>

          {/* Sort By Field */}
          <select
            className="select-custom"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1);
            }}
            aria-label="Sort By"
          >
            <option value="createdAt">Sort: Date & Time Added</option>
            <option value="name">Sort: Name (A-Z)</option>
            <option value="price">Sort: Price (INR)</option>
            <option value="quantity">Sort: Stock Quantity</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <LoadingSpinner message="Querying MongoDB products..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title={hasActiveFilters ? 'No Products Match Filters' : 'No Products In Catalog'}
          description={
            hasActiveFilters
              ? 'Try adjusting your search keywords, category filter, or stock status.'
              : 'Your MongoDB collection is currently empty. Add your first product or seed realistic sample data!'
          }
          actionLabel={hasActiveFilters ? 'Clear Filters' : 'Add Product'}
          onAction={hasActiveFilters ? onResetFilters : onAddProduct}
          secondaryActionLabel={!hasActiveFilters ? 'Populate Demo Products' : null}
          onSecondaryAction={!hasActiveFilters ? onSeedData : null}
        />
      ) : (
        <>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSortToggle('name')}
                    title="Sort by Name"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>Product</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th>Category</th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSortToggle('price')}
                    title="Sort by Price"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>Price (INR)</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSortToggle('quantity')}
                    title="Sort by Quantity"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>Stock</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th>Status</th>
                  <th 
                    style={{ cursor: 'pointer' }} 
                    onClick={() => handleSortToggle('createdAt')}
                    title="Sort by Date & Time"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span>Date & Time Added</span>
                      <ArrowUpDown size={13} />
                    </div>
                  </th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod._id}>
                    {/* Product Name & SKU */}
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

                    {/* Category */}
                    <td>
                      <span className="category-pill">{prod.category}</span>
                    </td>

                    {/* Price in Rupees */}
                    <td>
                      <span className="price-text" style={{ color: '#0f172a' }}>
                        {formatRupees(prod.price)}
                      </span>
                    </td>

                    {/* Quantity */}
                    <td>
                      <span style={{ fontWeight: 600, color: prod.quantity === 0 ? '#ef4444' : '#334155' }}>
                        {prod.quantity} units
                      </span>
                    </td>

                    {/* Stock Status Badge */}
                    <td>
                      <span className={`badge-status ${
                        prod.status === 'In Stock' ? 'in-stock' : prod.status === 'Low Stock' ? 'low-stock' : 'out-of-stock'
                      }`}>
                        {prod.status}
                      </span>
                    </td>

                    {/* Created Date & Time */}
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b' }}>
                          <Calendar size={13} style={{ color: 'var(--indigo-600)' }} />
                          <span>{new Date(prod.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b' }}>
                          <Clock size={12} style={{ color: '#94a3b8' }} />
                          <span>{new Date(prod.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                        </div>
                      </div>
                    </td>

                    {/* Action Buttons: View, Edit, Delete */}
                    <td style={{ textAlign: 'right' }}>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => onViewProduct(prod)}
                          title="View Product Details"
                          aria-label="View details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => onEditProduct(prod)}
                          title="Edit Product"
                          aria-label="Edit product"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon delete"
                          onClick={() => onDeleteProduct(prod)}
                          title="Delete Product"
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {pagination && pagination.pages > 1 && (
            <div className="pagination-wrapper">
              <div className="pagination-info">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} products
              </div>

              <div className="pagination-controls">
                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`pagination-btn ${pagination.page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  className="pagination-btn"
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => setPage(pagination.page + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
