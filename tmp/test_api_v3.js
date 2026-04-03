const http = require('http');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || 'your_super_secret_key_here');

// INTENTIONALLY leaving out unit_name and unit_quantity to test undefined safety
const data = JSON.stringify({
  school_id: 1,
  menu_date: new Date().toISOString().split('T')[0],
  buffer_portions: 5,
  organoleptic_portions: 2,
  items: [
    {
      food_item_id: 1,
      portion_name: 'Nasi Putih',
      raw_weight_gram: 100
      // unit_name and unit_quantity are missing (undefined)
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/menus/daily',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
    'Authorization': `Bearer ${token}`
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  let body = '';
  res.on('data', (d) => {
    body += d;
  });
  res.on('end', () => {
    console.log('Response:', JSON.parse(body));
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
