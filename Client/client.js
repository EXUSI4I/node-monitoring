const os = require('os');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const express = require('express')

//CLIENT
class NodeMonitoringClient {
    constructor(clientId, serverUrl) {
        this.clientId = clientId;
        this.serverUrl = serverUrl;
        this.totalMemory = os.totalmem();
        this.prevCpuUsage = process.cpuUsage();
        this.prevUptime = process.uptime();
    }

    calculateCpuUsagePercentage() {
        const currentCpuUsage = process.cpuUsage();
        const currentUptime = process.uptime();

        const userCpuTime = currentCpuUsage.user - this.prevCpuUsage.user;
        const systemCpuTime = currentCpuUsage.system - this.prevCpuUsage.system;
        const elapsedTime = (currentUptime - this.prevUptime) * 1000000; // Convert to microseconds

        const userCpuPercentage = ((userCpuTime / elapsedTime) * 100).toFixed(2);
        const systemCpuPercentage = ((systemCpuTime / elapsedTime) * 100).toFixed(2);

        this.prevCpuUsage = currentCpuUsage;
        this.prevUptime = currentUptime;

        return { userCpuPercentage, systemCpuPercentage };
    }

    async sendMetrics() {
        const memoryUsage = process.memoryUsage();
        const totalMemory = this.totalMemory;
        const { userCpuPercentage, systemCpuPercentage } = this.calculateCpuUsagePercentage();

        const metrics = {
            clientId: this.clientId,
            timestamp: new Date(),
            cpuUsage: {
                ...process.cpuUsage(),
                userCpuPercentage,
                systemCpuPercentage
            },
            memoryUsage: {
                ...memoryUsage,
                rssPercent: ((memoryUsage.rss / totalMemory) * 100).toFixed(2),
                heapTotalPercent: ((memoryUsage.heapTotal / totalMemory) * 100).toFixed(2),
                heapUsedPercent: ((memoryUsage.heapUsed / totalMemory) * 100).toFixed(2),
                externalPercent: ((memoryUsage.external / totalMemory) * 100).toFixed(2)
            },
            uptime: process.uptime(),
            totalMemory
        };

        try {
            await axios.post(`${this.serverUrl}/metrics`, metrics);
            console.log('Metrics sent:', metrics);
        } catch (error) {
            if (error.response) {
                console.error('Error response:', error.response.status, error.response.data);
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }
            console.error('Error config:', error.config);
        }
    }
}

// Configure client ID and server URL
const clientId = uuidv4();
const serverUrl = 'http://172.16.128.218:3000'; // Update with actual server URL

// Create client instance and start sending metrics
const client = new NodeMonitoringClient(clientId, serverUrl);

setInterval(() => {
    client.sendMetrics();
}, 5000); // Send metrics every 5 seconds



//SERVER
const servant_server = express();

const servantServerIndexRouter = require('../routes/servant_server_index')

servant_server.use('/commands', servantServerIndexRouter);

const PORT = 5000;
servant_server.listen(PORT, 'localhost', () => {
  console.log(`Slave node is running at http://localhost:${PORT}`);
});

module.exports = servant_server;


