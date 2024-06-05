const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const metricsFilePath = path.join(__dirname, '../metrics.json');
const archiveFilePath = path.join(__dirname, '../archive.json');

// Move current metrics to archive on server start
if (fs.existsSync(metricsFilePath)) {
  const data = fs.readFileSync(metricsFilePath);
  let archivedMetrics = [];
  if (fs.existsSync(archiveFilePath)) {
    archivedMetrics = JSON.parse(fs.readFileSync(archiveFilePath));
  }
  archivedMetrics.push(...JSON.parse(data));
  fs.writeFileSync(archiveFilePath, JSON.stringify(archivedMetrics, null, 2));
  fs.unlinkSync(metricsFilePath);
}

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

// Endpoint to fetch all current metrics
router.get('/all-metrics', (req, res) => {
  if (fs.existsSync(metricsFilePath)) {
    const data = fs.readFileSync(metricsFilePath);
    res.send(JSON.parse(data));
  } else {
    res.send([]);
  }
});

// Endpoint to fetch archived metrics
router.get('/archived-metrics', (req, res) => {
  if (fs.existsSync(archiveFilePath)) {
    const data = fs.readFileSync(archiveFilePath);
    res.send(JSON.parse(data));
  } else {
    res.send([]);
  }
});

module.exports = router;
