const express = require('express');
const router = express.Router();

// Example user route (add your own user-related routes here)
router.get('/', (req, res) => {
  res.send({ message: 'User route' });
});

module.exports = router;
