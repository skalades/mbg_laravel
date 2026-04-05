const dashboardRepository = require('../repositories/dashboardRepository');

exports.getSummary = async (req, res) => {
  const { period } = req.query; // 'daily', 'weekly', 'monthly'
  const kitchenId = req.kitchenId;
  
  try {
    const stats = await dashboardRepository.getSummaryStats(period || 'daily', kitchenId);
    const recentActivity = await dashboardRepository.getRecentActivity(5, kitchenId);
    const upcomingSchedule = await dashboardRepository.getTodaySchedule(kitchenId);
    const allergyAlerts = await dashboardRepository.getAllergyAlerts(kitchenId);

    let kitchenName = null;
    if (kitchenId) {
      const [kitchens] = await require('../config/db').execute('SELECT kitchen_name FROM kitchens WHERE id = ?', [kitchenId]);
      if (kitchens.length > 0) kitchenName = kitchens[0].kitchen_name;
    }

    res.json({
      stats,
      recentActivity,
      upcomingSchedule,
      allergyAlerts,
      kitchenName
    });
  } catch (error) {
    console.error('❌ Dashboard Summary Error:', error);
    res.status(500).json({ message: 'Gagal memuat ringkasan dashboard.', error: error.message });
  }
};
