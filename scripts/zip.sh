#!/bin/bash
set -e

if [ -z "$1" ]; then
  echo "ERROR: Env argument is not passed (possible values: prod, staging, dev)"
  exit 1
fi

BUILD_TYPE="browser-mobile$1"
GAME_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
BUILD_DIR="${GAME_DIR}/build/" #release/$BUILD_TYPE
echo "Build dir: $BUILD_DIR"

PACKAGE_JSON="$GAME_DIR/package.json"
PACKAGE_VERSION=$(node -p "require('./package.json').version")

ZIP_NAME="babylon-test-$1"-"$PACKAGE_VERSION.zip"
ZIP_FULL_PATH="${BUILD_DIR}$ZIP_NAME"
echo "Zip full path: $ZIP_FULL_PATH"

echo "Zipping build: $ZIP_NAME"
rm -f "$ZIP_FULL_PATH" # remove old archive

cd "$BUILD_DIR"
zip -r -q "$ZIP_FULL_PATH" *
cd -