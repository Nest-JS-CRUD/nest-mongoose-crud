#!/usr/bin/env sh

set -eu

SCRIPT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
PACKAGE_DIR="$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)"
TEST_PROJECT_DIR="$(CDPATH= cd -- "$PACKAGE_DIR/../test-project" && pwd)"

cd "$PACKAGE_DIR"
npm link

cd "$TEST_PROJECT_DIR"
npm link nest-mongoose-crud
