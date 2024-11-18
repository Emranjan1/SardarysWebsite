// routes/orders.js

const router = require('express').Router();
const { verifyToken, verifyAdmin } = require('../middleware/authenticationMiddleware');
const { Order, User, OrderItem, Product } = require('../models'); // Correctly import OrderItem and Product

let dailySequence = 0;
let lastDate = new Date().toISOString().slice(0, 10);  // Format as "YYYY-MM-DD"

function generateOrderNumber() {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== lastDate) {
        dailySequence = 0;  // Reset sequence if a new day
        lastDate = today;
    }
    dailySequence++;
    const year = new Date().getFullYear().toString().slice(2, 4);  // Get last two digits of the year
    const month = String(new Date().getMonth() + 1).padStart(2, '0');  // Get month as two digits
    const day = String(new Date().getDate()).padStart(2, '0');  // Get day as two digits
    return `SAR${year}${month}${day}${String(dailySequence).padStart(4, '0')}`;  // Construct order number
}

router.post('/', verifyToken, async (req, res) => {
  const { orderItems, totalAmount, paymentMethod, isCashOnDelivery } = req.body;
  const userId = req.user.id;

  // Validate order items
  if (!orderItems.every(item => item.productId)) {
      return res.status(400).json({ error: 'Every order item must have a productId' });
  }

  try {
      const orderNumber = generateOrderNumber(); // Generate a new order number
      const order = await Order.create({
          userId,
          totalAmount,
          orderNumber,
          paymentMethod,
          status: isCashOnDelivery ? 'Pending Payment' : 'Completed',
          orderStatus: 'In Progress' // Default status when an order is created.
      });

      const items = orderItems.map(item => ({
          ...item,
          orderId: order.id
      }));
      await OrderItem.bulkCreate(items);

      res.status(201).json(order);
  } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});



// GET all orders for admin with customer and product details
router.get('/admin', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'customer',
          attributes: ['id', 'firstName', 'lastName']
        },
        {
          model: OrderItem,
          as: 'orderItems',
          include: [{
            model: Product,
            as: 'product',
            attributes: ['id', 'name', 'price']
          }]
        }
      ],
      attributes: ['id', 'orderNumber', 'createdAt', 'totalAmount', 'status', 'orderStatus']
    });

    const formattedOrders = orders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status, // Separate field if distinguishing from orderStatus
      orderStatus: order.orderStatus, // Include the new order status field.
      customerId: order.customer.id,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      products: order.orderItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price.toFixed(2),
        productQuantity: item.quantity
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

router.get('/', verifyToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: [{
        model: OrderItem,
        as: 'orderItems',
        include: [{
          model: Product,
          as: 'product'
        }]
      }],
      attributes: ['id', 'orderNumber', 'createdAt', 'totalAmount', 'status', 'orderStatus'] // Include orderStatus here
    });

    const formattedOrders = orders.map(order => ({
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.createdAt,
      totalAmount: order.totalAmount.toFixed(2),
      status: order.status,
      orderStatus: order.orderStatus, // Include this in the response
      products: order.orderItems.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productPrice: item.product.price.toFixed(2),
        quantity: item.quantity
      }))
    }));

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.put('/:orderId/status', verifyToken, verifyAdmin, async (req, res) => {
  const { orderStatus } = req.body; // This is the new status coming from the front end
  const { orderId } = req.params;

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.orderStatus(404).json({ error: 'Order not found' });
    }

    order.orderStatus = orderStatus; // Update the order status
    await order.save();

    res.json({ message: 'Order status updated successfully', orderStatus: order.orderStatus });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
