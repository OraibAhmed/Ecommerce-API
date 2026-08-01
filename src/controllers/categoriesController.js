const db = require('../config/database');

const validateCategory = (data) => {
  const { name } = data;
  if (!name) {
    throw { name: 'ValidationError', message: 'Missing required field: name.' };
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getCategoryById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid category ID', data: {} });
    }

    const result = await db.query('SELECT * FROM categories WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    validateCategory(req.body);
    const { name, description } = req.body;
    
    const result = await db.query(
      `INSERT INTO categories (name, description, is_active, created_at) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [name, description || null, true]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid category ID', data: {} });
    }

    validateCategory(req.body);
    const { name, description } = req.body;

    const result = await db.query(
      `UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *`,
      [name, description || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
