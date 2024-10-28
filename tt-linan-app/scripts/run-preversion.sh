#!/usr/bin/env bash

# Read the environment variables
set -a
source .env
set +a

## Validate mandatory artifacts
node ./scripts/do-validate.js &&
