const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); 
require('dotenv').config();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));

app.use((req, res, next) => {
  console.log('Requested URL:', req.method, decodeURIComponent(req.originalUrl));  // Decode URL for clarity
  next();
});

// Import routes
const authRoutes = require('./routes/authenticationRoutes');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const searchRoutes = require('./routes/search');
const checkoutRoutes = require('./routes/checkout');
const CustomerDetailsRoutes = require('./routes/CustomerDetails');
const ordersRoutes = require('./routes/orders');
const customerRoutes = require('./routes/customer');
const deliveryRoutes = require('./routes/delivery');
const adminSettingsRoutes = require('./routes/adminSettings');
const promoCodeRoutes = require('./routes/promoCodes');
const paymentRoute = require('./routes/payment');


// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/customer-details', CustomerDetailsRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/admin', adminSettingsRoutes);
app.use('/api/promo-codes', promoCodeRoutes);
app.use('/api/payment', paymentRoute);


app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

app.use(express.static(path.join(__dirname,'client', 'build')));

app.get('/', (req, res) => {
  res.send('Welcome to Sardarys Website');
});


app.get('*', (req, res) => {res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));});

// Initialize the database and create tables if they don't exist
const db = require('./models');

const initializeDatabase = async () => {
  try {
    await db.sequelize.authenticate()
    .then(() => console.log('Connection has been established successfully.'))
    .catch(err => console.error('Unable to connect to the database:', err));
    // Ensure tables are created if they don't exist
    await db.User.sync();
    await db.Category.sync();
    await db.Product.sync();
    await db.CustomerDetails.sync();
    await db.Order.sync();
    await db.PromoCode.sync();


    console.log('Database & tables created or confirmed.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initializeDatabase();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
