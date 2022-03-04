#!/usr/bin/env node
/* eslint-disable import/no-nodejs-modules */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const exec = require('child_process')
console.log('helloooo')
const myShellScript = exec('sh ./bin/start.sh')
myShellScript.stdout.on('data', (data) => {
  console.log(data)
})
myShellScript.stderr.on('data', (data) => {
  console.error(data)
})
