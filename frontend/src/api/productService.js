// API Client Service for Product Management
// In production on Vercel, VITE_API_URL points to the Render backend URL (e.g. https://your-backend.onrender.com)
// In local development, it defaults to relative paths using Vite reverse proxy
const BACKEND_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
const API_BASE = `${BACKEND_URL}/api/products`;

export const productService = {
  // Get products with optional search, filter, sort & pagination
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.order) query.append('order', params.order);
    if (params.page) query.append('page', params.page);
    if (params.limit !== undefined) query.append('limit', params.limit);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}${queryString}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch products');
    }
    return data;
  },

  // Get single product by ID
  async getProductById(id) {
    const res = await fetch(`${API_BASE}/${id}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch product details');
    }
    return data.product;
  },

  // Get Dashboard statistics
  async getStats() {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard stats');
    }
    return data.stats;
  },

  // Get distinct categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to fetch categories');
    }
    return data.categories || [];
  },

  // Create a new product
  async createProduct(productData) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || 'Failed to create product');
      err.errors = data.errors;
      throw err;
    }
    return data;
  },

  // Update existing product
  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    const data = await res.json();
    if (!res.ok) {
      const err = new Error(data.message || 'Failed to update product');
      err.errors = data.errors;
      throw err;
    }
    return data;
  },

  // Delete product
  async deleteProduct(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to delete product');
    }
    return data;
  },

  // Seed sample products
  async seedProducts(force = false) {
    const res = await fetch(`${API_BASE}/seed${force ? '?force=true' : ''}`, {
      method: 'POST',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Failed to seed sample products');
    }
    return data;
  },

  // Health check
  async checkHealth() {
    const res = await fetch(`${BACKEND_URL}/api/health`);
    return res.json();
  },
};
