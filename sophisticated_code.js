/* 
Filename: sophisticated_code.js
Content: A complex program that simulates a virtual marketplace for buying and selling various products.
*/

// Import necessary libraries and modules
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Initialize Express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose.connect('mongodb://localhost:27017/marketplace', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define the Product schema
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  datePosted: { type: Date, default: Date.now },
  isSold: { type: Boolean, default: false }
});

// Define the User schema
const userSchema = new mongoose.Schema({
  username: String,
  passwordHash: String
});

// Define the models based on the schemas
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// API route handlers
app.get('/products', (req, res) => {
  // Fetch all available products from the database
  Product.find({ isSold: false }).populate('seller', 'username').exec((err, products) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching products from the database' });
    } else {
      res.send(products);
    }
  });
});

app.post('/products', (req, res) => {
  // Create a new product and save it to the database
  const { name, price, sellerId } = req.body;
  
  User.findById(sellerId, (err, seller) => {
    if (err || !seller) {
      res.status(400).send({ message: 'Invalid seller ID' });
    } else {
      const product = new Product({ name, price, seller });
      
      product.save((err, savedProduct) => {
        if (err) {
          res.status(500).send({ message: 'Error saving product to the database' });
        } else {
          res.send(savedProduct);
        }
      });
    }
  });
});

// ... (other API routes for updating/deleting products, user registration, authentication, etc.)

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});