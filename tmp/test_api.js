const axios = require('axios');
const jwt = require('jsonwebtoken');
require('dotenv').config();

async function test() {
  const token = jwt.sign({ id: 1, role: 'ADMIN' }, process.env.JWT_SECRET || 'your_super_secret_key_here');
  
  try {
    const response = await axios.post('http://localhost:3000/api/menus/daily', {
      school_id: 1,
      menu_date: new Date().toISOString().split('T')[0],
      buffer_portions: 5,
      organoleptic_portions: 2,
      items: [
        {
          food_item_id: 1,
          portion_name: 'Nasi Putih',
          raw_weight_gram: 100,
          unit_name: 'gram',
          unit_quantity: 100
        }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('✅ Success:', response.data);
  } catch (err) {
    console.error('❌ Failed:', err.response?.status, err.response?.data);
  }
}

test();
