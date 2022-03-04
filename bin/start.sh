#!/usr/bin/env bash

ROOT="$(
    cd "$(dirname "$0")" >/dev/null 2>&1 || exit
    pwd -P
)"
echo $ROOT
cd $ROOT/../

echo "Starting component-ui app"

if [ -d "node-modules" ]
then
    npm start
else
    npm install && npm start
fi
