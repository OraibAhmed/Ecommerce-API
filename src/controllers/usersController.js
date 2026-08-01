const db = require('../config/database');

const validateUser = (data) => {
  const { full_name, email } = data;
  if (!full_name || !email) {
    throw { name: 'ValidationError', message: 'Missing required fields: full_name, email.' };
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result.rows
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid user ID', data: {} });
    }

    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    validateUser(req.body);
    const { full_name, email, phone, role } = req.body;
    
    const result = await db.query(
      `INSERT INTO users (full_name, email, phone, role, is_active, created_at) 
       VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`,
      [full_name, email, phone || null, role || 'customer', true]
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserStatus = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid user ID', data: {} });
    }

    const { status } = req.body;
    if (typeof status !== 'boolean') {
      return res.status(400).json({ success: false, message: 'Status must be a boolean', data: {} });
    }

    const result = await db.query(
      `UPDATE users SET is_active = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found', data: {} });
    }

    res.status(200).json({
      success: true,
      message: 'User status updated successfully',
      data: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};
