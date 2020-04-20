#!/bin/bash

if [ -z "$1" ]; then
  echo "You must provide an app name"
  echo ""
  exit 1
fi

ANALYZE=true yarn next build apps/$1
