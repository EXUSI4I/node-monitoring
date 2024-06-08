const axios = require('axios')
const express = require('express');

const router = express.Router();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

let count = 0;
let count_status = 'idle';

router.post('/', (req, res) => {
  console.log("body: ", req.body);
  const command = req.body.command;
  if (command === 'count') {
    count_status = 'counting';
    for (let i = 1; i <= 1000; i++) {
      count = i;
      console.log(`Counting: ${count}`);
    }
    count_status = 'done';
    res.send({ count_status: 'done' });
  } else {
    res.status(400).send(`Invalid command`);
  }
});

router.get('/status', (req, res) => {
  var command = req.query.command;
  if (command === 'count') {
    res.send({status: count_status});
  } else {
    res.status(400).send(`Invalid command`);
  }
});

module.exports = router;