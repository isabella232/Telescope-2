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

CHROME_DRIVER="$DIR/tests/nightwatch/.bin/chromedriver"
if [ ! -e $CHROME_DRIVER ] ; then
  if [[ "$OSTYPE" == "linux-gnu" ]]; then
    ARCH="linux64"
  elif [[ "$unamestr" == "darwin"* ]]; then
    ARCH="mac32"
  fi
  curl -L "https://chromedriver.storage.googleapis.com/2.14/chromedriver_${ARCH}.zip" > ${CHROME_DRIVER}.zip
  unzip ${CHROME_DRIVER}.zip -d `dirname $CHROME_DRIVER`
  rm ${CHROME_DRIVER}.zip
fi

cd $DIR
NODE_PATH=$NPM_BASE/node_modules $NIGHTWATCH -c $DIR/tests/nightwatch_config.json "$@"
