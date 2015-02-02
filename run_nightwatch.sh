#!/bin/bash

# Get the directory for the current file.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Path to nightwatch binary
NPM_BASE="$DIR/tests/.npm"
LOG_DIR="$DIR/tests/nightwatch/.logs"
NIGHTWATCH="$NPM_BASE/node_modules/nightwatch/bin/nightwatch"

PACKAGES="nightwatch mongodb underscore"

mkdir -p $NPM_BASE $LOG_DIR
cd $NPM_BASE

for package in $PACKAGES; do
    if [ ! -e "$NPM_BASE/node_modules/$package" ] ; then
      npm install $package
    fi
done

# Get the selenium server if it doesn't exist yet
SELENIUM_JAR="$DIR/tests/nightwatch/.bin/selenium-server-standalone.jar"
mkdir -p `dirname $SELENIUM_JAR`
if [ ! -e  $SELENIUM_JAR ] ; then
  curl -L "https://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar" > $SELENIUM_JAR
fi

cd $DIR
NODE_PATH=$NPM_BASE/node_modules $NIGHTWATCH -c $DIR/tests/nightwatch_config.json "$@"
