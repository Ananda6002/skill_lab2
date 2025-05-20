const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Product
router.post('/', auth, async (req, res) => {
  const { name, description, price, quantity } = req.body;
  const product = new Product({ name, description, price, quantity });
  await product.save();
  res.json(product);
});

// Read All Products
router.get('/', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// Read One Product
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Update Product
router.put('/:id', auth, async (req, res) => {
  const { name, description, price, quantity } = req.body;
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { name, description, price, quantity },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Delete Product
router.delete('/:id', auth, async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  // Update user's numberOfOrders (simulate order cancellation)
  const user = await User.findById(req.user.id);
  if (user && user.numberOfOrders > 0) {
    user.numberOfOrders -= 1;
    await user.save();
  }

  res.json({ message: 'Product deleted successfully' });
});

// Simulate Product Purchase
router.post('/buy/:id', auth, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product || product.quantity <= 0) return res.status(400).json({ error: 'Product not available' });

  product.quantity -= 1;
  await product.save();

  const user = await User.findById(req.user.id);
  if (user) {
    user.numberOfOrders += 1;
    await user.save();
  }

  res.json({ message: 'Product purchased successfully', product });
});

module.exports = router;