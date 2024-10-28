#!/usr/bin/env bash

# Read the environment variables
set -a
source .env
set +a

## Update manifest file
node ./scripts/update-manifest.js
