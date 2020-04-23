#!/bin/bash
cd ../..
yarn patch-package
cd -
yarn next build
