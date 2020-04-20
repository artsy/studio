#!/bin/bash

if [ -z "$1" ]; then
  echo "You must provide an app name"
  echo ""
  exit 1
fi

tsc -b -i
yarn dotenv next dev apps/$1
