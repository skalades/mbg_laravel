const menuService = require('./src/services/menuService');

async function test() {
  try {
    const menu = await menuService.getDailyMenuById(2);
    console.log('Menu 2:', menu);
  } catch (error) {
    console.error('Error fetching menu 2:', error);
  }
  process.exit();
}

test();
