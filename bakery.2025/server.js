/*const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Serve audio files
app.use('/audio', express.static(path.join(__dirname, 'audio')));

// Database file path
const DB_FILE = path.join(__dirname, 'database.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify({
        products: [],
        orders: []
    }));
}

// Helper function to read database
function readDatabase() {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

// Helper function to write to database
function writeDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Get all products
app.get('/api/products', (req, res) => {
    const db = readDatabase();
    res.json(db.products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
    const db = readDatabase();
    const product = db.products.find(p => p.id === parseInt(req.params.id));

    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
});

// Create a product (admin only)
app.post('/api/products', (req, res) => {
    const db = readDatabase();
    const newProduct = {
        id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
        ...req.body
    };

    db.products.push(newProduct);
    writeDatabase(db);

    res.status(201).json(newProduct);
});

// Update a product (admin only)
app.put('/api/products/:id', (req, res) => {
    const db = readDatabase();
    const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    db.products[productIndex] = { ...db.products[productIndex], ...req.body };
    writeDatabase(db);

    res.json(db.products[productIndex]);
});

// Delete a product (admin only)
app.delete('/api/products/:id', (req, res) => {
    const db = readDatabase();
    const productIndex = db.products.findIndex(p => p.id === parseInt(req.params.id));

    if (productIndex === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    db.products.splice(productIndex, 1);
    writeDatabase(db);

    res.status(204).end();
});

// Create an order
app.post('/api/orders', (req, res) => {
    const db = readDatabase();
    const newOrder = {
        id: `ORD-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        date: new Date().toISOString(),
        ...req.body,
        status: 'processing'
    };

    db.orders.push(newOrder);
    writeDatabase(db);

    res.status(201).json(newOrder);
});

// Get all orders (admin only)
app.get('/api/orders', (req, res) => {
    const db = readDatabase();
    res.json(db.orders);
});

// Get order by ID
app.get('/api/orders/:id', (req, res) => {
    const db = readDatabase();
    const order = db.orders.find(o => o.id === req.params.id);

    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
});

// Update order status (admin only)
app.patch('/api/orders/:id', (req, res) => {
    const db = readDatabase();
    const orderIndex = db.orders.findIndex(o => o.id === req.params.id);

    if (orderIndex === -1) {
        return res.status(404).json({ error: 'Order not found' });
    }

    if (req.body.status) {
        db.orders[orderIndex].status = req.body.status;
        writeDatabase(db);
    }

    res.json(db.orders[orderIndex]);
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});*/