const path = require('node:path')

module.exports = {
  apps: [
    {
      name: 'jaqenhu-portfolio-local',
      cwd: __dirname,
      script: path.join(__dirname, 'node_modules/vite/bin/vite.js'),
      interpreter: process.execPath,
      args: ['preview', '--host', '127.0.0.1', '--port', '5173', '--strictPort'],
      env: { NODE_ENV: 'production' },
      watch: false,
      autorestart: true,
      min_uptime: 10000,
      max_restarts: 3,
      restart_delay: 1000,
    },
  ],
}
