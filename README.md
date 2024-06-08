# Node Health Checking and Monitoring System

This project demonstrates a basic distributed task management system where a main computer (server) assigns tasks to worker computers (clients), checks and monitors their health status.

## Project Structure

- `app.js`: Main server that handles task distribution and health status reporting.
- `client.js`: Worker client that fetches tasks, executes them, and reports health status.

## Prerequisites

- Node.js (v12 or later)
- npm (Node Package Manager)

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/EXUSI4I/node-monitoring.git
cd node-monitoring
```


### 2. Install Dependencies
```bash
npm install
```

### 3. Running the Server
The server is responsible for distributing tasks and monitoring the health status of the clients.

1. Open a terminal.
2. Navigate to the project directory.
3. Start the server using the following command:
```bash
node app.js
```
4. Open Command Prompt:

- Press Windows Key + R, type 'cmd', and press Enter.
5. Find Your IPv4 Address:

- In the Command Prompt, type the following command:
```bash
ipconfig
```
- Look for the IPv4 Address under the network adapter you are using. It will look something like '192.168.1.x'.
6. Update 'serverUrl' in client.js Code:
  - Replace 'serverUrl' with the IP address of the machine running the server.
### 4. Running the Client
Each client fetches tasks from the server, executes them, and periodically reports its health status.

1. Open a new terminal for each client.
2. Navigate to the project directory then the Client directory.
3. Start the client using the following command:
```bash
cd Client
node client.js
```

### 5. Display the data
Go to any search engine and use the following command:
```bash
http://localhost:3000/ui/index.html
```
*Notice: The server is always listening on port 3000.
