const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductStats,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} = require('../controllers/productController');
const validateProduct = require('../middleware/validateProduct');

// Special endpoints (before :id parameter routes)
router.get('/stats', getProductStats);
router.get('/categories', getCategories);
router.post('/seed', seedProducts);

// Base CRUD endpoints
router.route('/')
  .get(getProducts)
  .post(validateProduct, createProduct);

router.route('/:id')
  .get(getProductById)
  .put(validateProduct, updateProduct)
  .delete(deleteProduct);

module.exports = router;
