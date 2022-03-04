#!/usr/bin/env node
// eslint-disable-next-line import/no-nodejs-modules
import { exec } from 'child_process'
console.log('helloooo')
const myShellScript = exec('sh ./bin/start.sh')
myShellScript.stdout.on('data', (data) => {
  console.log(data)
})
myShellScript.stderr.on('data', (data) => {
  console.error(data)
})
