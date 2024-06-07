const axios = require('axios');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

class NodeMonitoringClient {
    constructor(clientId, serverUrl) {
        this.clientId = clientId;
        this.serverUrl = serverUrl;
    }

    calculateHealthStatus(cpuUsage, memoryUsage) {
        const cpuThreshold = 80; // 80% CPU usage threshold
        const memoryThreshold = 75 * 1024 * 1024; // 75MB memory usage threshold
        
        const cpuLoad = (cpuUsage.user + cpuUsage.system) / 1000000; // Convert microseconds to seconds
        const memoryLoad = memoryUsage.heapUsed;

        if (cpuLoad > cpuThreshold || memoryLoad > memoryThreshold) {
            return 'unhealthy';
        }
        return 'healthy';
    }

    async sendMetrics() {
        const metrics = {
            clientId: this.clientId,
            timestamp: new Date(),
            cpuUsage: process.cpuUsage(),
            memoryUsage: process.memoryUsage(),
            loadAvg: os.loadavg(),
            uptime: process.uptime(),
            healthStatus: this.calculateHealthStatus(process.cpuUsage(), process.memoryUsage())
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
const serverUrl = 'http://localhost:3000'; // Update with actual server URL

// Create client instance and start sending metrics
const client = new NodeMonitoringClient(clientId, serverUrl);

setInterval(() => {
    client.sendMetrics();
}, 5000); // Send metrics every 5 seconds
