const Product = require('../models/Product');

const calculateStatus = (qty) => {
  const num = Number(qty);
  if (num === 0) return 'Out of Stock';
  if (num <= 5) return 'Low Stock';
  return 'In Stock';
};

// @desc    Get all products with search, filter, sort & pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      status,
      sortBy = 'createdAt',
      order = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    // Search by product name, description or SKU
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // Filter by Category
    if (category && category !== 'All' && category.trim() !== '') {
      query.category = { $regex: `^${category.trim()}$`, $options: 'i' };
    }

    // Filter by Stock Status
    if (status && status !== 'All' && status.trim() !== '') {
      query.status = status.trim();
    }

    // Sorting
    const sortField = ['name', 'price', 'quantity', 'category', 'createdAt'].includes(sortBy)
      ? sortBy
      : 'createdAt';
    const sortDirection = order === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortDirection };

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = parseInt(limit, 10) === 0 ? 0 : Math.max(1, parseInt(limit, 10) || 10);
    const skip = limitNum === 0 ? 0 : (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);

    let queryBuilder = Product.find(query).sort(sortObj);
    if (limitNum > 0) {
      queryBuilder = queryBuilder.skip(skip).limit(limitNum);
    }

    const products = await queryBuilder;

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        total,
        page: pageNum,
        pages: limitNum === 0 ? 1 : Math.ceil(total / limitNum),
        limit: limitNum,
      },
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/products/stats
// @access  Public
const getProductStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();

    // Aggregation for inventory totals and averages
    const aggregationResult = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalInventoryValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$price' },
        },
      },
    ]);

    const statsTotals = aggregationResult[0] || {
      totalInventoryValue: 0,
      totalQuantity: 0,
      avgPrice: 0,
    };

    // Category breakdown
    const categoryStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: { $sum: { $multiply: ['$price', '$quantity'] } },
          totalQuantity: { $sum: '$quantity' },
          avgPrice: { $avg: '$price' },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Distinct category names
    const categories = await Product.distinct('category');

    // Status counts
    const inStockCount = await Product.countDocuments({ status: 'In Stock' });
    const lowStockCount = await Product.countDocuments({ status: 'Low Stock' });
    const outOfStockCount = await Product.countDocuments({ status: 'Out of Stock' });

    // 5 Most recently added products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories: categories.length,
        categories,
        totalInventoryValue: parseFloat((statsTotals.totalInventoryValue || 0).toFixed(2)),
        totalQuantity: statsTotals.totalQuantity || 0,
        avgPrice: parseFloat((statsTotals.avgPrice || 0).toFixed(2)),
        inStockCount,
        lowStockCount,
        outOfStockCount,
        categoryStats: categoryStats.map((c) => ({
          category: c._id,
          count: c.count,
          totalValue: parseFloat(c.totalValue.toFixed(2)),
          totalQuantity: c.totalQuantity,
          avgPrice: parseFloat(c.avgPrice.toFixed(2)),
        })),
        recentProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all distinct categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct('category');
    res.status(200).json({
      success: true,
      categories: categories.sort(),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Public
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, sku } = req.body;
    const qty = Number(quantity);

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category: category.trim(),
      quantity: qty,
      sku: sku && sku.trim() ? sku.trim().toUpperCase() : undefined,
      status: calculateStatus(qty),
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/products/:id
// @access  Public
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, quantity, sku } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    const qty = Number(quantity);
    product.name = name.trim();
    product.description = description.trim();
    product.price = Number(price);
    product.category = category.trim();
    product.quantity = qty;
    product.status = calculateStatus(qty);
    if (sku && sku.trim()) {
      product.sku = sku.trim().toUpperCase();
    }

    const updatedProduct = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Public
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `Product "${product.name}" deleted successfully`,
      deletedId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Seed sample products
// @route   POST /api/products/seed
// @access  Public
const seedProducts = async (req, res, next) => {
  try {
    const defaultProducts = [
      {
        name: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Quiet clicks and 8K DPI track-on-glass sensor ergonomic wireless mouse with MagSpeed scrolling.',
        price: 8995.00,
        category: 'Electronics',
        quantity: 34,
        sku: 'PRD-LGT01',
        status: 'In Stock',
      },
      {
        name: 'Apple MacBook Pro 14" M3 Pro',
        description: 'Supercharged by M3 Pro chip with 18GB Unified Memory, 512GB SSD and Liquid Retina XDR display.',
        price: 199900.00,
        category: 'Electronics',
        quantity: 12,
        sku: 'PRD-APL02',
        status: 'In Stock',
      },
      {
        name: 'Sony WH-1000XM5 Wireless Headphones',
        description: 'Industry-leading noise canceling with two processors and 8 microphones for exceptional sound quality.',
        price: 29990.00,
        category: 'Electronics',
        quantity: 18,
        sku: 'PRD-SNY03',
        status: 'In Stock',
      },
      {
        name: 'Dell UltraSharp 27" 4K USB-C Hub Monitor',
        description: 'Brilliant IPS Black technology with 4K resolution, 98% DCI-P3 color gamut, and 90W Power Delivery.',
        price: 54999.00,
        category: 'Electronics',
        quantity: 8,
        sku: 'PRD-DEL04',
        status: 'In Stock',
      },
      {
        name: 'Keychron Q1 Pro Wireless Custom Mechanical Keyboard',
        description: 'Full aluminum body, hot-swappable QMK/VIA programmable mechanical keyboard with double-gasket design.',
        price: 18499.00,
        category: 'Electronics',
        quantity: 4,
        sku: 'PRD-KCH05',
        status: 'Low Stock',
      },
      {
        name: 'Herman Miller Aeron Ergonomic Chair',
        description: 'Iconic ergonomic mesh office chair offering superior lumbar posture fit and breathable pellicle material.',
        price: 125000.00,
        category: 'Office Furniture',
        quantity: 6,
        sku: 'PRD-HMA06',
        status: 'In Stock',
      },
      {
        name: 'Fully Jarvis Bamboo Standing Desk',
        description: 'Motorized height adjustable sit-to-stand desk with dual motors, solid sustainable bamboo top.',
        price: 64500.00,
        category: 'Office Furniture',
        quantity: 3,
        sku: 'PRD-JAR07',
        status: 'Low Stock',
      },
      {
        name: 'Ember Temperature Control Smart Mug 2',
        description: 'App-controlled smart heated mug keeps your coffee or tea at your precise drinking temperature for 80 minutes.',
        price: 12999.00,
        category: 'Home & Kitchen',
        quantity: 22,
        sku: 'PRD-EMB08',
        status: 'In Stock',
      },
      {
        name: 'Breville Barista Touch Espresso Machine',
        description: 'Automated touchscreen espresso machine with integrated conical burr grinder and automatic microfoam milk texturing.',
        price: 89999.00,
        category: 'Home & Kitchen',
        quantity: 0,
        sku: 'PRD-BRV09',
        status: 'Out of Stock',
      },
      {
        name: 'Patagonia Nano Puff Insulated Jacket',
        description: 'Warm, windproof, water-resistant lightweight jacket using 60g PrimaLoft Gold Insulation Eco.',
        price: 21500.00,
        category: 'Clothing',
        quantity: 19,
        sku: 'PRD-PAT10',
        status: 'In Stock',
      },
      {
        name: 'Nike Air Zoom Pegasus 40 Running Shoes',
        description: 'Springy ride for every run, energized with Nike React technology and Zoom Air units in the forefoot.',
        price: 11895.00,
        category: 'Sports & Outdoors',
        quantity: 15,
        sku: 'PRD-NIK11',
        status: 'In Stock',
      },
      {
        name: 'Designing Data-Intensive Applications',
        description: 'The definitive guide to the architecture of modern data storage, processing systems by Martin Kleppmann.',
        price: 3450.00,
        category: 'Books',
        quantity: 28,
        sku: 'PRD-BK012',
        status: 'In Stock',
      },
    ];

    const count = await Product.countDocuments();
    if (count > 0 && !req.query.force) {
      return res.status(200).json({
        success: true,
        message: 'Products collection already has data. Pass ?force=true to overwrite.',
        count,
      });
    }

    if (req.query.force) {
      await Product.deleteMany({});
    }

    const inserted = await Product.insertMany(defaultProducts);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${inserted.length} sample products!`,
      count: inserted.length,
      products: inserted,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductStats,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
};
