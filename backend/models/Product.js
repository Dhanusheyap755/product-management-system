const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      minlength: [2, 'Product name must be at least 2 characters'],
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [5, 'Description must be at least 5 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0.01, 'Price must be greater than 0'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      validate: {
        validator: Number.isInteger,
        message: 'Quantity must be a whole integer',
      },
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  {
    timestamps: true,
  }
);

// Pre-validate middleware to auto-calculate status & ensure SKU
productSchema.pre('validate', function (next) {
  if (typeof this.quantity !== 'undefined') {
    const qty = Number(this.quantity);
    if (qty === 0) {
      this.status = 'Out of Stock';
    } else if (qty <= 5) {
      this.status = 'Low Stock';
    } else {
      this.status = 'In Stock';
    }
  }

  if (!this.sku) {
    const randomHex = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.sku = `PRD-${randomHex}`;
  }

  next();
});

// Pre-update middleware for findOneAndUpdate
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update && typeof update.quantity !== 'undefined') {
    const qty = Number(update.quantity);
    if (qty === 0) {
      update.status = 'Out of Stock';
    } else if (qty <= 5) {
      update.status = 'Low Stock';
    } else {
      update.status = 'In Stock';
    }
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
