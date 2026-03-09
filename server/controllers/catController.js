const { pool } = require('../config/db');

// Get all cats
exports.getCats = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM cats ORDER BY id');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Get single cat by ID
exports.getCatById = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT * FROM cats WHERE id=$1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cat not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Create new cat
exports.createCat = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, age, breed, gender, organization_id, adopted_by, location, image } = req.body;
    const result = await client.query(
      `INSERT INTO cats (name, age, breed, gender, organization_id, adopted_by, location, image)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [name, age, breed, gender, organization_id, adopted_by || null, location, image || '']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Update cat
exports.updateCat = async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, age, breed, gender, organization_id, adopted_by, location, image } = req.body;
    const result = await client.query(
      `UPDATE cats SET name=$1, age=$2, breed=$3, gender=$4,
       organization_id=$5, adopted_by=$6, location=$7, image=$8
       WHERE id=$9 RETURNING *`,
      [name, age, breed, gender, organization_id, adopted_by || null, location, image || '', req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cat not found' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    client.release();
  }
};

// Delete cat
exports.deleteCat = async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query('DELETE FROM cats WHERE id=$1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Cat not found' });
    res.status(200).json({ message: 'Cat deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};
