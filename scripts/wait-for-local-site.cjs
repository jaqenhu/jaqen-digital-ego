const http = require('node:http')
const { spawnSync } = require('node:child_process')
const { setTimeout: delay } = require('node:timers/promises')

const appName = 'jaqenhu-portfolio-local'

function responds() {
  return new Promise((resolve) => {
    const request = http.get('http://127.0.0.1:5173', (response) => {
      response.resume()
      resolve(response.statusCode === 200)
    })
    request.setTimeout(2000, () => request.destroy())
    request.on('error', () => resolve(false))
  })
}

async function main() {
  const deadline = Date.now() + 20000
  while (Date.now() < deadline) {
    const result = spawnSync('cmd.exe', ['/d', '/s', '/c', 'pm2.cmd jlist'], {
      encoding: 'utf8',
      windowsHide: true,
      timeout: 5000,
    })
    if (result.error || result.status !== 0) {
      throw new Error('Could not read PM2 service status.')
    }
    const app = JSON.parse(result.stdout).find((item) => item.name === appName)
    if (!app || ['errored', 'stopped'].includes(app.pm2_env.status)) {
      throw new Error('The website process is not running.')
    }
    if (
      app.pm2_env.status === 'online' &&
      Date.now() - app.pm2_env.pm_uptime >= 2000 &&
      await responds()
    ) {
      return
    }
    await delay(500)
  }
  throw new Error('Timed out waiting for the website.')
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
