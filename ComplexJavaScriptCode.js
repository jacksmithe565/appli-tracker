/* 
   File Name: ComplexJavaScriptCode.js
   Description: A complex and elaborate JavaScript code showcasing a fictional online shopping website.
*/

// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();

// Connect to the database
mongoose.connect('mongodb://localhost/shop', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to the database'))
  .catch((error) => console.error('Failed to connect to the database:', error));

// Define the data models using Mongoose
const User = mongoose.model('User', new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  createdAt: { type: Date, default: Date.now }
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  createdAt: { type: Date, default: Date.now }
}));

// Middleware to parse incoming request bodies
app.use(bodyParser.json());

// Define API endpoints
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch users' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    const savedProduct = await product.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product' });
  }
});

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(400).json({ error: 'Failed to fetch products' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});