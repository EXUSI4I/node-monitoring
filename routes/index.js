const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const metricsFilePath = path.join(__dirname, '../metrics.json');

// Endpoint to receive metrics from clients
router.post('/metrics', (req, res) => {
  const clientMetrics = req.body;

  // Read existing metrics from the file
  let existingMetrics = [];
  if (fs.existsSync(metricsFilePath)) {
    const data = fs.readFileSync(metricsFilePath);
    existingMetrics = JSON.parse(data);
  }

  // Append new metrics
  existingMetrics.push(clientMetrics);

  // Write updated metrics back to the file
  fs.writeFileSync(metricsFilePath, JSON.stringify(existingMetrics, null, 2));

  res.send({ status: 'success' });
});

// Endpoint to fetch all metrics
router.get('/all-metrics', (req, res) => {
  if (fs.existsSync(metricsFilePath)) {
    const data = fs.readFileSync(metricsFilePath);
    res.send(JSON.parse(data));
  } else {
    res.send([]);
  }
});

module.exports = router;
