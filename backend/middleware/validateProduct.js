const validateProduct = (req, res, next) => {
  const { name, description, price, category, quantity } = req.body;
  const errors = {};

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.name = 'Product name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Product name must be at least 2 characters';
  } else if (name.trim().length > 120) {
    errors.name = 'Product name cannot exceed 120 characters';
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters';
  } else if (description.trim().length > 1000) {
    errors.description = 'Description cannot exceed 1000 characters';
  }

  if (price === undefined || price === null || price === '') {
    errors.price = 'Price is required';
  } else {
    const numPrice = Number(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Price must be a positive number greater than 0';
    }
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    errors.category = 'Category is required';
  }

  if (quantity === undefined || quantity === null || quantity === '') {
    errors.quantity = 'Quantity is required';
  } else {
    const numQty = Number(quantity);
    if (isNaN(numQty) || !Number.isInteger(numQty) || numQty < 0) {
      errors.quantity = 'Quantity must be a non-negative integer (0 or more)';
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed. Please correct the highlighted errors.',
      errors,
    });
  }

  next();
};

module.exports = validateProduct;
