const db = require('../config/database');

// Helper for validating inputs
const validateProduct = (data) => {
  const { category_id, name, price, stock_quantity, sku } = data;
  if (!category_id || !name || price === undefined || stock_quantity === undefined || !sku) {
    throw { name: 'ValidationError', message: 'Missing required fields: category_id, name, price, stock_quantity, sku.' };
  }
  if (Number(price) <= 0) {
    throw { name: 'ValidationError', message: 'Price must be greater than 0.' };
  }
  if (Number(stock_quantity) < 0) {
    throw { name: 'ValidationError', message: 'Stock cannot be negative.' };
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id ASC');
    res.status(200).json({
      success: true,
      message: 'Products retrieved successfully',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Product retrieved successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    validateProduct(req.body);
    const { category_id, name, description, price, stock_quantity, sku } = req.body;
    
    // Note: DB column is 'stock'
    const result = await db.query(
      `INSERT INTO products (category_id, name, description, price, stock, sku, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW()) RETURNING *`,
      [category_id, name, description || null, price, stock_quantity, sku, true]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    validateProduct(req.body);
    const { category_id, name, description, price, stock_quantity, sku } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET category_id = $1, name = $2, description = $3, price = $4, stock = $5, sku = $6, updated_at = NOW() 
       WHERE id = $7 RETURNING *`,
      [category_id, name, description || null, price, stock_quantity, sku, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.deactivateProduct = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid product ID', data: {} });
    }

    const result = await db.query(
      `UPDATE products SET is_active = false, updated_at = NOW() WHERE id = $1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Product deactivated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
