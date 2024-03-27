#!/bin/sh
brew uninstall watchman
brew install watchman
watchman shutdown-server (just in case it's running)
watchman watch-del-all
yarn start --reset-cache
