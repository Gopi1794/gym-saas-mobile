const { getDefaultConfig } = require("expo/metro-config")

const config = getDefaultConfig(__dirname)

// Expo Router treats every file under app/ as a potential route/import.
// Exclude test files so Metro never bundles testing-library (Node-only deps)
// into the native app — Jest resolves these files independently and is unaffected.
config.resolver.blockList = /.*\.test\.(js|jsx|ts|tsx)$/

module.exports = config
