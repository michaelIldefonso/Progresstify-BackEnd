const db = require('../../config/db');

// Fetch daily metrics by metric_type and date range
async function fetchDailyMetrics(metricType, startDate, endDate) {
  const query = `
    SELECT date, value
    FROM daily_metrics
    WHERE metric_type = $1
      AND date BETWEEN $2 AND $3
    ORDER BY date ASC
  `;
  const values = [metricType, startDate, endDate];
  const { rows } = await db.query(query, values);
  return rows;
}

module.exports = {
  fetchDailyMetrics,
};