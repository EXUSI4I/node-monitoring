const axios = require('axios')
const express = require('express');
const router = express.Router();

const servant_port = 5000;
const servant_ip_address = 'localhost'

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Master send a command to servant then get status from servant
router.post('/', (req, res) => {
  const command = req.body.command;
  if (command === 'count') {
    axios.post(
    //`http://${servant_ip_address}:${servant_port}/commands`, { command: 'count' }
    'http://localhost:5000/commands', { command: 'count' }
    )
     .then(response => {
        console.log('Slave node status: ', response.data);
        res.send(`Slave node is counting...`);
      })
     .catch(error => {
        console.error(`Error sending command to slave node: ${error}`);
        res.status(500).send(`Error sending command to slave node`);
      });
  } else {
    res.status(400).send(`Invalid command`);
  }
});

router.get('/status', (req, res) => {
    const command = req.query.command;
    const url = `http://localhost:5000/commands/status`;

    axios.get(url, {
        params: { command }
    })
    .then(response => {
        console.log(`Slave node status: ${response.data}`);
        res.send({status: `${response.data.status}`});
    })
    .catch(error => {
        console.error(`Error getting command status: ${error.message}`);
        res.status(500).json({ error: 'Failed to get command status' });
    });
})

module.exports = router;