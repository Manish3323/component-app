#!/usr/bin/env node
/* eslint-disable import/no-nodejs-modules */
import process from 'child_process'
console.log('helloooo')
const myShellScript = process.exec('npx serve ./component-app')
myShellScript.stdout.on('data', (data) => {
  console.log(data)
})
myShellScript.stderr.on('data', (data) => {
  console.error(data)
})
