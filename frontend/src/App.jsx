import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import ProductDetailModal from './components/ProductDetailModal';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';
import CategoriesPage from './pages/CategoriesPage';
import { productService } from './api/productService';

export default function App() {
  // Navigation & View
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Products Data
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: 10 });
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Stats & Categories
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(true);

  // Filter & Search Controls
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [status, setStatus] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  // Modals & Action States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type, duration: 4000 }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Stats from MongoDB
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      const data = await productService.getStats();
      setStats(data);
      setIsDbConnected(true);
    } catch (err) {
      console.error('Failed to load stats:', err);
      setIsDbConnected(false);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Fetch Categories list
  const fetchCategoriesList = useCallback(async () => {
    try {
      const cats = await productService.getCategories();
      setCategories(cats);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  }, []);

  // Fetch Products from MongoDB
  const fetchProductsList = useCallback(async () => {
    try {
      setLoadingProducts(true);
      const res = await productService.getProducts({
        search,
        category,
        status,
        sortBy,
        order,
        page,
        limit: 10,
      });
      setProducts(res.products || []);
      setPagination(res.pagination || { total: 0, page: 1, pages: 1, limit: 10 });
      setIsDbConnected(true);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setIsDbConnected(false);
      addToast(err.message || 'Error fetching products from server', 'error');
    } finally {
      setLoadingProducts(false);
    }
  }, [search, category, status, sortBy, order, page, addToast]);

  // Initial Load
  useEffect(() => {
    fetchDashboardStats();
    fetchCategoriesList();
  }, [fetchDashboardStats, fetchCategoriesList]);

  // Sync Products list on filter changes
  useEffect(() => {
    fetchProductsList();
  }, [fetchProductsList]);

  // CREATE Product
  const handleCreateProduct = async (productData) => {
    try {
      setIsSubmitting(true);
      const res = await productService.createProduct(productData);
      addToast(`"${res.product.name}" added to catalog successfully!`, 'success');
      // Refresh state
      await fetchProductsList();
      await fetchDashboardStats();
      await fetchCategoriesList();
      setCurrentTab('products');
    } catch (err) {
      addToast(err.message || 'Failed to create product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // UPDATE Product
  const handleUpdateProduct = async (id, productData) => {
    try {
      setIsSubmitting(true);
      const res = await productService.updateProduct(id, productData);
      addToast(`"${res.product.name}" updated successfully!`, 'success');
      await fetchProductsList();
      await fetchDashboardStats();
      await fetchCategoriesList();
      setProductToEdit(null);
      setCurrentTab('products');
    } catch (err) {
      addToast(err.message || 'Failed to update product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // DELETE Product
  const handleConfirmDelete = async (id) => {
    try {
      setIsDeleting(true);
      const res = await productService.deleteProduct(id);
      addToast(res.message || 'Product deleted permanently', 'success');
      setProductToDelete(null);
      await fetchProductsList();
      await fetchDashboardStats();
      await fetchCategoriesList();
    } catch (err) {
      addToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // SEED Sample Data
  const handleSeedData = async () => {
    try {
      const res = await productService.seedProducts(true);
      addToast(res.message || 'Sample products loaded into MongoDB!', 'success');
      await fetchProductsList();
      await fetchDashboardStats();
      await fetchCategoriesList();
    } catch (err) {
      addToast(err.message || 'Failed to populate sample data', 'error');
    }
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setStatus('All');
    setSortBy('createdAt');
    setOrder('desc');
    setPage(1);
  };

  // Action Triggers
  const handleStartEdit = (product) => {
    setProductToEdit(product);
    setCurrentTab('edit-product');
  };

  const handleStartDelete = (product) => {
    setProductToDelete(product);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
  };

  const handleSelectCategoryFromStats = (catName) => {
    setCategory(catName);
    setSearch('');
    setStatus('All');
    setPage(1);
    setCurrentTab('products');
  };

  return (
    <div className="app-container">
      {/* Toast Alert Notifications */}
      <Toast toasts={toasts} removeToast={removeToast} />

      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab !== 'edit-product') setProductToEdit(null);
          setCurrentTab(tab);
        }}
        totalProducts={stats?.totalProducts || 0}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isDbConnected={isDbConnected}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        {/* Top Navbar */}
        <Navbar
          currentTab={currentTab}
          setCurrentTab={(tab) => {
            if (tab !== 'edit-product') setProductToEdit(null);
            setCurrentTab(tab);
          }}
          onSearch={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchQuery={search}
          setMobileOpen={setMobileOpen}
          stats={stats}
          onRefresh={() => {
            fetchProductsList();
            fetchDashboardStats();
          }}
        />

        {/* Content Views */}
        <main className="content-container">
          {currentTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              loading={loadingStats}
              onNavigate={(tab) => setCurrentTab(tab)}
              onViewProduct={handleViewProduct}
              onSeedData={handleSeedData}
            />
          )}

          {currentTab === 'products' && (
            <ProductsPage
              products={products}
              loading={loadingProducts}
              totalCount={pagination.total}
              pagination={pagination}
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              status={status}
              setStatus={setStatus}
              sortBy={sortBy}
              setSortBy={setSortBy}
              order={order}
              setOrder={setOrder}
              page={page}
              setPage={setPage}
              categories={categories}
              onAddProduct={() => setCurrentTab('add-product')}
              onEditProduct={handleStartEdit}
              onDeleteProduct={handleStartDelete}
              onViewProduct={handleViewProduct}
              onResetFilters={handleResetFilters}
              onSeedData={handleSeedData}
            />
          )}

          {currentTab === 'add-product' && (
            <AddProductPage
              onSave={handleCreateProduct}
              onCancel={() => setCurrentTab('products')}
              isSubmitting={isSubmitting}
            />
          )}

          {currentTab === 'edit-product' && (
            <EditProductPage
              product={productToEdit}
              onSave={handleUpdateProduct}
              onCancel={() => {
                setProductToEdit(null);
                setCurrentTab('products');
              }}
              isSubmitting={isSubmitting}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesPage
              stats={stats}
              loading={loadingStats}
              onSelectCategory={handleSelectCategoryFromStats}
            />
          )}
        </main>
      </div>

      {/* Delete Confirmation Dialog Modal */}
      <ConfirmModal
        isOpen={Boolean(productToDelete)}
        product={productToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setProductToDelete(null)}
        isDeleting={isDeleting}
      />

      {/* Product Detail Inspector Modal */}
      <ProductDetailModal
        isOpen={Boolean(selectedProduct)}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onEdit={(prod) => {
          setSelectedProduct(null);
          handleStartEdit(prod);
        }}
        onDelete={(prod) => {
          setSelectedProduct(null);
          handleStartDelete(prod);
        }}
      />
    </div>
  );
}
