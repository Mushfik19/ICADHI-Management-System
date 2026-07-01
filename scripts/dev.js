const { spawn } = require('node:child_process')
const path = require('node:path')

const nodeCommand = process.execPath

const commands = [
  {
    name: 'backend',
    command: nodeCommand,
    args: [path.join('backend', 'src', 'server.js')],
  },
  {
    name: 'frontend',
    command: nodeCommand,
    args: [
      path.join('node_modules', 'vite', 'bin', 'vite.js'),
      '--host',
      '127.0.0.1',
      '--port',
      '5173',
    ],
  },
]

const children = commands.map(({ name, command, args }) => {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    env: process.env,
    shell: false,
    stdio: 'inherit',
  })

  child.on('exit', (code, signal) => {
    if (signal) {
      console.log(`[${name}] stopped with signal ${signal}`)
      return
    }

    if (code !== 0) {
      console.log(`[${name}] exited with code ${code}`)
      process.exitCode = code
      stopAll()
    }
  })

  child.on('error', (error) => {
    console.error(`[${name}] failed to start: ${error.message}`)
    process.exitCode = 1
    stopAll()
  })

  return child
})

function stopAll() {
  for (const child of children) {
    if (!child.killed) {
      child.kill()
    }
  }
}

process.on('SIGINT', () => {
  stopAll()
  process.exit(130)
})

process.on('SIGTERM', () => {
  stopAll()
  process.exit(143)
})
