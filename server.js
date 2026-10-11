// Golden Blossom Restaurant — Backend API
// Node.js + Express
// Run: npm install express cors && node server.js

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

// ── IN-MEMORY DATABASE (replace with MongoDB/PostgreSQL in production) ──
const db = {
  orders: [],
  reservations: [],
  contacts: [],
};

// ── MENU DATA ──
const MENU = [
  // Starters
  { id:1, category:'starters', name:'Galouti Kebab', description:'Melt-in-mouth minced lamb patties with 40+ spices, served on warqi paratha.', price:320, isVeg:false, isSpicy:true, available:true },
  { id:2, category:'starters', name:'Shammi Kebab', description:'Slow-cooked chana dal & mutton patties, signature Lucknowi flavor.', price:280, isVeg:false, isSpicy:false, available:true },
  { id:3, category:'starters', name:'Kakori Kebab', description:'Silky seekh kebab with aromatic saffron and kewra, grilled to perfection.', price:340, isVeg:false, isSpicy:false, available:true },
  { id:4, category:'starters', name:'Hara Bhara Kebab', description:'Crispy spinach, potato & peas patties with mint chutney.', price:220, isVeg:true, isSpicy:false, available:true },
  { id:5, category:'starters', name:'Paneer Tikka', description:'Marinated cottage cheese grilled in tandoor with bell peppers.', price:260, isVeg:true, isSpicy:true, available:true },
  { id:6, category:'starters', name:'Dahi Ke Sholey', description:'Crispy fried yogurt kebabs with a smoky spice blend.', price:200, isVeg:true, isSpicy:false, available:true },

  // Biryani
  { id:7, category:'biryani', name:'Lucknowi Mutton Dum Biryani', description:'Aged basmati, tender mutton, slow-cooked dum style with saffron milk.', price:480, isVeg:false, isSpicy:false, available:true },
  { id:8, category:'biryani', name:'Chicken Awadhi Biryani', description:'Juicy chicken layered with fragrant basmati, rose water & fried onions.', price:380, isVeg:false, isSpicy:false, available:true },
  { id:9, category:'biryani', name:'Vegetable Zafrani Biryani', description:'Garden vegetables, saffron, dry fruits in long-grain basmati.', price:280, isVeg:true, isSpicy:false, available:true },
  { id:10, category:'biryani', name:'Egg Biryani', description:'Boiled eggs cooked with spiced rice and caramelized onions.', price:320, isVeg:false, isSpicy:true, available:true },
  { id:11, category:'biryani', name:'Prawn Biryani', description:'Coastal-inspired prawns with Lucknowi dum technique.', price:520, isVeg:false, isSpicy:true, available:true },

  // Main Course
  { id:12, category:'mains', name:'Nihari', description:'Slow-simmered lamb shank in rich bone broth with whole spices & ghee.', price:420, isVeg:false, isSpicy:false, available:true },
  { id:13, category:'mains', name:'Rogan Josh', description:'Kashmiri-style lamb curry with yogurt, fennel and Kashmiri chilli.', price:400, isVeg:false, isSpicy:true, available:true },
  { id:14, category:'mains', name:'Murgh Musallam', description:'Whole chicken marinated & dum-cooked in aromatic Mughlai masala.', price:680, isVeg:false, isSpicy:false, available:true },
  { id:15, category:'mains', name:'Dal Makhani', description:'Overnight slow-cooked black lentils with cream, butter & tomato.', price:240, isVeg:true, isSpicy:false, available:true },
  { id:16, category:'mains', name:'Paneer Shahi Korma', description:'Cottage cheese in opulent cream-cashew gravy with saffron.', price:320, isVeg:true, isSpicy:false, available:true },
  { id:17, category:'mains', name:'Aloo Dum', description:'Baby potatoes slow-cooked in Banarasi-style spiced tomato gravy.', price:200, isVeg:true, isSpicy:true, available:true },
  { id:18, category:'mains', name:'Palak Gosht', description:'Tender lamb pieces in fresh spinach gravy with whole spices.', price:380, isVeg:false, isSpicy:false, available:true },

  // Breads
  { id:19, category:'breads', name:'Warqi Paratha', description:'Flaky, layered butter paratha — a Lucknow classic.', price:80, isVeg:true, isSpicy:false, available:true },
  { id:20, category:'breads', name:'Rumali Roti', description:'Paper-thin handkerchief bread, soft and delicate.', price:50, isVeg:true, isSpicy:false, available:true },
  { id:21, category:'breads', name:'Naan', description:'Fluffy oven-baked leavened bread, plain or buttered.', price:70, isVeg:true, isSpicy:false, available:true },
  { id:22, category:'breads', name:'Sheermal', description:'Mildly sweet saffron flatbread, Lucknow\'s treasured bread.', price:90, isVeg:true, isSpicy:false, available:true },

  // Desserts
  { id:23, category:'desserts', name:'Shahi Tukda', description:'Fried bread soaked in saffron-cardamom rabri with edible silver leaf.', price:180, isVeg:true, isSpicy:false, available:true },
  { id:24, category:'desserts', name:'Gulab Jamun', description:'Soft milk-solid dumplings in warm rose-scented sugar syrup.', price:120, isVeg:true, isSpicy:false, available:true },
  { id:25, category:'desserts', name:'Kulfi Falooda', description:'Home-made pistachio kulfi with vermicelli, rose syrup & basil seeds.', price:160, isVeg:true, isSpicy:false, available:true },
  { id:26, category:'desserts', name:'Phirni', description:'Rice flour & full-cream milk pudding set in earthen bowls.', price:140, isVeg:true, isSpicy:false, available:true },
  { id:27, category:'desserts', name:'Malpua', description:'Fried pancakes with rabri, served warm with pistachios.', price:160, isVeg:true, isSpicy:false, available:true },

  // Drinks
  { id:28, category:'drinks', name:'Rose Sharbat', description:'Chilled traditional rose & khus syrup with sabja seeds.', price:80, isVeg:true, isSpicy:false, available:true },
  { id:29, category:'drinks', name:'Thandai', description:'Spiced milk drink with almonds, fennel, saffron & rose.', price:100, isVeg:true, isSpicy:false, available:true },
  { id:30, category:'drinks', name:'Masala Chai', description:'Strong Lucknowi ginger-cardamom tea with full-cream milk.', price:60, isVeg:true, isSpicy:false, available:true },
  { id:31, category:'drinks', name:'Fresh Lime Soda', description:'Sweet, salty or mixed — classic street-side refresher.', price:70, isVeg:true, isSpicy:false, available:true },
  { id:32, category:'drinks', name:'Mango Lassi', description:'Thick Alphonso mango blended with creamy yogurt.', price:120, isVeg:true, isSpicy:false, available:true },
];

// ── HELPERS ──
function generateOrderId() {
  return 'GB' + Date.now().toString().slice(-6) + Math.random().toString(36).slice(2,4).toUpperCase();
}

function calcTotal(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const gst = Math.round(subtotal * 0.05);
  return { subtotal, gst, total: subtotal + gst };
}

function validateItems(items) {
  const errors = [];
  const enriched = items.map(item => {
    const menuItem = MENU.find(m => m.id === item.id);
    if (!menuItem) { errors.push(`Item ID ${item.id} not found`); return null; }
    if (!menuItem.available) { errors.push(`${menuItem.name} is currently unavailable`); return null; }
    if (!item.qty || item.qty < 1) { errors.push(`Invalid quantity for item ${item.id}`); return null; }
    return { ...menuItem, qty: item.qty };
  });
  return { errors, enriched: enriched.filter(Boolean) };
}

// ── ROUTES ──

// Health check
app.get('/', (req, res) => {
  res.json({
    restaurant: 'Golden Blossom',
    location: 'Madiyon, Lucknow',
    status: '🌸 Open and ready to serve',
    version: '1.0.0',
  });
});

// GET /menu — Full menu or by category
app.get('/menu', (req, res) => {
  const { category, veg, spicy } = req.query;
  let items = [...MENU];
  if (category) items = items.filter(i => i.category === category);
  if (veg === 'true') items = items.filter(i => i.isVeg === true);
  if (veg === 'false') items = items.filter(i => i.isVeg === false);
  if (spicy === 'true') items = items.filter(i => i.isSpicy === true);
  res.json({ success: true, count: items.length, items });
});

// GET /menu/categories — List all categories
app.get('/menu/categories', (req, res) => {
  const cats = [...new Set(MENU.map(i => i.category))];
  const summary = cats.map(cat => ({
    category: cat,
    count: MENU.filter(i => i.category === cat).length,
    priceRange: {
      min: Math.min(...MENU.filter(i => i.category === cat).map(i => i.price)),
      max: Math.max(...MENU.filter(i => i.category === cat).map(i => i.price)),
    }
  }));
  res.json({ success: true, categories: summary });
});

// GET /menu/:id — Single item
app.get('/menu/:id', (req, res) => {
  const item = MENU.find(i => i.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
  res.json({ success: true, item });
});

// POST /orders — Place a new order
app.post('/orders', (req, res) => {
  const { customerName, phone, orderType, items, tableNumber, notes } = req.body;

  // Validation
  if (!customerName || !phone) {
    return res.status(400).json({ success: false, message: 'Name and phone are required' });
  }
  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order must have at least one item' });
  }
  const validTypes = ['dine', 'takeaway', 'delivery'];
  if (!validTypes.includes(orderType)) {
    return res.status(400).json({ success: false, message: `orderType must be one of: ${validTypes.join(', ')}` });
  }

  const { errors, enriched } = validateItems(items);
  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: 'Item validation failed', errors });
  }

  const pricing = calcTotal(enriched);
  const order = {
    orderId: generateOrderId(),
    customerName,
    phone,
    orderType,
    tableNumber: tableNumber || null,
    notes: notes || '',
    items: enriched,
    pricing,
    status: 'confirmed',
    estimatedTime: orderType === 'delivery' ? '45-60 mins' : '25-35 mins',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.push(order);
  console.log(`[ORDER] #${order.orderId} placed by ${customerName} — ₹${pricing.total}`);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: {
      orderId: order.orderId,
      status: order.status,
      estimatedTime: order.estimatedTime,
      pricing: order.pricing,
      itemCount: enriched.length,
    }
  });
});

// GET /orders/:id — Track an order
app.get('/orders/:id', (req, res) => {
  const order = db.orders.find(o => o.orderId === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, order });
});

// PATCH /orders/:id/status — Update order status (admin)
app.patch('/orders/:id/status', (req, res) => {
  const order = db.orders.find(o => o.orderId === req.params.id);
  if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
  const validStatuses = ['confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
  const { status } = req.body;
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
  }
  order.status = status;
  order.updatedAt = new Date().toISOString();
  res.json({ success: true, orderId: order.orderId, status: order.status });
});

// GET /orders — Admin: all orders
app.get('/orders', (req, res) => {
  const { status, orderType } = req.query;
  let orders = [...db.orders];
  if (status) orders = orders.filter(o => o.status === status);
  if (orderType) orders = orders.filter(o => o.orderType === orderType);
  res.json({ success: true, count: orders.length, orders });
});

// POST /reservations — Book a table
app.post('/reservations', (req, res) => {
  const { name, phone, date, time, guests, occasion, notes } = req.body;
  if (!name || !phone || !date || !time || !guests) {
    return res.status(400).json({ success: false, message: 'Name, phone, date, time, guests are required' });
  }
  if (guests < 1 || guests > 20) {
    return res.status(400).json({ success: false, message: 'Guest count must be between 1 and 20' });
  }
  const reservation = {
    reservationId: 'RES' + Date.now().toString().slice(-6),
    name, phone, date, time,
    guests: parseInt(guests),
    occasion: occasion || '',
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  db.reservations.push(reservation);
  console.log(`[RESERVATION] #${reservation.reservationId} for ${name} on ${date} at ${time}`);
  res.status(201).json({
    success: true,
    message: 'Reservation request received! We will confirm shortly.',
    reservation,
  });
});

// GET /location — Restaurant location info
app.get('/location', (req, res) => {
  res.json({
    success: true,
    restaurant: 'Golden Blossom',
    address: {
      street: 'Near Madiyon Chowk',
      area: 'Madiyon',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      pincode: '226001',
      country: 'India',
    },
    coordinates: { lat: 26.8467, lng: 80.8722 },
    googleMapsUrl: 'https://maps.google.com/?q=Madiyon+Lucknow+Uttar+Pradesh',
    phone: '+91 98765 43210',
    email: 'goldenblossom.lko@gmail.com',
    hours: {
      monday: '12:00 PM – 11:00 PM',
      tuesday: '12:00 PM – 11:00 PM',
      wednesday: '12:00 PM – 11:00 PM',
      thursday: '12:00 PM – 11:00 PM',
      friday: '12:00 PM – 11:00 PM',
      saturday: '11:00 AM – 11:30 PM',
      sunday: '11:00 AM – 11:30 PM',
    },
    kitchenCloses: '10:30 PM',
  });
});

// POST /contact — Contact form
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
  }
  const contact = { id: Date.now(), name, email, subject: subject || 'General Enquiry', message, createdAt: new Date().toISOString() };
  db.contacts.push(contact);
  res.json({ success: true, message: 'Your message has been received. We\'ll get back to you soon!' });
});

// GET /stats — Admin dashboard stats
app.get('/stats', (req, res) => {
  const totalRevenue = db.orders
    .filter(o => o.status !== 'cancelled')
    .reduce((s, o) => s + o.pricing.total, 0);
  const todayOrders = db.orders.filter(o => o.createdAt.startsWith(new Date().toISOString().slice(0,10)));
  res.json({
    success: true,
    stats: {
      totalOrders: db.orders.length,
      todayOrders: todayOrders.length,
      totalRevenue: `₹${totalRevenue}`,
      totalReservations: db.reservations.length,
      pendingOrders: db.orders.filter(o => o.status === 'confirmed' || o.status === 'preparing').length,
      menuItems: MENU.length,
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found` });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🌸 Golden Blossom API running on http://localhost:${PORT}`);
  console.log(`   → GET  /menu              — Full menu`);
  console.log(`   → GET  /menu/categories   — Categories`);
  console.log(`   → GET  /menu/:id          — Single item`);
  console.log(`   → POST /orders            — Place order`);
  console.log(`   → GET  /orders/:id        — Track order`);
  console.log(`   → POST /reservations      — Book table`);
  console.log(`   → GET  /location          — Restaurant info`);
  console.log(`   → GET  /stats             — Admin stats\n`);
});
